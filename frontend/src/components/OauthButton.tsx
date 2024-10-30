import { createResource, Suspense } from "solid-js";
import { Button } from "@/components/ui/button";
import { fetchOauthUrl } from "../api/oauth-google";

export default function OauthButton() {
  const origin = window.location.origin;

  const redirectUri = `${origin}/oauth/callback`;

  const [data, _] = createResource(() => fetchOauthUrl(redirectUri), {
    deferStream: true,
  });

  return (
    <Suspense fallback={"Récupération de l'URL de redirection ..."}>
      <Button as="a" href={data()!} variant="outline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mr-2 h-6 w-6"
          viewBox="0 0 24 24"
        >
          <image href="/google.svg" width="24" height="24" />
        </svg>
        Connexion avec Google
      </Button>
    </Suspense>
  );
}
