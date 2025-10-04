"use client";
import system from "@/chakra/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import ClientShell from "@/components/Providers/ClientShell";

type Props = {
  serverTheme: "light" | "dark" | undefined;
  children: React.ReactNode;
};

function NotFoundProvider({ serverTheme, children }: Props) {
  return (
    <ClientShell>
      <ChakraProvider value={system}>
        <ThemeProvider defaultTheme="system" serverTheme={serverTheme}>
          {children}
        </ThemeProvider>
      </ChakraProvider>
    </ClientShell>
  );
}

export default NotFoundProvider;
