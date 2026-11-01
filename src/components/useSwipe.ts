"use client";

import { useRef } from "react";

const MIN_DISTANCE_PX = 40;

// Finger swipes: left or right. Vertical drags are left alone so the page still scrolls.
// Only touch events are used, so mouse and trackpad behaviour doesn't change.
export function useSwipe({ onSwipeLeft, onSwipeRight }: { onSwipeLeft?: () => void; onSwipeRight?: () => void }) {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onTouchStart(e: React.TouchEvent) {
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd(e: React.TouchEvent) {
      const from = start.current;
      start.current = null;
      if (!from) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - from.x;
      const dy = t.clientY - from.y;
      if (Math.abs(dx) < MIN_DISTANCE_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    },
    onTouchCancel() {
      start.current = null;
    },
  };
}
