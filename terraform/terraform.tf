provider "google" {
  credentials = file("service-account-key.json")
  project     = "todo-397919"
  region      = "europe-north1"
}

resource "null_resource" "create_zip" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = "zip -r bundle.zip ../terraform/deploy.sh ../.env.prod ../backend ../frontend/build -x '../backend/node_modules/*'"
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

  metadata_startup_script = file("${path.module}/startup.sh")

  tags = ["http-server"]
}

resource "null_resource" "upload_bundle" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "file" {
    source      = "${path.module}/bundle.zip"
    destination = "/tmp/bundle.zip"
  }

  connection {
    type        = "ssh"
    user        = "lexa"
    private_key = file("~/.ssh/id_rsa") # Path to your private SSH key
    host        = google_compute_instance.backend_instance.network_interface[0].access_config[0].nat_ip
  }
}

resource "null_resource" "execute_script" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "remote-exec" {
    inline = [
      "unzip -o /tmp/bundle.zip -d /home/lexa",
      "rm /tmp/bundle.zip",
      "sh /home/lexa/terraform/deploy.sh",
    ]
  }

  connection {
    type        = "ssh"
    user        = "lexa"
    private_key = file("~/.ssh/id_rsa")
    host        = google_compute_instance.backend_instance.network_interface[0].access_config[0].nat_ip
  }
}

resource "google_compute_firewall" "allow-http" {
  name    = "allow-http"
  network = "default" # Replace with your network name if it's not the default network

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
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

resource "google_dns_record_set" "api_guskov_dev" {
  name         = "api.${google_dns_managed_zone.guskov_dev.dns_name}"
  type         = "A"
  ttl          = 300
  managed_zone = google_dns_managed_zone.guskov_dev.name
  rrdatas      = [google_compute_instance.backend_instance.network_interface[0].access_config[0].nat_ip]
}

output "instance_ip" {
  value = google_compute_instance.backend_instance.network_interface[0].access_config[0].nat_ip
}
