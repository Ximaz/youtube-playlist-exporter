"use server";

import { APIEvent } from "node_modules/@solidjs/start/dist/server";

async function revokeToken(token: string, tokenTypeHint: "access_token" | "refresh_token"): Promise<boolean> {
    const revokeBody = new URLSearchParams({
        client_id: process.env["VITE_GOOGLE_CLIENT_ID"]!,
        client_secret: process.env["VITE_GOOGLE_CLIENT_SECRET"]!,
        token,
        token_type_hint: tokenTypeHint
    });

    const response = await fetch("https://oauth2.googleapis.com/revoke", {
        body: revokeBody,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    })

    return 200 === response.status;
}

export async function GET(event: APIEvent): Promise<Response> {
    const params = new URL(event.request.url).searchParams;

    const accessToken = params.get("access_token");

    const refreshToken = params.get("refresh_token");

    if (null === accessToken)
        return new Response("No 'access_token' was provided.", { status: 400 });

    if (null === refreshToken)
      return new Response("No 'refresh_token' was provided.", { status: 400 });

    const accessTokenRevoked = await revokeToken(accessToken, "access_token");
    if (!accessTokenRevoked)
        return new Response("Unable to revoke the access token.", { status: 400 });

    const refreshTokenRevoked = await revokeToken(refreshToken, "refresh_token");
    if (!refreshTokenRevoked)
        return new Response("Unable to revoke the refresh token.", { status: 400 });

    return new Response("ok", { status: 200 });
}