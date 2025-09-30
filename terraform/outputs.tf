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

output "frontend_bucket_name" {
  description = "Name of the storage bucket for frontend assets"
  value       = google_storage_bucket.frontend_assets.name
}

output "firestore_database_name" {
  description = "Name of the Firestore database"
  value       = google_firestore_database.main.name
}

output "dialogflow_cx_agent_name" {
  description = "Name of the Dialogflow CX agent for customer support"
  value       = google_dialogflow_cx_agent.support_agent.name
}

output "contact_center_insights_instance" {
  description = "Contact Center Insights instance name"
  value       = google_contact_center_insights_instance.main.name
}

output "support_phone_number_secret" {
  description = "Secret Manager secret containing the support phone number"
  value       = google_secret_manager_secret.support_phone_number.secret_id
}
