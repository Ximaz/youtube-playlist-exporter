"use server";

import { createWriteStream, createReadStream } from "node:fs";

import path from "node:path";

import archiver from "archiver";

export async function zipAudioFolder(files: string[]): Promise<string> {
  const zipFilename = `${Date.now()}.tar.gz`;

  const zipPath = `./public/downloads/${zipFilename}`;

  const zip = createWriteStream(zipPath);

  const archive = archiver("tar", {
    gzip: true,
    zlib: { level: 9 },
  });

  return new Promise((resolve, reject) => {
    archive.on("error", function (err) {
      return reject(err);
    });

    archive.pipe(zip);

    for (const file of files) {
      const filename = path.basename(file);

      const readStream = createReadStream(file);

      archive.append(readStream, { name: filename });
    }

    return archive
      .finalize()
      .then(() => resolve(`/public/downloads/${zipFilename}`))
      .catch(reject);
  });
}
