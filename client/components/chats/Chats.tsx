import { Session } from "next-auth";
import { Box } from "@chakra-ui/react";
import SwiftStore from "@/store/swiftStore";
import { useRouter } from "next/navigation";
import { getSearchParam } from "@/lib/helpers";
import { memo, useCallback, useMemo } from "react";
import ChatList from "@/components/allChats/ChatList";
import CreateNewChatBtn from "@/components/allChats/CreateNewChatBtn";

type Props = {
  session: Session;
};

function Chats({ session }: Props) {
  const router = useRouter();
  const { allChats } = SwiftStore();

  const duoChats = useMemo(
    () => allChats.filter((chat) => chat.chatType === "duo"),
    [allChats]
  );

  const openChat = useCallback(async function (chatId: string) {
    const param = getSearchParam("swift");
    router.push(`/${chatId}?swift=${param}`);
  }, []);

  return (
    <Box>
      <CreateNewChatBtn session={session} />
      <ChatList chatList={duoChats} session={session} openChat={openChat} />
    </Box>
  );
}

export default memo(Chats);
