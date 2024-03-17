import { hideScrollbar } from "@/chakra/theme";
import { Box, Stack, StackItem, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import conversationOperations from "@/graphql/operations/conversations";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

type Props = {
  session: Session;
};

function ConversationList({ session }: Props) {
  const {
    data: convdata,
    error: convError,
    loading: convLoading,
    subscribeToMore,
  } = useQuery<conversationsData>(conversationOperations.Queries.conversations);

  function subToNewConversation() {
    subscribeToMore({
      document: conversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: { subscriptionData: { data: { conversationCreated: Conversation } } }
      ) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;
        console.log({ newConversation });
        console.log({ prev });

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  }

  useEffect(() => {
    // subscribe to new conversations on mount
    subToNewConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{ ...hideScrollbar, padding: "10px 0px" }}
      overflowY="auto"
      w="100%"
      h="calc(100vh - 90px)"
    >
      <Stack>
        {convdata?.conversations.map((c, i) => {
          return <Conversation key={i} conversation={c} />;
        })}
      </Stack>
    </Box>
  );
}

type Prop = {
  conversation: Conversation;
};
function Conversation(prop: Prop) {
  const { id, latestMessage, participants, latestMessageId } =
    prop.conversation;

  return (
    <StackItem p={3} _hover={{ bg: "whiteAlpha.200" }}>
      {id}
    </StackItem>
  );
}

export default ConversationList;
