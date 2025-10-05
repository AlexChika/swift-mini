import React from "react";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import { SendIcon } from "@/lib/icons";
import { useMutation } from "@apollo/client/react";
import handleError from "@/lib/helpers/handleError";
import messageOps from "@/graphql/operations/message.ops";
import { Flex, IconButton, Box, Icon, HStack } from "@chakra-ui/react";
import useMobileInputScrollFix from "@/lib/hooks/useMobileScrollFix";

type Props = {
  session: Session;
  id: string; //chatID
};

function MessageInput(props: Props) {
  const { id, session } = props;

  const [send, { error }] = useMutation<sendMessageData, sendMessageVariable>(
    messageOps.Mutations.sendMessage
  );

  // btn : submit handler
  function handleOnSubmit() {
    if (!InputBox.current) return;
    InputBox.current.focus();

    const textString = InputBox.current.textContent?.trim();
    if (!textString) return;

    InputBox.current.innerHTML = "";
    sendMessage(textString);
  }

  // called by the submit and enter btn:sends message
  async function sendMessage(str: string) {
    const newMessage = {
      body: str,
      chatId: id,
      senderId: session.user.id
    };

    try {
      await send({
        variables: {
          ...newMessage,
          clientSentAt: new Date().toISOString()
        }
      });

      if (error) toast.error("Could not send");
    } catch (error) {
      handleError(error, (err) => {
        console.log("onMessageError", err);
        toast.error("Could not send");
      });
    }
  }

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

  // ref
  const InputBox = React.useRef<HTMLDivElement>(null);
  // useMobileInputScrollFix(InputBox, "swft-message-container");

  //TODO: use rems and ems
  return (
    <Box
      py={3}
      w="100%"
      id="swft-message-box"
      px={{ base: 3, xmd: 6 }}
      bg="{colors.secondaryBg}"
      borderBottomRadius="inherit"
      borderTop="1px solid {colors.appBorder}">
      <Flex
        w="100%"
        maxW="100%"
        gap={{ base: 2, xmd: 3 }}
        justifyContent="space-between">
        <Box
          py={1}
          px={3}
          w="100%"
          maxH="200px"
          minH="33px"
          fontSize={16}
          ref={InputBox}
          overflowY="auto"
          borderRadius={14}
          whiteSpace="pre-wrap"
          wordBreak="break-word"
          overflowWrap="break-word"
          bg="{colors.primaryBg/30}"
          color="{colors.primaryText}"
          onKeyDown={onKeyDownHandler}
          contentEditable="plaintext-only"
          maxW={{ base: "calc(100% - 50px)", xmd: "calc(100% - 100px)" }}
        />

        <HStack>
          <IconButton
            h="30px"
            transition="none"
            variant={"plain"}
            borderRadius={14}
            alignSelf="flex-end"
            onClick={handleOnSubmit}
            bg="{colors.primaryBg/30}"
            aria-label="Send Message Icon"
            minW={{ base: "50px", xmd: "100px" }}>
            <Icon size="md">
              <SendIcon color="{colors.primaryText}" />
            </Icon>
          </IconButton>
        </HStack>
      </Flex>
    </Box>
  );
}

export default MessageInput;
