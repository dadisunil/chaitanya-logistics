provider "aws" {
  region = "ap-south-1"
}

resource "aws_instance" "app_server" {
  ami                    = var.ami
  instance_type          = "t2.micro"
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  user_data              = file("user_data.sh")
  iam_instance_profile   = "dev_test" # <-- Use your actual instance profile name here
  tags                   = {
    Name = "chaitanya-logistics-app"
  }
}

resource "aws_security_group" "app_sg" {
  name        = "app_sg"
  description = "Allow HTTP and SSH"
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Removed IAM role, policy, and instance profile resources
# Reference the existing instance profile (dev_test) in aws_instance