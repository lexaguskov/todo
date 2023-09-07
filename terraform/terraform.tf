# Specify the provider for GCP
provider "google" {
  credentials = file("service-account-key.json")
  project     = "todo-397919"
  region      = "europe-north1"
}

# # Create a Google Cloud Storage Bucket
# resource "google_storage_bucket" "static_website_bucket" {
#   name     = "lexaguskov-todo-app"
#   location = "EUROPE-NORTH1" # Use uppercase for the region

#   # Enable website hosting
#   website {
#     main_page_suffix = "index.html"
#     not_found_page   = "404.html"
#   }
# }

# # Upload your static website files to the bucket
# resource "google_storage_bucket_object" "static_website_files" {
#   for_each = fileset("../frontend/build", "**/*")

#   name   = each.value
#   source = "../frontend/build/${each.value}"
#   bucket = google_storage_bucket.static_website_bucket.name
# }

# resource "google_storage_bucket_iam_binding" "public_access" {
#   bucket = google_storage_bucket.static_website_bucket.name
#   role   = "roles/storage.objectViewer"

#   members = ["allUsers"]
# }

resource "null_resource" "create_zip" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = "zip -r bundle.zip ../.env.prod ../backend ../frontend/build -x '../backend/node_modules/*'"
  }
}

resource "google_compute_instance" "backend_instance" {
  name         = "backend-instance"
  machine_type = "e2-small"
  zone         = "europe-north1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-10"
    }
  }

  network_interface {
    network = "default"
    access_config {
      // Ephemeral IP
    }
  }

  metadata = {
    ssh-keys = "lexa:${file("~/.ssh/id_rsa.pub")}"
  }

  provisioner "file" {
    source      = "${path.module}/bundle.zip"
    destination = "/tmp/bundle.zip"

    connection {
      type        = "ssh"
      user        = "lexa"
      private_key = file("~/.ssh/id_rsa")
      host        = self.network_interface[0].access_config[0].nat_ip
    }
  }

  # FIXME: proper setup with container registry would be better
  metadata_startup_script = file("${path.module}/startup.sh")

  tags = ["http-server"]
}

resource "google_compute_firewall" "allow-http" {
  name    = "allow-http"
  network = "default" # Replace with your network name if it's not the default network

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  source_ranges = ["0.0.0.0/0"] # Adjust this to limit source IP ranges if needed
  target_tags   = ["http-server"]
}

resource "google_project_service" "cloudresourcemanager_api" {
  project = "todo-397919"                         # Replace with your GCP project ID
  service = "cloudresourcemanager.googleapis.com" # The API service name
}

resource "google_project_service" "dns_api" {
  project = "todo-397919"        # Replace with your GCP project ID
  service = "dns.googleapis.com" # The API service name
}

resource "google_dns_managed_zone" "guskov_dev" {
  name        = "guskov-dev"
  dns_name    = "guskov.dev."
  description = "My DNS zone"
}

# resource "google_dns_record_set" "todo_guskov_dev" {
#   name         = "todo.${google_dns_managed_zone.guskov_dev.dns_name}"
#   type         = "CNAME"
#   ttl          = 300
#   managed_zone = google_dns_managed_zone.guskov_dev.name
#   rrdatas      = ["${google_storage_bucket.static_website_bucket.name}.storage.googleapis.com"]
# }

resource "google_dns_record_set" "api_guskov_dev" {
  name         = "api.${google_dns_managed_zone.guskov_dev.dns_name}"
  type         = "A"
  ttl          = 300
  managed_zone = google_dns_managed_zone.guskov_dev.name
  rrdatas      = [google_compute_instance.backend_instance.network_interface[0].access_config[0].nat_ip]
}

# output "website_url" {
#   value = "https://todo.guskov.dev"
# }

# output "website_url" {
#   value = "https://${google_storage_bucket.static_website_bucket.name}.storage.googleapis.com"
# }

output "instance_ip" {
  value = google_compute_instance.backend_instance.network_interface[0].access_config[0].nat_ip
}
