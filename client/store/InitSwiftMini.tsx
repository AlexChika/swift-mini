import React from "react";
import * as SwiftTypes from "./SwiftTypes";
import { fetchChats } from "./fetchChats";
import { connectSocketAsync } from "@/socket/socket";

// step1 subscribe to socket

// step2 connect to socket ✅

// step3 fetch all chats ✅

// dispatch payload ✅

async function InitSwiftMini(dispatch?: React.Dispatch<Swift.ChatAction>) {
  let status: string;
  let data = null;
  let _error = null;
  let msg: string;

  // step1 connect to socket
  let isSocketConnected = false;

  try {
    await connectSocketAsync();
    isSocketConnected = true;
  } catch (err) {
    const error = err as Error;
    msg = error.message || "Error connecting to socket";

    const isAuthError = msg.split(":")[0] === "AUTH";

    if (isAuthError) {
      msg = "Socket authentication failed. Please try again";
      status = "failed";
    } else {
      status = "error";
      console.error({ msg });
    }
  }

  // step2 subscribe to socket

  // step3 fetch all chats
  if (isSocketConnected) {
    const { error, getChats } = await fetchChats();

    if (getChats && !error) {
      // step4 apollo did not throw error or return partial data
      if (getChats.success) {
        status = "success";
        data = getChats.chats;
      } else {
        status = "failed";
        _error = new Error(getChats.msg);
      }

      msg = getChats.msg;
    } else {
      // apollo either threw error or returned partial data
      msg = error.message;
      status = "error";
      _error = error || new Error("Error fetching chats");
      console.error({ msg });
    }
  }

  const payload = {
    status: status!,
    data: data,
    msg: msg!,
    error: _error
  } as Swift.InitSwiftMini;

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
