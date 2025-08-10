import { Avatar, Flex, Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useSearchParams } from "next/navigation";
import { formatUserNames, dateFormatter } from "@/lib";

type Props = {
  session: Session;
  conversation: Conversation;
  conversationOnClick: (conversationId: string) => Promise<void>;
};

function ConversationItem(props: Props) {
  const { conversation, conversationOnClick, session } = props;
  const { id, latestMessage, participants, latestMessageId, updatedAt } =
    conversation;

  const search = useSearchParams();
  const conversationId = search.get("conversationId");

  // variable depends on stateful values,
  const isSelected = id === conversationId;
  const { getTimePassed } = dateFormatter(updatedAt);
  const { usernames, avatar, name } = formatUserNames(
    participants,
    session.user.id
  );

  return (
    <Box
      title={usernames}
      cursor="pointer"
      onClick={() => conversationOnClick(id)}
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
              {latestMessage?.body}
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

export default ConversationItem;
