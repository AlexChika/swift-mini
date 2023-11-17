"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { ColorModeScript } from "@chakra-ui/react";

import theme from "./chakra/theme";

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

function Provider({ children, session }: Props) {
  return (
    <SessionProvider session={session}>
      <CacheProvider>
        <ColorModeScript initialColorMode="dark" storageKey="swift-mini" />
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </CacheProvider>
    </SessionProvider>
  );
}

export default Provider;
