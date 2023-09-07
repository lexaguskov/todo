cd /home/lexa/backend

mv ../frontend/build/* ./static/
docker build -t todo .

cd /home/lexa
rm -rf backend frontend

docker stop todo || echo not running
docker rm todo || echo not running
docker run \
  --name=todo \
  --restart=always \
  -p 80:3000 \
  -v /var/ypersistence:/var/ypersistence \
  --env-file=/home/lexa/.env.prod \
  -d \
  todo


