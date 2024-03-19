import { Avatar, Flex, StackItem, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useSearchParams } from "next/navigation";
import { formatUserNames, dateFormatter } from "@/lib";

type Props = {
  session: Session;
  conversation: Conversation;
  conversationOnClick: (conversationId: string) => Promise<void>;
};

function Conversation(props: Props) {
  const { conversation, conversationOnClick, session } = props;
  const { id, latestMessage, participants, latestMessageId, updatedAt } =
    conversation;

  const search = useSearchParams();
  const conversationId = search.get("conversationId");

  // variable depends on stateful values,
  const isSelected = id === conversationId;
  const { time } = dateFormatter(updatedAt);
  const { usernames, avatar, name } = formatUserNames(
    participants,
    session.user.id
  );

  return (
    <StackItem
      title={usernames}
      cursor="pointer"
      onClick={() => conversationOnClick(id)}
      px={3}
      py={2}
      borderBottom="2px"
      borderBottomColor="whiteAlpha.50"
      bg={isSelected ? "whiteAlpha.200" : ""}
      _hover={{ bg: "whiteAlpha.200" }}
    >
      <Flex align="center" gap={2} justify="space-between">
        <Flex isTruncated align="center" gap={2}>
          <Avatar
            background="Highlight"
            src={avatar}
            name={avatar ? "" : name}
            size={"sm"}
          />

          <Text isTruncated fontSize={15}>
            {usernames}
          </Text>
        </Flex>

        <Text minW="52px" fontSize={11} opacity="50%">
          {time}
        </Text>
      </Flex>
    </StackItem>
  );
}

// .....

export default Conversation;
