import * as SwiftTypes from "./SwiftTypes";

function swiftReducer(
  state: Swift.SwiftReducer,
  action: Swift.ChatAction
): Swift.SwiftReducer {
  if (action.type === SwiftTypes.INIT_SWIFT) {
    return {
      ...state,
      initSwiftMini: action.payload,
      allChats: action.payload.data || []
    };
  }

  if (action.type === SwiftTypes.UPDATE_CHATS) {
    return {
      ...state,
      allChats: action.payload
    };
  }

  return state;
}

export default swiftReducer;
