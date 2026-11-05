# F10: public-read bucket, no versioning, no encryption block.
resource "aws_s3_bucket" "reports" {
  bucket = "fixture-security-reports"
  acl    = "public-read"
}
