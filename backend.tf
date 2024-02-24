
terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "charleeo"
    workspaces {
      prefix  = "my-app-prod"
    }
  }
}