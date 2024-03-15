const conversationDefs = `#graphql
scalar Date

type Mutation {
createConversation(participantIds:[String!]!):CreateConversationResponse
}

type CreateConversationResponse {
    conversationId:String!
}

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
    participants:[Participant]!
    createdAt:Date!
    updatedAt:Date!
}

`;

export default conversationDefs;
