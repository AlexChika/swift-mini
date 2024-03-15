import { conversationsPopulated } from "#src/graphql/resolvers/conversations";
import { Prisma, PrismaClient } from "@prisma/client";
import nextAuth, { Session, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      emailVerified: boolean;
    } & DefaultSession["user"];
  }
}

type GraphqlContext = {
  session: Session | null;
  prisma: PrismaClient;
  // pubsub
};

/**
 * return object when a username is created
 */
type CreateUsernameResponse = {
  success: boolean;
  error?: string;
  username: string;
};

type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationsPopulated;
}>;

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
  latestMessageId: string | null;
  id: string;
};

type A = Conversation extends ConversationPopulated ? number : string;
