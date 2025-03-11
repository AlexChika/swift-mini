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
      : ["https://swiftmini.globalstack.dev"],
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
      const session = await getSession(req, process.env.SESSION_URL!);
      return { session, prisma, pubsub };
    },
  })
);
app.use("/iframetest", cors());
app.get("/iframetest", function (req, res) {
  //Call using /iframetest?url=url - needs to be stripped of http:// or https://
  var url = req.query.url || "";
  // const url = "www.google.com";
  console.log("hit here", url);
  const options = {
    hostname: url as string,
    port: 80,
    path: "/",
    method: "GET",
  };

  var reqs = request(
    { host: url as string },
    function (response: { headers: any }) {
      console.log("executed");
      //This does an https request - require('http') if you want to do a http request
      var headers = response.headers;
      console.log({ headers }, "what");

      if (typeof headers["x-frame-options"] === "undefined") {
        res.send(false); //Headers don't allow iframe
      } else {
        res.send(true); //Headers don't disallow iframe
      }
    }
  );
  reqs.on("error", function (e: any) {
    console.log("failed");
    res.send(true); //website unavailable
  });
  reqs.end();
});

app.get("/cron", (_, res) => {
  res.end("SERVER RUNING");
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server is now running.`, httpServer.address());
});

// Cron Jobs ... used to keep render servers busy
process.env.NODE_ENV === "production" && restartJob.start();
