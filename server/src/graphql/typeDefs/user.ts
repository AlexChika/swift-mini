const userDefs = `#graphql
type User {
  id:String
  name:String
  username:String
  email:String
  image:String
}

  type SearchedUser {
    id: String!
    username: String!
  }

type Query {
    searchUsers(username:String!):[SearchedUser]
}

type Mutation {
    createUsername(username:String!):CreateUserResponse
}

# type Subscription {

# }

type CreateUserResponse {
    username:String!
    success:Boolean!
    error:String
}

`;

export default userDefs;
