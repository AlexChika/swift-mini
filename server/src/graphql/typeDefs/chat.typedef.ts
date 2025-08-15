const chatDefs = `#graphql
scalar Date

# ------------- Mutation --------------

type Mutation {
    createDuoChat(otherUserId: String!): createChatResponse
    createGroupChat(memberIds: [String!]!): createChatResponse
}

type createChatResponse {
    chatId: String!
}

# --------------- Query ----------------

type Query {
    getChats: [ChatLean!]
    getChat(chatId: String!): ChatPopulated
}

# returns a complete chat object
type ChatPopulated {
    id: String!
    description: String!
    superAdmin: String
    groupAdmins: [String!]
    chatName: String!
    chatType: ChatType
    groupType: GroupType
    inviteLink: String
    joinRequests: [String!]
    latestMessageId: String
    hideLastSeen: Boolean!
    lastSeen: Date
    createdAt: Date!
    updatedAt: Date!

    # below fields are not part of chat model, they are reference fields returned from db lookup queries
    chat_superAdmin: User
    chat_groupAdmins: [User!]
    chat_joinRequests: [User!]
    chat_latestMessage: Message
    chat_members: [Member!]
}

# returns a lean chat object
type ChatLean {
    id: String!
    description: String!
    superAdmin: String
    groupAdmins: [String!]
    chatName: String!
    chatType: ChatType
    groupType: GroupType
    inviteLink: String
    joinRequests: [String!]
    latestMessageId: String
    hideLastSeen: Boolean!
    lastSeen: Date
    createdAt: Date!
    updatedAt: Date!

    # below fields are not part of chat model, they are reference fields returned from db lookup queries
    chat_latestMessage: Message
    duo_chat_members: [Member!]
    self_member: Member!
}

enum ChatType {
  duo
  group
}

enum GroupType {
  public
  private
}

type Member {
    id: String!
    chatId: String!
    memberId: String!
    showChat: Boolean
    lastRead: LastRead
    lastDelivered: LastRead
    messageMeta: [KeyValue!] # replaced Map with list of key-value pairs

    # below fields are not part of chatMember model, they are reference fields returned from db lookup queries
    member: User!
}

type KeyValue {
    key: String!
    value: MessageMeta!
}

type MessageMeta {
    messageId: String!
    showMessage: Boolean!
    time: Date!
}

type LastRead {
    id: String!
    messageId: String!
    time: Date!
}
`;

export default chatDefs;
