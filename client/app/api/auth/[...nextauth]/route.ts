import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const dev = process.env.NODE_ENV === "development";
const domain = "devarise.tech";
const cookiePrefix = "__Secure-";

console.log({ dev });

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
          name: `${cookiePrefix}next-auth.session-token`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: true,
            domain,
          },
        },
        callbackUrl: {
          name: `${cookiePrefix}next-auth.callback-url`,
          options: {
            sameSite: "lax",
            path: "/",
            secure: true,
            domain,
          },
        },
        csrfToken: {
          name: `${cookiePrefix}next-auth.csrf-token`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: true,
            domain,
          },
        },
        // pkceCodeVerifier: {
        //   name: `${cookiePrefix}next-auth.pkce.code_verifier`,
        //   options: {
        //     httpOnly: true,
        //     sameSite: "lax",
        //     path: "/",
        //     secure: true,
        //     maxAge: 900,
        //     domain,
        //   },
        // },
        // state: {
        //   name: `${cookiePrefix}next-auth.state`,
        //   options: {
        //     httpOnly: true,
        //     sameSite: "lax",
        //     path: "/",
        //     secure: true,
        //     maxAge: 900,
        //     domain,
        //   },
        // },
        // nonce: {
        //   name: `${cookiePrefix}next-auth.nonce`,
        //   options: {
        //     httpOnly: true,
        //     sameSite: "lax",
        //     path: "/",
        //     secure: true,
        //     domain,
        //   },
        // },
      },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
