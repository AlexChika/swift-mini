"use client";

import { Box } from "@chakra-ui/react";
import Chat from "../chat";
import Auth from "../auth";
import { useSession } from "next-auth/react";

function HomePage() {
  const { data: sess } = useSession();

  function reloadSession() {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  }

  return (
    <Box>
      {sess?.user.username ? <Chat /> : <Auth reloadSession={reloadSession} />}
    </Box>
  );
}

export default HomePage;
