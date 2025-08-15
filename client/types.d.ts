type ApiReturn<T, Name extends string> =
  | {
      success: false;
      msg: string;
    }
  | ({
      success: true;
      msg: string;
    } & { [P in Name]: T });

/* --------------------- users --------------------- */

type CreateUsernameData = {
  createUsername: {
    username: string;
    success: boolen;
    error: string;
  };
};
type CreateUsernameVariable = {
  username: string;
  userHasImage: boolean;
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

/* ----------------- conversations ----------------- */
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

// The update query subscription data for create conversations
type ConversationUpdate = {
  subscriptionData: { data?: { conversationCreated: Conversation } };
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

  latestMessage: Message | null;
};

/* -------------------- Messages ------------------- */
type MessagesResponse = ApiReturn<Message[], "messages">;

type MessagesData = {
  getMessages: MessagesResponse;
};

type sendMessageData = boolean;
type sendMessageVariable = {
  body: string;
  conversationId: string;
  senderId: string;
};

type MessageUpdate = {
  subscriptionData: { data?: { messageSent: Message } };
};

type Message = {
  id: string;
  body: string;
  createdAt: number;
  sender: {
    id: string;
    username: string;
    image: string;
  };
};

type IconProp = {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
  color?: string;
};
