FROM node:lts-alpine3.20

RUN npm install -g pnpm

RUN apk update --no-cache && apk upgrade

WORKDIR /usr/app

COPY package.json package.json

COPY pnpm-lock.yaml pnpm-lock.yaml

COPY tsconfig.json tsconfig.json

COPY tailwind.config.ts tailwind.config.ts

COPY postcss.config.js postcss.config.js

COPY app.config.ts app.config.ts

COPY components.json components.json

COPY env.d.ts .env.d.ts

COPY src/ src/

COPY public/ public/

COPY typings/ typings/

RUN pnpm i

RUN pnpm build

EXPOSE 8081

ENTRYPOINT [ "pnpm", "start" ]
