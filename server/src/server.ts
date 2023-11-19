import dotenv from "dotenv";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import express from "express";
import { ApolloServer } from "@apollo/server";
import cors from "cors";
import pkg from "body-parser";

import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import { getSession } from "../lib/helpers";
import { GraphqlContext } from "../lib/swift-mini";
const { json } = pkg;

// configs
dotenv.config();
const schema = makeExecutableSchema({ typeDefs, resolvers });
const corsOpts: cors.CorsOptions = {
  origin: ["http://localhost:3000", "https://studio.apollographql.com"],
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

const serverCleanup = useServer({ schema }, wsServer);

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
      const session = await getSession(req, process.env.SESSION_URL);
      return session;
    },
  })
);

const PORT = 4000;
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});
