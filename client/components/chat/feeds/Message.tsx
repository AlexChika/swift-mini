import { Avatar, Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { dateFormatter } from "@/lib";

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
      mt={usersFirstMessageAfterOthers ? "5px" : ""}
      mx={{ base: 3, xmd: 5 }}
      alignSelf={sentByMe ? "flex-end" : "flex-start"}
      maxWidth={{ base: "90%", xmd: "75%" }}
    >
      {/* other users image */}
      {usersFirstMessageAfterOthers && !sentByMe && (
        <Avatar.Root
          mr={2}
          size="2xs"
          bg="{colors.otherUserTextBg}"
          color="{colors.primaryText}"
        >
          <Avatar.Fallback name={sender.username} />
          <Avatar.Image src={sender.image} />
        </Avatar.Root>
      )}

      {/* use this as group message ui later */}
      <VStack
        ml={!usersFirstMessageAfterOthers && !sentByMe ? 8 : ""}
        mr={!usersFirstMessageAfterOthers && sentByMe ? 8 : ""}
        border="1px solid {colors.messageBorder}"
        color="{colors.primaryText}"
        bg={sentByMe ? "{colors.userTextBg}" : "{colors.otherUserTextBg}"}
        gap={0}
        borderRadius={"12px"}
      >
        {usersFirstMessageAfterOthers && (
          <>
            <HStack
              justifyContent="space-between"
              padding="13px 10px 0px 10px"
              marginBottom="7px"
              w="100%"
              color="{colors.usernameColor}"
            >
              {/* user name */}
              <Text
                fontSize={{ base: "12px" }}
                textTransform="capitalize"
                lineHeight={0}
              >
                {sender.username}
              </Text>

              {/* time */}
              <Text textAlign={"right"} lineHeight={0} fontSize="10px">
                {dateFormatter(createdAt).time}
              </Text>
            </HStack>

            <Text
              fontSize={{ base: "14px" }}
              lineHeight="20px"
              fontWeight={500}
              css={{
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
              alignSelf="flex-start"
              padding={
                usersFirstMessageAfterOthers ? "0px 10px 5px 10px" : "5px 10px"
              }
            >
              {body}
            </Text>
          </>
        )}

        {!usersFirstMessageAfterOthers && (
          <Box padding="5px 10px">
            <Text
              display="inline"
              fontSize={{ base: "14px" }}
              lineHeight="20px"
              fontWeight={500}
              css={{
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
              alignSelf="flex-start"
            >
              {body}
            </Text>
            {"  "}
            <Text
              display="inline"
              whiteSpace="nowrap"
              textAlign={"right"}
              lineHeight={0}
              fontSize="10px"
              color="{colors.usernameColor}"
            >
              {dateFormatter(createdAt).time}
            </Text>
          </Box>
        )}
      </VStack>

      {/* current usere image */}
      {usersFirstMessageAfterOthers && sentByMe && (
        <Avatar.Root
          ml={2}
          size="2xs"
          bg="{colors.userTextBg}"
          color="{colors.primaryText}"
        >
          <Avatar.Fallback name={sender.username} />
          <Avatar.Image src={sender.image} />
        </Avatar.Root>
      )}
    </Flex>
  );
}

export default Message;
