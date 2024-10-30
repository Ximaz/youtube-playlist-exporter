import { BACKEND_URL, OauthCredential, RawOauthCredential } from "./constants";

export async function fetchOauthUrl(redirectUri: string): Promise<string> {
  const response = await fetch(
    `${BACKEND_URL}/oauth/authorization?redirect_uri=${redirectUri}`,
    {
      credentials: "include",
    }
  );

  const data = await response.json();

  return data.redirect_uri;
}

export async function getOauthCredential(
  code: string,
  state: string
): Promise<OauthCredential> {
  const response = await fetch(
    `${BACKEND_URL}/oauth/callback?code=${code}&state=${state}`,
    {
      credentials: "include",
    }
  );

  const data: RawOauthCredential = await response.json();

  const oauthCredential: OauthCredential = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in - 5) * 1000,
    refresh_token: data.refresh_token,
  };

  return oauthCredential;
}
