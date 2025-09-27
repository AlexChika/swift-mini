/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef } from "react";
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

  // ref
  const InputBox = useRef<HTMLDivElement>(null);

  // the below also did not work
  // useMobileInputScrollFix(InputBox);

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
    InputBox.current.focus();

    const textString = InputBox.current.textContent?.trim();
    if (!textString) return;

    InputBox.current.innerHTML = "";
    sendMessage(textString);
  }

  // this solution is buggy. both input and page scroll same time, if page is short and input content is long, scroll gets very stuck

  /* --------------------- failed -------------------- */
  // useEffect(() => {
  //   if (!InputBox.current) return;
  //   const input = InputBox.current;

  //   function onTouchStart(e: TouchEvent) {
  //     if (!InputBox.current) return;

  //     const input = InputBox.current;
  //     const { scrollTop } = input;

  //     // Store initial touch position
  //     const startY = e.touches[0].clientY;
  //     (input as any)._startY = startY;
  //     (input as any)._startScrollTop = scrollTop;
  //   }

  //   function onTouchMove(e: TouchEvent) {
  //     if (!InputBox.current) return;

  //     const input = InputBox.current;
  //     const { scrollHeight, clientHeight } = input;
  //     const currentY = e.touches[0].clientY;
  //     const startY = (input as any)._startY;
  //     const deltaY = startY - currentY;

  //     // Check if input is scrollable
  //     const isScrollable = scrollHeight > clientHeight;

  //     if (isScrollable) {
  //       const newScrollTop = (input as any)._startScrollTop + deltaY;

  //       // If we're trying to scroll within the input bounds
  //       if (newScrollTop >= 0 && newScrollTop <= scrollHeight - clientHeight) {
  //         e.preventDefault();
  //         e.stopPropagation();

  //         // Smooth scroll using scrollTo
  //         input.scrollTo({
  //           top: newScrollTop,
  //           behavior: "smooth"
  //         });
  //       }
  //     }
  //   }

  //   input.addEventListener("touchstart", onTouchStart);
  //   input.addEventListener("touchmove", onTouchMove);

  //   return () => {
  //     input.removeEventListener("touchstart", onTouchStart);
  //     input.removeEventListener("touchmove", onTouchMove);
  //   };
  // }, [InputBox]);

  //TODO: use rems and ems
  return (
    <Box
      bg="{colors.secondaryBg}"
      px={{ base: 3, xmd: 6 }}
      py={3}
      w="100%"
      borderTop="1px solid {colors.appBorder}"
      borderBottomRadius="inherit">
      <Flex
        w="100%"
        maxW="100%"
        gap={{ base: 2, xmd: 3 }}
        justifyContent="space-between">
        <Box
          pos="relative"
          zIndex={9999}
          id="swft-message-box"
          ref={InputBox}
          onKeyDown={onKeyDownHandler}
          css={{
            overflowY: "auto",
            touchAction: "pan-y",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch"
          }}
          bg="{colors.primaryBg/30}"
          color="{colors.primaryText}"
          maxH="200px"
          minH="33px"
          py={1}
          px={3}
          maxW={{ base: "calc(100% - 50px)", xmd: "calc(100% - 100px)" }}
          w="100%"
          fontSize={20}
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
        </HStack>
      </Flex>
    </Box>
  );
}

export default MessageInput;
