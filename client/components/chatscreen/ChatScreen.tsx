import { Center, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { Session } from "next-auth";
import Spinner from "@/components/general/Spinner";
import MessagesHeader from "./MessagesHeader";
import Messages from "./Messages";

type Props = {
  session: Session;
  id: string; //chatId
};

// border={"2px solid yellow"}

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
        margin: { base: "0px", xmd: "5px 5px 5px 0px" },
        borderRadius: { base: "0px", xmd: "0px 10px 10px 0px" }
      }}>
      <MessagesHeader {...{ id, userId: session.user.id }} />
      <Messages {...{ session, id }} />
    </Flex>
  );
}

export default ChatScreen;
