terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.57.0"
    }
  }

  required_version = ">= 1.4.6"

  backend "s3" {
    bucket         = "eike-terraform-state"
    key            = "state/cm-stats-terraform.tfstate"
    encrypt        = true
    dynamodb_table = "eike-terraform_tf_lockid"
  }
}

provider "aws" {
  region = "eu-central-1"
}

module "cm-stats" {
  source = "./modules"
}