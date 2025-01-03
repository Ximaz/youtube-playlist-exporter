"use server";

import { existsSync, unlinkSync } from "node:fs";

import ffmpeg from "fluent-ffmpeg";

import relativeFFmpegPath from "ffmpeg-static";

const ffmpegPath = relativeFFmpegPath!.replace(/\/.output\/server/, '');

export async function convertAudioFile(file: string, fmt: string): Promise<string> {
  const convertedFile = `${file.split(".").slice(0, -1).join(".")}.${fmt}`;

  if (existsSync(convertedFile)) unlinkSync(convertedFile);


  return new Promise((resolve, reject) => {
    ffmpeg(file)
      .setFfmpegPath(ffmpegPath)
      .output(convertedFile)
      .on("error", (err) => {
        return reject(err);
      })
      .on("end", () => {
        return resolve(convertedFile);
      })
      .run();
  })
}
