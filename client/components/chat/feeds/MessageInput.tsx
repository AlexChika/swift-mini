import { SendIcon } from "@/lib/icons";
import { Flex, IconButton, Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import { FormEvent, useState } from "react";

type Props = {
  session: Session;
  id: string | null; //conversationID
};

function MessageInput(props: Props) {
  const [text, setText] = useState("");

  function submithandler(e: FormEvent) {
    e.preventDefault();

    const textString = text.trim();
    if (!textString) return;

    console.log(textString);
  }

  return (
    <Box
      sx={{ flex: "1" }}
      borderTop="2px"
      borderColor="whiteAlpha.50"
      bg="blackAlpha.300"
      px={4}
      py={2}
      w="100%"
    >
      <form onSubmit={submithandler}>
        <Flex width="95%" margin="0 auto" gap={2}>
          <Box
            sx={{
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
            bg="whiteAlpha.100"
            maxH="200px"
            minH="40px"
            overflowY="auto"
            p={2}
            minW="90%"
            contentEditable
            borderRadius={10}
          />

          <IconButton
            w="100%"
            alignSelf="flex-end"
            color="blackAlpha.100"
            aria-label="Send Message Icon"
            icon={<SendIcon color="whiteAlpha.700" />}
          />
        </Flex>
      </form>
    </Box>
  );
}

export default MessageInput;
