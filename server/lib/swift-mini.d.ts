import { PrismaClient } from "@prisma/client";
import { Session } from "next-auth";

type GraphqlContext = {
  session: Session | null;
  prisma: PrismaClient;
  // pubsub
};
