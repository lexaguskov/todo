set -e
cd /home/lexa/backend

rm -rf ./static
mv ../frontend/build ./static
docker build -t todo .

cd /home/lexa
rm -rf backend frontend

docker stop todo || echo not running
docker rm todo || echo not running
docker run \
  --name=todo \
  --restart=always \
  -p 80:80 \
  -p 443:443 \
  -v /var/ypersistence:/var/ypersistence \
  -v /var/greenlock.d:/var/greenlock.d \
  --env-file=/home/lexa/.env.prod \
  -d \
  todo


