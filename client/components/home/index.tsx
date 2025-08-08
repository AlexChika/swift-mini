"use client";

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Auth from "../auth";
import Chat from "../chat";
import StartScreen from "./StartScreen";
import useNetworkChangeNotifier from "@/lib/hooks/useNetworkChangeNotifier";
import { ColorMode, reloadSession } from "@/lib/helpers";

function HomePage() {
  const { data: session } = useSession();
  useNetworkChangeNotifier();

  if (process.env.NODE_ENV !== "production") {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
  }

  return (
    <Box>
      {/* <ColorMode.ThemeButton /> */} {/* For Debugging */}
      {session?.user.username ? (
        <StartScreen Child={<Chat session={session} />} />
      ) : (
        <Auth session={session} reloadSession={reloadSession} />
      )}
    </Box>
  );
}

export default HomePage;
