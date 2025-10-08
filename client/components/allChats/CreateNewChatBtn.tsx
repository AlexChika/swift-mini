import React from "react";
import { Session } from "next-auth";
import { toRems } from "@/lib/helpers";
import { Box, Text } from "@chakra-ui/react";
import CreateNewChatModal from "./CreateNewChatModal/CreateNewChatModal";
import CreateDuoChatModal from "./CreateNewChatModal";

type Props = {
  session: Session;
};

function CreateNewChatBtn({ session }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box
      py={2}
      mb={4}
      cursor="pointer"
      borderRadius={12}
      onClick={() => setIsOpen(true)}
      transition="all 0.3s ease"
      border="2px solid {colors.primaryBg}"
      _hover={{
        opacity: 1,
        transform: "translateY(-2px)",
        boxShadow: "0 0 12px {colors.primaryBg}"
      }}>
      <Text
        textAlign="center"
        color="{colors.primaryText}"
        fontSize={{ base: toRems(14), md: toRems(15) }}
        fontWeight={500}>
        Find or Create a New Chat
      </Text>

      {/* <CreateDuoChatModal
        session={session}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      /> */}
      <CreateNewChatModal
        session={session}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </Box>
  );
}

export default CreateNewChatBtn;
