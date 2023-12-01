import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const dev = process.env.NODE_ENV === "development";
const cookiePrefix = "swift";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          ...user,
        },
      };
    },
  },
  cookies: dev
    ? {}
    : {
        sessionToken: {
          name: `__Secure-next-auth.session-token`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: true,
            domain: ".devarise.tech",
          },
        },
        callbackUrl: {
          name: `__Secure-next-auth.callback-url`,
          options: {
            sameSite: "lax",
            path: "/",
            secure: true,
            domain: ".devarise.tech",
          },
        },
        csrfToken: {
          name: `__Host-next-auth.csrf-token`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: true,
            domain: ".devarise.tech",
          },
        },
        pkceCodeVerifier: {
          name: `${cookiePrefix}next-auth.pkce.code_verifier`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: true,
            maxAge: 900,
          },
        },
        state: {
          name: `${cookiePrefix}next-auth.state`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: true,
            maxAge: 900,
          },
        },
        nonce: {
          name: `${cookiePrefix}next-auth.nonce`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: true,
          },
        },
      },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
