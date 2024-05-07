import { useEffect } from "react";

// Mobile....
/*Hooks is used to dynamically set the height of an element to the visible browser height excluding browse-nav-bars using the window.innerHeight aproach */
type Ref = React.MutableRefObject<HTMLDivElement | null>;

const useDynamicHeight = (ref: Ref, sub = 0) => {
  // elementRef is an html element ref from useRef
  // sub is the height to deduct which could account for navbars, footer that are static on a page when useDynamicHeight is used inside a div containing navs or any otherr element

  /* -- dynamic  Wrapper Height logic - */
  useEffect(() => {
    const refElement = ref.current;
    if (!refElement) return;

    function set(_height: number) {
      if (!refElement) return;

      if (window.innerWidth > 767) {
        refElement.style.height = `${_height}px`;
      } else {
        refElement.style.height = `${_height - sub}px`;
      }
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
