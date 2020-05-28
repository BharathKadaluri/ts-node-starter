FROM node:10 AS BUILD

RUN mkdir -p /usr/share/app
WORKDIR /usr/share/app

COPY . .

RUN npm install
RUN npm run build

CMD ["npm","run","prod"]
