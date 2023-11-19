"use client";

import { Box } from "@chakra-ui/react";
import Chat from "../chat";
import Auth from "../auth";
import { useSession } from "next-auth/react";

function HomePage() {
  const { data: session } = useSession();

  function reloadSession() {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  }

  return (
    <Box>
      {session?.user.username ? (
        <Chat session={session} />
      ) : (
        <Auth session={session} reloadSession={reloadSession} />
      )}
    </Box>
  );
}

export default HomePage;
