import { useCallback, useEffect } from "react";
import { swiftEvent } from "../helpers/swiftEvent";

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

    swiftEvent.addEventListener(eventName, listener);
    return () => {
      swiftEvent.removeEventListener(eventName, listener);
    };
  }, [callback, eventName]);

  const dispatch = useCallback(
    (data: Swift.Events[K]) => {
      const event = new CustomEvent(eventName, { detail: { data } });
      swiftEvent.dispatchEvent(event);
    },
    [eventName]
  );

  return { dispatch };
}
