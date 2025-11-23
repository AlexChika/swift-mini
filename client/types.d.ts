type ApiReturn<T, Name extends string> =
  | {
      success: false;
      msg: string;
    }
  | ({
      success: true;
      msg: "success";
    } & { [P in Name]: T });

/* --------------------- users --------------------- */
type User = {
  id: string;
  username?: string;
  emailVerified?: boolean;
  name?: string;
  email?: string;
  image?: string; // set by Oauth
  lastSeen?: Date;
  hideLastSeen?: boolean;
  permanentImageUrl?: string; // set by user
};

type UserWithChatId = User & { chatId?: string };

type UserLean = {
  id: string;
  name?: string;
  image?: string;
  username?: string;
  permanentImageUrl?: string;
};

type SearchUsersData = {
  searchUsers: ApiReturn<UserLean[], "users">;
};

type SearchUsersVariable = {
  username: string;
};

/* ----------------- Chats ----------------- */
// narrow down types to returned graphql schema

// narrow down types to returned graphql schema
type ChatLean = {
  id: string;
  description: string;
  chatName: string;
  avatar: string;
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
  avatar: string;
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

type GetChatsResponse = ApiReturn<ChatLean[], "chats">;
type GetChatResponse = ApiReturn<ChatPopulated, "chat">;

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
};

type MessageUpdate = {
  subscriptionData: { data: { messageSent: Message } };
};

type Message = {
  id: string;
  body: string;
  createdAt: number;
  updatedAt: number;
  chatId: string;
  senderId: string;
  deleted: boolean;
  editted: boolean;
  type: "text" | "image" | "video" | "audio" | "file" | "location";
  eddited: boolean;
  deleted: boolean;
  sender: UserLean;
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

type DbMessage = {
  chatId: string;
  senderId: string;
  body: string;
  type: "text" | "image" | "video" | "audio" | "file" | "location";
};

type SendMessage = DbMessage & {
  sender: UserLean;
};

type OutboundMessage = {
  tempId: string;
  chatId: string;
  type: "outbound";
  message: SendMessage;
  status: "pending" | "success" | "failed";
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

namespace Swift {
  type SwiftStore = {
    dispatch: React.Dispatch<ChatAction>;
  } & SwiftReducer;

  type SwiftReducer = {
    allChats: ChatLean[];
    initSwiftMini: InitSwiftMini;
  };

  type InitSwiftMini = {
    status: "success" | "loading" | "failed" | "error";
    data: ChatLean[] | null;
    error: Error | ErrorLike | null;
    msg: string;
  };

  type ChatAction =
    | { type: "SET_ALL_CHATS"; payload: ChatLean[] }
    | { type: "ADD_CHAT"; payload: ChatLean }
    | { type: "UPDATE_CHATS"; payload: ChatLean[] }
    | { type: "REMOVE_CHAT"; payload: string }
    | { type: "INIT_SWIFT"; payload: InitSwiftMini };

  type Create_Chats_UI_State =
    | "default"
    | "swiftUsers"
    | "usersGroup"
    | "createGroup"
    | "usersContact"
    | "createGroupDetails";

  type Events = {
    GROUP_UI_UPDATE: Create_Group_UI_State;
    GROUP_SELECTED_USERS: User[];
    CHAT_CREATED: ChatLean;
    MESSAGE_QUEUED_ACK: { tempId: string; status: "success" | "failed" };
    MESSAGE_CREATED_ACK: { tempId: string; status: "success" | "failed" };
    MESSAGE_FAILED_ACK: { tempId: string; status: "success" | "failed" };
  };

  type ResolverEvents = {
    [P in keyof Events]: {
      type: P;
      data: Swift.Events[P];
    };
  };

  type ResolverEvent = ResolverEvents[keyof Swift.Events];
}
