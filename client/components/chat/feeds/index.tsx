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
      <Center display={{ base: "none", xmd: "flex" }} w="100%">
        <Text userSelect="none" color="whiteAlpha.500">
          No conversation selected
        </Text>
      </Center>
    );

  return (
    <Flex
      // borderRight="2px"
      // borderColor="whiteAlpha.50"
      justifyContent="space-between"
      bg="bg"
      direction="column"
      w="100%"
      css={{ border: "2px solid red" }}
    >
      <MessagesHeader {...{ id, userId: session.user.id }} />
      <Messages {...{ session, id }} />
    </Flex>
  );
}

export default Feeds;
