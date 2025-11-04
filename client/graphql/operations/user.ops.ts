import { gql } from "@apollo/client";

/* ------------------ queries ----------------- */
const searchUsers = gql`
  query SearchUsers($username: String!) {
    searchUsers(username: $username) {
      success
      msg
      users {
        id
        username
        image
        name
        permanentImageUrl
      }
    }
  }
`;

const getRecentRandomUsers = gql`
  query GetRecentRandomUsers($count: Int) {
    getRecentRandomUsers(count: $count) {
      success
      msg
      users {
        id
        username
        image
        name
        permanentImageUrl
      }
    }
  }
`;

/* ---------------- mutatations --------------- */
const createUsername = gql`
  mutation CreateUsername($username: String!) {
    createUsername(username: $username) {
      username
      success
      msg
    }
  }
`;

const Queries = {
  searchUsers,
  getRecentRandomUsers
};

const Mutations = {
  createUsername
};

const Subscriptions = {};

const userOps = { Queries, Mutations, Subscriptions };

export default userOps;
