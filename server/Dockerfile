FROM node:14

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 5432
EXPOSE 80

CMD [ "node", "index.js" ]