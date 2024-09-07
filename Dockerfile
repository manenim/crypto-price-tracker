FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]