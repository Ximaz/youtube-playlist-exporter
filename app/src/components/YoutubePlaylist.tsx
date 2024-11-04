import { For } from "solid-js";
import { YoutubePlaylist as YoutubePlaylistProps } from "../../../backend/dist/youtube/interfaces/youtube-playlist.interface";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@solidjs/router";

function YoutubePlaylist(props: { playlist: YoutubePlaylistProps }) {
  const thumbnail =
    props.playlist.snippet.thumbnails.maxres ??
    props.playlist.snippet.thumbnails.standard ??
    props.playlist.snippet.thumbnails.high ??
    props.playlist.snippet.thumbnails.medium ??
    props.playlist.snippet.thumbnails.default;

  const navigation = useNavigate();

  return (
    <div class="p-4 max-w-sm">
      <Card>
        <CardHeader>
          <img
            src={thumbnail.url}
            width={thumbnail.width}
            height={thumbnail.height}
          />
        </CardHeader>
        <CardContent>
          <CardTitle>{props.playlist.snippet.title}</CardTitle>
          <CardDescription>
            {props.playlist.snippet.description}
          </CardDescription>
        </CardContent>
        <CardFooter class="flex justify-between">
          <p>{props.playlist.contentDetails.itemCount} vidéos</p>
          <Button
            onClick={() =>
              navigation(`/playlists/${props.playlist.id}`, { replace: true })
            }
          >
            Exporter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function YoutubePlaylists(props: {
  playlist: YoutubePlaylistProps[];
}) {
  return (
    <div class="flex flex-wrap justify-center mt-10">
      <For each={props.playlist}>
        {(youtubePlaylist) => <YoutubePlaylist playlist={youtubePlaylist} />}
      </For>
    </div>
  );
}
