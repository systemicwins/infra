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
    "contactcenterinsights.googleapis.com",
    "sql-component.googleapis.com",
    "sqladmin.googleapis.com",
    "certificatemanager.googleapis.com"
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

# Cloud SQL PostgreSQL for SuiteCRM
resource "google_sql_database_instance" "suitecrm_db" {
  name             = "${var.environment}-suitecrm-postgres"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-f1-micro"
    disk_size = 10

    database_flags {
      name  = "max_connections"
      value = "100"
    }

    ip_configuration {
      ipv4_enabled = true
      authorized_networks {
        name  = "vpc-network"
        value = google_compute_subnetwork.main.ip_cidr_range
      }
    }
  }

  deletion_protection = false  # Set to true for production
}

# SuiteCRM Database
resource "google_sql_database" "suitecrm" {
  name     = "suitecrm"
  instance = google_sql_database_instance.suitecrm_db.name
}

# SuiteCRM Database User
resource "google_sql_user" "suitecrm" {
  name     = "suitecrm"
  instance = google_sql_database_instance.suitecrm_db.name
  password = var.suitecrm_db_password
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

# Cloud Run Service for SuiteCRM
resource "google_cloud_run_service" "suitecrm" {
  name     = "${var.environment}-suitecrm"
  location = var.region

  template {
    spec {
      service_account_name = google_service_account.cloud_run_sa.email
      containers {
        image = "gcr.io/${var.project_id}/${var.environment}-suitecrm:latest"
        ports {
          container_port = 80
        }
        env {
          name  = "SUITECRM_DB_HOST"
          value = google_sql_database_instance.suitecrm_db.private_ip_address
        }
        env {
          name  = "SUITECRM_DB_PORT"
          value = "5432"
        }
        env {
          name  = "SUITECRM_DB_NAME"
          value = google_sql_database.suitecrm.name
        }
        env {
          name  = "SUITECRM_DB_USER"
          value = google_sql_user.suitecrm.name
        }
        env {
          name  = "SUITECRM_DB_PASSWORD"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.suitecrm_db_password.secret_id
              key  = "latest"
            }
          }
        }
        env {
          name  = "SUITECRM_ADMIN_PASSWORD"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.suitecrm_admin_password.secret_id
              key  = "latest"
            }
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_secret_manager_secret_iam_member.suitecrm_secret_accessor]
}

# IAM policy for AI Agent Cloud Run
resource "google_cloud_run_service_iam_policy" "ai_agent_noauth" {
  location = google_cloud_run_service.ai_agent.location
  project  = google_cloud_run_service.ai_agent.project
  service  = google_cloud_run_service.ai_agent.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

# IAM policy for SuiteCRM Cloud Run
resource "google_cloud_run_service_iam_policy" "suitecrm_noauth" {
  location = google_cloud_run_service.suitecrm.location
  project  = google_cloud_run_service.suitecrm.project
  service  = google_cloud_run_service.suitecrm.name

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

resource "google_secret_manager_secret" "suitecrm_db_password" {
  secret_id = "${var.environment}-suitecrm-db-password"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "suitecrm_admin_password" {
  secret_id = "${var.environment}-suitecrm-admin-password"
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

resource "google_secret_manager_secret_version" "suitecrm_db_password" {
  secret      = google_secret_manager_secret.suitecrm_db_password.name
  secret_data = var.suitecrm_db_password
}

resource "google_secret_manager_secret_version" "suitecrm_admin_password" {
  secret      = google_secret_manager_secret.suitecrm_admin_password.name
  secret_data = var.suitecrm_admin_password
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

resource "google_secret_manager_secret_iam_member" "suitecrm_secret_accessor" {
  secret_id = google_secret_manager_secret.suitecrm_db_password.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

# Cloud SQL IAM permissions for SuiteCRM
resource "google_project_iam_member" "suitecrm_cloud_sql" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
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

# Load Balancer for subdomain routing
resource "google_compute_global_address" "default" {
  name = "${var.environment}-global-ip"
}

# Backend services for load balancer
resource "google_compute_backend_service" "ai_agent_backend" {
  name      = "${var.environment}-ai-agent-backend"
  protocol  = "HTTP"

  backend {
    group = google_compute_region_network_endpoint_group.ai_agent_neg.id
  }

  health_checks = [google_compute_health_check.default.id]
}

resource "google_compute_backend_service" "suitecrm_backend" {
  name      = "${var.environment}-suitecrm-backend"
  protocol  = "HTTP"

  backend {
    group = google_compute_region_network_endpoint_group.suitecrm_neg.id
  }

  health_checks = [google_compute_health_check.default.id]
}

# Network endpoint groups for Cloud Run
resource "google_compute_region_network_endpoint_group" "ai_agent_neg" {
  name                  = "${var.environment}-ai-agent-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = google_cloud_run_service.ai_agent.name
  }
}

resource "google_compute_region_network_endpoint_group" "suitecrm_neg" {
  name                  = "${var.environment}-suitecrm-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = google_cloud_run_service.suitecrm.name
  }
}

# Health check for load balancer
resource "google_compute_health_check" "default" {
  name = "${var.environment}-health-check"

  http_health_check {
    port = 80
  }
}

# SSL Certificate for custom domains
resource "google_compute_managed_ssl_certificate" "default" {
  name = "${var.environment}-ssl-cert"

  managed {
    domains = [var.domain_name, "crm.${var.domain_name}"]
  }
}

# URL Map for subdomain routing
resource "google_compute_url_map" "default" {
  name            = "${var.environment}-url-map"
  default_service = google_compute_backend_service.ai_agent_backend.id

  host_rule {
    hosts        = ["crm.${var.domain_name}"]
    path_matcher = "crm"
  }

  host_rule {
    hosts        = [var.domain_name]
    path_matcher = "main"
  }

  path_matcher {
    name            = "crm"
    default_service = google_compute_backend_service.suitecrm_backend.id
  }

  path_matcher {
    name            = "main"
    default_service = google_compute_backend_service.ai_agent_backend.id
  }
}

# HTTP Proxy
resource "google_compute_target_http_proxy" "default" {
  name    = "${var.environment}-http-proxy"
  url_map = google_compute_url_map.default.id
}

# HTTPS Proxy
resource "google_compute_target_https_proxy" "default" {
  name             = "${var.environment}-https-proxy"
  url_map          = google_compute_url_map.default.id
  ssl_certificates = [google_compute_managed_ssl_certificate.default.id]
}

# Global forwarding rules
resource "google_compute_global_forwarding_rule" "http" {
  name       = "${var.environment}-http-forwarding-rule"
  target     = google_compute_target_http_proxy.default.id
  port_range = "80"
  ip_address = google_compute_global_address.default.address
}

resource "google_compute_global_forwarding_rule" "https" {
  name       = "${var.environment}-https-forwarding-rule"
  target     = google_compute_target_https_proxy.default.id
  port_range = "443"
  ip_address = google_compute_global_address.default.address
}

# Note: Phone number provisioning for Dialogflow CX typically requires
# manual configuration through the Google Cloud Console or telephony partners
# The phone number will need to be configured to point to the Dialogflow CX webhook

# Outputs
output "cloud_run_url" {
  value = google_cloud_run_service.ai_agent.status[0].url
}

output "suitecrm_url" {
  value = google_cloud_run_service.suitecrm.status[0].url
}

output "load_balancer_ip" {
  value = google_compute_global_address.default.address
}

output "storage_bucket_name" {
  value = google_storage_bucket.frontend_assets.name
}

output "cloud_sql_instance" {
  value = google_sql_database_instance.suitecrm_db.name
}
