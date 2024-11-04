"use server";

import { APIEvent } from "node_modules/@solidjs/start/dist/server";
import { YoutubePlaylist } from "typings/youtube-playlist.interface";
import { YouTubeVideo, YoutubeVideos } from "typings/youtube-video.interface";

async function getYoutubePlaylistVideosPage(
  accessToken: string,
  playlistId: string,
  pageToken: string,
  maxResults: number
): Promise<YoutubeVideos> {
  const apiUrl = new URL("https://www.googleapis.com/youtube/v3/playlistItems");

  apiUrl.searchParams.append("part", "contentDetails");
  apiUrl.searchParams.append("playlistId", playlistId);
  apiUrl.searchParams.append("maxResults", maxResults.toString());
  apiUrl.searchParams.append("pageToken", pageToken);

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await response.json();
}

async function getYoutubePlaylistVideos(
  accessToken: string,
  playlistId: string
): Promise<YouTubeVideo["id"][]> {
  const maxResults = 50;

  const videos = [];

  let pageToken: string | undefined = "";

  do {
    const page = await getYoutubePlaylistVideosPage(
      accessToken,
      playlistId,
      pageToken,
      maxResults
    );
    videos.push(
      ...page.items.map(({ contentDetails }) => contentDetails.videoId)
    );
    pageToken = page.nextPageToken;
  } while (undefined !== pageToken);

  return videos;
}

export async function GET(
  event: APIEvent
): Promise<YouTubeVideo["id"][] | Response> {
  const params = new URL(event.request.url).searchParams;

  const accessToken = params.get("access_token");
  if (null === accessToken)
    return new Response("No 'access_token' was provided.", { status: 401 });

  const playlistId = event.params.playlistId;

  const videos: YouTubeVideo["id"][] = await getYoutubePlaylistVideos(accessToken, playlistId);

  return videos;
}
