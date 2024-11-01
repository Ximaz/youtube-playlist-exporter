import { Accessor } from "solid-js";
import { revoke } from "./oauth/revoke/revoke";
import { OauthCredential } from "typings/oauth-credential.interface";
import { YouTubeVideo } from "typings/youtube-video.interface";
import { YoutubePlaylist } from "typings/youtube-playlist.interface";

export type YoutubeAPIType = {
  disconnect: () => Promise<boolean>;
  getPlaylists: () => Promise<YoutubePlaylist[]>;
  getPlaylistVideos: (
    playlistId: YoutubePlaylist["id"]
  ) => Promise<YouTubeVideo["id"][]>;
};

export function YoutubeApi(
  oauthCredentialAccessor: Accessor<Promise<OauthCredential | null>>,
  oauthCredentialSetter: (oauthCredential: OauthCredential | null) => void
): YoutubeAPIType {
  return {
    disconnect: async () => {
      const oauthCredential = await oauthCredentialAccessor();

      if (null === oauthCredential) throw new Error("Forbidden");

      return await revoke(oauthCredential);
    },

    getPlaylists: async (): Promise<YoutubePlaylist[]> => {
      const oauthCredential = await oauthCredentialAccessor();

      if (null === oauthCredential) throw new Error("Forbidden");

      const response = await fetch(
        `${window.location.origin}/api/youtube/playlists?access_token=${oauthCredential.access_token}`
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
        `${window.location.origin}/api/youtube/playlists/${playlistId}/videos?access_token=${oauthCredential.access_token}`
      )

      const data = await response.json();

      return data;
    },
  };
}
