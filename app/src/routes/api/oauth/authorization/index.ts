"use server";

import { APIEvent } from "node_modules/@solidjs/start/dist/server";

export function GET(event: APIEvent) {
  const params = new URL(event.request.url).searchParams;

  const redirectUri = params.get("redirect_uri");
  if (null === redirectUri)
    return new Response("No 'redirect_uri' was provided.", { status: 400 });

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  const scope = "https://www.googleapis.com/auth/youtube.readonly";

  url.searchParams.append("client_id", process.env["VITE_GOOGLE_CLIENT_ID"]!);
  url.searchParams.append("redirect_uri", redirectUri);
  url.searchParams.append("scope", scope);
  url.searchParams.append("response_type", "code");

  return { redirect_uri: url.toString() };
}
