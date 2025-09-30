variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Domain name for the landing page"
  type        = string
}

variable "contact_center_location" {
  description = "Location for Google Cloud Contact Center AI"
  type        = string
  default     = "us-central1"
}

variable "phone_number_region" {
  description = "Region for phone number provisioning"
  type        = string
  default     = "US"
}

variable "phone_number" {
  description = "The phone number for customer support (to be configured manually)"
  type        = string
  default     = "+15551234567"
}

variable "openai_api_key" {
  description = "OpenAI API key for AI customer support agent"
  type        = string
  sensitive   = true
}

variable "suitecrm_db_password" {
  description = "SuiteCRM database password"
  type        = string
  sensitive   = true
}

variable "suitecrm_admin_password" {
  description = "SuiteCRM admin password"
  type        = string
  sensitive   = true
}

variable "gmail_client_id" {
  description = "Gmail API client ID for email integration"
  type        = string
  sensitive   = true
}

variable "gmail_client_secret" {
  description = "Gmail API client secret for email integration"
  type        = string
  sensitive   = true
}

variable "gmail_refresh_token" {
  description = "Gmail API refresh token for email integration"
  type        = string
  sensitive   = true
}

variable "elevenlabs_api_key" {
  description = "ElevenLabs API key for text-to-speech"
  type        = string
  sensitive   = true
}

variable "elevenlabs_voice_id" {
  description = "ElevenLabs voice ID for text-to-speech (optional, defaults to first available)"
  type        = string
  sensitive   = true
  default     = ""
}
