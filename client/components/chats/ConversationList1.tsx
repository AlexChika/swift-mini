import { hideScrollbar } from "@/chakra/theme";
import { Alert, Box, Center, Spinner, Stack } from "@chakra-ui/react";
import { Session } from "next-auth";
import conversationOperations from "@/graphql/operations/conversations";
import { useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SkeletonLoader from "@/components/general/SkeletonLoader";
import useDynamicHeight from "@/lib/hooks/useDynamicHeight";
import ConversationItem1 from "./ConversationItem1";

type Props = {
  session: Session;
};

function ConversationList1({ session }: Props) {
  const {
    data,
    error: convError,
    loading: convLoading,
    subscribeToMore
  } = useQuery<chatsData>(conversationOperations.Queries.getChats);

  function subToNewConversation() {
    subscribeToMore({
      document: conversationOperations.Subscriptions.chatCreated,
      updateQuery: (prev, update: ChatUpdate) => {
        if (!update.subscriptionData.data) return prev;

        console.log({ update, prev });

        const newChat = update.subscriptionData.data.chatCreated;

        return Object.assign({}, prev, {
          getChats: [...prev.getChats, newChat]
        });
      }
    });
  }

  async function chatsOnClick(chatId: string) {
    // router.replace(`/?chatId=${conversationId}`);
    router.push(chatId);
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
  useDynamicHeight(BoxRef, 80);

  // console.log({ data });
  // return "";

  return (
    <Box
      ref={BoxRef}
      css={{ ...hideScrollbar, overflowY: "auto" }}
      w="100%"
      pb="10px">
      {/* loading */}
      {convLoading && (
        <Stack h="100%" gap={3}>
          <SkeletonLoader duration={1} no={14} height="calc(100% / 14)" />
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
          <Alert.Root
            bg="transparent"
            color="whiteAlpha.500"
            status="error"
            flexDirection="column"
            textAlign="center">
            <Alert.Indicator color="whiteAlpha.500" boxSize="40px" mr={0} />
            <Alert.Content>
              <Alert.Title mt={4} fontSize="sm">
                Something Went Wrong!
              </Alert.Title>

              <Alert.Description fontSize="small" maxWidth="sm">
                Please Refresh The browser
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        </Center>
      )}

      {/* data */}
      {data && (
        <Stack>
          {[...data.getChats].reverse().map((c) => {
            return (
              <ConversationItem1
                key={c.id}
                {...{
                  chatsOnClick,
                  chat: c,
                  session
                }}
              />
            );
          })}
        </Stack>
      )}
    </Box>
  );
}

export default ConversationList1;
