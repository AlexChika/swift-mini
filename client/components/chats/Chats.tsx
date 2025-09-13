import { memo } from "react";
import ChatList from "./ChatList";
import { Session } from "next-auth";
import { Box } from "@chakra-ui/react";
import CreateDuoChatBtn from "./CreateDuoChatBtn";

type Props = {
  session: Session;
};

function Chats({ session }: Props) {
  return (
    <Box border="1px solid yellowy">
      <CreateDuoChatBtn session={session} />
      <ChatList session={session} />
    </Box>
  );
}

export default memo(Chats);
