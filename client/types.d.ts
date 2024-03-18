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
  id: string;
  updatedAt: string | number | Date;
  latestMessageId: string | null;

  participants: {
    userId: string;
    conversationId: string;
    hasSeenLatestMessage: boolean;
    user: {
      id: string;
      image: string | null;
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

// The update query subscription data for create conversations
type ConversationUpdate = {
  subscriptionData: { data?: { conversationCreated: Conversation } };
};

type IconProp = {
  className?: string;
  style?: any;
  color?: string;
};
