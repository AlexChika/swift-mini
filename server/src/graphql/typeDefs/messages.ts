const messageDefs = `#graphql
type Message {
    id:String!
    sender:User!
    body:String
    createdAt:Date
}


type Mutation {
    sendMessage( conversationId:String!, senderId:String!, body:String!) : Boolean!
}

type Query {
    getMessages(conversationId:String!): getMessageResponse
}


type getMessageResponse {
    success:Boolean!
    msg:String!
    messages:[Message!]
}

type Subscription {
    messageSent(conversationId:String):Message
}
`;

export default messageDefs;
