import { Accessor, createMemo, createSignal } from "solid-js";
import { OauthCredential } from "../../typings/oauth-credential.interface";
import { refresh } from "~/routes/api/oauth/refresh/refresh";

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

    const refreshedCredential = await refresh(result);

    setOrigOauthCredential(refreshedCredential);

    return refreshedCredential;
  });

  const setOauthCredential = (oauthCredential: OauthCredential | null) => {
    if (null === oauthCredential) storage.removeItem(key);
    else storage.setItem(key, JSON.stringify(oauthCredential));

    setOrigOauthCredential(oauthCredential);
  };

  return [oauthCredential, setOauthCredential];
};

export default createOauth;
