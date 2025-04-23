import { Center, Flex, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import MessagesHeader from "./MessagesHeader";
import Messages from "./Messages";

type Props = {
  session: Session;
  id: string | null; //conversationID
};

// border={"2px solid yellow"}

function Feeds({ session, id }: Props) {
  if (!id)
    return (
      <Center
        bg="{colors.secondaryBg}"
        border="2px solid {colors.secondaryBg}"
        display={{ base: "none", xmd: "flex" }}
        css={{
          margin: "10px 10px 10px 0px",
          borderRadius: "10px",
        }}
        w="100%"
      >
        <Text userSelect="none" color="whiteAlpha.500">
          No conversation selected
        </Text>
      </Center>
    );

  return (
    <Flex
      justifyContent="space-between"
      bg="{colors.secondaryBg}"
      border="2px solid {colors.secondaryBg}"
      direction="column"
      w="100%"
      css={{
        margin: { base: "10px", xmd: "10px 10px 10px 0px" },
        borderRadius: "10px",
      }}
    >
      <MessagesHeader {...{ id, userId: session.user.id }} />
      <Messages {...{ session, id }} />
    </Flex>
  );
}

export default Feeds;
