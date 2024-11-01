"use server";

import {
  existsSync,
  mkdirSync,
  readdirSync,
  createWriteStream,
  unlinkSync,
  createReadStream,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import archiver from "archiver";

import ffmpeg from "fluent-ffmpeg";

const DOWNLOAD_FOLDER = "downloads";

export async function audioToBlobParts(
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

export function prepareDownloadFolder(folder: string) {
  if (!existsSync(folder)) mkdirSync(folder, { recursive: true });
}

export function rmFile(path: string) {
  if (existsSync(path)) unlinkSync(path);
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

async function convertAudioFiles(fmt: string) {
  const files = readdirSync(DOWNLOAD_FOLDER, { withFileTypes: true }).filter(
    ({ name }) => name.endsWith(".webm")
  );

  for (const file of files) {
    const origFilename = path.join(DOWNLOAD_FOLDER, file.name);

    const convertedFilename = `${origFilename
      .split(".")
      .slice(0, -1)
      .join(".")}.${fmt}`;

    if (existsSync(convertedFilename)) unlinkSync(convertedFilename);

    try {
      ffmpeg(origFilename)
        .setFfmpegPath("./bin/ffmpeg.exe")
        .output(convertedFilename)
        .on("error", () => {
          console.error(`Unable to convert ${origFilename}`);
        })
        .run();
    } catch (e) {
      console.error(`Unable to convert ${origFilename}`);
    }
  }
}

export async function zipAudioFolder(): Promise<string> {
  const zipFilepath = "songs.tar.gz";

  const fmt = "mp3";

  // await convertAudioFiles(fmt);

  const files = readdirSync(DOWNLOAD_FOLDER, { withFileTypes: true })
    // .filter(({ name }) => name.endsWith(`.${fmt}`));

  const zip = createWriteStream(zipFilepath);

  const archive = archiver("tar", {
    gzip: true,
    zlib: { level: 9 },
  });

  archive.on("error", function (err) {
    console.error(err);
  });

  archive.pipe(zip);

  for (const file of files) {
    const filepath = path.join(DOWNLOAD_FOLDER, file.name);

    const readStream = createReadStream(filepath);

    archive.append(readStream, { name: file.name });
  }

  await archive.finalize();

  return zipFilepath;
}
