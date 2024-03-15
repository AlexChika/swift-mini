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

# type Message {
# }

type Participant {
    id:String!
    user: User!
    hasSeenLastMessage:Boolean!
}

type Conversation {
    id:String!
    # latestMessage:Message
    participants:[Participant]!
    createdAt:Date!
    updatedAt:Date!
}

`;

export default conversationDefs;
