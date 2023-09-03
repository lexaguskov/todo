# Specify the provider for GCP
provider "google" {
  credentials = file("service-account-key.json")
  project     = "todo-397919"
  region      = "europe-north1" 
}

# Create a Google Cloud Storage Bucket
resource "google_storage_bucket" "static_website_bucket" {
  name     = "lexaguskov-todo-app"
  location = "EUROPE-NORTH1"  # Use uppercase for the region

  # Enable website hosting
  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
}

# Upload your static website files to the bucket
resource "google_storage_bucket_object" "static_website_files" {
  for_each = fileset("../frontend/build", "**/*")

  name   = "${each.value}"
  source = "../frontend/build/${each.value}"
  bucket = google_storage_bucket.static_website_bucket.name
}

resource "google_storage_bucket_iam_binding" "public_access" {
  bucket = google_storage_bucket.static_website_bucket.name
  role   = "roles/storage.objectViewer"

  members = ["allUsers"]
}

# Output the URL of the static website
output "website_url" {
  value = "https://${google_storage_bucket.static_website_bucket.name}.storage.googleapis.com"
}