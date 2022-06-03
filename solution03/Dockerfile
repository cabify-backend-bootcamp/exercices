FROM node:latest
ADD . /app
WORKDIR /app
RUN npm install

CMD ["DEBUG=express:*", "node", "index.js"]
