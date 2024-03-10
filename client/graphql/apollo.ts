import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const uri =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000/graphql"
    : "https://server-swift-mini.devarise.tech/graphql";

const httpLink = new HttpLink({
  uri,
  credentials: "include",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
