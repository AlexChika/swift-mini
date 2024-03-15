import { Center, Flex, Text } from "@chakra-ui/react";
import { Session } from "next-auth";

type Props = {
  session: Session;
  id: string | null; //conversationID
};

// border={"2px solid yellow"}

function Feeds({ session, id }: Props) {
  if (!id)
    return (
      <Center display={{ base: "none", xmd: "flex" }} w="100%">
        <Text>No conversation selected</Text>
      </Center>
    );

  return (
    <Flex w="100%">
      <Text>{id}</Text>

      <Text>Build In Progress</Text>
    </Flex>
  );
}

export default Feeds;
