import { hideScrollbar } from "@/chakra/theme";
import { Box, Stack } from "@chakra-ui/react";
import { Session } from "next-auth";
import conversationOperations from "@/graphql/operations/conversations";
import { useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Conversation from "./ConversationItem";

type Props = {
  session: Session;
};

function ConversationList({ session }: Props) {
  const {
    data,
    error: convError,
    loading: convLoading,
    subscribeToMore,
  } = useQuery<conversationsData>(conversationOperations.Queries.conversations);

  const router = useRouter();
  const runEffect = useRef(true);

  function subToNewConversation() {
    subscribeToMore({
      document: conversationOperations.Subscriptions.conversationCreated,
      updateQuery: (prev, update: ConversationUpdate) => {
        if (!update.subscriptionData.data) return prev;

        const newConversation =
          update.subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [...prev.conversations, newConversation],
        });
      },
    });
  }

  async function conversationOnClick(conversationId: string) {
    router.replace(`/?conversationId=${conversationId}`);
    // mark Convo as read
  }

  useEffect(() => {
    if (!runEffect.current) return;

    runEffect.current = false;
    subToNewConversation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // effect is forced to run once rather than twice

  return (
    <Box
      sx={{ ...hideScrollbar, padding: "10px 0px" }}
      overflowY="auto"
      w="100%"
      h="calc(100vh - 90px)"
    >
      <Stack>
        {[...(data?.conversations || [])].reverse().map((c) => {
          return (
            <Conversation
              key={c.id}
              {...{
                conversationOnClick,
                conversation: c,
                session,
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

export default ConversationList;
