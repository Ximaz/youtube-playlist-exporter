import { createContext, useContext, Component, JSX, Accessor } from "solid-js";
import createOauthCredential from "../hooks/oauth";
import { YoutubeApi, YoutubeAPIType } from "~/routes/api/youtube";
import { OauthCredential } from "typings/oauth-credential.interface";

type AuthType = {
  oauthCredential: Accessor<Promise<OauthCredential | null>>;
  setOauthCredential: (oauthCredential: OauthCredential | null) => void;
  YoutubeAPI: YoutubeAPIType;
};

const AuthContext = createContext<AuthType>();

export const AuthContextProvider: Component<{ children?: JSX.Element }> = (
  props
) => {
  const [oauthCredential, setOauthCredential] = createOauthCredential();
  const youtubeAPI = YoutubeApi(oauthCredential, setOauthCredential);

  return (
    <AuthContext.Provider
      value={{
        oauthCredential: oauthCredential,
        setOauthCredential: setOauthCredential,
        YoutubeAPI: youtubeAPI,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthType => {
  const ctx = useContext(AuthContext);
  if (undefined === ctx)
    throw new Error("useAuthContext: unable to get an AuthContext");
  return ctx;
};
