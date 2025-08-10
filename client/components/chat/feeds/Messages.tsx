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
    name: "One",
    url: "linear-gradient(#151515, #151515)"
  },

  {
    name: "Two",
    url: "linear-gradient(180deg,rgba(21, 21, 21, 0.45) 0%,rgba(21, 21, 21, 0.451) 100%),url('https://www.toptal.com/designers/subtlepatterns/uploads/diagmonds.png')"
  },

  {
    name: "Three",
    url: "linear-gradient(180deg,rgba(21, 21, 21, 0.69) 0%,rgba(21, 21, 21, 0.67) 100%),url('https://www.toptal.com/designers/subtlepatterns/uploads/carbon_fibre.png')"
  },

  {
    name: "Four",
    url: "linear-gradient(180deg,rgba(21, 21, 21, 0.20) 0%,rgba(21, 21, 21, 0.25) 100%),url('https://www.toptal.com/designers/subtlepatterns/uploads/triangles.png')"
  },

  {
    name: "Five",
    url: "linear-gradient(180deg,rgba(21, 21, 21, 0.55) 0%,rgba(21, 21, 21, 0.54) 100%),url('https://www.toptal.com/designers/subtlepatterns/uploads/robots.png')"
  },

  {
    name: "Six",
    url: "linear-gradient(180deg,rgba(21, 21, 21, 0.65) 0%,rgba(21, 21, 21, 0.77) 100%),url('https://www.toptal.com/designers/subtlepatterns/uploads/fancy-cushion.png')"
  }
];

const whiteBgStrs = [
  {
    name: "One",
    url: "linear-gradient(#f5f5f5, #f5f5f5)"
  },
  {
    name: "Two",
    url: "linear-gradient(rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.27)), url('https://www.toptal.com/designers/subtlepatterns/uploads/confectionary.png')"
  },

  {
    name: "Three",
    url: "linear-gradient(rgba(245, 245, 245, 0.47), rgba(245, 245, 245, 0.55)), url('https://www.toptal.com/designers/subtlepatterns/uploads/circles-and-roundabouts.png')"
  },

  {
    name: "Four",
    url: "linear-gradient(rgba(242, 242, 242, 0.74), rgba(243, 243, 243, 0.77)), url('https://www.toptal.com/designers/subtlepatterns/uploads/doodles.png')"
  },

  {
    name: "Five",
    url: "linear-gradient(rgba(245, 245, 245, 0.27), rgba(245, 245, 245, 0.25)), url('https://www.toptal.com/designers/subtlepatterns/uploads/sun-pattern.png')"
  },

  {
    name: "Six",
    url: "linear-gradient(rgba(245, 245, 245, 0.44), rgba(245, 245, 245, 0.47)), url('https://www.toptal.com/designers/subtlepatterns/uploads/light-grey-terrazzo.png')"
  }
];

//  Modularize Projects later
function Messages({ session, id }: Props) {
  const [bg, setBg] = useState(0);

  const { theme } = ColorMode.useTheme();
  const { data, error, loading, subscribeToMore } = useQuery<
    MessagesData,
    { conversationId: string }
  >(messageOperations.Queries.messages, {
    variables: { conversationId: id }
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
          messages: [...prev.messages, newMessage]
        });
      }
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
      bgImage={theme === "light" ? whiteBgStrs[bg].url : bgStrs[bg].url}
      css={{
        "& *": {
          zIndex: 2
        }
      }}
      borderBottomRadius="inherit">
      <Stack
        gap="3px"
        ref={BoxRef}
        py="10px"
        css={{ ...hideScrollbar }}
        overflowY="auto">
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
              bg="{colors.secondaryBg}"
              color="{colors.primaryText}"
              status="error"
              maxW="280px"
              textAlign="center"
              alignItems={"center"}>
              <Alert.Indicator color="{colors.primaryText}" boxSize="40px" />

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
          style={{ color: "red" }}>
          {bgStrs[bg].name}
        </button>
      </Stack>

      <MessageInput {...{ session, id }} />
    </Stack>
  );
}

export default Messages;
