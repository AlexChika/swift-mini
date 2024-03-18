import { conversationsPopulated } from "#src/graphql/resolvers/conversations";
import { Prisma, PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws";
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

/**
 * return object when a username is created
 */
type CreateUsernameResponse = {
  success: boolean;
  error?: string;
  username: string;
};

type Conversation = Prisma.ConversationGetPayload<{
  include: typeof conversationsPopulated;
}>;
