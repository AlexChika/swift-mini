import { Alert, Box, Center, Spinner, Stack } from "@chakra-ui/react";
import MessageInput from "./MessageInput";
import { Session } from "next-auth";
import { hideScrollbar } from "@/chakra/theme";
import Message from "./Message";
import { useQuery } from "@apollo/client";
import messageOperations from "@/graphql/operations/messages";
import React, { useEffect, useRef, useState } from "react";
import DateDemacator, { renderObjectForDateDemacator } from "./DateDemacator";
import { ColorMode } from "@/lib/helpers";

type Props = {
  session: Session;
  id: string; //conversationID
};

const bgStrs = [
  {
    name: "one",
    url: "linear-gradient(180deg,rgba(0, 0, 0, 0.622) 0%,rgba(0, 0, 0, 0.783) 100%),url('https://www.toptal.com/designers/subtlepatterns/uploads/tactile_noise.png')",
  },
  {
    name: "two",
    url: "linear-gradient(180deg,rgba(0, 0, 0, 0.682) 0%,rgba(0, 0, 0, 0.683) 100%),url('https://www.toptal.com/designers/subtlepatterns/uploads/carbon_fibre.png')",
  },

  {
    name: "three",
    url: "linear-gradient(180deg,rgba(6, 6, 6, 0.892) 0%,rgba(0, 0, 0, 0.87) 100%),url('https://www.toptal.com/designers/subtlepatterns/uploads/carbon_fibre.png')",
  },
  {
    name: "four",
    url: "linear-gradient(180deg,rgba(0, 0, 0, 0.72) 0%,rgba(0, 0, 0, 0.67) 100%),url('https://www.toptal.com/designers/subtlepatterns/uploads/dark-grey-terrazzo.png')",
  },
  {
    name: "five",
    url: "linear-gradient(180deg,rgba(0, 0, 0, 0.52) 0%,rgba(0, 0, 0, 0.47) 100%),url('https://www.toptal.com/designers/subtlepatterns/uploads/beanstalk-dark.png')",
  },
  {
    name: "six",
    url: "linear-gradient(180deg,rgba(0, 0, 0, 0.62) 0%,rgba(0, 0, 0, 0.67) 100%),url('https://www.toptal.com/designers/subtlepatterns/uploads/beanstalk-dark.png')",
  },
];

//  Modularize Projects later
function Messages({ session, id }: Props) {
  const [bg, setBg] = useState(0);

  const { theme } = ColorMode.useTheme();
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
      justifyContent="flex-end"
      h="calc(100% - 60px)"
      overflowY="auto"
      position="relative"
      zIndex={6}
      bgPos="center"
      bgImage={
        theme === "light"
          ? "linear-gradient(rgba(255, 255, 255, 0.274), rgba(255, 255, 255, 0.33)), url('https://www.toptal.com/designers/subtlepatterns/uploads/email-pattern.png')"
          : bgStrs[bg].url
      }
      css={{
        "& *": {
          zIndex: 2,
        },
      }}
      borderBottomRadius="inherit"
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
        <button
          onClick={() => setBg((prev) => (prev + 1) % bgStrs.length)}
          style={{ color: "white" }}
        >
          {bgStrs[bg].name}
        </button>
      </Stack>

      <MessageInput {...{ session, id }} />
    </Stack>
  );
}

export default Messages;
