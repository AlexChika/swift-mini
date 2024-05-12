import { Box, Flex, Text } from "@chakra-ui/react";
import { dateFormatter } from "@/lib";
import React from "react";

type Props = {
  message: Message;
  sentByMe: boolean;
};

function Message(props: Props) {
  const { message, sentByMe } = props;
  const { createdAt, body } = message;

  return (
    <Flex
      gap={1}
      mx={{ base: 3, xmd: 12 }}
      alignSelf={sentByMe ? "flex-end" : "flex-start"}
      maxWidth={{ base: "70%", xmd: "60%", xl: "55%" }}
      // w="full"
      // border="2px solid green"
    >
      <Box
        borderRadius={sentByMe ? "8px" : "12px"}
        color={sentByMe ? "black" : "white"}
        _hover={{ opacity: sentByMe ? "0.8" : "0.7" }}
        bg={sentByMe ? "whiteAlpha.800" : "blackAlpha.600"}
        pt={1}
        pb={2}
        px={3}
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
          // border="2px solid red"
          color={sentByMe ? "gray" : "#404040"}
        >
          {dateFormatter(createdAt).getTimePassed(7)}
        </Text>
      </Box>
    </Flex>
  );
}

export default Message;
