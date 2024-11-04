import { A, useParams } from "@solidjs/router";
import { YoutubePlaylist as YoutubePlaylistType } from "../../../typings/youtube-playlist.interface";
import {
  createEffect,
  createResource,
  createSignal,
  Match,
  Setter,
  Show,
  Signal,
  Switch,
} from "solid-js";
import { Progress } from "@kobalte/core/progress";
import { useAuthContext } from "~/contexts/auth-context";
import { YoutubeAPIType } from "~/utils/youtube";
import { exportYoutubePlayer } from "~/utils/youtube-player-exporter";
import { downloadAudio } from "./youtube-exporter";
import { zipAudioFolder } from "~/utils/archiver";
import { convertAudioFile } from "~/utils/audio-convertor";

async function exportPlaylistVideos(
  YoutubeAPI: YoutubeAPIType,
  playlistId: YoutubePlaylistType["id"],
  progressSignal: Signal<number>,
  totalSignal: Signal<number>
): Promise<string[]> {
  const playlistVideosIds = await YoutubeAPI.getPlaylistVideos(playlistId);

  const batchSize = 4;

  const allVideoMetadata = (
    await Promise.all(playlistVideosIds.map(exportYoutubePlayer))
  ).filter((videoMetadata) => null !== videoMetadata);

  const totalBytes = allVideoMetadata.reduce(
    (acc, curr) => acc + +curr.fmt.contentLength,
    0
  );

  totalSignal[1](() => totalBytes);

  const filePaths: string[] = [];

  for (let i = 0; i < allVideoMetadata.length; i += batchSize) {
    filePaths.push(
      ...(await Promise.all(
        allVideoMetadata
          .slice(i, i + batchSize)
          .map((videoMetadata) => downloadAudio(videoMetadata, progressSignal))
      ))
    );
  }

  return filePaths;
}

function Exporter({
  setAudioFiles,
}: {
  setAudioFiles: Setter<string[] | null>;
}) {
  const totalSignal = createSignal<number>(0);

  const progressSignal = createSignal<number>(0);

  const params = useParams();

  const playlistId: YoutubePlaylistType["id"] = params.id;

  const { YoutubeAPI } = useAuthContext();

  const [audioFiles, _] = createResource<string[]>(
    () =>
      exportPlaylistVideos(YoutubeAPI, playlistId, progressSignal, totalSignal),
    {
      deferStream: true,
    }
  );

  createEffect(() => {
    if (!audioFiles.loading) setAudioFiles(audioFiles()!);
  });

  return (
    <>
      <Switch>
        <Match when={0 === totalSignal[0]()}>
          <p>Récupération des fichiers audio en cours ...</p>
        </Match>

        <Match when={audioFiles.loading}>
          <Progress
            value={progressSignal[0]()}
            minValue={0}
            maxValue={totalSignal[0]()}
            class="progress"
          >
            <div class="progress__label-container">
              <Progress.Label class="progress__label">
                Téléchargement des fichiers audio en cours...
              </Progress.Label>
              <Progress.ValueLabel class="progress__value-label" />
            </div>
            <Progress.Track class="progress__track">
              <Progress.Fill class="progress__fill" />
            </Progress.Track>
          </Progress>
        </Match>

        <Match when={0 < totalSignal[0]() && !audioFiles.loading}>
          <p>Convertion des fichiers audio en cours ...</p>
        </Match>
      </Switch>
    </>
  );
}

async function convertPlaylistVideos(
  files: string[],
  fmt: string,
  progressSignal: Signal<number>,
  totalSignal: Signal<number>
): Promise<string[]> {
  const batchSize = 4;

  totalSignal[1](() => files.length);

  const convertedFiles: string[] = [];

  for (let i = 0; i < files.length; i += batchSize) {
    const _convertedFiles = await Promise.all(
      files.slice(i, i + batchSize).map((file) => convertAudioFile(file, fmt))
    );
    convertedFiles.push(..._convertedFiles);
    progressSignal[1](() => progressSignal[0]() + _convertedFiles.length);
  }

  return convertedFiles;
}

function Convertor({
  audioFiles,
  fmt,
  setConvertedFiles,
}: {
  audioFiles: string[];
  fmt: string;
  setConvertedFiles: Setter<string[] | null>;
}) {
  const totalSignal = createSignal<number>(audioFiles.length);

  const progressSignal = createSignal<number>(0);

  const [convertedFiles, _] = createResource<string[]>(
    () => convertPlaylistVideos(audioFiles, fmt, progressSignal, totalSignal),
    {
      deferStream: true,
    }
  );

  createEffect(() => {
    if (!convertedFiles.loading) setConvertedFiles(convertedFiles()!);
  });

  return (
    <>
      <Switch>
        <Match when={convertedFiles.loading}>
          <Progress
            value={progressSignal[0]()}
            minValue={0}
            maxValue={totalSignal[0]()}
            class="progress"
          >
            <div class="progress__label-container">
              <Progress.Label class="progress__label">
                Conversion des fichiers audio en cours...
              </Progress.Label>
              <Progress.ValueLabel class="progress__value-label" />
            </div>
            <Progress.Track class="progress__track">
              <Progress.Fill class="progress__fill" />
            </Progress.Track>
          </Progress>
        </Match>

        <Match when={"ready" === convertedFiles.state}>
          <p>Finalisation ...</p>
        </Match>
      </Switch>
    </>
  );
}

function Downloader({ convertedFiles }: { convertedFiles: string[] }) {
  const [zipFile, _] = createResource<string>(
    () => zipAudioFolder(convertedFiles),
    {
      deferStream: true,
    }
  );

  return (
    <>
      <Show
        when={!zipFile.loading}
        fallback={"Compression de votre playlist en cours..."}
      >
        <A href={zipFile()!} download={"playlist.tar.gz"}>Télécharger votre playlist</A>
      </Show>
    </>
  );
}

export default function YoutubePlaylist() {
  const [audioFiles, setAudioFiles] = createSignal<string[] | null>(null);

  const [convertedFiles, setConvertedFiles] = createSignal<string[] | null>(
    null
  );

  const fmt = "mp3";

  // TODO: replace this mess with all resources instead of signals.
  return (
    <>
      <Switch>
        <Match when={null === audioFiles()}>
          <Exporter setAudioFiles={setAudioFiles} />
        </Match>
        <Match when={null !== audioFiles() && null === convertedFiles()}>
          <Convertor
            audioFiles={audioFiles()!}
            fmt={fmt}
            setConvertedFiles={setConvertedFiles}
          />
        </Match>
        <Match when={null !== convertedFiles()}>
          <Downloader convertedFiles={convertedFiles()!} />
        </Match>
      </Switch>
    </>
  );
}
