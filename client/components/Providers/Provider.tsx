"use client";

import system from "@/chakra/theme";
import { Session } from "next-auth";
import client from "@/graphql/apollo";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "./ThemeProvider";
import ClientShell from "./ClientShell";
import { Toaster } from "react-hot-toast";

type Props = {
  children: React.ReactNode;
  session: Session | null;
  defaultTheme: "light" | "dark" | "system";
  serverTheme: "light" | "dark" | undefined;
};

function Provider({ children, session, defaultTheme, serverTheme }: Props) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <ChakraProvider value={system}>
          <ThemeProvider defaultTheme={defaultTheme} serverTheme={serverTheme}>
            <ClientShell>
              {children}
              <Toaster />
            </ClientShell>
          </ThemeProvider>
        </ChakraProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}

export default Provider;
