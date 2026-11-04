"use client";

import { useEffect, useRef, useState } from "react";
import { formatSegmentTime, type TimelineSegment } from "@/lib/sunTimeline";

const SEGMENT_ICON: Record<string, string> = {
  sun: "☀️",
  partial: "⛅",
  shade: "☁️",
};

const SEGMENT_TOOLTIP_LABEL: Record<string, string> = {
  sun: "Sunny",
  partial: "Partly sunny",
  shade: "Shade",
  closed: "Closed",
};

// "Closed" hours aren't the interesting part of this widget — each closed minute only
// counts for a fraction of its real width, so a café that's closed for 8 hours doesn't
// crowd out the (much more useful) open/sun hours into an unreadable sliver. Real
// timestamps are untouched; this only affects how much horizontal space a segment draws.
const CLOSED_WEIGHT_FACTOR = 0.12;

const MIN_CONTENT_PCT = 6;
// "Closed" is a whole word, not a single glyph like the weather icons — it needs
// noticeably more room before it fits without clipping into its neighbor.
const MIN_CLOSED_TEXT_PCT = 18;
const ROW_HEIGHT_PX = 18;
const TICK_BASE_HEIGHT_PX = 6;
// Space a label's text takes beside its tick (margin + line height).
const LABEL_TEXT_BLOCK_PX = 20;

// Used until the bar's real width has been measured.
const ASSUMED_BAR_WIDTH_PX = 190;
// Rough width of one character of label text, plus a little air between neighbouring labels.
const CHAR_WIDTH_PX = 6.4;
const LABEL_GAP_PX = 8;

function weightOf(segment: TimelineSegment): number {
  const durationMs = segment.end.getTime() - segment.start.getTime();
  return segment.status === "closed" ? durationMs * CLOSED_WEIGHT_FACTOR : durationMs;
}

type Side = "below" | "above";
type Label = { pct: number; text: string; isStart: boolean; isEnd: boolean; side: Side; depth: number };

// Gives every time label a slot so that no two labels overlap, whatever the screen width. Slots are tried in
// this order: just below the bar, just above it, a second row below, a second row above, and so on, so
// labels that would collide alternate between the two sides (their tick lines go up or down to the bar).
// There is always another slot further out, so a label is never left sitting on top of another.
// The first/last labels ("Now" / "Open", and the end time / "Close") are anchored to the bar's edges so
// they can't spill past the card.
function layoutLabels(points: { pct: number; text: string; isEnd?: boolean }[], barWidth: number): Label[] {
  const lastRightBySlot = new Map<string, number>();
  return points.map(({ pct, text, isEnd = false }) => {
    const width = text.length * CHAR_WIDTH_PX + LABEL_GAP_PX;
    const isStart = pct === 0;
    const left = isEnd ? barWidth - width : isStart ? 0 : (pct / 100) * barWidth - width / 2;
    for (let depth = 0; ; depth++) {
      for (const side of ["below", "above"] as const) {
        const key = `${side}${depth}`;
        if (left >= (lastRightBySlot.get(key) ?? -Infinity)) {
          lastRightBySlot.set(key, left + width);
          return { pct, text, isStart, isEnd, side, depth };
        }
      }
    }
  });
}

// "Today" runs to the very end of the day, which would read as an odd "23:59".
function formatEndLabel(end: Date, from: Date) {
  if (end.getHours() === 23 && end.getMinutes() === 59) return "00:00";
  return formatSegmentTime(end, from);
}

