import { OauthCredential } from "typings/oauth-credential.interface";

export async function callback(code: string): Promise<OauthCredential> {
  const callbackResponse = await fetch(
    `${window.location.origin}/api/oauth/callback?code=${code}`
  );

  const data = await callbackResponse.json();

  if (!callbackResponse.ok)
    throw new Error(`${data["error"]}: ${data["error_description"]}`);

  return data;
}
