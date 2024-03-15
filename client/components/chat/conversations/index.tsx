import { memo } from "react";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";

type Props = {
  session: Session;
  id: string | null; // conversation Id
};

function Conversations({ session, id }: Props) {
  return (
    <Box
      bg="whiteAlpha.50"
      display={{ base: id ? "none" : "block", xmd: "block" }}
      w="100%"
      maxW={{ xmd: "260px", lg: "350px" }}
      py={6}
      px={3}
    >
      {/* skeleton loader */}
      <ConversationList session={session} />
    </Box>
  );
}

export default memo(Conversations);
