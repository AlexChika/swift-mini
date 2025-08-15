const messageDefs = `#graphql
type Message {
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
    getMessages(chatId:String!):[Message!]
}

`;

export default messageDefs;
