import { useRouter } from "next/navigation";
import { getSearchParam } from "../helpers";
import { useCallback, useMemo } from "react";

function useNavigate() {
  const router = useRouter();

  const openChat = useCallback(
    function (chatId: string) {
      const param = getSearchParam("swift");
      router.push(`/${chatId}?swift=${param}`);
    },
    [router]
  );

  return useMemo(() => ({ openChat }), [openChat]);
}

export default useNavigate;
