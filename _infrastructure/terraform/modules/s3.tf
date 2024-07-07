resource "aws_s3_bucket" "cm_pricelists" {
  bucket = "${data.aws_caller_identity.current.account_id}-cm-pricelists"

  lifecycle {
    prevent_destroy = true
  }
}
