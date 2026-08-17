import { cookies } from "next/headers";

const COOKIE_NAME = "rw_session";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Returns a stable anonymous id for the current visitor, stored in a
 * long-lived cookie. Used only to let someone update their own vote and
 * to prevent trivial double-voting — it's not an auth system.
 */
export function getOrCreateSessionId(): string {
  const store = cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const id = crypto.randomUUID();
  store.set(COOKIE_NAME, id, {
    maxAge: ONE_YEAR,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return id;
}
