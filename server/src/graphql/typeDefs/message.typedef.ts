const messageDefs = `#graphql
type MessageNew {
    id:String!
    chatId:String!
    senderId:String!
    body:String!
    createdAt:Date!
    updatedAt:Date!
    deleted:Boolean!

    # below fields are not part of message model, they are reference fields returned from db lookup queries

    sender:User!
}

type Query {
    getMessagesNew(chatId:String!): getMessageResponseNew
}

type Mutation {
    sendMessageNew( chatId:String!, senderId:String!, body:String!) : Boolean!
}

type Subscription {
    messageSentNew(chatId:String):MessageNew
}

type getMessageResponseNew {
    success:Boolean!
    msg:String!
    messages:[MessageNew!]
}

`;

export default messageDefs;
