import { useRouter } from "next/navigation";
import { getSearchParam } from "../helpers";
import { useCallback, useMemo } from "react";

function useNavigate() {
  const router = useRouter();

  /**
   * Router.push wrapper. please omit the leading slash when inputing the path
   */
  const openLink = useCallback(
    function (path: string) {
      const param = getSearchParam("swift");
      router.push(`/${path}?swift=${param}`);
    },
    [router]
  );
  return useMemo(() => ({ openLink }), [openLink]);
}

export default useNavigate;
