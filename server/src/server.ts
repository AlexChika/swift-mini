import dotenv from "dotenv";
import { createServer, get, request } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import express from "express";
import { ApolloServer } from "@apollo/server";
import cors from "cors";
import pkg from "body-parser";

import resolvers from "#src/graphql/resolvers";
import typeDefs from "#src/graphql/typeDefs";
import { getSession } from "#lib/getSession";
import { GraphqlContext, SubscriptionContext } from "../swift-mini";
import { PrismaClient } from "@prisma/client";
import restartJob from "#lib/cron";
import { PubSub } from "graphql-subscriptions";
const { json } = pkg;

// configs
dotenv.config();
const prisma = new PrismaClient();
const pubsub = new PubSub();

const schema = makeExecutableSchema({ typeDefs, resolvers });
const corsOpts: cors.CorsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "https://studio.apollographql.com"]
      : [
          "https://swiftmini.globalstack.dev",
          "https://swift-mini.vercel.app",
          "https://swiftmini-staging.globalstack.dev",
        ],
  credentials: true,
};

// http server
const app = express();
const httpServer = createServer(app);

// websocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscriptions",
});

const serverCleanup = useServer(
  {
    schema,
    context: async (ctx: SubscriptionContext): Promise<GraphqlContext> => {
      const { session } = ctx?.connectionParams || {};
      return { session, pubsub, prisma };
    },
  },
  wsServer
);

const server = new ApolloServer<GraphqlContext>({
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
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }): Promise<GraphqlContext> => {
      const sessionUrl = req.headers["x-session-url"] as string;
      console.log({ sessionUrl }, "session url");
      const session = await getSession(req, sessionUrl);

      console.log({ session }, "express middleware");
      return { session, prisma, pubsub };
    },
  })
);

app.get("/cron", (_, res) => {
  res.end("SERVER RUNING");
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server is now running.`, httpServer.address());
});

// Cron Jobs ... used to keep render servers busy
process.env.NODE_ENV === "production" && restartJob.start();
