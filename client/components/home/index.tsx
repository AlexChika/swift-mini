"use client";

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Auth from "../auth";
import Chat from "../chat";
import StartScreen from "./StartScreen";

function HomePage() {
  const { data: session } = useSession();

  if (process.env.NODE_ENV !== "production") {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
  }

  function reloadSession() {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  }

  return (
    <Box>
      {session?.user.username ? (
        <StartScreen Child={<Chat session={session} />} />
      ) : (
        <Auth session={session} reloadSession={reloadSession} />
      )}
    </Box>
  );
}

export default HomePage;
