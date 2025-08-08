import { Center, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { Session } from "next-auth";
import MessagesHeader from "./MessagesHeader";
import Messages from "./Messages";
import Spinner from "@/components/general/Spinner";

type Props = {
  session: Session;
  id: string | null; //conversationID
};

// border={"2px solid yellow"}

function Feeds({ session, id }: Props) {
  if (!id)
    return (
      <Center
        dir="column"
        bg="{colors.emptyChatScreen}"
        border="4px solid {colors.appBorder}"
        borderLeft={{ xmd: "none" }}
        display={{ base: "none", xmd: "flex" }}
        css={{
          margin: { base: "0px", xmd: "5px 5px 5px 0px" },
          borderRadius: { base: "0px", xmd: "0px 10px 10px 0px" },
        }}
        w="100%"
      >
        <VStack>
          <Image opacity={0.5} maxW="150px" alt="Logo Image" src="/icon.png" />

          <Text userSelect="none" opacity={0.3} color="{colors.primaryText}">
            No conversation selected
          </Text>
        </VStack>
      </Center>
    );

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
        borderRadius: { base: "0px", xmd: "0px 10px 10px 0px" },
      }}
    >
      <MessagesHeader {...{ id, userId: session.user.id }} />
      <Messages {...{ session, id }} />
    </Flex>
  );
}

export default Feeds;
