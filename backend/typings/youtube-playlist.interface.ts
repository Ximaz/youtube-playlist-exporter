declare interface YoutubePlaylistThumbnail {
  url: string;
  width: number;
  height: number;
}

declare interface YoutubePlaylistLocalization {
  title: string;
  description: string;
}

export interface YoutubePlaylist {
  kind: 'youtube#playlist';
  etag: string;
  id: string;
  snippet: {
    publishedAt: number;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: YoutubePlaylistThumbnail;
      medium: YoutubePlaylistThumbnail;
      high: YoutubePlaylistThumbnail;
      standard: YoutubePlaylistThumbnail;
      maxres: YoutubePlaylistThumbnail;
    };
    channelTitle: string;
    defaultLanguage: string;
    localized: {
      title: string;
      description: string;
    };
  };
  status: {
    privacyStatus: 'public' | 'private' | 'unlisted';
    podcastStatus: 'enabled' | 'disabled' | 'unspecified';
  };
  contentDetails: {
    itemCount: number;
  };
  player: {
    embedHtml: string;
  };
  localizations: {
    [id: string]: YoutubePlaylistLocalization;
  };
}

export interface YoutubePlaylists {
  kind: 'youtube#playlistListResponse';
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YoutubePlaylist[];
}
