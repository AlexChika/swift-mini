"use client";

import { useRef } from "react";
import { Session } from "next-auth";
import { toRems } from "@/lib/helpers";
import { Flex } from "@chakra-ui/react";
import Home from "@/components/home/Home";
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
        h="100dvh"
        maxW={{ base: toRems(500), xmd: "100%" }}
        margin={0}
        gap={0}>
        <Home session={session} />
        {children}
      </Flex>
    </>
  );
}

export default ChatLayout;
