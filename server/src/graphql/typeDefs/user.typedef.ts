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
