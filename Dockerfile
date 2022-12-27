FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm ci --only=production

CMD [ "npm", "start" ]
