"use server";

import {
  AdaptiveFormat,
  YoutubePlayerMetadata,
} from "typings/youtube-player-metadata.interface";

import { existsSync, unlinkSync, writeFileSync } from "node:fs";

const USER_AGENT =
  "com.google.android.youtube/17.36.4 (Linux; U; Android 12; GB) gzip";

async function getVideoPlayer(videoId: string): Promise<{
  jsPlayer: string;
  metadata: YoutubePlayerMetadata;
  videoId: string;
}> {
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
  return { jsPlayer: fullJs, metadata: jsonData, videoId };
}

class YoutubePlayerExporter {
  constructor(
    private readonly jsPlayer: string,
    private readonly metadata: YoutubePlayerMetadata,
    private readonly videoId: string
  ) {}

  private getBestAudioQuality(): AdaptiveFormat {
    return (
      this.metadata.streamingData.adaptiveFormats ??
      this.metadata.streamingData.formats
    )
      .filter((format) => format.mimeType.startsWith("audio/"))
      .sort((a, b) => a.bitrate - b.bitrate)
      .slice(-1)[0];
  }

  private getSignatures(): {
    s: string | null;
    ns: string | null;
    url: string;
    fmt: AdaptiveFormat;
  } {
    const fmt = this.getBestAudioQuality();

    const signatureCipher = new URLSearchParams(fmt.signatureCipher);

    if (null === signatureCipher.get("s")) {
      const url = decodeURIComponent(fmt.url!.replaceAll("\u0026", "&"));

      const urlQueries = new URLSearchParams(url);

      const s = decodeURIComponent(
        (urlQueries.get("s") ?? urlQueries.get("sig"))!
      );

      const ns = urlQueries.get("n")!;

      return {
        s,
        ns,
        url: url.replace(`&sig=${urlQueries.get("s")!}`, ""),
        fmt,
      };
    }

    const signature = decodeURIComponent(signatureCipher.get("s")!);

    const url = decodeURIComponent(
      signatureCipher.get("url")!.replaceAll("\u0026", "&")
    );

    const urlQueries = new URLSearchParams(url);

    const n = urlQueries.get("n")!;

    return { s: signature, ns: n, url, fmt };
  }

  private solveSignature(signature: string): string {
    const mainFunctionRegex =
      /^(\w+)=(function\(\w+\)\{.=.\.split\(""\);.+;return .\.join\(""\)\});$/m;

    const mainFunction = mainFunctionRegex.exec(this.jsPlayer);

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

    const fullObject = fullObjectRegex.exec(this.jsPlayer);

    if (null === fullObject)
      throw new Error(
        "Youtube Player Exporter: Unable to get the signature decipher util functions."
      );

    const fullObjectContent = fullObject[1];

    const executor = `(function(s){var ${mainFunctionName}=${mainFunctionCode}; var ${utilObjectName}=${fullObjectContent}; return ${mainFunctionName}(s)})("${signature}")`;

    return eval(executor);
  }

  private solveNSignature(nsignature: string): string {
    const functionRegex =
      /^[a-zA-Z0-9_$]+=(function\([a-zA-Z0-9_$]+\)\{(?:(?!};).)+?"enhanced_except_[^;]+);$/ms;

    const func = functionRegex.exec(this.jsPlayer);

    if (null === func)
      throw new Error(
        "Youtube Player Exporter: Unable to get the n signature decipher function."
      );

    const functionCode = func[1];

    const executor = `(${functionCode})("${nsignature}");`;

    return eval(executor);
  }

  exportStreamingUrl(): {
    url: string;
    metadata: YoutubePlayerMetadata;
    fmt: AdaptiveFormat;
  } | null {
    try {
      const { s, ns, url, fmt } = this.getSignatures();

      if (null === s) return { url, metadata: this.metadata, fmt };

      const solvedSignature = this.solveSignature(s);

      const solvedNSignature = this.solveNSignature(ns!);

      const nFromUrl = new URLSearchParams(url).get("n")!;

      let resultUrl = `${url}&sig=${solvedSignature}`;

      resultUrl = resultUrl.replace(`n=${nFromUrl}`, `n=${solvedNSignature}`);

      return { url: resultUrl, metadata: this.metadata, fmt };
    } catch (e) {
      switch (this.metadata.playabilityStatus.status) {
        case "ERROR":
          console.warn(
            `Unable to get the JS player for https://www.youtube.com/watch?v=${
              this.videoId
            } : ${
              this.metadata.playabilityStatus.reason ?? "no reason provided."
            }.`
          );
          break;
        case "LOGIN_REQUIRED":
          console.warn(
            "YouTube is ratelimiting the application. You may want to try again later."
          );
        default:
          console.error(e, this.videoId, JSON.stringify(this.metadata));
      }
      return null;
    }
  }
}

export async function exportStreamChunk(
  url: string,
  rangeStart: number,
  rangeEnd: number
): Promise<{ blobParts: ArrayBufferLike[]; readBytes: number }> {
  const response = await fetch(url, {
    headers: {
      range: `bytes=${rangeStart}-${rangeEnd}`,
    },
  });

  const readBytes = +response.headers.get("Content-Length")!;

  const reader = response.body!.getReader();

  let result = await reader.read();

  const blobParts: ArrayBufferLike[] = [];

  while (!result.done) {
    blobParts.push(result.value.buffer);

    result = await reader.read();
  }

  reader.releaseLock();

  return { blobParts, readBytes };
}

export async function exportYoutubePlayer(videoId: string): Promise<{
  url: string;
  metadata: YoutubePlayerMetadata;
  fmt: AdaptiveFormat;
} | null> {
  const videoPlayer = await getVideoPlayer(videoId);

  const youtubePlayerExporter = new YoutubePlayerExporter(
    videoPlayer.jsPlayer,
    videoPlayer.metadata,
    videoPlayer.videoId
  );

  return youtubePlayerExporter.exportStreamingUrl();
}

export function prepareDownload(filename: string) {
  if (existsSync(filename)) unlinkSync(filename);
}

export async function saveBlob(
  blobParts: ArrayBufferLike[],
  mimeType: string,
  output: string
) {
  const blob = new Blob(blobParts, { type: mimeType });

  const buffer = Buffer.from(await blob.arrayBuffer());

  writeFileSync(output, buffer);
}
