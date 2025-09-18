import ChatList from "./ChatList";
import { Session } from "next-auth";
import { Box } from "@chakra-ui/react";
import SwiftStore from "@/store/Store";
import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSearchParam } from "@/lib/helpers";
import CreateNewChatBtn from "./CreateNewChatBtn";

type Props = {
  session: Session;
};

function AllChats({ session }: Props) {
  const router = useRouter();
  const { allChats } = SwiftStore();

  const openChat = useCallback(async function (chatId: string) {
    const param = getSearchParam("swift");
    router.push(`/${chatId}?swift=${param}`);
  }, []);

  return (
    <Box>
      <CreateNewChatBtn session={session} />
      <ChatList session={session} chatList={allChats} openChat={openChat} />
    </Box>
  );
}

export default memo(AllChats);
