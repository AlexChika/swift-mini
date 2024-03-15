import { gql } from "@apollo/client";

/* ------------------ queries ----------------- */
const conversations = gql`
  query Conversations {
    conversations {
      id
      participants {
        user {
          id
          username
        }
        hasSeenLastMessage
      }
      latestMessage {
        id
        sender {
          id
          username
        }
        body
        createdAt
      }
      updatedAt
    }
  }
`;

/* ----------------- mutations ---------------- */
const createConversation = gql`
  mutation CreateConversation($participantIds: [String!]!) {
    createConversation(participantIds: $participantIds) {
      conversationId
    }
  }
`;

const Queries = {
  conversations,
};

const Mutations = {
  createConversation,
};

const Subscriptions = {};

const conversationOperations = { Queries, Mutations, Subscriptions };
export default conversationOperations;
