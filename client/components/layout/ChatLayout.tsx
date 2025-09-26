"use client";

import { Session } from "next-auth";
import { toRems } from "@/lib/helpers";
import { Flex } from "@chakra-ui/react";
import Home from "@/components/home/Home";
import InProgressModal from "../general/InProgressModal";

type ChatProps = {
  session: Session;
  children: React.ReactNode;
};

function ChatLayout({ session, children }: ChatProps) {
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
