import ChatItem from "./ChatItem";
import { Session } from "next-auth";
import { useCallback, useEffect, useRef } from "react";
import { hideScrollbar } from "@/chakra/theme";
import { useQuery } from "@apollo/client/react";
import chatOps from "@/graphql/operations/chat.ops";
import useDynamicHeight from "@/lib/hooks/useDynamicHeight";
import { Alert, Box, Center, Stack } from "@chakra-ui/react";
import SkeletonLoader from "@/components/general/SkeletonLoader";
import { useParams } from "next/navigation";

type Props = {
  session: Session;
  openChat: (chatId: string) => Promise<void>;
};

function ChatList({ session, openChat }: Props) {
  const chatId = useParams().chatId;

  const {
    data,
    error: convError,
    loading: convLoading,
    subscribeToMore
  } = useQuery<chatsData>(chatOps.Queries.getChats);

  function subToNewConversation() {
    subscribeToMore({
      document: chatOps.Subscriptions.chatCreated,
      updateQuery: (prev, update: ChatUpdate) => {
        if (!update.subscriptionData.data) return prev as chatsData;

        const newChat = update.subscriptionData.data.chatCreated;

        return Object.assign({}, prev, {
          getChats: [newChat, ...(prev.getChats as ChatLean[])]
        }) as chatsData;
      }
    });
  }

  const runEffect = useRef(true);
  useEffect(() => {
    // effect is forced to run once rather than twice
    if (!runEffect.current) return;

    runEffect.current = false;
    subToNewConversation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const BoxRef = useRef<null | HTMLDivElement>(null);
  useDynamicHeight({
    ref: BoxRef,
    sub: () => {
      // 80 for nav, 60 for creatChat btn, 60 for footer (small screen only)
      return window.matchMedia("(min-width: 48rem)").matches ? 140 : 200;
    },
    useRems: true
  });

  return (
    <Box
      css={{
        "&[data-current-swft-chat] [data-swft-chat]": {
          cursor: "pointer",
          backgroundColor: "transparent",
          transition: "background-color 0.2s ease",
          border: "1px solid transparent",
          borderBottom: "1px solid {colors.appBorder}"
        },

        [`&[data-current-swft-chat="${chatId}"] [data-swft-chat="${chatId}"]`]:
          {
            backgroundColor: "{colors.primaryBg}/30",
            border: "1px solid {colors.appBorder}",
            borderRadius: "4px"
          },

        ...hideScrollbar,
        overflowY: "auto"
      }}
      data-current-swft-chat={chatId}
      ref={BoxRef}
      w="100%"
      pb={2.5}>
      {/* loading */}
      {convLoading && (
        <Stack h="100%" gap="12px">
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
          {[...data.getChats].map((c) => {
            return (
              <ChatItem
                key={c.id}
                {...{
                  openChat,
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

export default ChatList;
