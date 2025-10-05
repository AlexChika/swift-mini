"use client";

import { useRef } from "react";
import { Session } from "next-auth";
import { Flex } from "@chakra-ui/react";
import Home from "@/components/home/Home";
import InProgressModal from "../general/InProgressModal";
import useDynamicHeight from "@/lib/hooks/useDynamicHeight";

type ChatProps = {
  session: Session;
  children: React.ReactNode;
};

function ChatLayout({ session, children }: ChatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useDynamicHeight({
    ref: containerRef
  });

  return (
    <>
      {/* temp addition */}
      <InProgressModal></InProgressModal>

      <Flex gap={0} w={"100%"} margin={0} h="100vh">
        <Home session={session} />
        {children}
      </Flex>
    </>
  );
}

export default ChatLayout;
