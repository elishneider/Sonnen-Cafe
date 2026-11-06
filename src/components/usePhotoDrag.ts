"use client";

import { useEffect, useRef, useState } from "react";

const SETTLE_MS = 260;

// A photo carousel that follows your finger. The pictures sit side by side (previous, current, next) on a track; while
// you drag, the track moves with your finger, and on release it either slides on to the next/previous picture (a far or
// fast enough swipe) or springs back. Vertical drags are left alone so the page still scrolls. Touch events only.
export function usePhotoDrag({ enabled, onNext, onPrev }: { enabled: boolean; onNext: () => void; onPrev: () => void }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  // True while following the finger and while snapping back to the centre after a swipe: no sliding animation then.
  const [instant, setInstant] = useState(false);
  const touch = useRef<{ x: number; y: number; time: number; width: number; axis: "x" | "y" | null } | null>(null);
  const settling = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function release(direction: 1 | -1 | 0, width: number) {
    setInstant(false);
    setOffset(direction === 0 ? 0 : -direction * width);
    if (direction === 0) return;
    settling.current = true;
    timer.current = setTimeout(() => {
      setInstant(true);
      if (direction === 1) onNext();
      else onPrev();
      setOffset(0);
      settling.current = false;
      // Sliding animations come back on once the new picture is in place.
      requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
    }, SETTLE_MS);
  }

  const handlers = {
    onTouchStart(e: React.TouchEvent) {
      if (!enabled || settling.current) return;
      const t = e.touches[0];
      touch.current = { x: t.clientX, y: t.clientY, time: Date.now(), width: frameRef.current?.clientWidth ?? 300, axis: null };
    },
    onTouchMove(e: React.TouchEvent) {
      const start = touch.current;
      if (!start) return;
      const dx = e.touches[0].clientX - start.x;
      const dy = e.touches[0].clientY - start.y;
      if (!start.axis) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        start.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? "x" : "y";
        if (start.axis === "x") setInstant(true);
      }
      if (start.axis === "x") setOffset(Math.max(-start.width, Math.min(start.width, dx)));
    },
    onTouchEnd(e: React.TouchEvent) {
      const start = touch.current;
      touch.current = null;
      if (!start || start.axis !== "x") return;
      const dx = e.changedTouches[0].clientX - start.x;
      const speed = Math.abs(dx) / Math.max(1, Date.now() - start.time);
      const commit = (speed > 0.35 && Math.abs(dx) > 20) || Math.abs(dx) > start.width * 0.25;
      release(commit ? (dx < 0 ? 1 : -1) : 0, start.width);
    },
    onTouchCancel() {
      const start = touch.current;
      touch.current = null;
      if (start?.axis === "x") release(0, start.width);
    },
  };

  const trackStyle: React.CSSProperties = {
    transform: `translateX(calc(-33.3333% + ${offset}px))`,
    transition: instant ? "none" : `transform ${SETTLE_MS}ms ease-out`,
  };

  return { frameRef, handlers, trackStyle };
}
