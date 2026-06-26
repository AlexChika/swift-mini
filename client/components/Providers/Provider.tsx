"use client";

import system from "@/chakra/theme";
import { Session } from "next-auth";
import client from "@/graphql/apollo";
import ClientShell from "./ClientShell";
import { Toaster } from "react-hot-toast";
import { SwiftProvider } from "./SwifProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import type { Engine } from "@tsparticles/engine";
import { ApolloProvider } from "@apollo/client/react";
import { NextParticlesProvider } from "@tsparticles/nextjs";

type Props = {
  children: React.ReactNode;
  session: Session | null;
  defaultTheme: "light" | "dark" | "system";
  serverTheme: "light" | "dark" | undefined;
};

const particlesInit = async (engine: Engine): Promise<void> => {
  const [{ loadFull }] = await Promise.all([import("tsparticles")]);

  await Promise.all([loadFull(engine)]);
};

function Provider(prop: Props) {
  const { children, session, defaultTheme, serverTheme } = prop;

  return (
    <NextParticlesProvider init={particlesInit}>
      <SessionProvider
        session={session}
        refetchInterval={30 * 60} // 30 mins
        refetchOnWindowFocus={false}
        refetchWhenOffline={false}>
        <ApolloProvider client={client}>
          <ChakraProvider value={system}>
            <SwiftProvider>
              <ThemeProvider
                defaultTheme={defaultTheme}
                serverTheme={serverTheme}>
                <ClientShell>
                  {children}
                  <Toaster />
                </ClientShell>
              </ThemeProvider>
            </SwiftProvider>
          </ChakraProvider>
        </ApolloProvider>
      </SessionProvider>
    </NextParticlesProvider>
  );
}

export default Provider;
