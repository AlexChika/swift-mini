import { useRef, useCallback, useMemo } from "react";

type Ref = HTMLTextAreaElement | HTMLDivElement | null;

export function useScrollableTextarea() {
  const ref = useRef<Ref>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const el = ref.current;
    if (!el) return;

    el.dataset.startY = String(e.touches[0].clientY);
    el.dataset.startScroll = String(el.scrollTop);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const el = ref.current;
    if (!el) return;

    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;
    if (scrollHeight <= clientHeight) return; // not scrollable

    const startY = Number(el.dataset.startY || 0);
    const startScroll = Number(el.dataset.startScroll || 0);
    const deltaY = startY - e.touches[0].clientY;
    const newScrollTop = startScroll + deltaY;

    if (newScrollTop >= 0 && newScrollTop <= scrollHeight - clientHeight) {
      e.preventDefault();
      e.stopPropagation();
      el.scrollTo({
        top: newScrollTop,
        behavior: "smooth"
      });
    }
  }, []);

  return useMemo(
    () => ({ ref, onTouchStart, onTouchMove }),
    [onTouchMove, onTouchStart]
  );
}
