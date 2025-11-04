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

type Query {
    searchUsers(username:String!):SearchUserResponse
    getRecentRandomUsers(count:Int):SearchUserResponse
}

type Mutation {
    createUsername(username:String!):CreateUserResponse
}

# a lean user for use in message population
type UserLean {
    id: String!
    name: String!
    image: String!
    username: String!
    permanentImageUrl:String
  }

type SearchUserResponse {
    success:Boolean!
    msg:String!
    users:[UserLean!]
}

type CreateUserResponse {
    username:String
    success:Boolean!
    msg:String
}

`;

export default userDefs;
