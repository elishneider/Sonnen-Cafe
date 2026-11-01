import { timingSafeEqual } from "node:crypto";

// Reads the password out of an HTTP Basic "Authorization" header. Any username is accepted;
// only the password counts. Returns null if the header is missing or malformed.
export function getBasicAuthPassword(header: string | null): string | null {
  if (!header?.startsWith("Basic ")) return null;
  let decoded: string;
  try {
    decoded = Buffer.from(header.slice("Basic ".length), "base64").toString("utf8");
  } catch {
    return null;
  }
  const colon = decoded.indexOf(":");
  return colon === -1 ? null : decoded.slice(colon + 1);
}

// Compares without leaking, through timing, how much of the password was right.
export function passwordsMatch(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
