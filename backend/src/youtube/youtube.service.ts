import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  YoutubePlaylist,
  YoutubePlaylists,
} from '../../typings/youtube-playlist.interface';
import { HttpService } from '@nestjs/axios';
import {
  YouTubeVideo,
  YoutubeVideos,
} from '../../typings/youtube-video.interface';

@Injectable()
export class YoutubeService {
  constructor(private readonly httpService: HttpService) {}

  async getPlaylists(accessToken: string): Promise<YoutubePlaylists['items']> {
    const response: YoutubePlaylists = (
      await this.httpService.axiosRef.get(
        'https://www.googleapis.com/youtube/v3/playlists',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            part: 'id,contentDetails,snippet',
            mine: true,
            maxResults: 25,
          },
        },
      )
    ).data;

    return response['items'];
  }

  private async getPlaylistVideosPaginated(
    accessToken: string,
    playlistId: YoutubePlaylist['id'],
    pageToken: string | undefined,
  ): Promise<{
    videos: YouTubeVideo['id'][];
    nextPageToken: string | undefined;
  }> {
    const response: YoutubeVideos = (
      await this.httpService.axiosRef.get(
        'https://www.googleapis.com/youtube/v3/playlistItems',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            part: 'contentDetails',
            playlistId,
            maxResults: 50,
            pageToken,
          },
        },
      )
    ).data;

    return {
      videos: response['items'].map(
        (video) => video['contentDetails']['videoId'],
      ),
      nextPageToken: response.nextPageToken,
    };
  }

  async getPlaylistVideos(
    accessToken: string,
    playlistId: YoutubePlaylist['id'],
  ): Promise<YouTubeVideo['id'][]> {
    const allVideos: YouTubeVideo['id'][] = [];

    let pageToken = undefined;

    do {
      try {
        const { videos, nextPageToken } = await this.getPlaylistVideosPaginated(
          accessToken,
          playlistId,
          pageToken,
        );
        allVideos.push(...videos);
        pageToken = nextPageToken;
      } catch (e) {
        console.error(e.response.data);
        throw new InternalServerErrorException();
      }
    } while (pageToken !== undefined);

    return allVideos;
  }
}
