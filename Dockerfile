FROM node:lts-alpine3.16

RUN mkdir -p /usr/app
COPY . /usr/app
WORKDIR /usr/app

RUN apk add --no-cache --update git python3 make g++
RUN npm install --production

FROM node:lts-alpine3.16

COPY --from=builder /usr/app /usr/app
WORKDIR /usr/app

CMD ["./entrypoint.sh"]