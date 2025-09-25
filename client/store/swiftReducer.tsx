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
  return state;
}

export default swiftReducer;
