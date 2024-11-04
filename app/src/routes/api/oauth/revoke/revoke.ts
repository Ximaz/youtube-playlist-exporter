import { OauthCredential } from "typings/oauth-credential.interface";

export async function revoke(current: OauthCredential): Promise<boolean> {
  const revokeResponse = await fetch(
    `${window.location.origin}/api/oauth/revoke?access_token=${current.access_token}&refresh_token=${current.refresh_token}`
  );

  return 200 === revokeResponse.status;
}
