import { readFileSync } from 'node:fs';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';

import { AppModule } from './app.module';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('./ssl/localhost.key'),
    cert: readFileSync('./ssl/localhost.crt'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  const configService = app.get(ConfigService);

  const FRONTEND = configService.getOrThrow<string>('FRONTEND');

  app.enableCors({
    credentials: true,
    origin: FRONTEND,
  });

  const EXPRESS_SESSION_SECRET = configService.getOrThrow<string>(
    'EXPRESS_SESSION_SECRET',
  );

  const REDIS_HOST = configService.getOrThrow<string>('REDIS_HOST');

  const REDIS_PORT = configService.getOrThrow<number>('REDIS_PORT');

  const redisClient = createClient({
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
  });

  await redisClient.connect();

  const redisStore = new RedisStore({
    client: redisClient,
  });

  app.use(
    session({
      name: 'youtube-playlist-downloader',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 5,
        sameSite: 'strict',
        secure: true,
      },
      secret: EXPRESS_SESSION_SECRET,
      store: redisStore,
    }),
  );

  const PORT = configService.getOrThrow<string>('PORT');

  await app.listen(PORT, '0.0.0.0');
}

bootstrap();
