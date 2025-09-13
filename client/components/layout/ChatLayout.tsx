"use client";

import { useRef } from "react";
import { Session } from "next-auth";
import { toRems } from "@/lib/helpers";
import { Flex } from "@chakra-ui/react";
import Chats from "@/components/chats/Chats";
import InProgressModal from "../general/InProgressModal";
import useDynamicHeight from "@/lib/hooks/useDynamicHeight";

type ChatProps = {
  session: Session;
  children: React.ReactNode;
};

function ChatLayout({ session, children }: ChatProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useDynamicHeight({
    ref: containerRef
  });

  return (
    <>
      {/* temp addition */}
      <InProgressModal></InProgressModal>

      <Flex
        w={"100%"}
        ref={containerRef}
        maxW={{ base: toRems(500), xmd: "100%" }}
        margin={0}
        gap={0}>
        <Chats session={session} />
        {children}
      </Flex>
    </>
  );
}

export default ChatLayout;
