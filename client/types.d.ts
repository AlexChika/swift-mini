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
  latestMessageId: string | null;
  id: string;

  participants: {
    userId: string;
    conversationId: string;
    hasSeenLatestMessage: boolean;
    user: {
      id: string;
      username: string | null;
    };
  }[];

  latestMessage: {
    id: string;
    createdAt: Date;
    senderId: string;
    sender: {
      id: string;
      username: string | null;
    };
  } | null;
};

type IconProp = {
  className?: string;
  style?: any;
  color?: string;
};
