import { gql } from "@apollo/client";

/* ------------------ queries ----------------- */
const getChat = gql`
  query GetChat($chatId: String!) {
    getChat(chatId: $chatId) {
      success
      msg
      chat {
        id
        description
        superAdmin # not used in client
        groupAdmins # not used in client
        chatName
        chatType
        avatar
        groupType # not used in client
        inviteLink # not used in client
        # {}

        joinRequests {
          # not used in client
          createdAt
          userId
        }

        latestMessageId # not used in client
        createdAt # not used in client
        updatedAt

        # not used in client
        chat_superAdmin {
          id
          username
          image
        }

        chat_groupAdmins {
          id
          username
          image
        }

        chat_joinRequests {
          user {
            id
            username
            image
          }
          createdAt
          userId
        }

        chat_latestMessage {
          body
          createdAt
          # id
          # sender {
          #   id
          #   username
          # }
        }

        chat_members {
          id
          chatId
          chatType
          memberId
          role
          showChat
          joinedAt

          member {
            id
            username
            image
          }

          lastRead {
            time
            messageId
            id
          }
          lastDelivered {
            time
            id
          }
          messageMeta {
            key
            value {
              messageId
              showMessage
              time
            }
          }
        }
      }
    }
  }
`;

const getChats = gql`
  query GetChats {
    getChats {
      success
      msg
      chats {
        id
        description
        avatar
        # superAdmin
        # groupAdmins
        chatName
        chatType
        # groupType
        # inviteLink
        # joinRequests {
        #   createdAt
        #   userId
        # }
        # latestMessageId
        # createdAt
        updatedAt
        chat_latestMessage {
          body
          createdAt
          id
          sender {
            id
            username
          }
        }
        duo_chat_members {
          id
          chatId
          chatType
          memberId
          role
          lastRead {
            time
            messageId
            id
          }
          lastDelivered {
            time
            id
          }
          messageMeta {
            key
            value {
              messageId
              showMessage
              time
            }
          }
          member {
            id
            name
            image
            username
            permanentImageUrl
          }
        }
        self_member {
          id
          chatId
          chatType
          memberId
          role
          showChat
          joinedAt
          member {
            id
            username
            image
          }
          lastRead {
            time
            messageId
            id
          }
          lastDelivered {
            time
            id
          }
          messageMeta {
            key
            value {
              messageId
              showMessage
              time
            }
          }
        }
      }
    }
  }
`;

/* ----------------- mutations ---------------- */
const createDuoChat = gql`
  mutation CreateDuoChat($otherUserId: String!) {
    createDuoChat(otherUserId: $otherUserId) {
      success
      msg
      chatId
    }
  }
`;

const createGroupChat = gql`
  mutation CreateGroupChat(
    $memberIds: [String!]!
    $chatName: String!
    $description: String!
    $groupType: GroupType!
    $avatar: String!
  ) {
    createGroupChat(
      memberIds: $memberIds
      chatName: $chatName
      description: $description
      groupType: $groupType
      avatar: $avatar
    ) {
      success
      msg
      chatId
    }
  }
`;

/* ----------------- subscriptions ---------------- */
const chatCreated = gql`
  subscription ChatCreated {
    chatCreated {
      id
      description
      # superAdmin
      # groupAdmins
      chatName
      chatType
      # groupType
      # inviteLink
      # joinRequests {
      #   createdAt
      #   userId
      # }
      # latestMessageId
      # createdAt
      updatedAt
      chat_latestMessage {
        body
        createdAt
        id
        sender {
          id
          username
        }
      }
      duo_chat_members {
        id
        chatId
        chatType
        memberId
        role
        lastRead {
          time
          messageId
          id
        }
        lastDelivered {
          time
          id
        }
        messageMeta {
          key
          value {
            messageId
            showMessage
            time
          }
        }
        member {
          id
          username
          image
        }
      }
      self_member {
        id
        chatId
        chatType
        memberId
        role
        showChat
        joinedAt
        member {
          id
          username
          image
        }
        lastRead {
          time
          messageId
          id
        }
        lastDelivered {
          time
          id
        }
        messageMeta {
          key
          value {
            messageId
            showMessage
            time
          }
        }
      }
    }
  }
`;

const Queries = {
  getChat,
  getChats
};

const Mutations = {
  createDuoChat,
  createGroupChat
};

const Subscriptions = {
  chatCreated
};

const chatOps = { Queries, Mutations, Subscriptions };
export default chatOps;
