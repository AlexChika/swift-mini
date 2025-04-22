"use client";

import system from "@/chakra/theme";
import { Session } from "next-auth";
import client from "@/graphql/apollo";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider, Toast } from "@chakra-ui/react";
import { ThemeProvider } from "./ThemeProvider";
import ClientShell from "./CliemtShell";
import { Toaster } from "react-hot-toast";

type Props = {
  children: React.ReactNode;
  session: Session | null;
  theme: "light" | "dark";
};

function Provider({ children, session, theme }: Props) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <ChakraProvider value={system}>
          <ThemeProvider theme={theme}>
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
