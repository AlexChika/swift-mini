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
      bg="{colors.secondaryBg}"
      border="4px solid {colors.appBorder}"
      borderRight="2px solid {colors.appBorderDivider}"
      css={{
        margin: { base: "0px", xmd: "5px 0px 5px 5px" },
        borderRadius: { base: "10px", xmd: "10px 0px 0px 10px" },
      }}
      display={{ base: id ? "none" : "block", xmd: "block" }}
      w="100%"
      maxW={{ xmd: "300px", lg: "380px" }}
      py={3}
      px={3}
    >
      <StartConversationBtn session={session} />
      <ConversationList session={session} />
    </Box>
  );
}

export default memo(Conversations);
