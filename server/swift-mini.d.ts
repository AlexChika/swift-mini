import { conversationsInclude } from "#src/graphql/resolvers/conversations";
import { MessageInclude } from "#src/graphql/resolvers/message";
import { Prisma, PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws";

type User = {
  id: string;
  username?: string | null;
  emailVerified?: boolean | null;
  name?: string | null;
  email?: string | null; // set by Oauth
  image?: string | null;
  userImageUrl?: string | null; // set/upload by User
  permanentImageUrl?: string | null;
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
