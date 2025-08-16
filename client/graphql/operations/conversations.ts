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
          image
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

const createDuoChat = gql`
  mutation CreateDuoChat($otherUserId: String!) {
    createDuoChat(otherUserId: $otherUserId) {
      chatId
    }
  }
`;

const createGroupChat = gql`
  mutation CreateGroupChat(
    $memberIds: [String!]!
    $chatName: String!
    $description: String!
    $groupType: GroupType!
  ) {
    createGroupChat(
      memberIds: $memberIds
      chatName: $chatName
      description: $description
      groupType: $groupType
    ) {
      chatId
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
          image
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
  conversations
};

const Mutations = {
  createConversation,
  createDuoChat,
  createGroupChat
};

const Subscriptions = {
  conversationCreated
};

const conversationOperations = { Queries, Mutations, Subscriptions };
export default conversationOperations;
