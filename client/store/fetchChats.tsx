import { useEffect, useRef, useState } from "react";
import client from "@/graphql/apollo";
import chatOps from "@/graphql/operations/chat.ops";
import handleError from "@/lib/helpers/handleError";
import { ErrorLike } from "@apollo/client";
import { useEvent } from "@/lib/hooks/useEvents";
import { eventTypes, type Payload } from "@/socket/socket";
import SwiftStore from "./swiftStore";
import { chatResolver } from "@/socket/chatResolver";
import * as types from "./SwiftTypes";

type GetChats = {
  getChats: GetChatsResponse | null;
};

type State = GetChats & {
  loading: boolean;
  error: unknown | undefined;
};

type FetchChats =
  | {
      getChats: GetChatsResponse;
      error: undefined;
    }
  | {
      getChats: null | undefined;
      error: ErrorLike | Error;
    };

async function fetchChats(): Promise<FetchChats> {
  const { data, error } = await client.query<GetChats>({
    query: chatOps.Queries.getChats,
    fetchPolicy: "no-cache",
    errorPolicy: "all"
  });

  if (!data?.getChats || error) {
    return {
      getChats: null,
      error: error || new Error("Error fetching chats")
    };
  }

  return {
    getChats: data.getChats,
    error
  };
}

function useFetchChats() {
  const [state, setState] = useState<State>({
    loading: true,
    error: undefined,
    getChats: null
  });

  useEffect(() => {
    async function fetchChats() {
      try {
        const { data, error } = await client.query<GetChats>({
          query: chatOps.Queries.getChats,
          fetchPolicy: "no-cache",
          errorPolicy: "all"
        });

        if (!data?.getChats || error) {
          return setState({
            loading: false,
            getChats: null,
            error: error || new Error("Error fetching chats")
          });
        }

        setState({
          loading: false,
          getChats: data.getChats,
          error
        });
      } catch (err) {
        handleError(err);
        setState({
          loading: false,
          getChats: null,
          error: err || new Error("Error fetching chats")
        });
      }
    }

    fetchChats();
  }, []);

  return state;
}

type Dispatch = React.Dispatch<Swift.ChatAction>;

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

  useEvent(eventTypes.CHAT_CREATED, (payload) => {
    handleChatCreated(payload, updates);
  });

  return {};
  // to be implemented
}

export { fetchChats, useChatsResolver };
export default useFetchChats;

type UpdateRef = React.RefObject<Swift.ResolverEvent[]>;

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
