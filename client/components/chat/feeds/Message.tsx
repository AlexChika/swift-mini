import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { dateFormatter } from "@/lib";
import React from "react";

type Props = {
  message: Message;
  sentByMe: boolean;
  usersFirstMessageAfterOthers: boolean;
};

function Message(props: Props) {
  const { message, sentByMe, usersFirstMessageAfterOthers } = props;
  const { createdAt, body, sender } = message;

  return (
    <Flex
      mx={{ base: 3, xmd: 12 }}
      alignSelf={sentByMe ? "flex-end" : "flex-start"}
      maxWidth={{ base: "70%", xmd: "60%", xl: "55%" }}
    >
      {/* other users */}
      {usersFirstMessageAfterOthers && !sentByMe && (
        <Avatar
          mr={2}
          size="2xs"
          name={sender.username}
          bg={sentByMe ? "whiteAlpha.800" : "blackAlpha.600"}
          color={sentByMe ? "blackAlpha.800" : "whiteAlpha.600"}
          src={sender.image}
        />
      )}

      <Box
        borderRadius="8px"
        color={sentByMe ? "black" : "white"}
        _hover={{ opacity: sentByMe ? "0.8" : "0.7" }}
        bg={sentByMe ? "whiteAlpha.800" : "blackAlpha.600"}
        pt={1}
        pb={2}
        px={3}
        ml={!usersFirstMessageAfterOthers && !sentByMe ? 6 : ""}
        mr={!usersFirstMessageAfterOthers && sentByMe ? 6 : ""}
      >
        {/* message body */}
        <Text
          fontSize={{ base: "13px" }}
          lineHeight="20px"
          fontWeight={500}
          sx={{
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {body}
        </Text>

        {/* message time */}
        <Text
          pt={0.5}
          pl={9}
          textAlign={"right"}
          lineHeight={0}
          fontSize="9px"
          minW="100%"
          color={sentByMe ? "gray" : "#595959"}
        >
          {dateFormatter(createdAt).time}
        </Text>
      </Box>

      {/* current useres */}
      {usersFirstMessageAfterOthers && sentByMe && (
        <Avatar
          ml={2}
          size="2xs"
          name={sender.username}
          bg={sentByMe ? "whiteAlpha.800" : "blackAlpha.600"}
          color={sentByMe ? "blackAlpha.800" : "whiteAlpha.600"}
          src={sender.image}
        />
      )}
    </Flex>
  );
}

export default Message;
