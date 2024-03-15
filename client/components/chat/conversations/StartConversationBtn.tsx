import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationModal from "../modals/ConversationModal";
import { useState } from "react";

type Props = {
  session: Session;
};

function StartConversationBtn({ session }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <Box
      py={2}
      mb={4}
      bg="blackAlpha.300"
      borderRadius={4}
      cursor="pointer"
      onClick={() => onOpen()}
    >
      <Text
        textAlign="center"
        color="whiteAlpha.800"
        fontSize={{ base: "14px", md: "15px" }}
        fontWeight={500}
      >
        Find or start a conversation
      </Text>

      <ConversationModal session={session} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

export default StartConversationBtn;
