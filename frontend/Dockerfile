FROM node:20-alpine

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY ./src ./src
COPY ./public ./public
COPY ./tsconfig.json ./tsconfig.json

CMD [ "npm", "run", "start" ]
