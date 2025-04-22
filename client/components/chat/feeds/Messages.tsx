import {
  Alert,
  Box,
  Center,
  Flex,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import MessageInput from "./MessageInput";
import { Session } from "next-auth";
import { hideScrollbar } from "@/chakra/theme";
import Message from "./Message";
import { useQuery } from "@apollo/client";
import messageOperations from "@/graphql/operations/messages";
import React, { useEffect, useRef } from "react";
import DateDemacator, { renderObjectForDateDemacator } from "./DateDemacator";

type Props = {
  session: Session;
  id: string; //conversationID
};

function Messages({ session, id }: Props) {
  const { data, error, loading, subscribeToMore } = useQuery<
    MessagesData,
    { conversationId: string }
  >(messageOperations.Queries.messages, {
    variables: { conversationId: id },
  });

  function subToNewMessage(id: string) {
    subscribeToMore({
      variables: { conversationId: id },
      document: messageOperations.Subscriptions.messageSent,
      updateQuery: (prev, update: MessageUpdate) => {
        if (!update.subscriptionData.data) return prev;

        const newMessage = update.subscriptionData.data.messageSent;

        console.log(new Date().getSeconds(), "sub func 3");
        return Object.assign({}, prev, {
          messages: [...prev.messages, newMessage],
        });
      },
    });
  }

  const subscribedCoversationIds = useRef<string[]>([]);
  useEffect(() => {
    // if a conversation has been subscribed... we return
    if (subscribedCoversationIds.current.find((ids) => ids === id)) return;
    subscribedCoversationIds.current.push(id);

    subToNewMessage(id); // sub to conversation

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const BoxRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    if (BoxRef.current) {
      BoxRef.current.scrollTo(0, Number(BoxRef.current.scrollHeight));
    }
  }, [data]);

  const renderObj = renderObjectForDateDemacator(data?.messages || []);

  return (
    // calc(100% - 60px) => 60px accounts for the MessageHeader
    <Stack
      justifyContent="space-between"
      h="calc(100% - 60px)"
      overflowY="auto"
    >
      <Stack
        gap="3px"
        ref={BoxRef}
        py="10px"
        css={{ ...hideScrollbar }}
        overflowY="auto"
      >
        {/* loading */}
        {loading && (
          <Center h="100%">
            <Box>
              <Spinner />
            </Box>
          </Center>
        )}

        {/* error */}
        {error && (
          <Center h="100%">
            <Alert.Root
              bg="transparent"
              color="whiteAlpha.500"
              status="error"
              flexDirection="column"
              textAlign="center"
            >
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
        {data &&
          data.messages.map((m, i) => {
            return (
              <React.Fragment key={i}>
                <DateDemacator key={m.id} demacatorText={renderObj[m.id]} />
                <Message
                  usersFirstMessageAfterOthers={(() => {
                    const prevMessage = data.messages[i - 1];
                    if (!prevMessage) return true;

                    if (m.sender.id === prevMessage.sender.id) return false;
                    return true;
                  })()}
                  message={m}
                  sentByMe={session.user.id === m.sender.id}
                  key={m.id + i}
                />
              </React.Fragment>
            );
          })}
      </Stack>

      <MessageInput {...{ session, id }} />
    </Stack>
  );
}

export default Messages;
