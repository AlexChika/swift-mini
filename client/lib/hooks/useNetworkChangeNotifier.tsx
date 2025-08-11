import { useSession, getSession } from "next-auth/react";
import { useEffect } from "react";
import toast from "react-hot-toast";

function useNetworkChangeNotifier() {
  const { update } = useSession();

  useEffect(() => {
    console.log("ran useNetworkChangeNotifier");

    const offlineHandler = () => {
      toast.loading("You are offline", {
        id: "onlineoffline",
        style: { background: "#14213d", color: "#ff4040" },

        iconTheme: {
          secondary: "#ff8080",
          primary: "red"
        }
      });
    };

    const onlineHandler = async () => {
      toast.loading("You are back online", {
        id: "onlineoffline",
        duration: 7000,
        style: { background: "#14213d", color: "#339933" },
        iconTheme: {
          secondary: "#80c080",
          primary: "green"
        }
      });

      let session = null;

      session = await update();

      if (!session) {
        session = await getSession({
          broadcast: true,
          triggerEvent: true,
          event: "authenticated"
        });
      }

      if (session) {
        await update(session);
      } else {
        console.log("no session, reloading");
        window.location.reload();
      }
    };

    window.addEventListener("offline", offlineHandler);
    window.addEventListener("online", onlineHandler);
    return () => {
      window.removeEventListener("offline", offlineHandler);
      window.removeEventListener("online", onlineHandler);
    };
  }, [update]);
  return null;
}

export default useNetworkChangeNotifier;
