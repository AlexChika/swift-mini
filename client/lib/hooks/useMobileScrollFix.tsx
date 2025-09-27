import { RefObject, useEffect } from "react";

type Opts = {
  // if true, also try a position:fixed body lock (fallback for stubborn browsers)
  enableBodyFix?: boolean;
  // whether to resize parent to visualViewport height (default true)
  useVisualViewport?: boolean;
};

export default function useMobileScrollFix(
  inputRef: RefObject<HTMLElement | null>,
  parentRef?: RefObject<HTMLElement | null>,
  opts: Opts = {}
) {
  useEffect(() => {
    const input = inputRef?.current;
    const parent = (parentRef?.current ??
      document.querySelector("#swft-message-container") ??
      document.documentElement) as HTMLDivElement;
    if (!input) return;

    const { enableBodyFix = false, useVisualViewport = true } = opts;

    // passive detection
    const supportsPassive = (() => {
      let passive = false;
      try {
        const obj = Object.defineProperty({}, "passive", {
          get() {
            passive = true;
            return true;
          }
        });
        // @ts-expect-error : throws
        window.addEventListener("testPassive", null, obj);
        // @ts-expect-error : throws
        window.removeEventListener("testPassive", null, obj);
      } catch {
        /* ignore */
      }
      return passive;
    })();
    const evOpts: AddEventListenerOptions | boolean = supportsPassive
      ? { passive: false }
      : false;

    let startY = 0;
    let startScrollTop = 0;
    let touching = false;

    function onInputTouchStart(e: TouchEvent) {
      if (!e.touches?.length) return;
      if (!input) return;
      touching = true;
      startY = e.touches[0].clientY;
      startScrollTop = input.scrollTop;
    }

    function onInputTouchMove(e: TouchEvent) {
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
      if (input.contains(e.target as Node)) {
        // let the input handler decide (it will call preventDefault when it handles movement)
        return;
      }

      if (
        document
          .querySelector("#swft-message-container")
          ?.contains(e.target as Node)
      ) {
        return;
      }

      // otherwise block page scroll while input is focused
      e.preventDefault();
    }

    function onViewportResize() {
      if (useVisualViewport && parent && window.visualViewport) {
        parent.style.height = ` ${window.visualViewport.height}px`;
      }
    }

    // optional body fix when some browsers still scroll despite touch handlers
    let lastScrollY = 0;
    function lockBody() {
      lastScrollY = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = "fixed";
      document.body.style.top = `-${lastScrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    }
    function unlockBody() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, lastScrollY);
    }

    function onFocus() {
      if (!input) return;

      // add document handler to stop page scroll (passive:false so preventDefault works)
      document.addEventListener("touchmove", onDocumentTouchMove, evOpts);

      //   input.addEventListener("touchstart", onInputTouchStart, evOpts);
      //   input.addEventListener("touchmove", onInputTouchMove, evOpts);
      //   input.addEventListener("touchend", onInputTouchEnd, evOpts);
      //   input.addEventListener("touchcancel", onInputTouchEnd, evOpts);

      if (useVisualViewport && window.visualViewport && parent) {
        parent.style.height = ` ${window.visualViewport.height}px`;
        window.visualViewport.addEventListener("resize", onViewportResize);
      }

      if (enableBodyFix) {
        lockBody();
      }
    }

    function onBlur() {
      if (!input) return;

      document.removeEventListener("touchmove", onDocumentTouchMove, evOpts);
      //   input.removeEventListener("touchstart", onInputTouchStart, evOpts);
      //   input.removeEventListener("touchmove", onInputTouchMove, evOpts);
      //   input.removeEventListener("touchend", onInputTouchEnd, evOpts);
      //   input.removeEventListener("touchcancel", onInputTouchEnd, evOpts);

      if (useVisualViewport && window.visualViewport && parent) {
        window.visualViewport.removeEventListener("resize", onViewportResize);
        parent.style.height = "";
      }

      if (enableBodyFix) {
        unlockBody();
      }
    }

    input.addEventListener("focus", onFocus, true);
    input.addEventListener("blur", onBlur, true);

    // cleanup
    return () => {
      input.removeEventListener("focus", onFocus, true);
      input.removeEventListener("blur", onBlur, true);
      onBlur(); // ensure all handlers removed
    };
  }, [inputRef, parentRef, opts.enableBodyFix, opts.useVisualViewport]);
}
