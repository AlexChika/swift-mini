"use client";

import ChatScreen from "@/components/chatscreen/ChatScreen";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

function Page() {
  const { chatId } = useParams<{ chatId: string }>();
  const { data: session } = useSession() as { data: Session };

  return <ChatScreen {...{ session, id: chatId }} />;
}

export default Page;
