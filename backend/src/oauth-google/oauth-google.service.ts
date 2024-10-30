import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash } from 'crypto';
import { Request } from 'express';
import { OauthCredential } from './interfaces/oauth-credential.interface';

@Injectable()
export class OauthGoogleService {
  private readonly OAUTH_AUTHORIZATION_URL =
    'https://accounts.google.com/o/oauth2/auth';

  private readonly OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';

  private readonly OAUTH_REVOKE_URL = 'https://oauth2.googleapis.com/revoke';

  private readonly GOOGLE_CLIENT_ID: string;

  private readonly GOOGLE_CLIENT_SECRET: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.GOOGLE_CLIENT_ID =
      this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID');

    this.GOOGLE_CLIENT_SECRET = this.configService.getOrThrow<string>(
      'GOOGLE_CLIENT_SECRET',
    );
  }

  private getState(req: Request, now: number): string {
    const state = `${req.ip}:${req.headers['user-agent']}:${now}`;

    const hashedState = hash('SHA-512', state, 'hex');

    return hashedState;
  }

  getOauthUrl(req: Request, redirectUri: string): string {
    const now = Date.now();

    const state = this.getState(req, now);

    req.session['state'] = {
      createdAt: now,
      value: state,
    };

    req.session.save((err) => {
      if (err) console.error(err);
    });

    const queries = {
      scope: 'https%3A//www.googleapis.com/auth/youtube.readonly',
      access_type: 'offline',
      include_granted_scopes: false,
      response_type: 'code',
      state,
      redirect_uri: redirectUri,
      client_id: this.GOOGLE_CLIENT_ID,
    };

    const queriesString = Object.entries(queries)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    return `${this.OAUTH_AUTHORIZATION_URL}?${queriesString}`;
  }

  validateState(req: Request, state: string): void {
    const cachedState = req.session['state'] as {
      createdAt: number;
      value: string;
    };

    req.session.destroy((err) => {
      if (err) console.error(err);
    });

    const forbiddenException = new ForbiddenException('Invalid state.');

    if (undefined === cachedState.createdAt || undefined === cachedState.value)
      throw forbiddenException;

    if (cachedState.value !== state) throw forbiddenException;

    const computedState = this.getState(req, cachedState.createdAt);

    if (computedState !== state) throw forbiddenException;
  }

  async getOauthCredential(
    redirectUri: string,
    code: string,
  ): Promise<OauthCredential> {
    const oauthCredential: OauthCredential = (
      await this.httpService.axiosRef.post(
        this.OAUTH_TOKEN_URL,
        {
          code,
          client_id: this.GOOGLE_CLIENT_ID,
          client_secret: this.GOOGLE_CLIENT_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
    ).data;

    if (
      !oauthCredential.scope.includes(
        'https://www.googleapis.com/auth/youtube.readonly',
      )
    )
      throw new ForbiddenException('Some scopes are missing.');

    return oauthCredential;
  }

  async refresh(refreshToken: string): Promise<OauthCredential> {
    const oauthCredential: OauthCredential = (
      await this.httpService.axiosRef.post(
        this.OAUTH_TOKEN_URL,
        {
          client_id: this.GOOGLE_CLIENT_ID,
          client_secret: this.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
    ).data;

    if (
      !oauthCredential.scope.includes(
        'https://www.googleapis.com/auth/youtube.readonly',
      )
    )
      throw new ForbiddenException('Some scopes are missing.');

    return oauthCredential;
  }

  async revoke(token: string): Promise<void> {
    await this.httpService.axiosRef.post(
      this.OAUTH_REVOKE_URL,
      {
        token,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  }
}
