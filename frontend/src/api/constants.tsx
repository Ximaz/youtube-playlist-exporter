export const BACKEND_URL = "https://localhost:3000";

export type RawOauthCredential = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
};

export type OauthCredential = {
  access_token: string;
  expires_at: number;
  refresh_token: string;
};
