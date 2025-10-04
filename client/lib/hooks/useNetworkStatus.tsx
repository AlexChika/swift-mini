import { useEffect, useState } from "react";

function useNetworkStatus() {
  const [online, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : false
  );

  useEffect(() => {
    const onlineHandler = () => {
      setIsOnline(true);
    };

    const offlineHandler = () => {
      setIsOnline(false);
    };

    setIsOnline(navigator.onLine);

    window.addEventListener("offline", offlineHandler);
    window.addEventListener("online", onlineHandler);
    return () => {
      window.removeEventListener("offline", offlineHandler);
      window.removeEventListener("online", onlineHandler);
    };
  }, []);

  return online;
}

export default useNetworkStatus;
