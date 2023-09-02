FROM node:18.4.0-alpine3.15

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY ./src ./src
COPY ./public ./public
COPY ./tsconfig.json ./tsconfig.json

CMD [ "npm", "run", "start" ]
