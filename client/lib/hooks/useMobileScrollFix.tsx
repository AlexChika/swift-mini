import { RefObject, useEffect } from "react";

export default function useMobileScrollFix(
  inputRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const input = inputRef?.current;
    if (!input) return;

    const evOpts: AddEventListenerOptions = { passive: false };

    let startY = 0;
    let startScrollTop = 0;
    let touching = false;

    function onInputTouchStart(e: TouchEvent) {
      console.log("touched start");
      if (!e.touches?.length) return;
      if (!input) return;
      touching = true;
      startY = e.touches[0].clientY;
      startScrollTop = input.scrollTop;
    }

    function onInputTouchMove(e: TouchEvent) {
      console.log("ran here");
      if (!touching || !e.touches?.length) return;
      if (!input) return;

      const curY = e.touches[0].clientY;
      const dy = startY - curY; // positive = user swiped up => content should scroll down (scrollTop increases)
      const maxScrollTop = Math.max(0, input.scrollHeight - input.clientHeight);
      const newScrollTop = startScrollTop + dy;

      const isScrollable = input.scrollHeight > input.clientHeight + 1;

      if (!isScrollable) {
        // If input isn't scrollable, trap the touch so the page doesn't move
        e.preventDefault();
        return;
      }

      // If newScrollTop is strictly inside bounds, we handle it and prevent page scroll
      if (newScrollTop > 0 && newScrollTop < maxScrollTop) {
        input.scrollTop = newScrollTop;
        e.preventDefault();
        return;
      }

      // If user tries to go past the top or bottom, clamp and prevent default so page doesn't steal it
      if (newScrollTop <= 0) {
        input.scrollTop = 0;
        e.preventDefault();
        return;
      }

      if (newScrollTop >= maxScrollTop) {
        input.scrollTop = maxScrollTop;
        e.preventDefault();
        return;
      }
    }

    function onInputTouchEnd() {
      touching = false;
    }

    // Document-wide touchmove to stop the page from scrolling while input is focused.
    // We don't prevent if the target is inside the input — the input handler will manage it.
    function onDocumentTouchMove(e: TouchEvent) {
      if (!input) return;

      console.log(e.target, "target");
      if (input.contains(e.target as Node)) {
        console.log("ran input");
        // let the input handler decide (it will call preventDefault when it handles movement)
        return;
      }

      if (
        document
          .querySelector("#swft-message-container")
          ?.contains(e.target as Node)
      ) {
        console.log("ran messages");
        return;
      }

      // otherwise block page scroll while input is focused
      e.preventDefault();
    }

    function onFocus() {
      if (!input) return;

      // add document handler to stop page scroll (passive:false so preventDefault works)
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

    input.addEventListener("focus", onFocus, true);
    input.addEventListener("blur", onBlur, true);

    // cleanup
    return () => {
      input.removeEventListener("focus", onFocus, true);
      input.removeEventListener("blur", onBlur, true);
      onBlur(); // ensure all handlers removed
    };
  }, [inputRef]);
}
