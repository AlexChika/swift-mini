"use client";

import system from "@/chakra/theme";
import { Session } from "next-auth";
import client from "@/graphql/apollo";
import ClientShell from "./ClientShell";
import { Toaster } from "react-hot-toast";
import { SwiftProvider } from "./SwifProvider";
import { ThemeProvider } from "./ThemeProvider";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client/react";

type Props = {
  children: React.ReactNode;
  session: Session | null;
  defaultTheme: "light" | "dark" | "system";
  serverTheme: "light" | "dark" | undefined;
};

function Provider(prop: Props) {
  const { children, session, defaultTheme, serverTheme } = prop;

  return (
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
  );
}

export default Provider;
