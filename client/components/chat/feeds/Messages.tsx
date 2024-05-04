import { Box, Stack, Text } from "@chakra-ui/react";
import MessageInput from "./MessageInput";
import { Session } from "next-auth";
import { hideScrollbar } from "@/chakra/theme";

type Props = {
  session: Session;
  id: string | null; //conversationID
};

function Messages({ session, id }: Props) {
  return (
    // calc(100% - 65px) => 65px accounts for the MessageHeader
    <Stack h="calc(100% - 60px)" overflowY="auto">
      <Box
        bg="blackAlpha.100"
        pb="10px"
        sx={{ ...hideScrollbar }}
        overflowY="auto"
      >
        {Array.from({ length: 100 }).map((x, i) => {
          return <Text key={i}>Build In Progress {i}</Text>;
        })}
      </Box>

      <MessageInput {...{ session, id }} />
    </Stack>
  );
}

export default Messages;
