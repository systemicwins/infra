output "project_id" {
  description = "The GCP project ID"
  value       = var.project_id
}

output "region" {
  description = "The GCP region"
  value       = var.region
}

output "cloud_run_service_url" {
  description = "URL of the Cloud Run AI agent service"
  value       = google_cloud_run_service.ai_agent.status[0].url
}

output "admin_service_url" {
  description = "URL of the Cloud Run admin service"
  value       = google_cloud_run_service.admin.status[0].url
}

output "frontend_bucket_name" {
  description = "Name of the storage bucket for frontend assets"
  value       = google_storage_bucket.frontend_assets.name
}

output "firestore_database_name" {
  description = "Name of the Firestore database"
  value       = google_firestore_database.main.name
}

output "vertex_ai_location" {
  description = "Vertex AI location for Gemini 2.5 Flash"
  value       = var.region
}

output "support_phone_number_secret" {
  description = "Secret Manager secret containing the support phone number"
  value       = google_secret_manager_secret.support_phone_number.secret_id
}

output "load_balancer_ip_address" {
  description = "IP address of the load balancer for custom domains"
  value       = google_compute_global_address.default.address
}
