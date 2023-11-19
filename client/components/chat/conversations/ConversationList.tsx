import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationModal from "../modals/ConversationModal";
import { useState } from "react";

type Props = {
  session: Session;
};

function ConversationList({ session }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <Box w="100%">
      <Box
        py={2}
        px={4}
        mb={4}
        bg="blackAlpha.300"
        borderRadius={4}
        cursor="pointer"
        onClick={() => onOpen()}
      >
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500}>
          Find or start a conversation
        </Text>

        <ConversationModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </Box>
  );
}

export default ConversationList;
