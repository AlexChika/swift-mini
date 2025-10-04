import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import CreateNewGroupModal from "./CreateNewGroupModal";

type Props = {
  session: Session;
};

function CreateNewGroupBtn({ session }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box
      py={2}
      mb={4}
      cursor="pointer"
      borderRadius={12}
      onClick={() => setIsOpen(true)}
      border="2px solid {colors.primaryBg}">
      <Text
        textAlign="center"
        color="{colors.primaryText}"
        fontSize={{ base: "14px", md: "15px" }}
        fontWeight={500}>
        Find or Create a New Group
      </Text>

      <CreateNewGroupModal
        session={session}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </Box>
  );
}

export default CreateNewGroupBtn;
