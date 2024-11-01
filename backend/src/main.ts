import RedisStore from 'connect-redis';
import { createClient } from 'redis';

import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

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

  app.set('trust proxy', true);

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

  app.listen(8080, '0.0.0.0');
}

bootstrap();
