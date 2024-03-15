const messageDefs = `#graphql
type Message {
    id:String!
    sender:User!
    body:string
    createdAt:Date
}
`;

export default messageDefs;
