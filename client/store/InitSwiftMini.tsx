import React from "react";
import * as SwiftTypes from "./SwiftTypes";
import { fetchChats } from "./useFetchChats";

// step1 connect to socket

// step2 subscribe to socket

// step3 fetch all chats

// step4 set allChats

// step5 set app initialized to true

async function InitSwiftMini(dispatch?: React.Dispatch<Swift.ChatAction>) {
  let status = "loading";
  let data = null;
  let _error = null;
  let msg = "Initializing SwiftMini";

  // step1 connect to socket

  // step2 subscribe to socket

  // step3 fetch all chats
  const { error, getChats } = await fetchChats();

  if (getChats && !error) {
    // step4 apollo did not throw error or return partial data
    if (getChats.success) {
      status = "success";
      data = getChats.chats;
    } else {
      status = "failed";
      _error = error || new Error("Error fetching chats");
    }
  } else {
    // apollo either threw error or returned partial data
    msg = error.message;
    status = "error";
    _error = error || new Error("Error fetching chats");
  }

  const payload = {
    status: status,
    data: data,
    msg: getChats?.msg || msg,
    error: _error
  } as Swift.InitSwiftMiniPayload;

  dispatch?.({
    type: SwiftTypes.INIT_SWIFT,
    payload: payload
  });

  return payload;
}

export default InitSwiftMini;
/**
 * [ User Online + Socket Connected ]
          │
          ▼
   [ Socket emits event ]
          │
          │ (⚠️ DO NOT patch yet)
          ▼
 [ Trigger Apollo refetch ]
          │
          ▼
 [ Receive fresh server data ]
          │
          ▼
 [ Fire "dataReady" event → resolvers run ]
          │
          ▼
 [ Resolvers patch socket updates into UI state ]
          │
          ▼
 [ UI reflects consistent + real-time state ]

 [ Network drops ]
      │
      ▼
[ Socket disconnects ]
      │
      ▼
   (App waits…)
      │
      ▼
[ Network returns ]
      │
      ▼
[ Socket reconnects ]   ◀─── (✅ single listener here)
      │
      ▼
[ Apollo refetch → fresh baseline ]
      │
      ▼
[ Resume socket event handling + resolvers ]


 */
