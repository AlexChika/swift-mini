import conversationOperations from "@/graphql/operations/conversations";
import { useQuery } from "@apollo/client";

function useFetchConversation() {
  const { loading, data, error } = useQuery<conversationsData>(
    conversationOperations.Queries.conversations
  );

  console.log({ data });
  return { loading, data, error };
}

export default useFetchConversation;
