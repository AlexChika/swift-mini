"use client";

import { Session } from "next-auth";
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
        gap={0}
        w={"100%"}
        margin={0}
        inset="0"
        pos={{ base: "fixed", xmd: "static" }}>
        <Home session={session} />
        {children}
      </Flex>
    </>
  );
}

export default ChatLayout;
