import { useEffect } from "react";
import { throttle } from "@/lib/helpers";

// Mobile....
type Options = {
  ref: React.RefObject<HTMLDivElement | null>;
  sub?: number | (() => number);
  useRems?: boolean;
  condition?: boolean | (() => boolean);
};

/**
 * A React hook that dynamically sets the height of a referenced element to the visible browser height,
 * excluding browser navigation bars, using the `window.innerHeight` approach.
 *
 * @remarks
 * This hook is useful for mobile layouts where you want an element to fill the visible viewport,
 * optionally subtracting a fixed height (e.g., for navbars or footers).
 *
 * @param options - Configuration options for the hook.
 * @param options.ref - The React ref of the target element whose height will be set.
 * @param options.sub - The height in pixels to deduct from the visible height (e.g., for static navbars or footers). sub can be a number or a function that returns a number.
 * @param options.useRems - If `true`, the deducted height `sub` will be computed based on its `rem` equivalent value. If your element is using `rem` units, set this to `true`.
 * @param options.condition - A boolean or function returning a boolean that determines whether the `sub` value should be deducted.
 *   - If a function, it is called on every scroll/resize event.
 *   - If `true`, the deduction is always applied.
 *   - If `false` or `undefined`, the deduction is never applied.
 *
 * @example
  ```tsx
  const ref = useRef<HTMLDivElement>(null);
  useDynamicHeight({
    ref,
    sub: () => window.matchMedia("(min-width: 48rem)").matches ? 140 : 195;
    useRems: true,
    condition: () => window.scrollY > 0
    });
 * ```
 */

const useDynamicHeight = (options: Options) => {
  const { ref, useRems = false, sub = 0, condition } = options;

  /* -- dynamic  Wrapper Height logic - */
  useEffect(() => {
    const refElement = ref.current;
    if (!refElement) return;

    function set(_height: number) {
      if (!refElement) return;

      const computed = (sub: number) =>
        `calc(${_height}px - ${useRems ? `${sub / 16}rem` : `${sub}px`})`;

      function _set(cond: boolean, el: HTMLElement, def?: "default") {
        const _sub = typeof sub === "function" ? sub() : sub;
        if (def === "default") return (el.style.height = computed(_sub));
        if (cond) el.style.height = computed(_sub);
        else el.style.height = computed(0);
      }

      if (typeof condition === "function") {
        _set(condition(), refElement);
      } else if (typeof condition === "boolean") {
        _set(condition, refElement);
      } else _set(true, refElement, "default");
    }

    let _height = window.innerHeight;
    set(_height); //initial set on render

    const handleScrollEvent = throttle(function () {
      if (_height === window.innerHeight) return;
      _height = window.innerHeight;
      set(_height);
    }, 50);

    function handleResizeEvent() {
      _height = window.innerHeight;
      set(_height);
    }

    refElement.addEventListener("scroll", handleScrollEvent);
    window.addEventListener("resize", handleResizeEvent);

    return () => {
      refElement.removeEventListener("scroll", handleScrollEvent);
      window.removeEventListener("resize", handleResizeEvent);
    };
  }, [ref, sub, condition, useRems]);
};

export default useDynamicHeight;
