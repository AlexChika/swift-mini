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
import MessageInput from "./MessageInput";
import { Session } from "next-auth";
import { hideScrollbar } from "@/chakra/theme";
import Message from "./Message";
import { useQuery } from "@apollo/client";
import messageOperations from "@/graphql/operations/messages";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

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

        return Object.assign({}, prev, {
          messages: [...prev.messages, newMessage],
        });
      },
    });
  }

  const listIds = useRef<string[]>([]);

  useEffect(() => {
    // effect is forced to run once rather than twice
    // if (!runEffect.current) return;

    if (listIds.current.find((ids) => ids === id)) return;
    listIds.current.push(id);

    // runEffect.current = false;
    subToNewMessage(id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    // calc(100% - 65px) => 65px accounts for the MessageHeader
    <Stack h="calc(100% - 60px)" overflowY="auto">
      <Box
        h="100%"
        bg="blackAlpha.100"
        pb="10px"
        sx={{ ...hideScrollbar }}
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
        {data &&
          data.messages.map((m, i) => {
            return <Message key={i} {...{ body: m.body }} />;
          })}
      </Box>

      <MessageInput {...{ session, id }} />
    </Stack>
  );
}

export default Messages;
