provider "google" {
  project = "utrakr"
  region  = "us-central1"
  version = "~> 3.20"
}

terraform {
  required_version = "~> 0.12"
}

terraform {
  required_version = "~> 0.12"
  backend "gcs" {
    bucket = "utrakr-all-terraform-state"
    prefix = "homepage"
  }
}

data "terraform_remote_state" "crit_dns" {
  backend = "gcs"

  config = {
    bucket = "utrakr-all-terraform-state"
    prefix = "crit-dns"
  }
}

data "google_dns_managed_zone" "root" {
  name = data.terraform_remote_state.crit_dns.outputs["root_zone_name"]
}
output "homepage" {
  value = "https://${trimsuffix(google_dns_record_set.homepage["www"].name, ".")}"
}