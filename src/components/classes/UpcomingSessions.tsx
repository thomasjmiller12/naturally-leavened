"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

/* Booking cards built from live Cal.com availability (see
   src/app/api/sessions/route.ts). Each card opens a golden-branded Cal.com
   popup pre-jumped to that date. */

const TEXT_HREF = "sms:+13855390544";
const TEXT_LABEL = "(385) 539-0544";
const CAL_LINK = "haylee-luo-0ci8if/sourdough-class";
const FULL_CALENDAR_URL = `https://cal.com/${CAL_LINK}`;

type ApiSession = {
  start: string; // ISO with offset, e.g. "2026-06-13T10:00:00.000-07:00"
  durationMins: number;
  spotsLeft: number;
  url: string; // Cal.com booking URL (fallback if popup JS unavailable)
  calLink: string; // "username/event-slug" for the embed
  date: string; // "YYYY-MM-DD" for deep-linking the popup
};

type ApiResponse = {
  configured: boolean;
  timezone?: string;
  sessions: ApiSession[];
  error?: string;
};

type State =
  | { status: "loading" }
  | { status: "ready"; sessions: ApiSession[]; timezone: string }
  | { status: "empty" };

// Cal.com embed loader + golden branding. Elements with data-cal-link open a
// popup on click (the script delegates, so React-rendered cards bind fine).
const CAL_EMBED_SNIPPET = `
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", {origin:"https://app.cal.com"});
Cal("ui", { hideEventTypeDetails:false, layout:"month_view", styles:{ branding:{ brandColor:"#B8864E" } } });
`;

function fmtTime(iso: string, timezone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date(iso))
    .replace(/\s?(AM|PM)/, (_, p) => p.toLowerCase());
}

function fmtWeekday(iso: string, timezone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
  }).format(new Date(iso));
}

function fmtMonthDay(iso: string, timezone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

function spotsNote(spotsLeft: number) {
  if (spotsLeft <= 0) return null;
  if (spotsLeft === 1) return "Last seat";
  return `${spotsLeft} spots left`;
}

const ArrowIcon = () => (
  <svg
    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function UpcomingSessions() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/sessions", { cache: "no-store" })
      .then((r) => r.json() as Promise<ApiResponse>)
      .then((data) => {
        if (cancelled) return;
        if (data.sessions && data.sessions.length > 0) {
          setState({
            status: "ready",
            sessions: data.sessions,
            timezone: data.timezone || "America/Los_Angeles",
          });
        } else {
          setState({ status: "empty" });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: "empty" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Script id="cal-embed" strategy="afterInteractive">
        {CAL_EMBED_SNIPPET}
      </Script>

      {state.status === "loading" && (
        <div className="grid gap-5 sm:grid-cols-2 max-w-3xl mx-auto">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-52 rounded-2xl border border-golden/15 bg-warm-white/50 animate-pulse"
            />
          ))}
        </div>
      )}

      {state.status === "ready" && (
        <>
          <div
            className={`grid gap-5 ${
              state.sessions.length === 1
                ? "max-w-md mx-auto"
                : "sm:grid-cols-2 max-w-3xl mx-auto"
            }`}
          >
            {state.sessions.map((session) => {
              const note = spotsNote(session.spotsLeft);
              const startMs = new Date(session.start).getTime();
              const endIso = new Date(
                startMs + session.durationMins * 60_000,
              ).toISOString();
              const timeLabel = `${fmtTime(session.start, state.timezone)} – ${fmtTime(
                endIso,
                state.timezone,
              )}`;
              const calConfig = JSON.stringify({
                month: session.date.slice(0, 7),
                date: session.date,
                layout: "month_view",
              });
              return (
                <div
                  key={session.start}
                  className="group relative flex flex-col rounded-2xl border border-golden/20 bg-warm-white/80 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-golden/40 hover:shadow-[0_18px_45px_-18px_rgba(184,134,78,0.4)]"
                >
                  <p className="text-[11px] tracking-[0.28em] uppercase text-golden-dark/70">
                    {fmtWeekday(session.start, state.timezone)}
                  </p>
                  <p className="font-serif text-3xl text-brown-dark mt-1.5">
                    {fmtMonthDay(session.start, state.timezone)}
                  </p>
                  <p className="text-sm text-brown-light/80 mt-2">{timeLabel}</p>

                  {note && (
                    <span className="inline-flex self-start items-center mt-4 text-[11px] font-medium tracking-wide uppercase text-sage-dark bg-sage/10 border border-sage/20 rounded-full px-3 py-1">
                      {note}
                    </span>
                  )}

                  <div className="mt-6 pt-5 border-t border-golden/10">
                    <a
                      href={session.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cal-link={session.calLink}
                      data-cal-config={calConfig}
                      className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-wider uppercase text-golden-dark transition-colors duration-300 hover:text-brown-dark cursor-pointer"
                    >
                      Reserve this seat
                      <ArrowIcon />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm text-brown-light/70 mt-10">
            Don&apos;t see a time that works?{" "}
            <a
              href={FULL_CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cal-link={CAL_LINK}
              data-cal-config='{"layout":"month_view"}'
              className="font-semibold text-golden-dark border-b border-golden/40 pb-0.5 transition-colors duration-300 hover:border-golden-dark cursor-pointer"
            >
              Browse the full calendar
            </a>{" "}
            or text Haylee at{" "}
            <a
              href={TEXT_HREF}
              className="font-semibold text-golden-dark border-b border-golden/40 pb-0.5 transition-colors duration-300 hover:border-golden-dark"
            >
              {TEXT_LABEL}
            </a>
            .
          </p>
        </>
      )}

      {state.status === "empty" && (
        <div className="max-w-md mx-auto text-center rounded-2xl border border-golden/15 bg-warm-white/60 px-8 py-12">
          <p className="font-serif text-2xl text-brown-dark">
            New dates are <span className="italic">on the way.</span>
          </p>
          <p className="text-sm text-brown-light/75 leading-relaxed mt-3">
            Classes are small and open a couple of times a month. Text Haylee
            to grab the next seat or get a heads-up when the next date drops.
          </p>
          <a
            href={TEXT_HREF}
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-golden text-brown-dark text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-golden-light"
          >
            Text to be notified
          </a>
        </div>
      )}
    </>
  );
}
