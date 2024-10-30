import { Accessor, createMemo, createSignal } from "solid-js";
import {
  BACKEND_URL,
  OauthCredential,
  RawOauthCredential,
} from "~/api/constants";

const storage = sessionStorage;

const createOauth = (): [
  Accessor<Promise<OauthCredential | null>>,
  (oauthCredential: OauthCredential | null) => void
] => {
  const key = "oauth-credential";

  const [origOauthCredential, setOrigOauthCredential] =
    createSignal<OauthCredential | null>(null);

  const oauthCredential = createMemo(async () => {
    let result: OauthCredential;

    const origOauthCredentialValue = origOauthCredential();

    if (null !== origOauthCredentialValue) {
      result = origOauthCredentialValue;
    } else {
      const cachedOauthCredential = storage.getItem(key);

      if (
        undefined === cachedOauthCredential ||
        null === cachedOauthCredential
      ) {
        storage.removeItem(key);

        return null;
      }

      result = JSON.parse(cachedOauthCredential);
    }

    if (result.expires_at > Date.now()) return result;

    const response = await fetch(
      `${BACKEND_URL}/oauth/refresh?refresh_token=${result.refresh_token}`
    );

    if (!response.ok) {
      storage.removeItem(key);

      setOrigOauthCredential(null);

      return null;
    }

    const data: RawOauthCredential = await response.json();

    const oauthCredential: OauthCredential = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in - 5) * 1000,
      refresh_token: data.refresh_token ?? result.refresh_token,
    };

    setOrigOauthCredential(oauthCredential);

    return oauthCredential;
  });

  const setOauthCredential = (oauthCredential: OauthCredential | null) => {
    if (null === oauthCredential) storage.removeItem(key);
    else storage.setItem(key, JSON.stringify(oauthCredential));

    setOrigOauthCredential(oauthCredential);
  };

  return [oauthCredential, setOauthCredential];
};

export default createOauth;
