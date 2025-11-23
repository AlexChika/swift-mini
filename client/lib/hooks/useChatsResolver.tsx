import { chatResolver } from "@/socket/chatResolver";

type UpdateRef = React.RefObject<Swift.ResolverEvent[]>;
type Dispatch = React.Dispatch<Swift.ChatAction>;
import * as types from "@/store/SwiftTypes";
import { useEffect, useRef, useState } from "react";
import { useEvent } from "@/lib/hooks/useEvents";
import { socketOnEvents, type Payload } from "@/socket/socket";

function useChatsResolver(
  dispatch: Dispatch,
  initSwiftMini: Swift.InitSwiftMini
) {
  const updates = useRef<Swift.ResolverEvent[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    if (initSwiftMini.status !== "success" || initSwiftMini.data === null)
      return;

    const init = chatResolver.initResolver((payload) => {
      dispatch({ type: types.UPDATE_CHATS, payload });
    }, initSwiftMini.data);

    setInitialized(init);
  }, [initialized, initSwiftMini]);

  useEvent(socketOnEvents.CHAT_CREATED, (payload) => {
    handleChatCreated(payload, updates);
  });

  return {};
  // to be implemented
}

type ChatCreatedEvent = Swift.ResolverEvents["CHAT_CREATED"];
function handleChatCreated({ data }: Payload<ChatLean>, updt: UpdateRef) {
  const chatEvt: ChatCreatedEvent = {
    type: "CHAT_CREATED",
    data
  };
  emitEventHandler(chatEvt, updt);
}

function emitEventHandler(evt: Swift.ResolverEvent, updates: UpdateRef) {
  if (chatResolver.isInitialized()) {
    if (updates.current.length > 0) {
      updates.current.forEach((e) => {
        chatResolver.enqueue(e);
      });

      updates.current = [];
    }
    chatResolver.enqueue(evt);
  } else {
    updates.current.push(evt);
  }
}
// type ChatCreatedEvent = Swift.ResolverEvents["CHAT_CREATED"];
// function handleMessageReceived ( updt: UpdateRef) {}

export { useChatsResolver };
