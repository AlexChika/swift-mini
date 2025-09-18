import { useRouter } from "next/navigation";
import { getSearchParam } from "../helpers";
import { useCallback, useMemo } from "react";

function useNavigate() {
  const router = useRouter();

  const openChat = useCallback(async function (chatId: string) {
    const param = getSearchParam("swift");
    router.push(`/${chatId}?swift=${param}`);
  }, []);

  return useMemo(() => ({ openChat }), []);
}

export default useNavigate;
