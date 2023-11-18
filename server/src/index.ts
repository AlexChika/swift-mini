import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import express from "express";
import http from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";

import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";

async function main() {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();

  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: "4000" }, resolve)
  );
  console.log("server running ");
}

main().catch((e) => console.log(e));
