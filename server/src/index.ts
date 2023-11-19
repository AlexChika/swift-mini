import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { PubSub } from "graphql-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import { GraphqlContext } from "../lib/swift-mini";
import * as dotenv from "dotenv";
import cors from "cors";
import pkg from "body-parser";
import { getSession } from "../lib/helpers";

const { json } = pkg;

const main = async () => {
  dotenv.config();

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  const corsOpts: cors.CorsOptions = {
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true,
  };

  const app = express();
  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql/subscriptions",
  });

  // Context parameters
  // const prisma = new PrismaClient();
  // const pubsub = new PubSub();

  // const getSubscriptionContext = async (
  //   ctx: SubscriptionContext
  // ): Promise<GraphQLContext> => {
  //   ctx;
  //   // ctx is the graphql-ws Context where connectionParams live
  //   if (ctx.connectionParams && ctx.connectionParams.session) {
  //     const { session } = ctx.connectionParams;
  //     return { session, prisma, pubsub };
  //   }
  //   // Otherwise let our resolvers know we don't have a current user
  //   return { session: null, prisma, pubsub };
  // };

  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer(
    {
      schema,
      // context: (ctx: SubscriptionContext) => {
      //   return getSubscriptionContext(ctx);
      // },
    },
    wsServer
  );

  // Set up ApolloServer.
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOpts),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphqlContext> => {
        const session = await getSession(req, process.env.SESSION_URL);
        return session;
      },
    })
  );

  const PORT = 4000;

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
};

main().catch((err) => console.log(err));
