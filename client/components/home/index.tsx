"use client";

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Auth from "../auth";
import Chat from "../chat";
import StartScreen from "./StartScreen";
import { useEffect } from "react";
import toast from "react-hot-toast";

function HomePage() {
  const { data: session, update } = useSession();

  if (process.env.NODE_ENV !== "production") {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
  }

  function reloadSession() {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  }

  useEffect(() => {
    const offlineHandler = () => {
      toast.loading("You are offline", {
        id: "onlineoffline",
        style: { background: "#14213d", color: "#ff4040" },

        iconTheme: {
          secondary: "#ff8080",
          primary: "red",
        },
      });
    };

    const onlineHandler = () => {
      toast.loading("You are back online", {
        id: "onlineoffline",
        duration: 7000,
        style: { background: "#14213d", color: "#339933" },
        iconTheme: {
          secondary: "#80c080",
          primary: "green",
        },
      });
      reloadSession();
      update();
    };

    window.addEventListener("offline", offlineHandler);
    window.addEventListener("online", onlineHandler);
    return () => {
      window.removeEventListener("offline", offlineHandler);
      window.removeEventListener("online", onlineHandler);
    };
  }, [update]);

  return (
    <Box>
      {session?.user.username ? (
        <StartScreen Child={<Chat session={session} />} />
      ) : (
        <Auth session={session} reloadSession={reloadSession} />
      )}
    </Box>
  );
}

export default HomePage;
