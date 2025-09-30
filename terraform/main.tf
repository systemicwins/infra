terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}


# Enable required GCP APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "compute.googleapis.com",
    "run.googleapis.com",
    "firestore.googleapis.com",
    "storage.googleapis.com",
    "cloudbuild.googleapis.com",
    "secretmanager.googleapis.com",
    "speech.googleapis.com",
    "texttospeech.googleapis.com",
    "dialogflow.googleapis.com",
    "contactcenterai.googleapis.com",
    "contactcenterinsights.googleapis.com"
  ])

  service = each.key
  disable_on_destroy = false
}

# VPC Network
resource "google_compute_network" "main" {
  name                    = "${var.environment}-network"
  auto_create_subnetworks = false
}

# Subnet
resource "google_compute_subnetwork" "main" {
  name          = "${var.environment}-subnet"
  ip_cidr_range = "10.0.1.0/24"
  region        = var.region
  network       = google_compute_network.main.id
}

# Cloud Router for NAT
resource "google_compute_router" "main" {
  name    = "${var.environment}-router"
  region  = google_compute_subnetwork.main.region
  network = google_compute_network.main.id
}

# NAT Gateway
resource "google_compute_router_nat" "main" {
  name                               = "${var.environment}-nat"
  router                             = google_compute_router.main.name
  region                             = google_compute_router.main.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}

# Firestore Database
resource "google_firestore_database" "main" {
  name                        = "(default)"
  location_id                 = var.region
  type                        = "FIRESTORE_NATIVE"
  concurrency_mode           = "OPTIMISTIC"
  app_engine_integration_mode = "DISABLED"
}

# Storage Bucket for static assets
resource "google_storage_bucket" "frontend_assets" {
  name                        = "${var.project_id}-${var.environment}-assets"
  location                    = "US"
  uniform_bucket_level_access = true
  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# Service Account for Cloud Run
resource "google_service_account" "cloud_run_sa" {
  account_id   = "${var.environment}-run-sa"
  display_name = "Cloud Run Service Account"
}

# Cloud Run Service for AI Agent Backend
resource "google_cloud_run_service" "ai_agent" {
  name     = "${var.environment}-ai-agent"
  location = var.region

  template {
    spec {
      service_account_name = google_service_account.cloud_run_sa.email
      containers {
        image = "gcr.io/${var.project_id}/${var.environment}-ai-agent:latest"
        ports {
          container_port = 8080
        }
        env {
          name  = "OPENAI_API_KEY"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.openai_api_key.secret_id
              key  = "latest"
            }
          }
        }
        env {
          name  = "FIRESTORE_PROJECT_ID"
          value = var.project_id
        }
        env {
          name  = "SUPPORT_PHONE_NUMBER"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.support_phone_number.secret_id
              key  = "latest"
            }
          }
        }
        env {
          name  = "DIALOGFLOW_AGENT_ID"
          value = google_dialogflow_cx_agent.support_agent.name
        }
        env {
          name  = "DIALOGFLOW_LOCATION"
          value = var.contact_center_location
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_secret_manager_secret_iam_member.ai_agent_secret_accessor]
}

# IAM policy for Cloud Run
resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.ai_agent.location
  project  = google_cloud_run_service.ai_agent.project
  service  = google_cloud_run_service.ai_agent.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

# Secret Manager for sensitive data
resource "google_secret_manager_secret" "openai_api_key" {
  secret_id = "${var.environment}-openai-api-key"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "support_phone_number" {
  secret_id = "${var.environment}-support-phone-number"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "openai_api_key" {
  secret      = google_secret_manager_secret.openai_api_key.name
  secret_data = var.openai_api_key
}

resource "google_secret_manager_secret_version" "support_phone_number" {
  secret      = google_secret_manager_secret.support_phone_number.name
  secret_data = var.phone_number != null ? var.phone_number : "+15551234567"
}

# IAM for Secret Manager access
resource "google_secret_manager_secret_iam_member" "ai_agent_secret_accessor" {
  secret_id = google_secret_manager_secret.openai_api_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_secret_manager_secret_iam_member" "support_phone_accessor" {
  secret_id = google_secret_manager_secret.support_phone_number.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

# Dialogflow CX Agent for AI-powered conversations
resource "google_dialogflow_cx_agent" "support_agent" {
  display_name = "${var.environment}-support-agent"
  location     = var.contact_center_location
  default_language_code = "en"
  time_zone = "America/Los_Angeles"

  # Enable speech recognition and synthesis
  enable_spell_correction = true
  enable_stackdriver_logging = true

  depends_on = [google_project_service.required_apis]
}

# Contact Center Insights Instance for conversation analysis
resource "google_contact_center_insights_instance" "main" {
  name     = "${var.environment}-ccai-instance"
  location = var.contact_center_location

  depends_on = [google_project_service.required_apis]
}

# Note: Phone number provisioning for Dialogflow CX typically requires
# manual configuration through the Google Cloud Console or telephony partners
# The phone number will need to be configured to point to the Dialogflow CX webhook

# Outputs
output "cloud_run_url" {
  value = google_cloud_run_service.ai_agent.status[0].url
}

output "storage_bucket_name" {
  value = google_storage_bucket.frontend_assets.name
}
