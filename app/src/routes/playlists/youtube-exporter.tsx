import { Signal } from "solid-js";
import {
  AdaptiveFormat,
  YoutubePlayerMetadata,
} from "../../../typings/youtube-player-metadata.interface";
import {
  exportStreamChunk,
  prepareDownload,
  saveBlob,
} from "~/utils/youtube-player-exporter";

async function downloadAllAudioChunks(
  url: string,
  totalBytes: number,
  progressSignal: Signal<number>
): Promise<ArrayBufferLike[]> {
  const chunkSize = 1e7; // 10mb

  let bytes = 0;

  const blobParts = [];

  while (bytes < totalBytes) {
    const rangeStart = bytes;

    const rangeEnd = bytes + chunkSize - 1;

    const { blobParts: _blobParts, readBytes } = await exportStreamChunk(
      url,
      rangeStart,
      rangeEnd
    );

    blobParts.push(..._blobParts);

    bytes += readBytes;

    progressSignal[1](() => progressSignal[0]() + readBytes);
  }

  return blobParts;
}

export async function downloadAudio(
  {
    url,
    metadata,
    fmt,
  }: { url: string; metadata: YoutubePlayerMetadata; fmt: AdaptiveFormat },
  progressSignal: Signal<number>
): Promise<string> {
  const ext = /^audio\/([^;]+)/.exec(fmt.mimeType)![1];

  const filename = `${
    metadata.videoDetails.author
  } - ${metadata.videoDetails.title.replaceAll("/", "")}.${ext}`;

  const filepath = `./public/downloads/${filename}`;

  prepareDownload(filepath);

  const totalBytes = +fmt.contentLength;

  const blobParts = await downloadAllAudioChunks(
    url,
    totalBytes,
    progressSignal
  );
  await saveBlob(blobParts, fmt.mimeType, filepath);

  return filepath;
}
