import { type Express } from "express";
import typeDefs from "@src/graphql/typeDefs";
import { ApolloServer } from "@apollo/server";
import resolvers from "@src/graphql/resolvers";
import { getCachedSession } from "./getSession";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

async function initApolloServer(
  app: Express,
  httpServer: ReturnType<typeof import("http").createServer>
) {
  const server = new ApolloServer<GraphqlContext>({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    introspection: process.env.NODE_ENV !== "production",
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphqlContext> => {
        const sessionUrl = req.headers["x-session-url"] as string;
        const session = await getCachedSession(req, sessionUrl);
        return { session };
      }
    })
  );
}

export { initApolloServer };
