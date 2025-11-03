import { useCallback, useEffect } from "react";

interface AppEvent<P> extends Event {
  detail: { data: P };
}

export function useEvent<K extends keyof Swift.Events>(
  eventName: K,
  callback?: ({ data }: { data: Swift.Events[K] }) => void
) {
  useEffect(() => {
    if (!callback) {
      return;
    }

    const listener = ((event: AppEvent<Swift.Events[K]>) => {
      callback(event.detail); // Use `event.detail` for custom payloads
    }) as EventListener;

    window.addEventListener(eventName, listener);
    return () => {
      window.removeEventListener(eventName, listener);
    };
  }, [callback, eventName]);

  const dispatch = useCallback(
    (data: Swift.Events[K]) => {
      const event = new CustomEvent(eventName, { detail: { data } });
      window.dispatchEvent(event);
    },
    [eventName]
  );

  return { dispatch };
}
