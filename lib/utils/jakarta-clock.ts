/** Time-of-day greeting word based on the Asia/Jakarta hour. */
export function jakartaGreeting(now = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      hourCycle: "h23", // guarantees 00–23, avoids the "24" midnight quirk
    }).format(now),
  );

  if (hour >= 5 && hour < 11) {
    return "Good morning";
  }
  if (hour >= 11 && hour < 15) {
    return "Good afternoon";
  }
  if (hour >= 15 && hour < 18) {
    return "Good evening";
  }
  return "Good night";
}

/** Empty-state greeting title, e.g. "Good morning, Braiyen" (falls back to greeting only). */
export function formatGreetingTitle(name: string, now = new Date()): string {
  const firstName = name.trim().split(/\s+/)[0] ?? "";
  const greeting = jakartaGreeting(now);
  return firstName ? `${greeting}, ${firstName}` : greeting;
}

/** Empty-state subtitle line, picked by Asia/Jakarta time-of-day bucket. */
export function formatJakartaEmptySubtitle(now = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(now),
  );

  if (hour >= 5 && hour < 11) {
    return "Compiler's warm. What are we building?";
  }
  if (hour >= 11 && hour < 15) {
    return "Peak hours for bugs and bad decisions.";
  }
  if (hour >= 15 && hour < 18) {
    return "Golden hour for code reviews nobody asked for.";
  }
  return "Prime debugging hours, allegedly.";
}

/**
 * Offset so `Date.now() + offset` ≈ server time.
 * Uses mid-RTT adjustment against `/api/time` (Vercel).
 */
export async function fetchServerClockOffsetMs(
  fetchImpl: typeof fetch = fetch,
): Promise<number> {
  const clientSentAt = Date.now();
  const response = await fetchImpl("/api/time", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`time api ${response.status}`);
  }

  const { now: serverNow } = (await response.json()) as { now: number };
  const clientReceivedAt = Date.now();
  const rttMs = clientReceivedAt - clientSentAt;
  const serverAtReceive = serverNow + rttMs / 2;
  return serverAtReceive - clientReceivedAt;
}

export function serverAlignedNow(offsetMs: number): Date {
  return new Date(Date.now() + offsetMs);
}
