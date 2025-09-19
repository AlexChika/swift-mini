import { useRef } from "react";
import ChatItem from "./ChatItem";
import { Session } from "next-auth";
import { useParams } from "next/navigation";
import { Box, Stack } from "@chakra-ui/react";
import { hideScrollbar } from "@/chakra/theme";
import useDynamicHeight from "@/lib/hooks/useDynamicHeight";

type Props = {
  session: Session;
  chatList: ChatLean[];
  openChat: (chatId: string) => Promise<void>;
};

function ChatList({ session, chatList, openChat }: Props) {
  const chatId = useParams().chatId;

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
      w="100%"
      pb={2.5}
      ref={BoxRef}
      css={{
        "&[data-current-swft-chat] [data-swft-chat]": {
          cursor: "pointer",
          backgroundColor: "transparent",
          transition: "background-color 0.2s ease"
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
      data-current-swft-chat={chatId}>
      <Stack>
        {chatList.map((c) => {
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
    </Box>
  );
}

export default ChatList;