export function SunTimeline({
  segments,
  startLabel = "Now",
  endLabel,
}: {
  segments: TimelineSegment[];
  startLabel?: string;
  // Defaults to the end time; pass text (e.g. "Close") to override, or null to hide it.
  endLabel?: string | null;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [barWidth, setBarWidth] = useState(ASSUMED_BAR_WIDTH_PX);
  const hasSegments = segments.length > 0;
  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    // Label positions are worked out in pixels, so they follow the bar's real width (phone, laptop, popup).
    const observer = new ResizeObserver(([entry]) => setBarWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasSegments]);

  if (segments.length === 0) return null;

  const from = segments[0].start;
  const weights = segments.map(weightOf);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight <= 0) return null;

  const cumulative: number[] = [];
  let runningTotal = 0;
  for (const w of weights) {
    runningTotal += w;
    cumulative.push(runningTotal);
  }

  const labels = layoutLabels([
    { pct: 0, text: startLabel },
    ...segments.slice(0, -1).map((segment, i) => ({
      pct: (cumulative[i] / totalWeight) * 100,
      text: formatSegmentTime(segment.end, from),
    })),
    // The default end label is a time; skip it when the bar finishes on "Closed", since the
    // bar then obviously runs to the end of the day.
    ...(endLabel === null || (endLabel === undefined && segments[segments.length - 1].status === "closed")
      ? []
      : [
          {
            pct: 100,
            text: endLabel ?? formatEndLabel(segments[segments.length - 1].end, from),
            isEnd: true,
          },
        ]),
  ], barWidth);
  const deepest = (side: Side) =>
    labels.reduce((max, label) => (label.side === side ? Math.max(max, label.depth) : max), -1);
  const belowDepth = deepest("below");
  const aboveDepth = deepest("above");
  const rowsHeight = (depth: number) => TICK_BASE_HEIGHT_PX + depth * ROW_HEIGHT_PX + LABEL_TEXT_BLOCK_PX;
  const renderLabel = (label: Label, i: number) => (
    <div
      key={i}
      className={`sun-timeline-tick-group${label.isStart ? " sun-timeline-tick-group--now" : ""}${label.isEnd ? " sun-timeline-tick-group--end" : ""}${label.side === "above" ? " sun-timeline-tick-group--above" : ""}`}
      style={label.isEnd ? { right: 0 } : { left: `${label.pct}%` }}
    >
      <span className="sun-timeline-tick" style={{ height: TICK_BASE_HEIGHT_PX + label.depth * ROW_HEIGHT_PX }} />
      <span className="sun-timeline-label">{label.text}</span>
    </div>
  );

  return (
    <div className="sun-timeline" ref={rootRef}>
      {aboveDepth >= 0 && (
        <div className="sun-timeline-labels sun-timeline-labels--above" style={{ height: rowsHeight(aboveDepth) }}>
          {labels.map((label, i) => (label.side === "above" ? renderLabel(label, i) : null))}
        </div>
      )}
      <div className="sun-timeline-track">
        {segments.map((segment, i) => {
          const pct = (weights[i] / totalWeight) * 100;
          return (
            <div
              key={i}
              className={`sun-timeline-segment sun-timeline-segment--${segment.status}`}
              // Fixed percentage basis, no grow/shrink — must render at exactly `pct`, the
              // same number the tick/label below is positioned at, or the two drift apart
              // (flex-grow alone lets a segment's own icon/text nudge its width off-ratio).
              style={{ flexBasis: `${pct}%`, flexGrow: 0, flexShrink: 0 }}
              title={`${SEGMENT_TOOLTIP_LABEL[segment.status]}, ${formatSegmentTime(segment.start, from)}–${formatSegmentTime(segment.end, from)}`}
            >
              {segment.status === "closed"
                ? pct >= MIN_CLOSED_TEXT_PCT && <span className="sun-timeline-text">Closed</span>
                : pct >= MIN_CONTENT_PCT && (
                    <span className="sun-timeline-icon">{SEGMENT_ICON[segment.status]}</span>
                  )}
            </div>
          );
        })}
      </div>
      <div className="sun-timeline-labels" style={{ height: rowsHeight(Math.max(0, belowDepth)) }}>
        {labels.map((label, i) => (label.side === "below" ? renderLabel(label, i) : null))}
      </div>
    </div>
  );
}
