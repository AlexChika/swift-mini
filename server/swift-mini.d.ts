import { conversationsInclude } from "src/graphql/resolvers/conversations";
import { MessageInclude } from "src/graphql/resolvers/message";
import { Prisma, PrismaClient } from "@prisma/client";
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

type Messages<T> = {
  id: string;
  chatId: T;
  senderId: T;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  clientSentAt: Date;
  deleted: boolean;
};

/* -------------- Api Types -------------- */
type ApiReturn<T, Name extends string> =
  | {
      success: false;
      msg: string;
    }
  | ({
      success: true;
      msg: string;
    } & { [P in Name]: T });

type ChatMemberPopulated = ChatMember<string> & {
  member: User;
};

type MessagePopulated = Messages<string> & {
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
  prisma: PrismaClient;
  pubsub: PubSub;
};

interface SubscriptionContext extends Context {
  connectionParams: {
    session: Session | null;
  };
}

// Types
type Conversation = Prisma.ConversationGetPayload<{
  include: typeof conversationsInclude;
}>;

type Message = Prisma.MessageGetPayload<{
  include: typeof MessageInclude;
}>;
