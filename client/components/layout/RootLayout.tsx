"use client";

import { useRef } from "react";
import Auth from "@/components/auth";
import ChatLayout from "./ChatLayout";
import { Box } from "@chakra-ui/react";
import StartScreen from "./StartScreen";
import { useSession } from "next-auth/react";
// import { reloadSession } from "@/lib/helpers";
import useNetworkChangeNotifier from "@/lib/hooks/useNetworkChangeNotifier";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import useDynamicHeight from "@/lib/hooks/useDynamicHeight";

type Props = {
  children: React.ReactNode;
};

function RootLayout({ children }: Props) {
  const { data: session, update } = useSession();
  useNetworkChangeNotifier();

  if (process.env.NODE_ENV !== "production") {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
  }

  // return <Auth session={session} reloadSession={reloadSession} />;

  const containerRef = useRef<HTMLDivElement>(null);
  useDynamicHeight({
    ref: containerRef
  });

  return (
    <Box ref={containerRef}>
      {/* <ColorMode.ThemeButton /> */} {/* For Debugging */}
      {session?.user.username ? (
        <StartScreen
          Child={<ChatLayout session={session}>{children}</ChatLayout>}
        />
      ) : (
        <Auth session={session} reloadSession={update} />
      )}
    </Box>
  );
}

export default RootLayout;
