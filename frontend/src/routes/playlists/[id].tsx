import { useParams } from "@solidjs/router";
import { YoutubePlaylist as YoutubePlaylistType } from "../../../typings/youtube-playlist.interface";
import { createResource, createSignal, Show, Signal } from "solid-js";
import { Progress } from "@kobalte/core/progress";
import { useAuthContext } from "~/contexts/auth-context";
import { YoutubeAPIType } from "~/api/youtube";
import { getAudio, getAudioUrl } from "~/api/youtube-exporter";
import { zipAudioFolder } from "~/api/save-youtube-blob";

async function exportPlaylistVideos(
  YoutubeAPI: YoutubeAPIType,
  playlistId: YoutubePlaylistType["id"],
  progressSignal: Signal<number>,
  totalSignal: Signal<number>
) {
  const playlistVideosIds = await YoutubeAPI.getPlaylistVideos(playlistId);

  const chunkSize = 4;

  const allVideoMetadata = (
    await Promise.all(playlistVideosIds.map(getAudioUrl))
  ).filter((videoMetadata) => null !== videoMetadata);

  const totalBytes = allVideoMetadata.reduce(
    (acc, curr) => acc + +curr.fmt.contentLength,
    0
  );

  totalSignal[1](() => totalBytes);

  for (let i = 0; i < allVideoMetadata.length; i += chunkSize) {
    await Promise.all(
      allVideoMetadata
        .slice(i, i + chunkSize)
        .map((videoMetadata) => getAudio(videoMetadata, progressSignal))
    );
  }

  return await zipAudioFolder();
}

export default function YoutubePlaylist() {
  const params = useParams();

  const playlistId: YoutubePlaylistType["id"] = params.id;

  const { YoutubeAPI } = useAuthContext();

  const progressSignal = createSignal<number>(0);

  const totalSignal = createSignal<number>(0);

  const [zipAudio, _] = createResource<string>(
    () =>
      exportPlaylistVideos(YoutubeAPI, playlistId, progressSignal, totalSignal),
    { deferStream: true }
  );

  return (
    <>
      <Show when={totalSignal[0]() > 0} fallback={"Récupération des vidéos"}>
        <Progress
          value={progressSignal[0]()}
          minValue={0}
          maxValue={totalSignal[0]()}
          class="progress"
        >
          <div class="progress__label-container">
            <Progress.Label class="progress__label">Loading...</Progress.Label>
            <Progress.ValueLabel class="progress__value-label" />
          </div>
          <Progress.Track class="progress__track">
            <Progress.Fill class="progress__fill" />
          </Progress.Track>
        </Progress>
      </Show>
    </>
  );
}
