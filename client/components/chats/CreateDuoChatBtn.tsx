import React from "react";
import { Session } from "next-auth";
import { toRems } from "@/lib/helpers";
import { Box, Text } from "@chakra-ui/react";
import CreateDuoChatModal from "./CreateDuoChatModal";

type Props = {
  session: Session;
};

function CreateDuoChatBtn({ session }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box
      py={2}
      mb={4}
      border="2px solid {colors.primaryBg}"
      borderRadius={12}
      cursor="pointer"
      onClick={() => setIsOpen(true)}>
      <Text
        textAlign="center"
        color="{colors.primaryText}"
        fontSize={{ base: toRems(14), md: toRems(15) }}
        fontWeight={500}>
        Create Duo Chat tester
      </Text>

      <CreateDuoChatModal
        session={session}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </Box>
  );
}

export default CreateDuoChatBtn;
