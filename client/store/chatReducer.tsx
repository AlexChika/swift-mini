export type ChatAction =
  | { type: "SET_ALL_CHATS"; payload: ChatLean[] }
  | { type: "ADD_CHAT"; payload: ChatLean }
  | { type: "UPDATE_CHAT"; payload: ChatLean }
  | { type: "REMOVE_CHAT"; payload: string }; // chatId

function chatReducer(state: ChatLean[], action: ChatAction): ChatLean[] {
  switch (action.type) {
    case "SET_ALL_CHATS":
      return action.payload;
    case "ADD_CHAT":
      return [...state, action.payload];
    case "UPDATE_CHAT":
      return state.map((c) =>
        c.id === action.payload.id ? { ...c, ...action.payload } : c
      );
    case "REMOVE_CHAT":
      return state.filter((c) => c.id !== action.payload);
    default:
      return state;
  }
}

export default chatReducer;
