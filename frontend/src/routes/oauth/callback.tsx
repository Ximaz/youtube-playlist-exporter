import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect, createResource } from "solid-js";
import { OauthCredential } from "~/api/constants";
import { getOauthCredential } from "~/api/oauth-google";
import { useAuthContext } from "~/contexts/auth-context";

export default function Callback() {
  const location = useLocation();

  const queries = new URLSearchParams(location.search);

  const code = queries.get("code");

  const state = queries.get("state");

  const authContext = useAuthContext();

  const navigation = useNavigate();

  const [oauthCredential, _] = createResource<OauthCredential>(
    () => getOauthCredential(code!, state!),
    { deferStream: true }
  );

  createEffect(() => {
    if ("ready" === oauthCredential.state) {
      authContext.setOauthCredential(oauthCredential());

      navigation("/", { replace: true });
    }
  });

  return <></>;
}
