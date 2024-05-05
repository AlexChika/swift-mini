import { gql } from "@apollo/client";

// Queries

const messages = gql`
  query Messages($conversationId: String!) {
    messages(conversationId: $conversationId) {
      sender {
        id
      }
    }
  }
`;

// Subscriptions
const sendMessage = gql`
  mutation SendMessage(
    $senderId: String!
    $conversationId: String!
    $body: String!
  ) {
    sendMessage(
      senderId: $senderId
      conversationId: $conversationId
      body: $body
    ) {
      id
      sender
      body
      updatedAt
    }
  }
`;

const Queries = { messages };

const Mutations = { sendMessage };

const Subscriptions = {};

const messageOperations = { Queries, Mutations, Subscriptions };
export default messageOperations;
