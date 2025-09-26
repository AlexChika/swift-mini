import Messages from "./Messages";
import { Session } from "next-auth";
import { toEms } from "@/lib/helpers";
import { Flex } from "@chakra-ui/react";
import MessagesHeader from "./MessagesHeader";

type Props = {
  session: Session;
  id: string; //chatId
};

function ChatScreen({ session, id }: Props) {
  return (
    <Flex
      justifyContent="space-between"
      bg="{colors.secondaryBg}"
      border="4px solid {colors.appBorder}"
      borderLeft={{ xmd: "none" }}
      direction="column"
      w="100%"
      css={{
        margin: { base: "0px", xmd: toEms(5, 5, 5, 0) },
        borderRadius: { base: "0px", xmd: "0px 10px 10px 0px" }
      }}>
      <MessagesHeader {...{ id, userId: session.user.id }} />
      <Messages {...{ session, id }} />
    </Flex>
  );
}

export default ChatScreen;
