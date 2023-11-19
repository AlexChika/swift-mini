"use client";

import { Flex } from "@chakra-ui/react";
import Conversations from "./conversations";
import Feeds from "./feeds";
import { Session } from "next-auth";

type ChatProps = {
  session: Session;
};

function Chat({ session }: ChatProps) {
  return (
    <Flex height="100vh">
      <Conversations session={session} />
      <Feeds session={session} />
    </Flex>
  );
}

export default Chat;
