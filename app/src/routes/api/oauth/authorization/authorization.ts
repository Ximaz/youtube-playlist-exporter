export async function authorization(redirectUri: string): Promise<string> {
  const authorizationResponse = await fetch(
    `${window.location.origin}/api/oauth/authorization?redirect_uri=${redirectUri}`
  );

  const data = await authorizationResponse.json();

  return data.redirect_uri;
}
