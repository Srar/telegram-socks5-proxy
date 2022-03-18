FROM node:17-alpine

WORKDIR /telegram-socks5-proxy

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 1080

CMD ["node", "server.js", "--port", "1080"]
