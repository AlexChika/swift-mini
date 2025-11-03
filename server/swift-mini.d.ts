import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws";

/* ------------ model types ----------- */
type User<T> = {
  _id: T; // MongoDB ObjectId
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

type Chat<T> = {
  id: string;
  description: string;
  chatName: string;
  avatar: string;
  chatType: "group" | "duo";
  groupType: "private" | "public";
  inviteLink: string | null;
  joinRequests: { createdAt: Date; userId: T }[];
  groupAdmins: T[];
  superAdmin: T | null;
  latestMessageId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ChatMember<T> = {
  id: string;
  chatId: T;
  chatType: "duo" | "group";
  memberId: T;
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
};

type Message<T> = {
  id: string;
  body: string;
  chatId: T;
  senderId: T;
  createdAt: Date;
  clientSentAt: string;
  deleted: boolean;
  editted: boolean;
  meta: {
    readStatus: {
      hasRead: boolean;
      readAt: Date;
    };
    deliveredStatus: {
      hasDelivered: boolean;
      deliveredAt: Date;
    };
  };
  type: "text" | "image" | "video" | "audio" | "file" | "location";
};

/* -------------- Api Types -------------- */
type ApiReturn<T, Name extends string> =
  | {
      success: false;
      msg: string;
    }
  | ({
      success: true;
      msg: "success";
    } & { [P in Name]: T });

type ChatMemberPopulated = ChatMember<string> & {
  member: User;
};

type MessagePopulated = Message<string> & {
  sender: User;
};

type ChatLean = Chat<string> & {
  chat_latestMessage?: MessagePopulated;
  duo_chat_members: ChatMemberPopulated[];
  self_member: ChatMemberPopulated;
};

type ChatPopulated = Chat<string> & {
  chat_superAdmin: User;
  chat_groupAdmins: User[];
  chat_joinRequests: {
    user: User | null;
    createdAt: Date;
    userId: string;
  }[];
  chat_latestMessage: MessagePopulated | null;
  chat_members: ChatMemberPopulated[];
};

interface Session {
  user: {
    id: string;
    username: string;
    emailVerified: boolean;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };

  expires: ISODateString;
}

// Server Context Configuration
type GraphqlContext = {
  session: Session | null;
  pubsub: PubSub;
};

interface SubscriptionContext extends Context {
  connectionParams: {
    session: Session | null;
  };
}
