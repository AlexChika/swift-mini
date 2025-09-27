/* -------------------- Mehod 1 -------------------- */

// useEffect(() => {
//   if (!InputBox.current) return;
//   const input = InputBox.current;

//   function onTouchStart(e: TouchEvent) {
//     if (!InputBox.current) return;

//     const input = InputBox.current;
//     const { scrollTop } = input;

//     // Store initial touch position
//     const startY = e.touches[0].clientY;
//     (input as any)._startY = startY;
//     (input as any)._startScrollTop = scrollTop;
//   }

//   function onTouchMove(e: TouchEvent) {
//     if (!InputBox.current) return;

//     const input = InputBox.current;
//     const { scrollHeight, clientHeight } = input;
//     const currentY = e.touches[0].clientY;
//     const startY = (input as any)._startY;
//     const deltaY = startY - currentY;

//     // Check if input is scrollable
//     const isScrollable = scrollHeight > clientHeight;

//     if (isScrollable) {
//       const newScrollTop = (input as any)._startScrollTop + deltaY;

//       // If we're trying to scroll within the input bounds
//       if (newScrollTop >= 0 && newScrollTop <= scrollHeight - clientHeight) {
//         e.preventDefault();
//         e.stopPropagation();

//         // Smooth scroll using scrollTo
//         input.scrollTo({
//           top: newScrollTop,
//           behavior: "smooth"
//         });
//       }
//     }
//   }

//   input.addEventListener("touchstart", onTouchStart);
//   input.addEventListener("touchmove", onTouchMove);

//   return () => {
//     input.removeEventListener("touchstart", onTouchStart);
//     input.removeEventListener("touchmove", onTouchMove);
//   };
// }, [InputBox]);
