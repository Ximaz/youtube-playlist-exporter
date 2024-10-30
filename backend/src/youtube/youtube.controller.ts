import { Controller, Get, Param, Query } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import {
  YoutubePlaylist,
  YoutubePlaylists,
} from './interfaces/youtube-playlist.interface';

@Controller('/youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get('/playlists')
  playlist(
    @Query('access_token') accessToken: string,
  ): Promise<YoutubePlaylists['items']> {
    return this.youtubeService.getPlaylists(accessToken);
  }

  @Get('/playlists/:playlistId/videos')
  videos(
    @Query('access_token') accessToken: string,
    @Param('playlistId') playlistId: YoutubePlaylist['id'],
  ) {
    return this.youtubeService.getPlaylistVideos(accessToken, playlistId);
  }
}
