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

/* ----------------- Chats ----------------- */
// narrow down types to returned graphql schema
type User = {
  _id: string; // MongoDB ObjectId
  id: string;
  username?: string | null;
  emailVerified?: boolean | null;
  name?: string | null;
  email?: string | null; // set by Oauth
  image?: string | null;
  lastSeen?: Date | null;
  hideLastSeen?: boolean;
  userImageUrl?: string | null; // set/upload by User
  permanentImageUrl?: string | null;
};

// narrow down types to returned graphql schema
type ChatLean = {
  id: string;
  description: string;
  chatName: string;
  chatType: "group" | "duo";
  groupType: "private" | "public";
  inviteLink: string | null;
  joinRequests: { createdAt: Date; userId: string }[];
  groupAdmins: string[];
  superAdmin: string | null;
  latestMessageId: string | null;
  createdAt: Date;
  updatedAt: Date;
  chat_latestMessage?: Messages;
  duo_chat_members: ChatMember[];
  self_member: ChatMember;
};

// TODO => narrow down types to graphql returned schema
type ChatPopulated = {
  id: string;
  description: string;
  chatName: string;
  chatType: "group" | "duo";
  groupType: "private" | "public";
  inviteLink: string | null;
  joinRequests: { createdAt: Date; userId: string }[];
  groupAdmins: string[];
  superAdmin: string | null;
  latestMessageId: string | null;
  createdAt: Date;
  chat_latestMessage?: Messages;
  chat_members: ChatMember[];
  chat_superAdmin: User;
  chat_groupAdmins: User[];
  chat_joinRequests: {
    user: User | null;
    createdAt: Date;
    userId: string;
  }[];
};

// narrow down types to returned graphql schema
type ChatMember = {
  id: string;
  chatId: string;
  chatType: "duo" | "group";
  memberId: string;
  role: "admin" | "member";
  lastRead: {
    time: Date | null;
    messageId: string | null;
  };
  lastDelivered: {
    time: Date | null;
  };
  messageMeta: {
    [key: string]: {
      showMessage: boolean;
      time: Date;
      messageId: string;
    };
  } | null;
  showChat: boolean;
  joinedAt: Date;
  member: User;
};

type chatsData = {
  getChats: ChatsLean[];
};

// The update query subscription data for create chats
type ChatUpdate = {
  subscriptionData: { data?: { chatCreated: ChatsLean } };
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
  chatId: string;
  senderId: string;
  clientSentAt: string;
};

type MessageUpdate = {
  subscriptionData: { data: { messageSent: Message } };
};

type Message = {
  id: string;
  body: string;
  createdAt: number;
  clientSentAt: string;
  eddited: boolean;
  deleted: boolean;
  sender: {
    id: string;
    username: string;
    image: string;
  };
  meta: {
    readStatus: {
      hasRead: boolean;
      readAt: number;
    };
    deliveredStatus: {
      hasDelivered: boolean;
      deliveredAt: number;
    };
  };
};

/* ------------------- Utilities ------------------- */
type Param =
  | "home"
  | "duo"
  | "group"
  | "swiftAi"
  | "settings"
  | "profile"
  | "calls"
  | "search";

type PageName =
  | "All Chats"
  | "Chats"
  | "Group Chats"
  | "Swift AI"
  | "Settings"
  | "Profile"
  | "Call History"
  | "Search";

type IconProp = {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
  color?: string;
};
