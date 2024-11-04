import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect, createResource } from "solid-js";
import { OauthCredential } from "typings/oauth-credential.interface";
import { callback } from "~/routes/api/oauth/callback/callback";
import { useAuthContext } from "~/contexts/auth-context";

export default function Callback() {
  const location = useLocation();

  const queries = new URLSearchParams(location.search);

  const code = queries.get("code");

  const authContext = useAuthContext();

  const navigation = useNavigate();

  const [oauthCredential, _] = createResource<OauthCredential>(
    () => callback(code!),
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
