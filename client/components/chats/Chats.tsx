import ChatList from "./ChatList";
import { Session } from "next-auth";
import { Box } from "@chakra-ui/react";
import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSearchParam } from "@/lib/helpers";
import CreateDuoChatBtn from "./CreateDuoChatBtn";

type Props = {
  session: Session;
};

function Chats({ session }: Props) {
  const router = useRouter();

  const openChat = useCallback(async function (chatId: string) {
    const param = getSearchParam("swift");
    router.push(`/${chatId}?swift=${param}`);
  }, []);

  return (
    <Box border="1px solid yellowy">
      <CreateDuoChatBtn openChat={openChat} session={session} />
      <ChatList session={session} openChat={openChat} />
    </Box>
  );
}

export default memo(Chats);
