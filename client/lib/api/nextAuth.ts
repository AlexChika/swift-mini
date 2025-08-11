import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// add the below to generator fun in prisma schema
//   output = "app/generated/prisma/client";
// import { PrismaClient } from "@/prisma/app/generated/prisma/client"; for v7 (not supported by nextAuth yet)

const prisma = new PrismaClient();
export const getAuthConfig = (): NextAuthConfig => {
  const dev = process.env.NODE_ENV === "development";
  const domain = "globalstack.dev";
  const cookiePrefix = "__Secure-";

  return {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, user, token }) {
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
            name: `${cookiePrefix}next-auth.session-token`,
            options: {
              httpOnly: true,
              sameSite: "lax",
              path: "/",
              secure: true,
              domain
            }
          },
          callbackUrl: {
            name: `${cookiePrefix}next-auth.callback-url`,
            options: {
              sameSite: "lax",
              path: "/",
              secure: true,
              domain
            }
          },
          csrfToken: {
            name: `${cookiePrefix}next-auth.csrf-token`,
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

// import { NextAuthOptions } from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";

// // add the below to generator fun in prisma schema
// //   output = "app/generated/prisma/client";
// // import { PrismaClient } from "@/prisma/app/generated/prisma/client"; for v7 (not supported by nextAuth yet)

// import GoogleProvider from "next-auth/providers/google";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const getAuthOptions = (): NextAuthOptions => {
//   const dev = process.env.NODE_ENV === "development";
//   const domain = "globalstack.dev";
//   const cookiePrefix = "__Secure-";

//   return {
//     adapter: PrismaAdapter(prisma),
//     providers: [
//       GoogleProvider({
//         clientId: process.env.GOOGLE_CLIENT_ID!,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET!
//       })
//     ],
//     secret: process.env.NEXTAUTH_SECRET,
//     callbacks: {
//       async session({ session, user, token }) {
//         return {
//           ...session,
//           user: {
//             ...session.user,
//             ...user
//           }
//         };
//       }
//     },
//     cookies: dev
//       ? {}
//       : {
//           sessionToken: {
//             name: `${cookiePrefix}next-auth.session-token`,
//             options: {
//               httpOnly: true,
//               sameSite: "lax",
//               path: "/",
//               secure: true,
//               domain
//             }
//           },
//           callbackUrl: {
//             name: `${cookiePrefix}next-auth.callback-url`,
//             options: {
//               sameSite: "lax",
//               path: "/",
//               secure: true,
//               domain
//             }
//           },
//           csrfToken: {
//             name: `${cookiePrefix}next-auth.csrf-token`,
//             options: {
//               httpOnly: true,
//               sameSite: "lax",
//               path: "/",
//               secure: true,
//               domain
//             }
//           }
//         }
//   };
// };
