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
