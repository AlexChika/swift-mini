"use client";

import { Button, Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useSearchParams } from "next/navigation";
import Conversations from "./conversations";
import Feeds from "./feeds";
import useDynamicHeight from "@/lib/hooks/useDynamicHeight";
import { useRef } from "react";
import InProgressModal from "../general/InProgressModal";

type ChatProps = {
  session: Session;
};

function Chat({ session }: ChatProps) {
  const search = useSearchParams();
  const id = search.get("conversationId");

  const containerRef = useRef<HTMLDivElement | null>(null);
  useDynamicHeight(containerRef);

  // delete below code
  async function call() {
    const req = await fetch(
      `http://localhost:4000/iframetest?url=alexchika.com`
    );

    const iframeBlocked = await req.json();
    console.log({ iframeBlocked });
  }

  return (
    <>
      {/* temp addition */}
      <InProgressModal></InProgressModal>

      <iframe src="https://alexchika.com/"></iframe>
      <Button onClick={call}>CLICK ME</Button>

      <Flex ref={containerRef} margin={0} gap={0}>
        <Conversations id={id} session={session} />
        <Feeds id={id} session={session} />
      </Flex>
    </>
  );
}

export default Chat;
