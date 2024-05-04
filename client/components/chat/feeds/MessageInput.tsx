import { SendIcon } from "@/lib/icons";
import { Flex, IconButton, Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRef } from "react";

type Props = {
  session: Session;
  id: string | null; //conversationID
};

function MessageInput(props: Props) {
  const InputBox = useRef<null | HTMLDivElement>(null);

  function onInputHandler(e: React.FormEvent) {
    e.preventDefault();

    // register contenteditable to a Ref
    if (InputBox.current) return;
    InputBox.current = e.currentTarget as HTMLDivElement;

    // add listener to send message when enterKey is pressed
    InputBox.current.addEventListener("keydown", (e) => {
      const el = e.currentTarget as HTMLDivElement;

      const textString = el.textContent?.trim();
      if (!textString) return;

      if (e.key === "Enter") {
        if (e.shiftKey) return; // shiftKey is active: go to newline

        // send the message : enter key alone was pressed
        sendMessage(textString);
        e.preventDefault(); // Don't go to newline
        el.innerHTML = ""; // clear inputBox
      }
    });
  }

  function sendMessage(str: string) {
    console.log({ str });
  }

  function handleOnSubmit() {
    const textString = InputBox.current?.textContent?.trim();
    if (!textString) return;

    sendMessage(textString);
  }

  return (
    <Box
      borderTop="2px"
      borderColor="whiteAlpha.50"
      bg="blackAlpha.300"
      px={{ base: "10px", xmd: "30px" }}
      py={2}
      w="100%"
    >
      <Flex
        justifyContent="space-between"
        maxW="100%"
        w="100%"
        gap={{ base: 2, xmd: 3 }}
      >
        <Box
          onInput={onInputHandler}
          sx={{
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
          }}
          bg="whiteAlpha.100"
          maxH="200px"
          minH="40px"
          overflowY="auto"
          p={2}
          maxW={{ base: "calc(100% - 50px)", xmd: "calc(100% - 100px)" }}
          w="100%"
          contentEditable="plaintext-only"
          borderRadius={10}
        />

        <IconButton
          onClick={handleOnSubmit}
          minW={{ base: "50px", xmd: "100px" }}
          alignSelf="flex-end"
          color="blackAlpha.100"
          borderRadius={10}
          aria-label="Send Message Icon"
          icon={<SendIcon color="whiteAlpha.700" />}
        />
      </Flex>
    </Box>
  );
}

export default MessageInput;
