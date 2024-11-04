"use server";

import { APIEvent } from "node_modules/@solidjs/start/dist/server";
import {
  OauthCredential,
  RawOauthCredential,
} from "typings/oauth-credential.interface";

export async function GET(
  event: APIEvent
): Promise<OauthCredential | Response> {
  const referer = event.request.headers.get("referer");

  if (null === referer)
    return new Response("No 'referer' header was provided", { status: 400 });

  const requestUrl = new URL(referer);

  const redirectUri = `${requestUrl.origin}${requestUrl.pathname}`;

  const params = requestUrl.searchParams;

  const code = params.get("code");

  if (null === code) return new Response("No 'code' was provided", { status: 400 });

  const exchangeBody = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  }).toString();

  const exchangeResponse = await fetch("https://oauth2.googleapis.com/token", {
    body: exchangeBody,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST"
  });

  const data: RawOauthCredential = await exchangeResponse.json();

  return {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in - 4) * 1000,
    refresh_token: data.refresh_token,
  };
}
