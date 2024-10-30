import { Button } from "@/components/ui/button";
import { useAuthContext } from "~/contexts/auth-context";

export default function DisconnectButton() {
  const { YoutubeAPI } = useAuthContext();

  return (
    <Button
      onClick={async () => {
        await YoutubeAPI.disconnect();
      }}
      variant="outline"
    >
      Déconnexion
    </Button>
  );
}
