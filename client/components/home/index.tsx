"use client";

import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import Chat from "../chat";
import Auth from "../auth";

type Props = {
  session: Session | null;
};

function HomePage({ session }: Props) {
  return (
    <Box>
      {session?.user ? (
        <Chat />
      ) : (
        <Auth session={session} reloadSession={() => {}} />
      )}
    </Box>
  );
}

export default HomePage;
