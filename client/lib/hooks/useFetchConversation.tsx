import conversationOperations from "@/graphql/operations/conversations";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

function useFetchConversation() {
  const { loading, data, error } = useQuery<conversationsData>(
    conversationOperations.Queries.conversations
  );

  return { loading, data, error };
}

function useFetchChats() {
  const { loading, data, error } = useQuery<any>(
    conversationOperations.Queries.getChats
  );

  useEffect(() => {
    if (data) {
      // Handle the fetched chats data, e.g., store in state or cache
      console.log("Fetched chats:", data);
    }

    if (error) {
      console.error("Error fetching chats:", error);
      // Handle the error, e.g., show a notification
    }
  }, [data, error]);

  return { loading, data, error };
}

function useFetchChat() {
  const { loading, data, error } = useQuery<any>(
    conversationOperations.Queries.getChat,
    {
      variables: { chatId: "68a08662d35b9270fa6b4ad2" } // For testing purposes
      // Replace with actual chatId when needed
    }
  );

  useEffect(() => {
    if (data) {
      // Handle the fetched chats data, e.g., store in state or cache
      console.log("Fetched chats:", data);
    }

    if (error) {
      console.error("Error fetching chats:", error);
      // Handle the error, e.g., show a notification
    }
  }, [data, error]);

  return { loading, data, error };
}

export { useFetchChats, useFetchChat };
export default useFetchConversation;
