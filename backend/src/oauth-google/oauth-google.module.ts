import { Module } from '@nestjs/common';
import { OauthGoogleController } from './oauth-google.controller';
import { OauthGoogleService } from './oauth-google.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [OauthGoogleController],
  providers: [OauthGoogleService]
})
export class OauthGoogleModule {}
