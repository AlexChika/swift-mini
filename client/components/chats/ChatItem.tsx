import { Avatar, Flex, Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useParams } from "next/navigation";
import { dateFormatter, formatUserNames2 } from "@/lib";

type Props = {
  session: Session;
  chat: ChatLean;
  chatsOnClick: (chatId: string) => Promise<void>;
};

function ChatItem(props: Props) {
  const { chat, chatsOnClick, session } = props;
  const { id, chat_latestMessage, updatedAt } = chat;

  const chatId = useParams().chatId;

  // variable depends on stateful values,
  const isSelected = id === chatId;
  const { getTimePassed } = dateFormatter(updatedAt);

  const { usernames, avatar, name } = formatUserNames2(chat, session.user.id);

  return (
    <Box
      title={usernames}
      cursor="pointer"
      onClick={() => chatsOnClick(id)}
      px={2}
      py={2}
      bg={isSelected ? "{colors.primaryBg}/40" : "transparent"}
      _hover={{
        opacity: 0.6
      }}
      borderRadius={isSelected ? "4px" : undefined}
      border={`1px solid ${isSelected ? "{colors.appBorder}" : "transparent"}`}
      borderBottom="1px solid {colors.appBorder}"
      color="primaryText">
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

// .....

export default ChatItem;
