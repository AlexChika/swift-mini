import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { ApolloServer } from "@apollo/server";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { expressMiddleware } from "@as-integrations/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import typeDefs from "@src/graphql/typeDefs";
import { PubSub } from "graphql-subscriptions";
import resolvers from "@src/graphql/resolvers";
import { connectDB, restartJob, getSession } from "lib";
import imagesRouter from "src/routes/images/images.route";
import { GraphqlContext, SubscriptionContext } from "swift-mini";

// configs
dotenv.config();
await connectDB();
const pubsub = new PubSub();

const schema = makeExecutableSchema({ typeDefs, resolvers });
const corsOpts: cors.CorsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "https://studio.apollographql.com"]
      : [
          "https://swiftmini.globalstack.dev",
          "https://swift-mini.vercel.app",
          "https://swiftmini-staging.globalstack.dev"
        ],
  credentials: true
};

// http server
const app = express();
const httpServer = createServer(app);

// websocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscriptions"
});

const serverCleanup = useServer(
  {
    schema,
    context: async (ctx: SubscriptionContext): Promise<GraphqlContext> => {
      const { session } = ctx?.connectionParams || {};
      return { session, pubsub };
    }
  },
  wsServer
);

const server = new ApolloServer<GraphqlContext>({
  schema,
  csrfPrevention: true,
  introspection: process.env.NODE_ENV !== "production",
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          }
        };
      }
    }
  ]
});

await server.start();

app.use(
  "/graphql",
  cors<cors.CorsRequest>(corsOpts),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }): Promise<GraphqlContext> => {
      const sessionUrl = req.headers["x-session-url"] as string;
      const session = await getSession(req, sessionUrl);
      return { session, pubsub };
    }
  })
);

app.use(cors<cors.CorsRequest>(corsOpts));

app.use("/images", imagesRouter);

app.get("/time", (_, res) => {
  res.json({ serverNow: Date.now() });
});

app.get("/cron", (_, res) => {
  res.end("SERVER RUNING");
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server is now running.`, httpServer.address());
});

// Cron Jobs ... used to keep render servers busy
if (process.env.NODE_ENV === "production") {
  restartJob.start();
}
