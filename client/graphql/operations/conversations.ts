import { gql } from "@apollo/client";

/* ------------------ queries ----------------- */
const fetchConversations = gql`
  query SearchUsers($username: String!) {
    searchUsers(username: $username) {
      id
      username
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
  fetchConversations,
};

const Mutations = {
  createConversation,
};

const Subscriptions = {};

const conversationOperations = { Queries, Mutations, Subscriptions };
export default conversationOperations;
