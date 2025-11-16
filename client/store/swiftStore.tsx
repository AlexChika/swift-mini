import React, { useEffect, useState } from "react";
import swiftReducer from "./swiftReducer";
import InitSwiftMini from "./InitSwiftMini";
import { useSession } from "next-auth/react";
import { useChatsResolver } from "./fetchChats";

const initialReducerState: Swift.SwiftReducer = {
  allChats: [],
  initSwiftMini: {
    data: null,
    status: "loading",
    error: null,
    msg: "Initializing SwiftMini"
  }
};

const Context = React.createContext<Swift.SwiftStore>({
  dispatch: () => {},
  ...initialReducerState
});

type SwiftProvider = {
  children: React.ReactNode;
};

function SwiftProvider(props: SwiftProvider) {
  const { children } = props;
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [state, dispatch] = React.useReducer(swiftReducer, initialReducerState);

  useChatsResolver(dispatch, state.initSwiftMini);

  useEffect(() => {
    if (mounted) return;
    if (!session?.user.username) return;

    console.log("first render");

    async function mount() {
      const res = await InitSwiftMini(dispatch);
      if (res.status === "success") setMounted(true);
    }

    mount();
  }, [mounted, session?.user.username]);

  const val = React.useMemo(
    () => ({
      ...state,
      dispatch
    }),
    [state]
  );

  return <Context.Provider value={val}>{children}</Context.Provider>;
}

function SwiftStore() {
  const ctx = React.useContext(Context);
  if (!ctx) {
    throw new Error("SwiftStore must be used within a SwiftProvider");
  }
  return ctx;
}

export { SwiftProvider };
export default SwiftStore;
