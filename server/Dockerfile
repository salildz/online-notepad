FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 9001
CMD ["npm", "start"]
