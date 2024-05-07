import { Box, Text } from "@chakra-ui/react";
import React from "react";

type Props = {
  body: string;
  createdAt?: string;
};

function Message(props: Props) {
  const { body } = props;
  return (
    <Box m={{ base: 3, xmd: 4 }}>
      <Text>{body}</Text>
    </Box>
  );
}

export default Message;
