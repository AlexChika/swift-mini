const messageDefs = `#graphql
type Message {
    id:String!
    chatId:String!
    senderId:String!
    body:String!
    createdAt:Date!
    updatedAt:Date!
    clientSentAt:String!
    deleted:Boolean!

    # below fields are not part of message model, they are reference fields returned from db lookup queries

    sender:User!
}

type Query {
    getMessages(chatId:String!): getMessageResponse
}

type Mutation {
    sendMessage( chatId:String!, senderId:String!, body:String!, clientSentAt: String!) : Boolean!
}

type Subscription {
    messageSent(chatId:String):Message
}

type getMessageResponse {
    success:Boolean!
    msg:String!
    messages:[Message!]
}

`;

export default messageDefs;
