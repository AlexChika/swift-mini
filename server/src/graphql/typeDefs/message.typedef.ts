const messageDefs = `#graphql
type Message {
    id:String!
    chatId:String!
    senderId:String!
    body:String!
    createdAt:Date!
    updatedAt:Date!
    deleted:Boolean!
    editted:Boolean!
    meta: MessageMeta!

    # below fields are not part of message model, they are reference fields returned from db lookup queries

    sender:UserLean!
}

type Query {
    getMessages(chatId:String!): GetMessagesResponse
}

type Mutation {
    sendMessage( chatId:String!, senderId:String!, body:String!) : Boolean!
}

type Subscription {
    messageSent(chatId:String):Message
}

type GetMessagesResponse {
    success:Boolean!
    msg:String!
    messages:[Message!]
}

type MessageMeta {
  readStatus: ReadStatus
  deliveredStatus: DeliveredStatus
}

type ReadStatus {
  hasRead: Boolean
  readAt: Date
}

type DeliveredStatus {
  hasDelivered: Boolean
  deliveredAt: Date
}

`;

export default messageDefs;
