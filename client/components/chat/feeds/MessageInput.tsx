import messageOperations from "@/graphql/operations/messages";
import { SendIcon } from "@/lib/icons";
import { useMutation } from "@apollo/client";
import { Flex, IconButton, Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRef } from "react";

type Props = {
  session: Session;
  id: string; //conversationID
};

function MessageInput(props: Props) {
  const { id, session } = props;

  // send message mutation
  const [send] = useMutation<sendMessageData, sendMessageVariable>(
    messageOperations.Mutations.sendMessage
  );

  // ref
  const InputBox = useRef<null | HTMLDivElement>(null);

  function onKeyDownHandler(e: React.KeyboardEvent) {
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
    // console.log("id from send message", id);
    const { data } = await send({
      variables: { body: str, conversationId: id, senderId: session.user.id },
    });

    // console.log({ data });

    try {
    } catch (error: any) {
      console.log("onMessageError", error);
    }
  }

  //  async function onSubmit() {
  //    const username = Username.trim().toLowerCase();
  //    if (err || !username) return;

  //    toast.loading("loading", {
  //      id: "createusername",
  //    });

  //    try {
  //      const { data } = await createUsername({ variables: { username } });

  //      if (!data?.createUsername) {
  //        throw new Error("Operation failed");
  //      }

  //      if (!data?.createUsername.success) {
  //        const { error } = data.createUsername;
  //        throw new Error(error);
  //      }

  //      toast.success("Username created successfully", {
  //        id: "createusername",
  //      });
  //      reloadSession();
  //    } catch (error) {
  //      const e = error as unknown as { message: string };
  //      toast.error(e?.message || "Unknown error occured", {
  //        id: "createusername",
  //      });
  //    }
  //  }

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
