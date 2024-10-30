import { MetaProvider, Title } from "@solidjs/meta";
import { createMemoryHistory, MemoryRouter, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

import { AuthContextProvider } from "./contexts/auth-context";
import "./app.css";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <AuthContextProvider>
      <Router
        root={(props) => (
          <MetaProvider>
            <Title>Youtube Playlist Downloader</Title>
            <Button as="a" href="/" variant="outline">
              Home
            </Button>
            <Suspense>{props.children}</Suspense>
          </MetaProvider>
        )}
      >
        <FileRoutes />
      </Router>
    </AuthContextProvider>
  );
}
