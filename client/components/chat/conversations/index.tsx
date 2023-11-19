import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";

type Props = {
  session: Session;
};

// border={"2px solid red"}

function Conversations({ session }: Props) {
  return (
    <Box bg="whiteAlpha.50" w={{ base: "100%", md: "400px" }} py={6} px={3}>
      {/* skeleton loader */}
      <ConversationList session={session} />
    </Box>
  );
}

export default Conversations;
