import { Session } from "next-auth";
import { Box } from "@chakra-ui/react";
import SwiftStore from "@/store/Store";
import { useRouter } from "next/navigation";
import { getSearchParam } from "@/lib/helpers";
import { memo, useCallback, useMemo } from "react";
import CreateNewGroupBtn from "./CreateNewGroupBtn";
import ChatList from "@/components/allChats/ChatList";

type Props = {
  session: Session;
};

function Groups({ session }: Props) {
  const router = useRouter();
  const { allChats } = SwiftStore();

  const groupChats = useMemo(
    () => allChats.filter((chat) => chat.chatType === "group"),
    [allChats]
  );

  const openChat = useCallback(
    async function (chatId: string) {
      const param = getSearchParam("swift");
      router.push(`/${chatId}?swift=${param}`);
    },
    [router]
  );

  return (
    <Box>
      <CreateNewGroupBtn session={session} />
      <ChatList chatList={groupChats} session={session} openChat={openChat} />
    </Box>
  );
}

export default memo(Groups);
