export interface RawOauthCredential {
  access_token: string;
  expires_in: number;
  token_type: 'Bearer';
  scope: string;
  refresh_token: string;
}

export interface OauthCredential {
  access_token: string;
  expires_at: number;
  refresh_token: string;
}
