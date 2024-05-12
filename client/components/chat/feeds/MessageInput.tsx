import messageOperations from "@/graphql/operations/messages";
import { SendIcon } from "@/lib/icons";
import { ApolloError, useMutation } from "@apollo/client";
import { Flex, IconButton, Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRef } from "react";
import toast from "react-hot-toast";

type Props = {
  session: Session;
  id: string; //conversationID
};

function MessageInput(props: Props) {
  const { id, session } = props;

  // send message mutation
  const [send, { error }] = useMutation<sendMessageData, sendMessageVariable>(
    messageOperations.Mutations.sendMessage
  );

  // ref
  const InputBox = useRef<null | HTMLDivElement>(null);

  function onKeyDownHandler(e: React.KeyboardEvent) {
    // disable send on enter for mobile device
    if (window.innerWidth < 768) return;

    const el = e.currentTarget as HTMLDivElement;

    const textString = el.textContent?.trim();
    if (!textString) return;

    if (e.key === "Enter") {
      if (e.shiftKey) return; // shiftKey is active: go to newline

      sendMessage(textString); // send the message : enter key alone was pressed
      e.preventDefault(); // Don't go to newline
      el.innerHTML = ""; // clear inputBox
    }
  }

  // called by the submit and enter btn:sends message
  async function sendMessage(str: string) {
    try {
      await send({
        variables: {
          body: str,
          conversationId: id,
          senderId: session.user.id,
        },
      });

      if (error) toast.error("Could not send");
    } catch (error) {
      const err = error as ApolloError;
      toast.error("Could not send");
      console.log("onMessageError", err);
    }
  }

  // btn : submit handler
  function handleOnSubmit() {
    if (!InputBox.current) return;

    const textString = InputBox.current.textContent?.trim();
    if (!textString) return;

    InputBox.current.innerHTML = "";
    sendMessage(textString);
  }

  return (
    <Box
      borderTop="2px"
      borderColor="whiteAlpha.50"
      bg="blackAlpha.300"
      px={{ base: 3, xmd: 12 }}
      py={4}
      w="100%"
      // border="2px solid red"
    >
      <Flex
        justifyContent="space-between"
        maxW="100%"
        w="100%"
        mb={2}
        gap={{ base: 2, xmd: 3 }}
      >
        <Box
          ref={InputBox}
          onKeyDown={onKeyDownHandler}
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
          color="blackAlpha.50"
          borderRadius={10}
          aria-label="Send Message Icon"
          icon={<SendIcon color="whiteAlpha.700" />}
        />
      </Flex>
    </Box>
  );
}

export default MessageInput;
