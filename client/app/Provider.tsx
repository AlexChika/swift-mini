"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./chakra/theme";

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

function Provider({ children, session }: Props) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </SessionProvider>
  );
}

export default Provider;
