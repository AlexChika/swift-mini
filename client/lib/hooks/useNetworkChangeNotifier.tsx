import { useSession } from "next-auth/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { reloadSession } from "../helpers";

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

    const onlineHandler = () => {
      toast.loading("You are back online", {
        id: "onlineoffline",
        duration: 7000,
        style: { background: "#14213d", color: "#339933" },
        iconTheme: {
          secondary: "#80c080",
          primary: "green"
        }
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
  return null;
}

export default useNetworkChangeNotifier;
