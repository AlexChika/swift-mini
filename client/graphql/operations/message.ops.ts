import { gql } from "@apollo/client";

const messageFields = `
       id
        body
        createdAt
        clientSentAt
        editted
        deleted
        meta {
          readStatus {
            hasRead
            readAt
          }
          deliveredStatus {
            hasDelivered
            deliveredAt
          }
        }
      sender {
        id
        username
        image
        name
        permanentImageUrl
      }
`;

// Queries
const messages = gql`
  query GetMessages($chatId: String!) {
    getMessages(chatId: $chatId) {
      success
      msg
      messages {
       ${messageFields}
      }
    }
  }
`;

// Mutation
const sendMessage = gql`
  mutation SendMessage(
    $senderId: String!
    $chatId: String!
    $body: String!
    $clientSentAt: String!
  ) {
    sendMessage(
      senderId: $senderId
      chatId: $chatId
      body: $body
      clientSentAt: $clientSentAt
    )
  }
`;

// Subscriptions
const messageSent = gql`
subscription MessageSent ($chatId:String!) {
    messageSent(chatId:$chatId) {
        ${messageFields}
    }
}
`;

const Queries = { messages };

const Mutations = { sendMessage };

const Subscriptions = { messageSent };

const messageOps = { Queries, Mutations, Subscriptions };
export default messageOps;
