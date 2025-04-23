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
    const newMessage = {
      body: str,
      conversationId: id,
      senderId: session.user.id,
    };

    try {
      await send({
        variables: {
          ...newMessage,
        },
        // optimisticResponse: true,
        // update:(cache)=>{
        //   const existing = cache.readQuery<MessagesData>({
        //     query: messageOperations.Queries.messages,
        //     variables: {conversationId:id}
        //   })

        //   cache.writeQuery<MessagesData, { conversationId: string }>({
        //     query: messageOperations.Queries.messages,
        //     variables: {conversationId:id },
        //     data: {...existing, messages:[{...newMessage}, ...existing?.messages || []]}
        //   });

        // }
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
      // bg="#333443"
      px={{ base: 3, xmd: 12 }}
      py={4}
      w="100%"
      borderBottomRadius="inherit"
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
          css={{
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
          }}
          bg="{colors.primaryBg}"
          color="{colors.primaryText}"
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
          bg="{colors.primaryBg}"
          borderRadius={10}
          aria-label="Send Message Icon"
        >
          <SendIcon color="{colors.primaryText}" />
        </IconButton>
      </Flex>
    </Box>
  );
}

export default MessageInput;
