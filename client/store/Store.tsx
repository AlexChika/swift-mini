import React, { useEffect } from "react";
import swiftReducer from "./swiftReducer";
import InitSwiftMini from "./InitSwiftMini";

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
  init: () => {},
  ...initialReducerState
});

type SwiftProvider = {
  children: React.ReactNode;
};
function SwiftProvider(props: SwiftProvider) {
  const { children } = props;
  const [state, dispatch] = React.useReducer(swiftReducer, initialReducerState);

  function init() {
    InitSwiftMini(dispatch);
  }

  useEffect(() => {
    if (state.initSwiftMini.status === "success") return;
    console.log("first render");
    InitSwiftMini(dispatch);
  }, []);

  const val = React.useMemo(
    () => ({
      ...state,
      dispatch,
      init
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
