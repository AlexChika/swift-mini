// users

type CreateUsernameReturn = {
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

type SearchUsersReturn = {
  searchUsers: SearchedUser[];
};
type SearchUsersVariable = {
  username: string;
};

// conversations
type CreateConversationReturn = {
  createConversation: {
    conversationId: string;
  };
};
type CreateConversationVariable = {
  participantIds: string[];
};

type IconProp = {
  className?: string;
  style?: any;
  color?: string;
};
