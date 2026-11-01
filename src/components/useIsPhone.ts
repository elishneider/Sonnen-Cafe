"use client";

import { useSyncExternalStore } from "react";

// Matches the phone breakpoint used in globals.css.
const PHONE_QUERY = "(max-width: 560px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// True on a phone-sized screen. The server renders as "not a phone"; browsers update right after.
export function useIsPhone() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(PHONE_QUERY).matches,
    () => false,
  );
}
