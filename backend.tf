
terraform {
  backend "remote" {
    organization = "charleeo"
    workspaces {
      prefix  = "my-app-prod"
    }
  }
}