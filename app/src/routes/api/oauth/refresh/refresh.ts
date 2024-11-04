import { OauthCredential } from "typings/oauth-credential.interface";

export async function refresh(
  current: OauthCredential
): Promise<OauthCredential> {
  // const refreshResponse = await fetch(
  //   `${window.location.origin}/api/oauth/refresh?refresh_token=${current.refresh_token}`
  // );

  // return await refreshResponse.json();
  return current;
}
