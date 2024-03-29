import { memo } from "react";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import StartConversationBtn from "./StartConversationBtn";

type Props = {
  session: Session;
  id: string | null; // conversation Id
};

function Conversations({ session, id }: Props) {
  return (
    <Box
      bg="whiteAlpha.50"
      borderRight="2px"
      borderColor="whiteAlpha.50"
      display={{ base: id ? "none" : "block", xmd: "block" }}
      w="100%"
      maxW={{ xmd: "260px", lg: "350px" }}
      py={4}
      px={3}
    >
      {/* skeleton loader */}
      <StartConversationBtn session={session} />
      <ConversationList session={session} />
    </Box>
  );
}

export default memo(Conversations);
