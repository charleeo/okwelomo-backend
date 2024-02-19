provider "aws" {
  access_key = "${var.AWS_ACCESS_KEY_ID}"
  secret_key = "${var.AWS_SECRET_ACCESS_KEY}"
  region     = "eu-west-2"  # Specify your AWS region
}

resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true

  tags = {
    Name = "my-vpc"
  }
}

output "vpc" {
  description = "VPC information"
  value = aws_vpc.my_vpc
}
output "secret_group" {
  description = "VPC Security group"
  value = aws_security_group.my_db_sg
}

resource "aws_subnet" "my_subnet" {
  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "eu-west-2a" # Change to your desired AZ
  map_public_ip_on_launch = true

  tags = {
    Name = "my-subnet"
  }
}
resource "aws_subnet" "my_subnet_2" {
  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "eu-west-2b" # Change to your desired AZ
  map_public_ip_on_launch = true

  tags = {
    Name = "my-subnet_2"
  }
}

resource "aws_instance" "my_ec2_instance" {
  count         = 2
  ami           = "ami-0e5f882be1900e43b" # Specify your desired AMI ID
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.my_subnet.id
  vpc_security_group_ids = [aws_security_group.my_db_sg.id]


  tags = {
    Name = "my-ec2-instance-${count.index}"
  }
}

resource "aws_db_subnet_group" "my_db_subnet_group" {
  name       = "my-db-subnet-group"
  subnet_ids = [aws_subnet.my_subnet.id, aws_subnet.my_subnet_2.id] # List of subnet IDs within the VPC
  tags = {
    Name = "DB-Subnet"
  }
}


resource "aws_security_group" "my_ec2_sg" {
  vpc_id = aws_vpc.my_vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Example ingress rule for SSH access, modify as needed
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "my-ec2-sg"
  }
}

resource "aws_db_instance" "my_db_instance" {
  identifier           = "my-nestjs-db"
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "15.5"
  instance_class       = "db.t3.micro"
  db_name              = "okw"
  username             = "charles"
  password             = "charles1234"
  parameter_group_name = "default.postgres15"
  vpc_security_group_ids = [aws_security_group.my_db_sg.id]
  db_subnet_group_name = aws_db_subnet_group.my_db_subnet_group.name

  tags = {
    Name = "my-db-instance"
  }
}


resource "aws_security_group" "my_db_sg" {
  vpc_id = aws_vpc.my_vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "my-db-sg"
  }
}
