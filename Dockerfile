FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --silent

COPY . ./

EXPOSE 7134
