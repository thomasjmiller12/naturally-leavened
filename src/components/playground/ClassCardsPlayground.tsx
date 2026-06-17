"use client";

import type { PointerEvent } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";

/* ──────────────────────────────────────────────────────────────────────────
   Class card style lab. Ten different treatments of the "Upcoming class"
   booking card, rendered with sample data so Haylee can pick a favorite.
   Nothing here is wired to Cal.com — the CTAs are inert. Once a style is
   chosen we port it into src/components/classes/UpcomingSessions.tsx.
   ────────────────────────────────────────────────────────────────────────── */

type Sample = {
  weekday: string;
  monthDay: string;
  time: string;
  spots: number;
};

const SAMPLES: Sample[] = [
  { weekday: "Saturday", monthDay: "June 21", time: "10:00am – 1:00pm", spots: 2 },
  { weekday: "Sunday", monthDay: "June 29", time: "2:00pm – 5:00pm", spots: 1 },
];

function spotsLabel(spots: number) {
  if (spots <= 0) return null;
  return spots === 1 ? "Last seat" : `${spots} spots left`;
}

const Arrow = ({ thick = false }: { thick?: boolean }) => (
  <svg
    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={thick ? 2.5 : 2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

// ─── Variant 1: 3D Tilt (the current live treatment) ───────────────────────
function TiltCard({ data }: { data: Sample }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 220, damping: 16 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [9, -9]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), spring);
  const note = spotsLabel(data.spots);
  const last = data.spots === 1;

  function move(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <motion.div
      onPointerMove={move}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={{ scale: 1.035 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="group relative flex flex-col rounded-3xl border-2 border-golden/35 bg-gradient-to-br from-warm-white via-cream to-golden-light/40 p-7 shadow-[0_14px_34px_-16px_rgba(184,134,78,0.45)] transition-shadow duration-500 hover:border-golden-dark/55 hover:shadow-[0_34px_70px_-22px_rgba(184,134,78,0.65)] [transform-style:preserve-3d] will-change-transform"
    >
      <span className="absolute left-0 top-6 bottom-6 w-1.5 rounded-full bg-gradient-to-b from-golden via-honey to-golden-dark" />
      <div style={{ transform: "translateZ(45px)" }} className="pl-3">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-golden-dark">
          {data.weekday}
        </p>
        <p className="font-serif text-4xl sm:text-5xl font-medium text-brown-deep mt-1.5 leading-tight">
          {data.monthDay}
        </p>
        <p className="text-sm font-semibold text-brown-medium mt-2">{data.time}</p>
        {note && (
          <span
            className={`inline-flex mt-4 text-[11px] font-bold tracking-wide uppercase rounded-full px-3 py-1 ${
              last
                ? "text-white bg-honey shadow-sm"
                : "text-sage-dark bg-sage/15 border border-sage/30"
            }`}
          >
            {note}
          </span>
        )}
        <div className="mt-6 pt-5 border-t border-golden/20">
          <button className="group inline-flex items-center gap-2.5 rounded-full bg-brown-dark px-5 py-3 text-sm font-bold tracking-wider uppercase text-cream shadow-md transition-all duration-300 hover:bg-golden-dark hover:shadow-lg">
            Reserve this seat
            <Arrow thick />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Variant 2: Glassmorphism ───────────────────────────────────────────────
function GlassCard({ data }: { data: Sample }) {
  const note = spotsLabel(data.spots);
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex flex-col rounded-3xl border border-white/50 bg-white/30 p-7 shadow-[0_10px_40px_-12px_rgba(184,134,78,0.4)] backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_24px_60px_-16px_rgba(184,134,78,0.55)]"
    >
      <p className="text-xs font-bold tracking-[0.3em] uppercase text-golden-dark">
        {data.weekday}
      </p>
      <p className="font-serif text-4xl sm:text-5xl font-medium text-brown-deep mt-1.5 leading-tight">
        {data.monthDay}
      </p>
      <p className="text-sm font-semibold text-brown-medium mt-2">{data.time}</p>
      {note && (
        <span className="inline-flex mt-4 text-[11px] font-bold tracking-wide uppercase rounded-full px-3 py-1 bg-white/50 border border-white/60 text-golden-dark">
          {note}
        </span>
      )}
      <div className="mt-6 pt-5 border-t border-white/40">
        <button className="group inline-flex items-center gap-2.5 text-sm font-bold tracking-wider uppercase text-golden-dark transition-colors hover:text-brown-dark">
          Reserve this seat
          <Arrow />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Variant 3: Bold Dark (high contrast) ───────────────────────────────────
function DarkCard({ data }: { data: Sample }) {
  const note = spotsLabel(data.spots);
  const last = data.spots === 1;
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-brown-deep p-7 shadow-xl ring-1 ring-golden/20 transition-shadow duration-500 hover:ring-golden/60 hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]"
    >
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-golden/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
      <p className="text-xs font-bold tracking-[0.3em] uppercase text-golden-light">
        {data.weekday}
      </p>
      <p className="font-serif text-4xl sm:text-5xl font-medium text-cream mt-1.5 leading-tight">
        {data.monthDay}
      </p>
      <p className="text-sm font-semibold text-cream/60 mt-2">{data.time}</p>
      {note && (
        <span
          className={`inline-flex mt-4 text-[11px] font-bold tracking-wide uppercase rounded-full px-3 py-1 ${
            last ? "text-brown-deep bg-honey" : "text-sage-light bg-sage/20"
          }`}
        >
          {note}
        </span>
      )}
      <div className="mt-6 pt-5 border-t border-cream/10">
        <button className="group inline-flex items-center gap-2.5 rounded-full bg-golden px-5 py-3 text-sm font-bold tracking-wider uppercase text-brown-deep shadow-md transition-all duration-300 hover:bg-golden-light">
          Reserve this seat
          <Arrow thick />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Variant 4: Ticket Stub (perforated) ────────────────────────────────────
function TicketCard({ data }: { data: Sample }) {
  const note = spotsLabel(data.spots);
  return (
    <motion.div
      whileHover={{ y: -5, rotate: -0.6 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className="group relative flex flex-col rounded-3xl bg-warm-white shadow-[0_12px_34px_-14px_rgba(184,134,78,0.5)] ring-1 ring-golden/25"
    >
      {/* Notches */}
      <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-cream ring-1 ring-golden/25" />
      <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-cream ring-1 ring-golden/25" />
      <div className="p-7 pb-5">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-golden-dark">
          {data.weekday}
        </p>
        <p className="font-serif text-4xl sm:text-5xl font-medium text-brown-deep mt-1.5 leading-tight">
          {data.monthDay}
        </p>
        <p className="text-sm font-semibold text-brown-medium mt-2">{data.time}</p>
      </div>
      <div className="mx-7 border-t-2 border-dashed border-golden/35" />
      <div className="flex items-center justify-between gap-3 p-7 pt-5">
        {note && (
          <span className="text-[11px] font-bold tracking-wide uppercase text-golden-dark">
            {note}
          </span>
        )}
        <button className="group ml-auto inline-flex items-center gap-2 rounded-full bg-brown-dark px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-cream transition-all duration-300 hover:bg-golden-dark">
          Reserve
          <Arrow thick />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Variant 5: Desk Calendar tear-off ──────────────────────────────────────
function CalendarCard({ data }: { data: Sample }) {
  const note = spotsLabel(data.spots);
  const [month, day] = data.monthDay.split(" ");
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-warm-white shadow-[0_12px_34px_-14px_rgba(184,134,78,0.45)] ring-1 ring-golden/25 transition-shadow duration-500 hover:shadow-[0_28px_64px_-20px_rgba(184,134,78,0.6)]"
    >
      {/* Header band */}
      <div className="bg-gradient-to-r from-golden-dark to-honey px-6 py-3 text-center">
        <p className="text-xs font-bold tracking-[0.35em] uppercase text-cream">
          {data.weekday}
        </p>
      </div>
      <div className="px-6 py-6 text-center">
        <p className="font-serif text-7xl font-medium text-brown-deep leading-none">
          {day}
        </p>
        <p className="mt-1 text-sm font-bold tracking-[0.25em] uppercase text-golden-dark">
          {month}
        </p>
        <p className="text-sm font-semibold text-brown-medium mt-3">{data.time}</p>
        {note && (
          <p className="mt-3 text-[11px] font-bold tracking-wide uppercase text-sage-dark">
            {note}
          </p>
        )}
        <button className="group mt-5 inline-flex items-center gap-2 rounded-full bg-brown-dark px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-cream transition-all duration-300 hover:bg-golden-dark">
          Reserve this seat
          <Arrow thick />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Variant 6: Minimal Outline (fills on hover) ────────────────────────────
function OutlineCard({ data }: { data: Sample }) {
  const note = spotsLabel(data.spots);
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex flex-col rounded-3xl border-2 border-brown-dark/80 bg-transparent p-7 transition-colors duration-300 hover:bg-brown-dark"
    >
      <p className="text-xs font-bold tracking-[0.3em] uppercase text-golden-dark transition-colors duration-300 group-hover:text-golden-light">
        {data.weekday}
      </p>
      <p className="font-serif text-4xl sm:text-5xl font-medium text-brown-deep mt-1.5 leading-tight transition-colors duration-300 group-hover:text-cream">
        {data.monthDay}
      </p>
      <p className="text-sm font-semibold text-brown-medium mt-2 transition-colors duration-300 group-hover:text-cream/70">
        {data.time}
      </p>
      {note && (
        <span className="inline-flex mt-4 text-[11px] font-bold tracking-wide uppercase rounded-full px-3 py-1 border border-brown-dark/30 text-brown-medium transition-colors duration-300 group-hover:border-cream/30 group-hover:text-cream/80">
          {note}
        </span>
      )}
      <div className="mt-6 pt-5 border-t border-brown-dark/15 transition-colors duration-300 group-hover:border-cream/15">
        <span className="inline-flex items-center gap-2.5 text-sm font-bold tracking-wider uppercase text-brown-dark transition-colors duration-300 group-hover:text-golden-light">
          Reserve this seat
          <Arrow />
        </span>
      </div>
    </motion.div>
  );
}

// ─── Variant 7: Cursor Spotlight glow ───────────────────────────────────────
function SpotlightCard({ data }: { data: Sample }) {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const bg = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, rgba(212,163,115,0.35), transparent 70%)`;
  const note = spotsLabel(data.spots);

  function move(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  }

  return (
    <div
      onPointerMove={move}
      onPointerLeave={() => {
        mx.set(-200);
        my.set(-200);
      }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-golden/25 bg-warm-white p-7 shadow-[0_12px_34px_-16px_rgba(184,134,78,0.4)]"
    >
      <motion.div
        style={{ background: bg }}
        className="pointer-events-none absolute inset-0"
      />
      <div className="relative">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-golden-dark">
          {data.weekday}
        </p>
        <p className="font-serif text-4xl sm:text-5xl font-medium text-brown-deep mt-1.5 leading-tight">
          {data.monthDay}
        </p>
        <p className="text-sm font-semibold text-brown-medium mt-2">{data.time}</p>
        {note && (
          <span className="inline-flex mt-4 text-[11px] font-bold tracking-wide uppercase rounded-full px-3 py-1 bg-sage/15 border border-sage/30 text-sage-dark">
            {note}
          </span>
        )}
        <div className="mt-6 pt-5 border-t border-golden/15">
          <button className="group inline-flex items-center gap-2.5 text-sm font-bold tracking-wider uppercase text-golden-dark transition-colors hover:text-brown-dark">
            Reserve this seat
            <Arrow />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Variant 8: Big Lift (satisfying hover pop) ─────────────────────────────
function LiftCard({ data }: { data: Sample }) {
  const note = spotsLabel(data.spots);
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.04 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="group relative flex flex-col rounded-3xl border border-golden/20 bg-warm-white p-7 shadow-[0_6px_16px_-8px_rgba(184,134,78,0.35)] transition-shadow duration-300 hover:shadow-[0_40px_80px_-24px_rgba(184,134,78,0.7)]"
    >
      <p className="text-xs font-bold tracking-[0.3em] uppercase text-golden-dark">
        {data.weekday}
      </p>
      <p className="font-serif text-4xl sm:text-5xl font-medium text-brown-deep mt-1.5 leading-tight">
        {data.monthDay}
      </p>
      <p className="text-sm font-semibold text-brown-medium mt-2">{data.time}</p>
      {note && (
        <span className="inline-flex mt-4 text-[11px] font-bold tracking-wide uppercase rounded-full px-3 py-1 bg-sage/15 border border-sage/30 text-sage-dark">
          {note}
        </span>
      )}
      <div className="mt-6 pt-5 border-t border-golden/15">
        <button className="group inline-flex items-center gap-2.5 rounded-full bg-golden px-5 py-3 text-sm font-bold tracking-wider uppercase text-brown-dark transition-all duration-300 group-hover:bg-golden-dark group-hover:text-cream">
          Reserve this seat
          <Arrow thick />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Variant 9: Gradient Ring border ────────────────────────────────────────
function GradientBorderCard({ data }: { data: Sample }) {
  const note = spotsLabel(data.spots);
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative rounded-3xl bg-gradient-to-br from-golden via-honey to-sage p-[2.5px] shadow-[0_14px_34px_-16px_rgba(184,134,78,0.5)] transition-all duration-500 hover:from-golden-dark hover:via-golden hover:to-sage-dark hover:shadow-[0_30px_64px_-20px_rgba(184,134,78,0.65)]"
    >
      <div className="flex h-full flex-col rounded-[1.4rem] bg-warm-white p-7">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-golden-dark">
          {data.weekday}
        </p>
        <p className="font-serif text-4xl sm:text-5xl font-medium text-brown-deep mt-1.5 leading-tight">
          {data.monthDay}
        </p>
        <p className="text-sm font-semibold text-brown-medium mt-2">{data.time}</p>
        {note && (
          <span className="inline-flex mt-4 text-[11px] font-bold tracking-wide uppercase rounded-full px-3 py-1 bg-sage/15 border border-sage/30 text-sage-dark">
            {note}
          </span>
        )}
        <div className="mt-6 pt-5 border-t border-golden/15">
          <button className="group inline-flex items-center gap-2.5 text-sm font-bold tracking-wider uppercase text-golden-dark transition-colors hover:text-brown-dark">
            Reserve this seat
            <Arrow />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Variant 10: Polaroid (tilted, straightens on hover) ────────────────────
function PolaroidCard({ data }: { data: Sample }) {
  const note = spotsLabel(data.spots);
  return (
    <motion.div
      initial={{ rotate: -2.5 }}
      whileHover={{ rotate: 0, y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className="group relative flex flex-col rounded-sm bg-white p-4 pb-6 shadow-[0_16px_40px_-16px_rgba(60,43,31,0.45)] ring-1 ring-black/5"
    >
      {/* Photo well */}
      <div className="flex aspect-[4/3] items-center justify-center rounded-sm bg-gradient-to-br from-golden-light via-golden to-honey">
        <span className="font-serif text-5xl font-medium text-warm-white/90 drop-shadow">
          {data.monthDay}
        </span>
      </div>
      <div className="px-1 pt-4 text-center">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-golden-dark">
          {data.weekday} · {data.time}
        </p>
        {note && (
          <p className="mt-1 text-[11px] font-bold tracking-wide uppercase text-sage-dark">
            {note}
          </p>
        )}
        <button className="group mt-4 inline-flex items-center gap-2 rounded-full bg-brown-dark px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-cream transition-all duration-300 hover:bg-golden-dark">
          Reserve this seat
          <Arrow thick />
        </button>
      </div>
    </motion.div>
  );
}

type Variant = {
  n: number;
  name: string;
  blurb: string;
  Card: ({ data }: { data: Sample }) => React.ReactElement;
  dark?: boolean;
};

const VARIANTS: Variant[] = [
  { n: 1, name: "3D Tilt", blurb: "Currently live. Card leans toward the cursor; the date floats off the surface.", Card: TiltCard },
  { n: 2, name: "Glassmorphism", blurb: "Frosted translucent glass with a soft blur. Light and airy.", Card: GlassCard },
  { n: 3, name: "Bold Dark", blurb: "High-contrast espresso card with a glowing golden CTA.", Card: DarkCard, dark: true },
  { n: 4, name: "Ticket Stub", blurb: "Event-ticket feel with notches and a tear-off line. Playful.", Card: TicketCard },
  { n: 5, name: "Desk Calendar", blurb: "Big tear-off day number with a colored header band. Instantly reads as a date.", Card: CalendarCard },
  { n: 6, name: "Minimal Outline", blurb: "Clean outline that fills with espresso on hover. Understated.", Card: OutlineCard },
  { n: 7, name: "Cursor Spotlight", blurb: "A warm glow follows the pointer across the card.", Card: SpotlightCard },
  { n: 8, name: "Big Lift", blurb: "Satisfying spring lift + scale with a dramatic shadow.", Card: LiftCard },
  { n: 9, name: "Gradient Ring", blurb: "Animated golden-to-sage gradient border frames the card.", Card: GradientBorderCard },
  { n: 10, name: "Polaroid", blurb: "Tilted photo card that straightens on hover. Matches the polaroid stack below.", Card: PolaroidCard },
];

export default function ClassCardsPlayground() {
  return (
    <main className="min-h-screen bg-cream pb-32">
      {/* Header */}
      <header className="border-b border-golden/15 bg-warm-white/70 px-6 py-12 backdrop-blur">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] font-bold tracking-[0.35em] uppercase text-golden-dark/70">
            Design Lab
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-brown-dark mt-3">
            Class card <span className="italic text-golden-dark">styles</span>
          </h1>
          <p className="mt-4 max-w-2xl text-brown-light/80 leading-relaxed">
            Ten takes on the &ldquo;Upcoming class&rdquo; booking card. Hover each
            one to feel its interaction. Pick a favorite (or mix and match) and
            I&apos;ll wire it into the real classes page. The CTAs here are inert.
          </p>
          <Link
            href="/classes"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-golden-dark border-b border-golden/40 pb-0.5 transition-colors hover:border-golden-dark"
          >
            ← Back to the live classes page
          </Link>
        </div>
      </header>

      {/* Variants */}
      <div className="mx-auto max-w-5xl space-y-20 px-6 pt-16">
        {VARIANTS.map(({ n, name, blurb, Card, dark }) => (
          <section key={n}>
            <div className="mb-6 flex items-baseline gap-4">
              <span className="font-serif text-2xl text-golden-dark/50 tabular-nums">
                {String(n).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-serif text-2xl text-brown-dark">{name}</h2>
                <p className="text-sm text-brown-light/70 mt-0.5">{blurb}</p>
              </div>
            </div>
            <div
              className={`grid gap-6 rounded-3xl p-8 sm:grid-cols-2 ${
                dark
                  ? "bg-brown-deep/[0.04]"
                  : "bg-gradient-to-br from-golden-light/20 to-sage-light/10"
              }`}
            >
              {SAMPLES.map((s, i) => (
                <Card key={i} data={s} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
