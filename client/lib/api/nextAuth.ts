import { PrismaClient } from "@/prisma/swift";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const getAuthConfig = (): NextAuthConfig => {
  const dev = process.env.NODE_ENV === "development";
  const domain = "globalstack.dev";
  const cookiePrefix = "__Secure-SwiftMini";

  return {
    // @ts-expect-error: PrismaAdaper (v: 2.10.0) expects a prisma instance of a type that is currently not compatiible with the instance returned from the generated PrismaClient but compatible with the instance returned from "@prisma/client" package .
    adapter: PrismaAdapter(prisma),
    session: {
      strategy: "database",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      updateAge: 24 * 60 * 60 // 24 hours
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      })
    ],
    callbacks: {
      async session({ session, user }) {
        return {
          ...session,
          user: {
            ...session.user,
            ...user
          }
        };
      }
    },
    cookies: dev
      ? {}
      : {
          sessionToken: {
            name: `${cookiePrefix}.session-token`,
            options: {
              httpOnly: true,
              sameSite: "lax",
              path: "/",
              secure: true,
              domain
            }
          },
          callbackUrl: {
            name: `${cookiePrefix}.callback-url`,
            options: {
              sameSite: "lax",
              path: "/",
              secure: true,
              domain
            }
          },
          csrfToken: {
            name: `${cookiePrefix}.csrf-token`,
            options: {
              httpOnly: true,
              sameSite: "lax",
              path: "/",
              secure: true,
              domain
            }
          }
        }
  };
};

export const { auth, handlers, signIn, signOut } = NextAuth(getAuthConfig());
