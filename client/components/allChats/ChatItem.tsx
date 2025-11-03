import { memo } from "react";
import { Session } from "next-auth";
import { dateFormatter, formatUserNames2 } from "@/lib";
import { Avatar, Flex, Box, Text } from "@chakra-ui/react";

type Props = {
  session: Session;
  chat: ChatLean;
  openChat: (chatId: string) => Promise<void>;
};

function ChatItem(props: Props) {
  const { chat, openChat, session } = props;
  const { id, chat_latestMessage, updatedAt } = chat;

  const { getTimePassed } = dateFormatter(updatedAt);

  const { usernames, avatar, name } = formatUserNames2(chat, session.user.id);

  return (
    <Box
      px={2}
      py={2}
      _hover={{
        opacity: 0.6
      }}
      title={usernames}
      color="primaryText"
      data-swift-chat={id}
      cursor="pointer"
      bg="transparent"
      transition="background-color 0.2s ease"
      onClick={() => openChat(id)}
      border="1px solid transparent"
      borderBottom="1px solid {colors.primaryBg/15}">
      <Flex align="center" gap={2} justify="space-between">
        {/* avatar,  usernames, latest message */}
        <Flex truncate align="center" gap={2}>
          {/* user profile pic */}
          <Avatar.Root size="sm">
            <Avatar.Fallback name={name} />
            <Avatar.Image background="Highlight" src={avatar} />
          </Avatar.Root>

          {/* user names & latest message */}
          <Flex flexDir="column">
            {/* usernames */}
            <Text truncate fontSize={15}>
              {usernames}
            </Text>

            {/* latest messages */}
            <Text
              // opacity="90%"
              textOverflow="ellipsis"
              lineClamp={1}
              fontSize="11px">
              {chat_latestMessage?.body}
            </Text>
          </Flex>
        </Flex>

        {/* time passed */}
        <Text
          minW="80px"
          fontSize={11}
          opacity="70%"
          alignSelf="flex-end"
          textAlign="right">
          {getTimePassed()}
        </Text>
      </Flex>
    </Box>
  );
}

export default memo(ChatItem);
