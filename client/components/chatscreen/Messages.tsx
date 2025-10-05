import Message from "./Message";
import { Session } from "next-auth";
import MessageInput from "./MessageInput";
import { hideScrollbar } from "@/chakra/theme";
import { useQuery } from "@apollo/client/react";
import messageOps from "@/graphql/operations/message.ops";
import React, { useEffect, useRef, useState } from "react";
import useDynamicHeight from "@/lib/hooks/useDynamicHeight";
import DateDemacator, { renderObjectForDateDemacator } from "./DateDemacator";
import { ColorMode, syncClock } from "@/lib/helpers";
import { Alert, Box, Center, Spinner, Stack } from "@chakra-ui/react";

type Props = {
  session: Session;
  id: string; //chatId
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

  function logLatency({
    source,
    message,
    clientSentAt,
    createdAt
  }: {
    source: string;
    message: string;
    clientSentAt: string;
    createdAt: number;
  }) {
    const roundTripLatency = Date.now() - new Date(clientSentAt).getTime(); // no offset
    const now = Date.now() + (window.swtf_offset || 0);
    const serverLatency = now - new Date(createdAt).getTime(); // offset applied

    console.table([
      {
        Source: source,
        RoundTripLatency_ms: roundTripLatency,
        ServerLatency_ms: serverLatency,
        Message: message,
        CreatedAt: createdAt,
        ClientSentAt: clientSentAt,
        OffsetApplied: window.swtf_offset
      }
    ]);
  }

  const { data, error, loading, subscribeToMore } = useQuery<
    MessagesData,
    { chatId: string }
  >(messageOps.Queries.messages, {
    variables: { chatId: id },
    errorPolicy: "none"
  });

  // debug only
  useEffect(() => {
    if (!data || window.swtf_offset) return;
    console.log("effect for syncClock");
    async function runSync() {
      const offset = await syncClock();
      window.swtf_offset = offset;
      console.log("Clock offset synced:", offset);
    }
    runSync();
  }, [data]);

  // log latency when messages are fetched
  useEffect(() => {
    if (data?.getMessages.success) {
      const len = data.getMessages.messages.length;
      const msg = data.getMessages.messages[len - 1];
      if (!msg) return;
      logLatency({
        source: "effect",
        message: msg.body,
        clientSentAt: msg.clientSentAt,
        createdAt: msg.createdAt
      });
    }
  }, [data]);

  function subToNewMessage(id: string) {
    return subscribeToMore({
      variables: { chatId: id },
      document: messageOps.Subscriptions.messageSent,
      updateQuery: (prev, update: MessageUpdate) => {
        if (!update.subscriptionData.data) return prev as MessagesData;
        const newMessage = update.subscriptionData.data.messageSent;
        logLatency({
          source: "subMore",
          message: newMessage.body,
          clientSentAt: newMessage.clientSentAt,
          createdAt: newMessage.createdAt
        });
        return Object.assign({}, prev, {
          getMessages: {
            ...prev.getMessages,
            messages: [
              ...((prev.getMessages?.success && prev.getMessages.messages) ||
                []),
              newMessage
            ]
          }
        }) as MessagesData;
      }
    });
  }

  const subscribedChats = useRef<string[]>([]);
  useEffect(() => {
    // if a conversation has been subscribed... we return
    if (subscribedChats.current.find((ids) => ids === id)) return;
    subscribedChats.current.push(id);

    const unsubscribe = subToNewMessage(id); // sub to conversation

    return () => {
      // cleanup
      unsubscribe?.();
      subscribedChats.current = subscribedChats.current.filter(
        (ids) => ids !== id
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const BoxRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    if (BoxRef.current) {
      BoxRef.current.scrollTo(0, Number(BoxRef.current.scrollHeight));
    }
  }, [data]);

  const renderObj = renderObjectForDateDemacator(
    (data?.getMessages.success && data?.getMessages.messages) || []
  );

  // TODO: use rems and ems
  return (
    // calc(100% - 60px) => 60px accounts for the MessageHeader
    <Stack
      css={{
        "& *": {
          zIndex: 2
        }
      }}
      zIndex={6}
      bgPos="center"
      position="relative"
      h="calc(100%)"
      justifyContent="flex-end"
      id="swft-message-container"
      borderBottomRadius="inherit"
      bgImage={theme === "light" ? whiteBgStrs[bg].url : bgStrs[bg].url}>
      <Stack
        gap="3px"
        pb="10px"
        pt="30px"
        ref={BoxRef}
        overflowY="auto"
        css={{ ...hideScrollbar }}>
        {/* loading */}
        {loading && (
          <Center h="100%">
            <Box>
              <Spinner />
            </Box>
          </Center>
        )}

        {/* error */}
        {error && <MessageErrorUI error="Please Refresh The browser" />}

        {/* success false */}
        {data?.getMessages.success === false && (
          <MessageErrorUI error={data.getMessages.msg} />
        )}

        {/* data */}
        {data?.getMessages.success &&
          data.getMessages.messages.map((m, i) => {
            const messages =
              (data.getMessages.success && data.getMessages.messages) || [];

            return (
              <React.Fragment key={i}>
                <DateDemacator key={m.id} demacatorText={renderObj[m.id]} />
                <Message
                  usersFirstMessageAfterOthers={(() => {
                    const prevMessage = messages[i - 1];
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
          className="swftMini"
          onClick={() => setBg((prev) => (prev + 1) % bgStrs.length)}
          style={{ color: "gray" }}>
          {bgStrs[bg].name} Swift Mini
        </button>
      </Stack>

      <MessageInput {...{ session, id }} />
    </Stack>
  );
}

export default Messages;

function MessageErrorUI({ error }: { error: string }) {
  return (
    <Center dir="column" h="100%">
      <Alert.Root
        bg="{colors.secondaryBg}"
        color="{colors.primaryText}"
        status="error"
        maxW="280px"
        textAlign="center"
        alignItems={"center"}>
        <Alert.Indicator color="red.solid" boxSize="40px" />

        <Alert.Content maxWidth="md" width="max-content">
          <Alert.Title color="red.solid" fontSize="sm">
            Something Went Wrong!
          </Alert.Title>
          <Alert.Description fontSize="small">{error}</Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </Center>
  );
}
