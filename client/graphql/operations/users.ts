import { gql } from "@apollo/client";

/* ------------------ queries ----------------- */
const searchUsers = gql`
  query SearchUsers($username: String!) {
    searchUsers(username: $username) {
      id
      username
    }
  }
`;

/* ---------------- mutatations --------------- */
const createUsername = gql`
  mutation CreateUsername($username: String!, $userHasImage: Boolean!) {
    createUsername(username: $username, userHasImage: $userHasImage) {
      username
      success
      error
    }
  }
`;

const Queries = {
  searchUsers
};

const Mutations = {
  createUsername
};

const Subscriptions = {};

const userOperations = { Queries, Mutations, Subscriptions };
export default userOperations;
