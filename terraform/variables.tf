variable "key_name" {
  description = "The name of the EC2 Key Pair to use for SSH access. Must already exist in your AWS account."
  type        = string
}

variable "ami" {
  description = "AMI ID for the EC2 instance."
  type        = string
}
# Add more variables as needed
