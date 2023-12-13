import { Center, Flex, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useSearchParams } from "next/navigation";

type Props = {
  session: Session;
};

function Feeds({ session }: Props) {
  const search = useSearchParams();
  const id = search.get("conversationId");
  console.log({ id, session });

  if (!id)
    return (
      <Center w="100%">
        <Text>No conversation selected</Text>
      </Center>
    );

  return (
    <Flex w="100%" border="1px solid red">
      <Text>{id}</Text>
    </Flex>
  );
}

export default Feeds;
