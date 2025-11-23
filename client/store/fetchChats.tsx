import { useEffect, useState } from "react";
import client from "@/graphql/apollo";
import chatOps from "@/graphql/operations/chat.ops";
import handleError from "@/lib/helpers/handleError";
import { ErrorLike } from "@apollo/client";

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

export { fetchChats };
export default useFetchChats;
