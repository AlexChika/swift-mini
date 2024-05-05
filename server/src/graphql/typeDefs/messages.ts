const messageDefs = `#graphql
type Message {
    id:String!
    sender:User!
    body:String
    createdAt:Date
}


type Mutation {
    sendMessage(id:String!, conversationId:String!, senderId:String!, body:String!) : Boolean!
}

type Query {
    messages(conversationId:String!):[Message!]
}


type Subscription {
    messageSent(conversationId:String):Message
}
`;

export default messageDefs;
