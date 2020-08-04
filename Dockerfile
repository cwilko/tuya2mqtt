FROM arm32v7/node:alpine

COPY qemu-arm-static /usr/bin

RUN mkdir -p /usr/node_app
COPY . /usr/node_app
WORKDIR /usr/node_app
RUN apk add --no-cache git
RUN npm install --production

CMD ["./entrypoint.sh"]