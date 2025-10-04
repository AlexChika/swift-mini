const chatDefs = `#graphql
scalar Date

# ------------- Mutation --------------

type Mutation {
    createDuoChat(otherUserId: String!): createChatResponse
    createGroupChat(memberIds: [String!]!, chatName: String!, description: String!, groupType: GroupType!): createChatResponse
}

type createChatResponse {
    chatId: String!
}

# --------------- Query ----------------

type Query {
    getChats: GetChatsResponse
    getChat(chatId: String!): GetChatResponse
}


type GetChatsResponse {
    success:Boolean!
    msg:String!
    chats:[ChatLean!]
}


type GetChatResponse {
    success:Boolean!
    msg:String!
    chat:ChatPopulated
}


# --------------- Subscription ----------------
type Subscription {
  chatCreated:ChatLean!
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
    joinRequests: [JoinRequest!]
    latestMessageId: String
    createdAt: Date!
    updatedAt: Date!

    # below fields are not part of chat model, they are reference fields returned from db lookup queries
    chat_superAdmin: User
    chat_groupAdmins: [User!]
    chat_joinRequests: [ChatJoinRequest!]
    chat_latestMessage: Message
    chat_members: [ChatMember!]
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
    joinRequests: [JoinRequest!]
    latestMessageId: String
    createdAt: Date!
    updatedAt: Date!

    # below fields are not part of chat model, they are reference fields returned from db lookup queries
    chat_latestMessage: Message
    duo_chat_members: [ChatMember!]
    self_member: ChatMember!
}

enum ChatType {
  duo
  group
}

enum GroupType {
  public
  private
}

type ChatMember {
    id: String!
    role: String!
    chatId: String!
    joinedAt: Date!
    memberId: String!
    showChat: Boolean
    chatType: ChatType
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

type JoinRequest {
    createdAt: Date!
    userId: String!
}

type ChatJoinRequest {
    createdAt: Date!
    userId: String!

    # below fields are not part of joinRequest sub-model, they are reference fields returned from db lookup queries
    user: User!
}
`;

export default chatDefs;
