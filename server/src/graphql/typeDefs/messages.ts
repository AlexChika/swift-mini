const messageDefs = `#graphql
type Message {
    id:String!
    sender:User!
    body:String
    createdAt:Date
}
`;

export default messageDefs;
