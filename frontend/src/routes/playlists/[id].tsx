import { useParams } from "@solidjs/router";
import { YoutubePlaylist as YoutubePlaylistType } from "../../../../backend/dist/youtube/interfaces/youtube-playlist.interface";
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
  const playlistVideosIds = [
    "7vDnr9mxuhA",
    "h-Fzs4M_hAY",
    "9EEPJ24-N2w",
    "1hbfwSswy_0",
    "GGz3yRFCqUY",
    "SZgS8Yhq2k8",
    "MMXrlFBkkkc",
    "hJGJy5qTcu0",
    "ovvbCPqgX5E",
    "vFt2OArMclQ",
    "eenLOHk8dtc",
    "SbPjaHCliUE",
    "tDgn9PwjTXw",
    "7qmRSBHZp5s",
    "OGMXeNQkkcg",
    "IIzIW4Kfi_8",
    "gZWdlOyE4i0",
    "g0vy_t1pTPE",
    "ym4o6a4gbQ4",
    "3nI2AoXKsOc",
    "a-bIwAKCBXU",
    "OMh5j4s0QKs",
    "BxmAveUMzc4",
    "aqVTzT2qH98",
    "PANIioKNJ3I",
    "bbNVpS7WOj4",
    "KdUpcI2jID8",
    "p1xphsbH20E",
    "-ME66TniXvY",
    "JRL02FC0AOM",
    "BY4ctMMCV3A",
    "a8ehXJTx26k",
    "LtVP01oEChw",
    "hPCZVkQKBBk",
    "_ydwe3MfWSI",
    "onzULMt9VOE",
  ]; // await YoutubeAPI.getPlaylistVideos(playlistId);

  const chunkSize = 2;

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
