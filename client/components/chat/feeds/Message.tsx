import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { dateFormatter } from "@/lib";
import React from "react";

type Props = {
  message: Message;
  sentByMe: boolean;
  usersFirstMessageAfterOthers: boolean; // a bolean indicating if a message is the first message a user sends immediately after another user
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
      {/* other users image */}
      {usersFirstMessageAfterOthers && !sentByMe && (
        <Avatar
          mr={2}
          size="2xs"
          name={sender.username}
          bg="whiteAlpha.900"
          color="blackAlpha.900"
          src={sender.image}
        />
      )}

      {/* message body */}
      <Flex
        ml={!usersFirstMessageAfterOthers && !sentByMe ? 6 : ""}
        mr={!usersFirstMessageAfterOthers && sentByMe ? 6 : ""}
        flexDir="column"
      >
        {/* username */}
        {usersFirstMessageAfterOthers && !sentByMe && (
          <Text
            fontSize={{ base: "9px", xmd: "11px" }}
            minW="100%"
            color="#acacac"
            textTransform="capitalize"
          >
            {sender.username}
          </Text>
        )}

        {/* message and time container */}
        <Box
          w="full"
          borderRadius="6px"
          color={sentByMe ? "black" : "black"}
          _hover={{ opacity: sentByMe ? "0.8" : "0.7" }}
          bg={sentByMe ? "whiteAlpha.900" : "teal.50"}
          pt={1}
          pb={2}
          px={3}
        >
          {/* message body */}
          <Text
            fontSize={{ base: "14px", xmd: "15px" }}
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
      </Flex>

      {/* current usere image */}
      {usersFirstMessageAfterOthers && sentByMe && (
        <Avatar
          ml={2}
          size="2xs"
          name={sender.username}
          bg="whiteAlpha.800"
          color="blackAlpha.900"
          src={sender.image}
        />
      )}
    </Flex>
  );
}

export default Message;
