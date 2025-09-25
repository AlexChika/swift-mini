import client from "@/graphql/apollo";
import { throttle } from "@/lib/helpers";
import { useEffect, useRef } from "react";
// import { Socket } from "socket.io-client";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Options = {
  socket: any;
  //   socket: Socket;
  query: any;
  onRefetch: (data: any) => void;
  throttleMs?: number; // configurable
};

export function useRealtimeSync({
  socket,
  query,
  onRefetch,
  throttleMs = 1000
}: Options) {
  const hasConnectedOnce = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    async function refetchChats() {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const { data } = await client.query({
          query,
          fetchPolicy: "no-cache",
          context: { fetchOptions: { signal: controller.signal } }
        });
        onRefetch(data);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Realtime sync refetch failed:", err);
        }
      }
    }

    const handleConnect = throttle(function () {
      if (hasConnectedOnce.current) {
        refetchChats();
      } else {
        hasConnectedOnce.current = true;
      }
    }, throttleMs);

    socket.on("connect", handleConnect);

    return () => {
      if (abortRef.current) abortRef.current.abort();
      socket.off("connect", handleConnect);
    };
  }, [client, socket, query, onRefetch, throttleMs]);
}
