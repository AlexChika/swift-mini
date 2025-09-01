import { memo } from "react";
import ChatList from "./ChatList";
import { Session } from "next-auth";
import { Box } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import CreateDuoChatBtn from "./CreateDuoChatBtn";
// import CreateGroupChatBtn from "./CreateGroupChatBtn";

type Props = {
  session: Session;
};

function Chats({ session }: Props) {
  const { chatId: id } = useParams<{ chatId: string }>();

  return (
    <Box
      bg="{colors.secondaryBg}"
      border="4px solid {colors.appBorder}"
      borderRight="1px solid {colors.appBorder}"
      css={{
        margin: { base: "0px", xmd: "5px 0px 5px 5px" },
        borderRadius: { base: "0px", xmd: "10px 0px 0px 10px" }
      }}
      display={{ base: id ? "none" : "block", xmd: "block" }}
      w="100%"
      maxW={{ xmd: "300px", lg: "380px", xl: "400px" }}
      py={3}
      px={3}>
      <CreateDuoChatBtn session={session} />
      {/* create group chat */}
      {/* <CreateGroupChatBtn session={session} /> */}
      <ChatList session={session} />
    </Box>
  );
}

export default memo(Chats);
