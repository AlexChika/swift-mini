import nextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      emailVerified: boolean;
    } & DefaultSession["user"];
  }
}
