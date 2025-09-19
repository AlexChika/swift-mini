const userDefs = `#graphql
type User {
  id:String!
  name:String!
  emailVerified:Boolean
  userImageUrl:String
  permanentImageUrl:String
  username:String
  email:String
  image:String
  hideLastSeen: Boolean
  lastSeen: Date
}


# a lean user for use in message population
type Sender {
  id: String!
  username: String!
  image: String!
  permanentImageUrl:String
}

  type SearchedUser {
    id: String!
    username: String!
  }

type Query {
    searchUsers(username:String!):[SearchedUser]
}

type Mutation {
    createUsername(username:String!, userHasImage:Boolean!):CreateUserResponse
}

type CreateUserResponse {
    username:String!
    success:Boolean!
    error:String
}

`;

export default userDefs;
