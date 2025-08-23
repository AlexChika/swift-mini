import { gql } from "@apollo/client";

const messageFields = `
       id
        body
        createdAt
        clientSentAt
      sender {
        id
        username
        image
      }
`;

// Queries
const messages = gql`
  query GetMessages($conversationId: String!) {
    getMessages(conversationId: $conversationId) {
      success
      msg
      messages {
       ${messageFields}
      }
    }
  }
`;
const messagesNew = gql`
  query GetMessagesNew($chatId: String!) {
    getMessagesNew(chatId: $chatId) {
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
const sendMessageNew = gql`
  mutation SendMessageNew(
    $senderId: String!
    $chatId: String!
    $body: String!
    $clientSentAt: Date!
  ) {
    sendMessageNew(
      senderId: $senderId
      chatId: $chatId
      body: $body
      clientSentAt: $clientSentAt
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
const messageSentNew = gql`
subscription MessageSentNew ($chatId:String!) {
    messageSentNew(chatId:$chatId) {
        ${messageFields}
    }
}
`;

const Queries = { messages, messagesNew };

const Mutations = { sendMessage, sendMessageNew };

const Subscriptions = { messageSent, messageSentNew };

const messageOperations = { Queries, Mutations, Subscriptions };
export default messageOperations;
