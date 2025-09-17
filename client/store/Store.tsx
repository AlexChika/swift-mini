import React from "react";
import chatReducer, { type ChatAction } from "./chatReducer";

type SwiftStore = {
  allChats: ChatLean[];
  dispatch: React.Dispatch<ChatAction>;
};

const Context = React.createContext<SwiftStore>({
  allChats: [],
  dispatch: () => {}
});

type SwiftProvider = {
  children: React.ReactNode;
};
function SwiftProvider(props: SwiftProvider) {
  const { children } = props;
  const [allChats, dispatch] = React.useReducer(chatReducer, []);

  const val = React.useMemo(
    () => ({
      allChats,
      dispatch
    }),
    [allChats]
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
