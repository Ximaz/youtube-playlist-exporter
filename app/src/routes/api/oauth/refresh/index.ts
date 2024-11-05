"use server";

import { APIEvent } from "node_modules/@solidjs/start/dist/server";
import {
  OauthCredential,
  RawOauthCredential,
} from "typings/oauth-credential.interface";

export async function GET(
  event: APIEvent
): Promise<OauthCredential | Response> {
  const params = new URL(event.request.url).searchParams;

  const refreshToken = params.get("refresh_token");
  if (null === refreshToken)
    return new Response("No 'refresh_token' was provided.", { status: 400 });

  const refreshBody = new URLSearchParams({
    client_id: process.env["VITE_GOOGLE_CLIENT_ID"]!,
    client_secret: process.env["VITE_GOOGLE_CLIENT_SECRET"]!,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  }).toString();

  const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
    body: refreshBody,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST"
  });

  const data: RawOauthCredential = await refreshResponse.json();

  return {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in - 4) * 1000,
    refresh_token: data.refresh_token ?? refreshToken,
  };
}
