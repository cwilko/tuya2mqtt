FROM node:lts-alpine3.16

RUN mkdir -p /usr/app
COPY . /usr/app
WORKDIR /usr/app

RUN apk add --no-cache --update git python3 make
RUN npm install --production

CMD ["./entrypoint.sh"]