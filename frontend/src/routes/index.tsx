import { createResource, Show, Suspense } from "solid-js";
import DisconnectButton from "~/components/DisconnectButton";
import OauthButton from "~/components/OauthButton";
import YoutubePlaylists from "../components/YoutubePlaylist";
import { useAuthContext } from "~/contexts/auth-context";

function LoginRequired() {
  return (
    <>
      <p>
        Vous devez vous connecter avec votre compte Google pour obtenir la liste
        de vos playlists.
      </p>
      <OauthButton />
    </>
  );
}

function Application() {
  const { YoutubeAPI } = useAuthContext();

  const [playlists, _] = createResource(YoutubeAPI.getPlaylists, {
    deferStream: true,
  });

  return (
    <>
      <DisconnectButton />
      <Suspense fallback={"Récupération de vos playlists..."}>
        <YoutubePlaylists playlist={playlists()!} />
      </Suspense>
    </>
  );
}

export default function Home() {
  const authContext = useAuthContext();

  const [oauthCredential, _] = createResource(authContext.oauthCredential);

  return (
    <main>
      <Suspense fallback="Récupération de votre compte...">
        <Show when={null !== oauthCredential()} fallback={<LoginRequired />}>
          <Application />
        </Show>
      </Suspense>
    </main>
  );
}
