import { useEffect } from "react";

// Mobile....

type Ref = React.MutableRefObject<HTMLDivElement | null>;
type Condition = boolean | (() => boolean);

/**
 * Hooks is used to dynamically set the height of an element to the visible browser height excluding browse-nav-bars using the window.innerHeight aproach
 * @param condition a function that return a bool, which defines when the {sub} shoul be deducted or not. conditon can also be a boolean. a true would mean always deduct while a false and undefined will mean never deduct
 * @param ref the react ref of target element
 * @param sub the height to deduct which could account for navbars, footer that are static on a page when useDynamicHeight is used inside a div containing navs or any otherr element
 */
const useDynamicHeight = (ref: Ref, sub = 0, condition?: Condition) => {
  /* -- dynamic  Wrapper Height logic - */
  useEffect(() => {
    const refElement = ref.current;
    if (!refElement) return;

    function set(_height: number) {
      if (!refElement) return;

      if (typeof condition === "function") {
        condition()
          ? (refElement.style.height = `${_height - sub}px`)
          : (refElement.style.height = `${_height - 0}px`);
      } else if (typeof condition === "boolean") {
        condition
          ? (refElement.style.height = `${_height - sub}px`)
          : (refElement.style.height = `${_height - 0}px`);
      } else refElement.style.height = `${_height - sub}px`;
    }

    let _height = window.innerHeight;
    set(_height); //initial set on render

    function handleScrollEvent() {
      // console.log("i ran scrolls");
      if (_height === window.innerHeight) return;
      _height = window.innerHeight;
      set(_height);
    }

    function handleResizeEvent() {
      // console.log("I ran resuiz");
      _height = window.innerHeight;
      set(_height);
    }

    refElement.addEventListener("scroll", handleScrollEvent);
    window.addEventListener("resize", handleResizeEvent);

    return () => {
      refElement.removeEventListener("scroll", handleScrollEvent);
      window.removeEventListener("resize", handleResizeEvent);
    };
  }, [ref, sub]);
};

export default useDynamicHeight;
