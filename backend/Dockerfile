FROM node:lts-alpine3.20

RUN npm install -g pnpm

RUN apk update --no-cache && apk upgrade

WORKDIR /usr/app

COPY package.json package.json

COPY pnpm-lock.yaml pnpm-lock.yaml

COPY tsconfig.build.json tsconfig.build.json

COPY tsconfig.json tsconfig.json

COPY src/ src/

COPY typings/ typings/

RUN pnpm i

RUN pnpm build

EXPOSE 8080

ENTRYPOINT [ "pnpm", "start" ]
