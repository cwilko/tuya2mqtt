FROM node:lts-alpine3.16

RUN mkdir -p /usr/app
COPY . /usr/app
WORKDIR /usr/app

RUN npm install --production

CMD ["./entrypoint.sh"]