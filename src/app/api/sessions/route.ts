import { NextResponse } from "next/server";

/* ════════════════════════════════════════════════════════════════════
   Pulls real availability for the Sourdough Class from the Cal.com API
   and returns it as a clean list the booking cards render from. The API
   key stays server-side (never shipped to the browser).

   Cal.com is the source of truth: set your class dates and seat count
   there, and these cards follow automatically.

   Setup: CALCOM_API_KEY in .env.local (local) and in the Vercel project's
   Environment Variables (preview/production). With no key set, this returns
   { configured: false } and the page shows a graceful "text Haylee" state.
   ════════════════════════════════════════════════════════════════════ */

const API_KEY = process.env.CALCOM_API_KEY;
const USERNAME = "haylee-luo-0ci8if";
const EVENT_SLUG = "sourdough-class";
const EVENT_TYPE_ID = 5958486;
const TIMEZONE = "America/Los_Angeles";
const WEEKS_AHEAD = 4; // how far out to surface classes

// Re-pull from Cal.com at most every 5 minutes.
export const revalidate = 300;

type RangeSlot = {
  start: string;
  end?: string;
  attendeesCount?: number;
};

async function cal(path: string, version: string) {
  const res = await fetch(`https://api.cal.com/v2${path}`, {
    headers: { Authorization: `Bearer ${API_KEY}`, "cal-api-version": version },
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`Cal.com ${path} responded ${res.status}`);
  }
  return res.json();
}

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json({ configured: false, sessions: [] });
  }

  try {
    // Event type → seat capacity + duration (so we can compute spots left).
    const eventType = await cal(`/event-types/${EVENT_TYPE_ID}`, "2024-06-14");
    const et = eventType.data ?? eventType;
    const capacity: number | null = et.seats?.seatsPerTimeSlot ?? null;
    const durationMins: number = et.lengthInMinutes ?? 180;

    const now = Date.now();
    const start = new Date(now + 60_000).toISOString(); // strictly future
    const end = new Date(now + WEEKS_AHEAD * 7 * 86_400_000).toISOString();

    // format=range returns attendeesCount per slot for seated events.
    const slotsRes = await cal(
      `/slots?eventTypeId=${EVENT_TYPE_ID}&start=${start}&end=${end}&timeZone=${encodeURIComponent(
        TIMEZONE,
      )}&format=range`,
      "2024-09-04",
    );
    const byDay: Record<string, RangeSlot[]> = slotsRes.data ?? {};

    const sessions: Array<{
      start: string;
      durationMins: number;
      spotsLeft: number;
      url: string;
      calLink: string;
      date: string;
    }> = [];

    for (const day of Object.keys(byDay)) {
      for (const slot of byDay[day]) {
        const taken = slot.attendeesCount ?? 0;
        const spotsLeft = capacity ? Math.max(0, capacity - taken) : 0;
        if (capacity && spotsLeft <= 0) continue; // full → don't show
        sessions.push({
          start: slot.start,
          durationMins,
          spotsLeft,
          url: `https://cal.com/${USERNAME}/${EVENT_SLUG}?month=${day.slice(
            0,
            7,
          )}&date=${day}`,
          calLink: `${USERNAME}/${EVENT_SLUG}`,
          date: day,
        });
      }
    }

    sessions.sort((a, b) => a.start.localeCompare(b.start));
    return NextResponse.json({ configured: true, timezone: TIMEZONE, sessions });
  } catch (error) {
    // Never break the booking section on an API hiccup.
    return NextResponse.json({
      configured: true,
      sessions: [],
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
