"use client";

import theme from "@/chakra/theme";
import client from "@/graphql/apollo";
import { ApolloProvider } from "@apollo/client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

function Provider({ children, session }: Props) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <CacheProvider>
          <ColorModeScript initialColorMode="dark" storageKey="swift-mini" />
          <ChakraProvider theme={theme}>
            <Toaster />
            {children}
          </ChakraProvider>
        </CacheProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}

export default Provider;
