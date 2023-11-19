import { PrismaClient } from "@prisma/client";
import { Session } from "next-auth";

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
