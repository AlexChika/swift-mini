import { memo } from "react";
import { Session } from "next-auth";
import { Box } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import ConversationList from "@/components/chats/ConversationList";
import StartConversationBtn from "@/components/chats/StartConversationBtn";
import StartConversationBtn2 from "./StartConversationBtn2";

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
      maxW={{ xmd: "300px", lg: "380px", xl: "420px" }}
      py={3}
      px={3}>
      <StartConversationBtn session={session} />
      <StartConversationBtn2 session={session} />
      <ConversationList session={session} />
    </Box>
  );
}

export default memo(Chats);
