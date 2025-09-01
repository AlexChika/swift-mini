"use client";

import Auth from "@/components/auth";
import ChatLayout from "./ChatLayout";
import { Box } from "@chakra-ui/react";
import StartScreen from "./StartScreen";
import { useSession } from "next-auth/react";
import { reloadSession } from "@/lib/helpers";
import useNetworkChangeNotifier from "@/lib/hooks/useNetworkChangeNotifier";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

type Props = {
  children: React.ReactNode;
};

function RootLayout({ children }: Props) {
  const { data: session } = useSession();
  useNetworkChangeNotifier();

  if (process.env.NODE_ENV !== "production") {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
  }

  // return <Auth session={session} reloadSession={reloadSession} />;

  return (
    <Box>
      {/* <ColorMode.ThemeButton /> */} {/* For Debugging */}
      {session?.user.username ? (
        <StartScreen
          Child={<ChatLayout session={session}>{children}</ChatLayout>}
        />
      ) : (
        <Auth session={session} reloadSession={reloadSession} />
      )}
    </Box>
  );
}

export default RootLayout;
