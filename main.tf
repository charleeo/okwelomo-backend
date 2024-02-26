provider "aws" {
  region = "eu-west-1"
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
}


# Create VPC
resource "aws_vpc" "okw" {
  cidr_block = "10.0.0.0/16"
   enable_dns_hostnames = true
    enable_dns_support = true
    tags = {
      Name="okw_vpc"
    }
}

# # Create internet gateway
resource "aws_internet_gateway" "okw_igw" {
  vpc_id = aws_vpc.okw.id
  tags = {
    Name ="okw_igw"
  }
}

# # Create security group
resource "aws_security_group" "okw_sg" {
  name        = "example_sg"
  description = "Allow inbound traffic to RDS"
  vpc_id      = aws_vpc.okw.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "SSH"
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

  tags = {
    Name = "okw_sg"
  }
}

# # Create public subnet A
resource "aws_subnet" "public_subnet_a" {
  vpc_id            = aws_vpc.okw.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "eu-west-1a" # Specify the availability zone
  tags = {
    Name = "subnet_1"
  }
}

# # Create public subnet B
resource "aws_subnet" "public_subnet_b" {
  vpc_id            = aws_vpc.okw.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "eu-west-1b" # Specify the availability zone
  tags = {
    Name = "subnet_2"
  }
}

# # Create route table for public subnets
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.okw.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.okw_igw.id
  }
  
  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.okw_igw.id
  }
  tags = {
    Name = "okw_route_table"
  }
}

# # Associate public subnet A with the route table
resource "aws_route_table_association" "public_subnet_a_association" {
  subnet_id      = aws_subnet.public_subnet_a.id
  route_table_id = aws_route_table.public_route_table.id
  
}

# # Associate public subnet B with the route table
resource "aws_route_table_association" "public_subnet_b_association" {
  subnet_id      = aws_subnet.public_subnet_b.id
  route_table_id = aws_route_table.public_route_table.id
}

# # Create RDS subnet group
resource "aws_db_subnet_group" "okw_db_subnet_group" {
  name       = "my_db_group"
  subnet_ids = [aws_subnet.public_subnet_a.id, aws_subnet.public_subnet_b.id]
}

# # Create RDS instance
resource "aws_db_instance" "example_db_instance" {
  identifier            = "okw-db-instance"
  allocated_storage     = 20
  storage_type          = "gp2"
  engine                = "postgres"
  engine_version        = "16"
  instance_class        = "db.t3.micro"
  db_name               =  "dev"
  username              = "admindev"
  password              = "charles1234"
  db_subnet_group_name  = aws_db_subnet_group.okw_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.okw_sg.id]
  publicly_accessible   = true # This makes your RDS instance publicly accessible
}

resource "aws_network_interface" "web-server-nic" {
  subnet_id       = aws_subnet.public_subnet_a.id
  private_ips     = ["10.0.1.50"]
  security_groups = [aws_security_group.okw_sg.id]
}

output "app_instance" {
  description = "Get the public IP of the EC2 instance"
  value = aws_instance.okw_app_instance.public_dns
}

resource "aws_instance" "okw_app_instance" {
  ami           = "ami-0905a3c97561e0b69" 
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public_subnet_b.id
  security_groups = [aws_security_group.okw_sg.id]
  key_name      = "okw-ireland"
  associate_public_ip_address = true
  tags = {
    Name = "okw_nest_instance"
  }

    user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y apache2
              sudo a2enmod proxy proxy_http
              sudo systemctl start apache2
              sudo systemctl enable apache2
              # Install Node.js
              curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
              sudo apt-get install -y nodejs git
              # Clone your repository
              git clone https://charleeo:${var.PA_TOKEN}@github.com/charleeo/okwelomo-backend.git /var/www/nestjsapp
              cd /var/www/nestjsapp
              git checkout -b dev orign
              # Install PM2 to keep your app running
              sudo npm install -g pm2
              # Install dependencies and run migrations
              npm install
              npm run build
              npm run migration:run
              # Start your NestJS application
              pm2 start dist/src/main.js --name nestjsapp
              # Copy example.env to .env
              cp /var/www/nestjsapp/example.env /var/www/nestjsapp/.env
              # Configure Apache to reverse proxy to your application
              echo '
              <VirtualHost *:80>
                   ServerName 
                   ErrorLog /var/log/apache2/error.log
                   CustomLog /var/log/apache2/access.log combined
                     ProxyRequests On
                     ProxyPass / http://localhost:4551
                    ProxyPassReverse / http://localhost:4551
              </VirtualHost>' | sudo tee /etc/apache2/sites-available/nestjsapp.conf
              sudo a2ensite nestjsapp.conf
              sudo systemctl restart apache2
              EOF
}

output "instance_public_ip" {
  value = aws_instance.okw_app_instance.public_ip
}


# <VirtualHost *:80>
#         ServerName  ec2-34-247-84-76.eu-west-1.compute.amazonaws.com
#         ErrorLog /var/log/apache2/error.log
#         CustomLog /var/log/apache2/access.log combined
#         ProxyRequests On
#         ProxyPass / http://localhost:4551
#         ProxyPassReverse / http://localhost:4551
# </VirtualHost>







