import { gql } from "@apollo/client";

/* ------------------ queries ----------------- */
const conversations = gql`
  query Conversations {
    conversations {
      id
      updatedAt
      participants {
        hasSeenLatestMessage
        user {
          id
          username
        }
      }
      latestMessage {
        body
        createdAt
        id
        sender {
          id
          username
        }
      }
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

/* ----------------- subscriptiond ---------------- */
const conversationCreated = gql`
  subscription ConversationCreated {
    conversationCreated {
      id
      updatedAt
      participants {
        hasSeenLatestMessage
        user {
          id
          username
        }
      }
      latestMessage {
        body
        createdAt
        id
        sender {
          id
          username
        }
      }
    }
  }
`;

const Queries = {
  conversations,
};

const Mutations = {
  createConversation,
};

const Subscriptions = {
  conversationCreated,
};

const conversationOperations = { Queries, Mutations, Subscriptions };
export default conversationOperations;
