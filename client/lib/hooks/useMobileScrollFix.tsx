import { RefObject, useEffect } from "react";

export default function useMobileScrollFix(
  inputRef: RefObject<HTMLElement | null>,
  ...ids: string[]
) {
  useEffect(() => {
    const input = inputRef?.current;
    if (!input) return;

    const evOpts: AddEventListenerOptions = { passive: false };

    let startY = 0;
    let startScrollTop = 0;
    let touching = false;

    function onInputTouchStart(e: TouchEvent) {
      if (!input || !e.touches?.length) return;
      touching = true;
      startY = e.touches[0].clientY;
      startScrollTop = input.scrollTop;
    }

    function onInputTouchMove(e: TouchEvent) {
      if (!input || !touching || !e.touches?.length) return;

      // Always block page scroll when touching input
      e.preventDefault();

      if (input.scrollHeight <= input.clientHeight + 1) return;

      const dy = startY - e.touches[0].clientY;
      const maxScrollTop = Math.max(0, input.scrollHeight - input.clientHeight);

      input.scrollTop = Math.min(
        Math.max(startScrollTop + dy, 0),
        maxScrollTop
      );
    }

    function onInputTouchEnd() {
      touching = false;
    }

    /** Document-wide handler: block page scroll unless in input or allowed IDs */
    function onDocumentTouchMove(e: TouchEvent) {
      if (!input) return;

      // If event is inside input → let input handlers manage
      if (input.contains(e.target as Node)) return;

      // If event is inside any allowed container → let native scroll work
      if (
        ids.some((id) =>
          document.getElementById(id)?.contains(e.target as Node)
        )
      )
        return;

      // Otherwise block page scroll
      e.preventDefault();
    }

    /** Focus/Blur listeners attach/detach */
    function onFocus() {
      if (!input) return;

      document.addEventListener("touchmove", onDocumentTouchMove, evOpts);

      input.addEventListener("touchstart", onInputTouchStart, evOpts);
      input.addEventListener("touchmove", onInputTouchMove, evOpts);
      input.addEventListener("touchend", onInputTouchEnd, evOpts);
      input.addEventListener("touchcancel", onInputTouchEnd, evOpts);
    }

    function onBlur() {
      if (!input) return;

      document.removeEventListener("touchmove", onDocumentTouchMove, evOpts);

      input.removeEventListener("touchstart", onInputTouchStart, evOpts);
      input.removeEventListener("touchmove", onInputTouchMove, evOpts);
      input.removeEventListener("touchend", onInputTouchEnd, evOpts);
      input.removeEventListener("touchcancel", onInputTouchEnd, evOpts);
    }

    // Attach focus/blur on mount
    input.addEventListener("focus", onFocus, true);
    input.addEventListener("blur", onBlur, true);

    // Cleanup
    return () => {
      input.removeEventListener("focus", onFocus, true);
      input.removeEventListener("blur", onBlur, true);
      onBlur(); // ensure everything detached
    };
  }, [inputRef, ids]);
}
