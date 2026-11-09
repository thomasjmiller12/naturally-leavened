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
const WEEKS_AHEAD = 52; // how far out to surface classes (a full year, so every
// class date you set in Cal.com shows up — the schedule is override-only, so
// only the specific dates you add ever appear)

// Always fetch live from Cal.com — every visitor (and every page refresh) sees
// the current dates the moment Haylee changes them, with no caching delay.
export const dynamic = "force-dynamic";

type RangeSlot = {
  start: string;
  end?: string;
  // Cal.com's seated-event slot shape. Older payloads exposed `attendeesCount`;
  // current ones return seatsBooked/seatsRemaining/seatsTotal. We read all of
  // them so seat counts stay correct across either shape.
  attendeesCount?: number;
  seatsBooked?: number;
  seatsRemaining?: number;
  seatsTotal?: number;
};

async function cal(path: string, version: string) {
  const res = await fetch(`https://api.cal.com/v2${path}`, {
    headers: { Authorization: `Bearer ${API_KEY}`, "cal-api-version": version },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Cal.com ${path} responded ${res.status}`);
  }
  return res.json();
}

type Booking = {
  eventTypeId: number;
  status: string;
  start: string;
  end: string;
  attendees: unknown[];
};

async function getFullBookings(capacity: number, now: number, end: number) {
  const full: Booking[] = [];
  const take = 100;
  let skip = 0;
  let hasNextPage: boolean;

  do {
    const page = await cal(
      `/bookings?eventTypeId=${EVENT_TYPE_ID}&status=upcoming&take=${take}&skip=${skip}`,
      "2024-08-13",
    );
    for (const booking of page.data as Booking[]) {
      const startMs = Date.parse(booking.start);
      if (
        booking.eventTypeId === EVENT_TYPE_ID &&
        booking.status === "accepted" &&
        startMs > now &&
        startMs <= end &&
        booking.attendees.length >= capacity
      ) {
        full.push(booking);
      }
    }
    skip += take;
    hasNextPage = page.pagination?.hasNextPage === true;
  } while (hasNextPage);

  return full;
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
    const end = new Date(now + WEEKS_AHEAD * 7 * 86_400_000);

    const [slotsRes, fullBookings] = await Promise.all([
      cal(
        `/slots?eventTypeId=${EVENT_TYPE_ID}&start=${start}&end=${end.toISOString()}&timeZone=${encodeURIComponent(
          TIMEZONE,
        )}&format=range`,
        "2024-09-04",
      ),
      capacity
        ? getFullBookings(capacity, now, end.getTime()).catch(() => [])
        : [],
    ]);
    const byDay: Record<string, RangeSlot[]> = slotsRes.data ?? {};

    // Cal.com omits full classes from availability. Prefer live slots if both
    // feeds include a class, including when a cancellation reopens a seat.
    const seen = new Set(
      Object.values(byDay).flatMap((slots) => slots.map((slot) => Date.parse(slot.start))),
    );
    const localDate = new Intl.DateTimeFormat("sv-SE", { timeZone: TIMEZONE });
    for (const booking of fullBookings) {
      const startMs = Date.parse(booking.start);
      if (seen.has(startMs)) continue;
      seen.add(startMs);
      const day = localDate.format(startMs);
      (byDay[day] ??= []).push({
        start: booking.start,
        end: booking.end,
        seatsRemaining: 0,
      });
    }

    const sessions: Array<{
      start: string;
      durationMins: number;
      spotsLeft: number | null;
      url: string;
      calLink: string;
      date: string;
    }> = [];

    for (const day of Object.keys(byDay)) {
      for (const slot of byDay[day]) {
        const slotCapacity = slot.seatsTotal ?? capacity;
        const taken = slot.seatsBooked ?? slot.attendeesCount ?? 0;
        const spotsLeft =
          slot.seatsRemaining ??
          (slotCapacity ? Math.max(0, slotCapacity - taken) : null);
        sessions.push({
          start: slot.start,
          durationMins: slot.end
            ? (Date.parse(slot.end) - Date.parse(slot.start)) / 60_000
            : durationMins,
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

    sessions.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
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
