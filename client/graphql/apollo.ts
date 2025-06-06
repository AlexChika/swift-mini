import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";

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
    "X-SESSION-URL": process.env.NEXT_PUBLIC_SESSION_URL!,
  },
  credentials: "include",
});

const wsLink = () => {
  return new GraphQLWsLink(
    createClient({
      url: wsUrl,
      connectionParams: async () => {
        return { session: await getSession() };
      },
    })
  );
};

const link = () => {
  return split(
    ({ query }) => {
      const definition = getMainDefinition(query);

      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink(),
    httpLink
  );
};

const client = new ApolloClient({
  link: typeof window !== "undefined" ? link() : httpLink,
  cache: new InMemoryCache(),
});

export default client;
