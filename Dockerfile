FROM arm64v8/node:alpine as target-arm64

FROM arm32v7/node:alpine as target-armv7

FROM target-$TARGETARCH$TARGETVARIANT as builder

RUN mkdir -p /usr/app
COPY . /usr/app
WORKDIR /usr/app

RUN apk add --no-cache --update git 
RUN npm install --production

FROM target-$TARGETARCH$TARGETVARIANT

COPY --from=builder /usr/app /usr/app
WORKDIR /usr/app

CMD ["./entrypoint.sh"]