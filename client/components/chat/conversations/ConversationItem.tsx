import { Avatar, Flex, StackItem, Text } from "@chakra-ui/react";
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
    <StackItem
      title={usernames}
      cursor="pointer"
      onClick={() => conversationOnClick(id)}
      px={2}
      py={2}
      borderBottom="2px"
      borderBottomColor="blackAlpha.300"
      bg={isSelected ? "whiteAlpha.200" : ""}
      _hover={{ bg: "whiteAlpha.50" }}
    >
      <Flex align="center" gap={2} justify="space-between">
        {/* avatar,  usernames, latest message */}
        <Flex isTruncated align="center" gap={2}>
          {/* user profile pic */}
          <Avatar background="Highlight" src={avatar} name={name} size={"sm"} />

          {/* user names & latest message */}
          <Flex flexDir="column">
            {/* usernames */}
            <Text isTruncated fontSize={15}>
              {usernames}
            </Text>

            {/* latest messages */}
            <Text
              opacity="70%"
              textOverflow="ellipsis"
              noOfLines={1}
              fontSize="11px"
            >
              {latestMessage?.body}
            </Text>
          </Flex>
        </Flex>

        {/* time passed */}
        <Text
          minW="80px"
          fontSize={11}
          opacity="50%"
          alignSelf="flex-end"
          textAlign="right"
        >
          {getTimePassed()}
        </Text>
      </Flex>
    </StackItem>
  );
}

// .....

export default ConversationItem;
