import { Module } from '@nestjs/common';
import { OauthGoogleModule } from './oauth-google/oauth-google.module';
import { ConfigModule } from '@nestjs/config';
import { YoutubeModule } from './youtube/youtube.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OauthGoogleModule,
    YoutubeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
