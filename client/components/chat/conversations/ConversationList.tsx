import { hideScrollbar } from "@/chakra/theme";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import conversationOperations from "@/graphql/operations/conversations";
import { useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ConversationItem from "./ConversationItem";
import SkeletonLoader from "@/components/general/SkeletonLoader";
import useDynamicHeight from "@/lib/hooks/useDynamicHeight";

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

  const router = useRouter();
  const runEffect = useRef(true);
  useEffect(() => {
    // effect is forced to run once rather than twice
    if (!runEffect.current) return;

    runEffect.current = false;
    subToNewConversation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const BoxRef = useRef<null | HTMLDivElement>(null);
  useDynamicHeight(BoxRef, 70);

  return (
    <Box
      ref={BoxRef}
      sx={{ ...hideScrollbar, overflowY: "auto" }}
      w="100%"
      pb="10px"
    >
      {/* loading */}
      {convLoading && (
        <Stack h="100%" gap={3}>
          <SkeletonLoader duration={1} no={10} height="calc(100% / 10)" />
        </Stack>
        // <Center h="100%">
        //   <Box>
        //     <Spinner />
        //   </Box>
        // </Center>
      )}

      {/* error */}
      {convError && (
        <Center h="100%">
          <Alert
            bg="transparent"
            color="whiteAlpha.500"
            status="error"
            flexDirection="column"
            textAlign="center"
          >
            <AlertIcon color="whiteAlpha.500" boxSize="40px" mr={0} />
            <AlertTitle mt={4} fontSize="sm">
              Something Went Wrong!
            </AlertTitle>
            <AlertDescription fontSize="small" maxWidth="sm">
              Please Refresh The browser
            </AlertDescription>
          </Alert>
        </Center>
      )}

      {/* data */}
      {data && (
        <Stack>
          {[...data.conversations].reverse().map((c) => {
            return (
              <ConversationItem
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
      )}
    </Box>
  );
}

export default ConversationList;
