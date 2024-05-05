"use client";

import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useSearchParams } from "next/navigation";
import Conversations from "./conversations";
import Feeds from "./feeds";
import useDynamicHeight from "@/lib/hooks/useDynamicHeight";
import { useRef } from "react";

type ChatProps = {
  session: Session;
};

// border={"2px solid yellow"}

function Chat({ session }: ChatProps) {
  const search = useSearchParams();
  const id = search.get("conversationId");

  const containerRef = useRef<HTMLDivElement | null>(null);
  useDynamicHeight(containerRef);

  return (
    <Flex ref={containerRef} height="100vh" margin={0} gap={0}>
      <Conversations id={id} session={session} />
      <Feeds id={id} session={session} />
    </Flex>
  );
}

export default Chat;
