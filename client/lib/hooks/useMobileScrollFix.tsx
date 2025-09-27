/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject, useEffect } from "react";

export default function useMobileInputScrollFix(
  inputRef: RefObject<HTMLElement | null>,
  parentRef?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const inputEl = inputRef?.current;
    const parentEl = (parentRef?.current ??
      document.querySelector("#swft-message-container") ??
      document.documentElement) as HTMLDivElement;

    if (!inputEl) return;

    let startY = 0;
    let lastScrollY = 0;

    // Detect passive event support
    const supportsPassive = (() => {
      let passive = false;
      try {
        const opts = Object.defineProperty({}, "passive", {
          get() {
            passive = true;
            return true;
          }
        });
        window.addEventListener("testPassive", null as any, opts);
        window.removeEventListener("testPassive", null as any, opts);
      } catch (e) {
        // ignore
      }
      return passive;
    })();
    const evOpts: AddEventListenerOptions | boolean = supportsPassive
      ? { passive: false }
      : false;

    function onTouchStart(e: TouchEvent) {
      startY = e.touches[0].clientY;
    }

    function onTouchMove(e: TouchEvent) {
      const curY = e.touches[0].clientY;
      const dy = curY - startY;

      if (!inputEl) return;
      const el = inputEl;

      const canScroll = el.scrollHeight > el.clientHeight + 1;
      const atTop = el.scrollTop <= 0;
      const atBottom =
        Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;

      if (!canScroll) {
        e.preventDefault();
        return;
      }

      if ((atTop && dy > 0) || (atBottom && dy < 0)) {
        e.preventDefault();
      }
    }

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

    function onViewportResize() {
      if (window.visualViewport && parentEl) {
        parentEl.style.height = ` ${window.visualViewport.height}px`;
      }
    }

    function onFocus() {
      lockBody();
      if (window.visualViewport && parentEl) {
        parentEl.style.height = `${window.visualViewport.height}px`;
        window.visualViewport.addEventListener("resize", onViewportResize);
      }
      if (!inputEl) return;
      inputEl.addEventListener("touchstart", onTouchStart, evOpts);
      inputEl.addEventListener("touchmove", onTouchMove, evOpts);
    }

    function onBlur() {
      unlockBody();
      if (window.visualViewport && parentEl) {
        window.visualViewport.removeEventListener("resize", onViewportResize);
        parentEl.style.height = "";
      }
      if (!inputEl) return;
      inputEl.removeEventListener("touchstart", onTouchStart, evOpts);
      inputEl.removeEventListener("touchmove", onTouchMove, evOpts);
    }

    inputEl.addEventListener("focus", onFocus, true);
    inputEl.addEventListener("blur", onBlur, true);

    return () => {
      inputEl.removeEventListener("focus", onFocus, true);
      inputEl.removeEventListener("blur", onBlur, true);
      onBlur();
    };
  }, [inputRef, parentRef]);
}
