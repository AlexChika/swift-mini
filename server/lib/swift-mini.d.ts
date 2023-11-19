import { Session } from "next-auth";

type GraphqlContext = {
  session: Session | null;
  // prisma
  // pubsub
};
