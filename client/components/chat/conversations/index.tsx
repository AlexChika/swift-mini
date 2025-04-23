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
      bg="{colors.primaryBg}"
      // border="2px solid {colors.secondaryBg}"
      // border="2px solid {colors.htmlBg}"
      css={{
        filter:
          "drop-shadow(1px 1px 2px {colors.secondaryBg}) drop-shadow(-1px -1px 2px {colors.secondaryBg})drop-shadow(1px -1px 2px {colors.secondaryBg})drop-shadow(-1px 1px 2px {colors.secondaryBg})",
        margin: "10px",
        borderRadius: "10px",
      }}
      display={{ base: id ? "none" : "block", xmd: "block" }}
      w="100%"
      maxW={{ xmd: "260px", lg: "350px", xl: "450px" }}
      py={3}
      px={3}
    >
      <StartConversationBtn session={session} />
      <ConversationList session={session} />
    </Box>
  );
}

export default memo(Conversations);
