import { useRef } from "react";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import { SendIcon } from "@/lib/icons";
import { useMutation } from "@apollo/client/react";
import handleError from "@/lib/helpers/handleError";
import { Flex, IconButton, Box, Button, Icon, HStack } from "@chakra-ui/react";
import messageOps from "@/graphql/operations/message.ops";

type Props = {
  session: Session;
  id: string; //chatID
};

function MessageInput(props: Props) {
  const { id, session } = props;

  const [send, { error }] = useMutation<sendMessageData, sendMessageVariable>(
    messageOps.Mutations.sendMessage
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

  // btn : submit handler
  function handleOnSubmit() {
    if (!InputBox.current) return;

    const textString = InputBox.current.textContent?.trim();
    if (!textString) return;

    InputBox.current.focus();
    InputBox.current.innerHTML = "";
    sendMessage(textString);
  }

  //TODO: use rems and ems
  return (
    <Box
      bg="{colors.secondaryBg}"
      px={{ base: 3, xmd: 6 }}
      pt={3}
      w="100%"
      borderTop="1px solid {colors.appBorder}"
      borderBottomRadius="inherit">
      <Flex
        justifyContent="space-between"
        maxW="100%"
        w="100%"
        gap={{ base: 2, xmd: 3 }}>
        <Box
          ref={InputBox}
          onKeyDown={onKeyDownHandler}
          css={{
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word"
          }}
          bg="{colors.primaryBg/30}"
          color="{colors.primaryText}"
          maxH="200px"
          minH="33px"
          overflowY="auto"
          py={1}
          px={3}
          maxW={{ base: "calc(100% - 50px)", xmd: "calc(100% - 100px)" }}
          w="100%"
          fontSize={16}
          contentEditable="plaintext-only"
          borderRadius={14}
        />

        <HStack>
          <IconButton
            h="30px"
            onClick={handleOnSubmit}
            minW={{ base: "50px", xmd: "100px" }}
            alignSelf="flex-end"
            bg="{colors.primaryBg/30}"
            borderRadius={14}
            transition="none"
            variant={"plain"}
            aria-label="Send Message Icon">
            <Icon size="md">
              <SendIcon color="{colors.primaryText}" />
            </Icon>
          </IconButton>
          {/* <IconButton
            h="30px"
            onClick={handleOnSubmit}
            minW={{ base: "50px", xmd: "100px" }}
            alignSelf="flex-end"
            bg="{colors.primaryBg/30}"
            borderRadius={14}
            transition="none"
            variant={"plain"}
            aria-label="Send Message Icon">
            <Icon size="md">
              <SendIcon color="{colors.primaryText}" />
            </Icon>
          </IconButton> */}
        </HStack>
      </Flex>
    </Box>
  );
}

export default MessageInput;
