import chatOps from "@/graphql/operations/chat.ops";
import { useQuery } from "@apollo/client/react";

function useFetchChats() {
  const { loading, data, error } = useQuery<ChatLean>(chatOps.Queries.getChats);

  return { loading, data, error };
}

export default useFetchChats;
