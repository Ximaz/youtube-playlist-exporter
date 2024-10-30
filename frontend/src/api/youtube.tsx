import { Accessor } from "solid-js";
import { BACKEND_URL, OauthCredential } from "./constants";
import { YouTubeVideo } from "../../../backend/dist/youtube/interfaces/youtube-video.interface";
import { YoutubePlaylist } from "../../../backend/dist/youtube/interfaces/youtube-playlist.interface";

export type YoutubeAPIType = {
  disconnect: () => Promise<boolean>;
  getPlaylists: () => Promise<YoutubePlaylist[]>;
  getPlaylistVideos: (playlistId: YoutubePlaylist["id"]) => Promise<YouTubeVideo["id"][]>;
}

export function YoutubeApi(
  oauthCredentialAccessor: Accessor<Promise<OauthCredential | null>>,
  oauthCredentialSetter: (oauthCredential: OauthCredential | null) => void
): YoutubeAPIType {
  return {
    disconnect: async () => {
      const oauthCredential = await oauthCredentialAccessor();

      if (null === oauthCredential) throw new Error("Forbidden");

      const response = await fetch(
        `${BACKEND_URL}/oauth/revoke?access_token=${oauthCredential.access_token}&refresh_token=${oauthCredential.refresh_token}`,
        { method: "DELETE" }
      );

      oauthCredentialSetter(null);

      return 204 === response.status;
    },

    getPlaylists: async (): Promise<YoutubePlaylist[]> => {
      const oauthCredential = await oauthCredentialAccessor();

      if (null === oauthCredential) throw new Error("Forbidden");

      const response = await fetch(
        `${BACKEND_URL}/youtube/playlists?access_token=${oauthCredential.access_token}`
      );

      const data = response.json();

      return data;
    },

    getPlaylistVideos: async (
      playlistId: YoutubePlaylist["id"]
    ): Promise<YouTubeVideo["id"][]> => {
      const oauthCredential = await oauthCredentialAccessor();

      if (null === oauthCredential) throw new Error("Forbidden");

      const response = await fetch(
        `${BACKEND_URL}/youtube/playlists/${playlistId}/videos?access_token=${oauthCredential.access_token}`
      );

      const data = response.json();

      return data;
    },
  };
}
