import { useState } from "react";
import { Session } from "next-auth";
import { toRems } from "@/lib/helpers";
import { Box, Text } from "@chakra-ui/react";
import CreateNewGroupModal from "./CreateNewGroupModal";

type Props = {
  session: Session;
};

function CreateNewGroupBtn({ session }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Box
        py={2}
        mb={4}
        cursor="pointer"
        borderRadius={12}
        onClick={() => setIsOpen(true)} // this works too
        border="2px solid {colors.primaryBg}">
        <Text
          fontWeight={500}
          textAlign="center"
          color="{colors.primaryText}"
          fontSize={{ base: toRems(14), md: toRems(15) }}>
          Find or Create a New Group
        </Text>
      </Box>

      <CreateNewGroupModal
        isOpen={isOpen}
        session={session}
        setIsOpen={setIsOpen}
      />
    </>
  );
}

export default CreateNewGroupBtn;
