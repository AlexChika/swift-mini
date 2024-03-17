const conversationDefs = `#graphql
scalar Date

# /* ----------------------- Mutation ----------------------- */
type Mutation {
    createConversation(participantIds:[String!]!):CreateConversationResponse
}

type CreateConversationResponse {
    conversationId:String!
}

# /* ----------------------- Query ----------------------- */
type Query {
    conversations: [Conversation!]
}

type Participant {
    id:String!
    user: User!
    hasSeenLatestMessage:Boolean!
}

type Conversation {
    id:String!
    latestMessage:Message
    participants:[Participant!]
    createdAt:Date!
    updatedAt:Date!
}


# /* ----------------------- Subscriptionx ----------------------- */
type Subscription {
  conversationCreated:Conversation!
}

`;

export default conversationDefs;
