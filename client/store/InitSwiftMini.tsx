import React from "react";
import * as SwiftTypes from "./SwiftTypes";
import useFetchChats, { fetchChats } from "./useFetchChats";

/* eslint-disable @typescript-eslint/no-explicit-any */
// step1 connect to socket

// step2 subscribe to socket

// step3 fetch all chats

// step4 set allChats

// step5 set app initialized to true

async function InitSwiftMini(dispatch?: React.Dispatch<Swift.ChatAction>) {
  // step1 connect to socket

  // step2 subscribe to socket

  // step3 fetch all chats
  const { error, getChats } = await fetchChats();

  // step4 set app initialized to true
  if (getChats && !error) {
    const payload: Swift.InitSwiftMiniPayload = {
      status: "success",
      data: getChats,
      error: null
    };

    dispatch?.({
      type: SwiftTypes.INIT_SWIFT,
      payload: payload
    });

    return payload;
  }

  // step5 on fetch error set app initialized to false
  const err = error || new Error("Error fetching chats");
  const payload: Swift.InitSwiftMiniPayload = {
    status: "failed",
    data: null,
    error: err
  };

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
