FROM --platform=linux/amd64 node:16.4.2-slim

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "prod"]