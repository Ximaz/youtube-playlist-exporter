# YouTube Playlist Exporter

This project provides a way to export a YouTube playlist freely, without having
to pay for YouTube Music. The goal is then to convert the downloaded audio files
to a format that Apple Music will understand, and then be able to import them
into your iPhone, without having to manually convert each file by hand.

# How to use the project

### Google OAuth2.0 credential

To use this project, you must have a Google application with `YouTube Data API V3`
enabled, and an OAuth2.0 consent screen. Google should provide you a `client_id`
and a `client_secret` for your OAuth2.0 credential. Store them inside a `.env`.

You can take a look to what values are expected inside the [`.env.example`](https://github.com/Ximaz/youtube-playlist-exporter/blob/main/.env.example) file.
If you are lost about OAuth2.0 credential, you may want to follow Google's
tutorial about it. You can [`click here`](https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps) to learn more.

You need to complete that first step before continuing.

### Through reverse proxy (HTTPS, recommanded)

If you want some privacy, evne on a local network, you may want to use the
provided Nginx reverse proxy configuration. To do so, you first need to install
[Docker](https://www.docker.com/products/docker-desktop/).

If you don't know Docker, it is a way to containerize an application, which will
allow the application to run in a certain environment. A bit like virtual machines,
except that it's way more lightweight and easy to use.

Once you installed Docker, you then need to generate an SSL certificate, including
both public and private keys. For this step, you may want to take a look to [`mkcert`](https://github.com/FiloSottile/mkcert).
In the end, `mkcert` should generate you a few files, including `cert.pem` and `dev.pem`.
Drag those files to the `nginx/ssl` folder.

Now you just have to run the following command to a terminal :
```bash
docker-compose -f docker-compose.yml up
```
It will containerize the application in it's environment.

Open up your browser, and connect to the application with this url :
[`https://localhost`](https://localhost)

You can then follow the steps which are :
- connecting to your Google account,
- choosing the YouTube playlist to export,
- downloading the `playlist.tar.gz` compressed file,
- export the audio files form `playlist.tar.gz`,
- transfer the compressed files to your iPhone via iTunes.

Congrats, you are all done !

### Direct connection, no reverse proxy (HTTP)

If you don't mind about privacy and just want to export your playlists, you must
install [`NodeJS`](https://nodejs.org/en) and [`pnpm`](https://pnpm.io/fr/installation).

Once installed, go to the `app` folder and type the following command in a terminal :
```bash
pnpm install
```
This will install all the dependencies the projet needs in order to run.

You can the run the following command to run the application :
```bash
pnpm start
```
Open up your browser, and connect to the application with this url :
[`https://localhost:8080`](https://localhost:8080)

You can then follow the steps which are :
- connecting to your Google account,
- choosing the YouTube playlist to export,
- downloading the `playlist.tar.gz` compressed file,
- export the audio files form `playlist.tar.gz`,
- transfer the compressed files to your iPhone via iTunes.

Congrats, you are all done !
