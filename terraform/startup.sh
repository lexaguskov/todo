apt update -y
apt install -y docker.io unzip
usermod -aG docker lexa
systemctl restart docker
