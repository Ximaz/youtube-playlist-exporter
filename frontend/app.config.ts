import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "@solidjs/start/config";
import mkcert from "vite-plugin-mkcert";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  ssr: false,
  vite: {
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src")
      }
    },
    server: {
      https: true,
    },
    plugins: [
      mkcert({
        force: true,
        savePath: "./ssl",
      }),
    ],
  },
  server: {
    https: {
      cert: "./ssl/cert.pem",
      key: "./ssl/dev.pem",
    },
  },
});
