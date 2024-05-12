import { gql } from "@apollo/client";

const messageFields = `
       id
        body
        createdAt
      sender {
        id
        username
        image
      }
`;

// Queries
const messages = gql`
  query Messages($conversationId: String!) {
    messages(conversationId: $conversationId) {
       ${messageFields}
    }
  }
`;

// Mutation
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
    )
  }
`;

// Subscriptions
const messageSent = gql`
subscription MessageSent ($conversationId:String!) {
    messageSent(conversationId:$conversationId) {
        ${messageFields}
    }
}
`;

const Queries = { messages };

const Mutations = { sendMessage };

const Subscriptions = { messageSent };

const messageOperations = { Queries, Mutations, Subscriptions };
export default messageOperations;
