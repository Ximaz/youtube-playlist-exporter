"use server";

import { APIEvent } from "node_modules/@solidjs/start/dist/server";
import { YoutubePlaylists } from "typings/youtube-playlist.interface";

// TODO: Search through all the playlists, and not just be lazy by using the
// "maxResults" attribute.
export async function GET(event: APIEvent): Promise<YoutubePlaylists["items"] | Response> {
  const params = new URL(event.request.url).searchParams;

  const accessToken = params.get("access_token");

  if (null === accessToken)
    return new Response("No 'access_token' was provided.", { status: 401 });

  const apiUrl = new URL("https://www.googleapis.com/youtube/v3/playlists");
  apiUrl.searchParams.append("part", "id,snippet,contentDetails");
  apiUrl.searchParams.append("mine", "true");
  apiUrl.searchParams.append("maxResults", "50");

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include"
  });

  if (401 === response.status)
    return new Response("Invalid access token, it might have expired.", { status: 401 });

  const youtubePlaylists: YoutubePlaylists = await response.json();

  return youtubePlaylists["items"];
}
