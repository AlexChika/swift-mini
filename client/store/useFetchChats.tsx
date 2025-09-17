import { useEffect, useState } from "react";
import client from "@/graphql/apollo";
import chatOps from "@/graphql/operations/chat.ops";
import handleError from "@/lib/helpers/handleError";

// step1 connect to socket

// step2 subscribe to socket

// step3 fetch all chats

// step4 set allChats

// step5 set app initialized to true

type GetChats = {
  getChats: ChatLean[] | null;
  loading: boolean;
  error: any;
};

function useFetchChats() {
  const [error, data] = useState<GetChats>({
    loading: true,
    error: null,
    getChats: null
  });

  useEffect(() => {
    async function fetchChats() {
      try {
        const { data, error } = await client.query<ChatLean[]>({
          query: chatOps.Queries.getChats,
          fetchPolicy: "no-cache",
          errorPolicy: "all"
        });

        console.log({ data, error });

        // if (error) {
        //   throw error;
        // }
      } catch (err) {
        console.log("clicked");
        handleError(err);
      }
    }

    fetchChats();
    // client
    //   .query<ChatLean[]>({
    //     query: chatOps.Queries.getChats,
    //     fetchPolicy: "no-cache"
    //   })
    //   .then(({ data, error }) => {
    //     console.log({ data, error });
    //   })
    //   .catch((err) => console.log(err));
  }, []);

  return { error, data };
}

export default useFetchChats;

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
