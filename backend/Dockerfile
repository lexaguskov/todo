FROM node:18.4.0-alpine3.15

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY ./src ./src

CMD [ "npm", "run", "start" ]
