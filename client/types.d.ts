// users

type CreateUsernameData = {
  createUsername: {
    username: string;
    success: boolen;
    error: string;
  };
};
type CreateUsernameVariable = {
  username: string;
};

type SearchedUser = {
  id: string;
  username: string;
};

type SearchUsersData = {
  searchUsers: SearchedUser[];
};
type SearchUsersVariable = {
  username: string;
};

// conversations
type CreateConversationData = {
  createConversation: {
    conversationId: string;
  };
};
type CreateConversationVariable = {
  participantIds: string[];
};

type conversationsData = {
  conversations: Conversation[];
};

type Conversation = {
  participants: ({
    user: {
      id: string;
      username: string | null;
    };
  } & {
    id: string;
    userId: string;
    conversationId: string;
    hasSeenLatestMessage: boolean;
  })[];
  latestMessage:
    | ({
        sender: {
          id: string;
          username: string | null;
        };
      } & {
        createdAt: Date;
        senderId: string;
      })
    | null;
} & {
  latestMessageId: string;
  id: string;
};

type IconProp = {
  className?: string;
  style?: any;
  color?: string;
};
