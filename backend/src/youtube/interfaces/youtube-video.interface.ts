export interface YouTubeVideo {
  kind: 'youtube#playlistItem';
  etag: string;
  id: string;
}

export interface YoutubeVideos {
  kind: 'youtube#playlistItemListResponse';
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeVideo[];
}
