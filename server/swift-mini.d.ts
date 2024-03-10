import { PrismaClient } from "@prisma/client";
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
