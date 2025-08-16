import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationModal3 from "./ConversationModal3";

type Props = {
  session: Session;
};

function StartConversationBtn3({ session }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box
      py={2}
      mb={4}
      bg="{colors.primaryBg}"
      borderRadius={4}
      cursor="pointer"
      onClick={() => setIsOpen(true)}>
      <Text
        textAlign="center"
        color="{colors.primaryText}"
        fontSize={{ base: "14px", md: "15px" }}
        fontWeight={500}>
        Create Group Chat tester
      </Text>

      <ConversationModal3
        session={session}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </Box>
  );
}

export default StartConversationBtn3;
