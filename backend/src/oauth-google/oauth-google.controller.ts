import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import { OauthGoogleService } from './oauth-google.service';
import { Request } from 'express';
import { OauthCredential } from '../../typings/oauth-credential.interface';

@Controller('/oauth')
export class OauthGoogleController {
  constructor(private readonly oauthGoogleService: OauthGoogleService) {}

  @Get('/authorization')
  authorization(
    @Req() req: Request,
    @Query('redirect_uri') redirect_uri: string,
  ): { redirect_uri: string } {
    const authorizationUri = this.oauthGoogleService.getOauthUrl(
      req,
      redirect_uri,
    );

    return { redirect_uri: authorizationUri };
  }

  @Get('/callback')
  async callback(
    @Req() req: Request,
    @Query('code') code: string,
    @Query('state') state: string,
  ): Promise<
    Pick<OauthCredential, 'access_token' | 'expires_in' | 'refresh_token'>
  > {
    this.oauthGoogleService.validateState(req, state);

    const redirectUri = `${req.headers.origin}${req.url.split('?')[0]}`;

    const oauthCredential = await this.oauthGoogleService.getOauthCredential(
      redirectUri,
      code,
    );

    return {
      access_token: oauthCredential.access_token,
      expires_in: oauthCredential.expires_in,
      refresh_token: oauthCredential.refresh_token,
    };
  }

  @Get('/refresh')
  async refresh(
    @Query('refresh_token') refresh_token: string,
  ): Promise<
    Pick<OauthCredential, 'access_token' | 'expires_in' | 'refresh_token'>
  > {
    const oauthCredential =
      await this.oauthGoogleService.refresh(refresh_token);

    return {
      access_token: oauthCredential.access_token,
      expires_in: oauthCredential.expires_in,
      refresh_token: oauthCredential.refresh_token,
    };
  }

  @Delete('/revoke')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revoke(
    @Query('access_token') accessToken: string,
    @Query('refresh_token') refreshToken: string,
  ): Promise<void> {
    await this.oauthGoogleService.revoke(accessToken);

    await this.oauthGoogleService.revoke(refreshToken);
  }
}
