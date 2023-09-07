FROM node:20-alpine

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY ./src ./src
COPY ./static ./static

CMD [ "npm", "run", "start" ]

EXPOSE 3000
