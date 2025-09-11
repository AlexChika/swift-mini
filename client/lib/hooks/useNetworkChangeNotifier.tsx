import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

function useNetworkChangeNotifier() {
  const { update } = useSession();

  useEffect(() => {
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

      const session = await update();

      if (!session) {
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
