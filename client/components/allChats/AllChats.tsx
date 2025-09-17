import { memo } from "react";
// import ChatList from "./ChatList";
import { Session } from "next-auth";
import { Box } from "@chakra-ui/react";
import CreateNewChatBtn from "./CreateNewChatBtn";

type Props = {
  session: Session;
};

function Chats({ session }: Props) {
  return (
    <Box border="1px solid yellow">
      <CreateNewChatBtn session={session} />
      <div>Hello All Chats</div>
      {/* <ChatList session={session} /> */}
    </Box>
  );
}

export default memo(Chats);
