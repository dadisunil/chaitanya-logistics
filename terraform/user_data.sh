#!/bin/bash
# Install Docker
apt-get update -y
apt-get install -y docker.io docker-compose
systemctl start docker
systemctl enable docker
# Login to ECR if using ECR (uncomment and set your region/account)
# aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.ap-south-1.amazonaws.com
# Pull images if using ECR or build locally if using docker-compose
cd /home/ubuntu/app || cd /root/app || cd /app || exit 1
# Start containers
/usr/local/bin/docker-compose up -d --build
