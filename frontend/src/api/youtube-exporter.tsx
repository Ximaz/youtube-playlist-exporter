import { Signal } from "solid-js";
import {
  AdaptiveFormat,
  YoutubePlayerMetadata,
} from "./youtube-player-metadata";
import {
  audioToBlobParts,
  prepareDownloadFolder,
  rmFile,
  saveBlob,
} from "./save-youtube-blob";

const USER_AGENT =
  "com.google.android.youtube/17.36.4 (Linux; U; Android 12; GB) gzip";

async function getJsPlayer(
  videoId: string
): Promise<{ player: string; metadata: YoutubePlayerMetadata }> {
  "use server";
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      "user-agent": USER_AGENT,
    },
  });

  const html = await response.text();

  const jsUrlRegex = /"jsUrl":"([^"]+)"/;

  const jsUrl = jsUrlRegex.exec(html);

  if (null === jsUrl) throw new Error("Unable to retrieve the player.");

  const fullJs = await (
    await fetch(`https://www.youtube.com${jsUrl[1]}`, {
      headers: {
        "user-agent": USER_AGENT,
      },
    })
  ).text();

  const jsonRegex = /var ytInitialPlayerResponse = (\{.+?\});/s;

  const json = jsonRegex.exec(html);

  if (null === json)
    throw new Error("Unable to retrieve the player's matadata.");

  const jsonData = JSON.parse(json[1]);
  return { player: fullJs, metadata: jsonData };
}

function getBestAudioQuality(metadata: YoutubePlayerMetadata): AdaptiveFormat {
  return (
    metadata.streamingData.adaptiveFormats ?? metadata.streamingData.formats
  )
    .filter((format) => format.mimeType.startsWith("audio/"))
    .sort((a, b) => a.bitrate - b.bitrate)
    .slice(-1)[0];
}

function getSignatures(metadata: YoutubePlayerMetadata): {
  s: string | null;
  ns: string | null;
  url: string;
  fmt: AdaptiveFormat;
} {
  const fmt = getBestAudioQuality(metadata);

  const signatureCipher = new URLSearchParams(fmt.signatureCipher);

  if (null === signatureCipher.get("s")) {
    const url = decodeURIComponent(fmt.url!.replaceAll("\u0026", "&"));

    const urlQueries = new URLSearchParams(url);

    const s = decodeURIComponent(urlQueries.get("s")!);

    const ns = urlQueries.get("n")!;

    return { s, ns, url: url.replace(`&sig=${urlQueries.get("s")!}`, ""), fmt };
  }

  const signature = decodeURIComponent(signatureCipher.get("s")!);

  const url = decodeURIComponent(
    signatureCipher.get("url")!.replaceAll("\u0026", "&")
  );

  const urlQueries = new URLSearchParams(url);

  const n = urlQueries.get("n")!;

  return { s: signature, ns: n, url, fmt };
}

function solveSignature(player: string, signature: string): string {
  const mainFunctionRegex =
    /^(\w+)=(function\(\w+\)\{.=.\.split\(""\);.+;return .\.join\(""\)\});$/m;

  const mainFunction = mainFunctionRegex.exec(player);

  if (null === mainFunction)
    throw new Error(
      "Youtube Player: Unable to get the signature decipher function."
    );

  const mainFunctionName = mainFunction[1];

  const mainFunctionCode = mainFunction[2];

  const utilObjectRegex = /([a-zA-Z]{2,})\.[a-zA-Z]{2,}/g;

  const utilObject = utilObjectRegex.exec(mainFunctionCode);

  if (null === utilObject)
    throw new Error(
      "Youtube Player: Unable to get the signature decipher util function name."
    );

  const utilObjectName = utilObject[1];

  const fullObjectRegex = new RegExp(
    `var ${utilObjectName}=(\\{.+?\\});`,
    "ms"
  );

  const fullObject = fullObjectRegex.exec(player);

  if (null === fullObject)
    throw new Error(
      "Youtube Player: Unable to get the signature decipher util functions."
    );

  const fullObjectContent = fullObject[1];

  const executor = `(function(s){var ${mainFunctionName}=${mainFunctionCode}; var ${utilObjectName}=${fullObjectContent}; return ${mainFunctionName}(s)})("${signature}")`;

  return eval(executor);
}

function solveNSignature(player: string, nsignature: string): string {
  const functionRegex =
    /^[a-zA-Z0-9_$]+=(function\([a-zA-Z0-9_$]+\)\{(?:(?!};).)+?"enhanced_except_[^;]+);$/ms;

  const func = functionRegex.exec(player);

  if (null === func)
    throw new Error(
      "Youtube Player: Unable to get the n signature decipher function."
    );

  const functionCode = func[1];

  const executor = `(${functionCode})("${nsignature}");`;

  return eval(executor);
}

export async function getAudioUrl(videoId: string): Promise<{
  url: string;
  metadata: YoutubePlayerMetadata;
  fmt: AdaptiveFormat;
} | null> {
  try {
    const { player, metadata } = await getJsPlayer(videoId);

    const { s, ns, url, fmt } = getSignatures(metadata);

    if (null === s) return { url, metadata, fmt };

    const solvedSignature = solveSignature(player, s);

    const solvedNSignature = solveNSignature(player, ns!);

    const nFromUrl = new URLSearchParams(url).get("n")!;

    let resultUrl = `${url}&sig=${solvedSignature}`;

    resultUrl = resultUrl.replace(`n=${nFromUrl}`, `n=${solvedNSignature}`);

    return { url: resultUrl, metadata, fmt };
  } catch (e) {
    console.warn(
      `Unable to get the JS player for https://www.youtube.com/watch?v=${videoId} , certainly due to a 'YouTube's policy on nudity or sexual content' violation.`
    );
    return null;
  }
}
async function audioToBlob(
  url: string,
  totalBytes: number,
  progressSignal: Signal<number>
): Promise<ArrayBufferLike[]> {
  const chunkSize = 1e+6; // 1mb

  let bytes = 0;

  const blobParts = [];

  while (bytes < totalBytes) {
    const rangeStart = bytes;

    const rangeEnd = bytes + chunkSize - 1;

    const { blobParts: _blobParts, readBytes } = await audioToBlobParts(
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
async function fetchAudio(
  url: string,
  metadata: YoutubePlayerMetadata,
  fmt: AdaptiveFormat,
  progressSignal: Signal<number>
): Promise<void> {
  const DOWNLOAD_FOLDER = "downloads";

  prepareDownloadFolder(DOWNLOAD_FOLDER);

  const ext = /^(?:audio|video)\/([^;]+)/.exec(fmt.mimeType)![1];

  const filename = `${metadata.videoDetails.author} - ${metadata.videoDetails.title}`;

  const filepath = `${DOWNLOAD_FOLDER}/${filename}.${ext}`;

  rmFile(filepath);

  console.log(`Downloading ${filepath} ...`);

  const totalBytes = +fmt.contentLength;

  const blobParts = await audioToBlob(url, totalBytes, progressSignal);

  saveBlob(blobParts, fmt.mimeType, filepath);

  console.log(`Download completed !`);
}

export async function getAudio(
  audioUrl: {
    url: string;
    metadata: YoutubePlayerMetadata;
    fmt: AdaptiveFormat;
  },
  progressSignal: Signal<number>
): Promise<void> {
  const { url, metadata, fmt } = audioUrl;

  await fetchAudio(url, metadata, fmt, progressSignal);
}
