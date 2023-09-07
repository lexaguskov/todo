apt update -y
apt install -y docker.io unzip
usermod -aG docker lexa
systemctl restart docker

unzip /tmp/bundle.zip -d /tmp/

cd /tmp/backend
docker build -t todo .

cd / 
rm -rf /tmp/bundle /tmp/bundle.zip

docker run \
  --name=todo \
  --restart=always \
  -p 80:3000 \
  -v /var/ypersistence:/var/ypersistence \
  --env-file=/tmp/.env.prod \
  -d \
  todo
