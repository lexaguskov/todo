FROM node:20-alpine

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY ./src ./src

CMD [ "npm", "run", "start" ]

EXPOSE 3000
