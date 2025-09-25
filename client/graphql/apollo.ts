import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink
} from "@apollo/client";
import { createClient } from "graphql-ws";
import { OperationTypeNode } from "graphql";
import { getSession } from "next-auth/react";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";

const uri =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000/graphql"
    : `${process.env.NEXT_PUBLIC_APP_HTTP_SERVER}/graphql`;

const wsUrl =
  process.env.NODE_ENV === "development"
    ? "ws://localhost:4000/subscriptions"
    : `${process.env.NEXT_PUBLIC_APP_WSS_SERVER}/subscriptions`;

const httpLink = new HttpLink({
  uri,
  headers: {
    "X-SESSION-URL": process.env.NEXT_PUBLIC_SESSION_URL!
  },
  credentials: "include"
});

// temporary code - remove this ⬇
let cachedSession: unknown = null;
export async function getCachedSession() {
  if (!cachedSession) {
    cachedSession = await getSession();
  }
  return cachedSession;
}

export function clearCachedSession() {
  cachedSession = null;
}

// drop ws subscription for socket.io
const wsLink = () => {
  return new GraphQLWsLink(
    createClient({
      url: wsUrl,
      connectionParams: async () => {
        return { session: await getCachedSession() };
      }
    })
  );
};
// temporary code - remove this ⬆

const link = () => {
  return ApolloLink.split(
    ({ operationType }) => {
      return operationType === OperationTypeNode.SUBSCRIPTION;
    },
    wsLink(),
    httpLink
  );
};
const client = new ApolloClient({
  link: typeof window !== "undefined" ? link() : httpLink,

  defaultOptions: {
    // query: {
    //   fetchPolicy: "network-only"
    // },
    // watchQuery: {
    //   notifyOnNetworkStatusChange: false
    // }
  }, // uncomment later
  cache: new InMemoryCache()
});

export default client;
