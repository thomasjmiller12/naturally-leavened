import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

const stats = [
  { value: "2–4", label: "per class" },
  { value: "3 hrs", label: "hands-on" },
  { value: "$95", label: "all included" },
];

export default function BakeCTA() {
  return (
    <section
      id="book"
      className="scroll-mt-24 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-28 lg:pt-36 lg:pb-32 text-center"
    >
      <Reveal>
        <p className="text-[11px] tracking-[0.32em] uppercase text-golden/85 mb-6">
          The oven&rsquo;s warm
        </p>
        <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.94] text-cream [letter-spacing:-0.4px]">
          Bake your
          <br />
          first <em className="italic text-golden">loaf.</em>
        </h2>
        <p className="text-lg leading-relaxed text-cream/70 max-w-md mx-auto mt-7">
          No experience needed — just you and a love of good bread. Pick a
          date, or text Haylee with a question first.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="flex items-center justify-center flex-wrap gap-6 mt-10">
          <Link
            href="/classes"
            className="inline-flex items-center gap-2.5 bg-golden text-brown-dark font-semibold text-sm tracking-wider uppercase px-8 py-4 rounded-full shadow-[0_12px_30px_-12px_rgba(184,134,78,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-golden-light hover:shadow-[0_18px_40px_-14px_rgba(184,134,78,0.7)]"
          >
            Reserve your spot
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <a
            href="sms:+13855390544"
            className="text-sm font-semibold text-cream/80 border-b border-golden/50 pb-1 transition-colors duration-300 hover:border-golden"
          >
            Text (385) 539-0544
          </a>
        </div>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="flex justify-center flex-wrap gap-8 sm:gap-14 mt-16 pt-8 border-t border-golden/20 max-w-xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-serif text-3xl text-golden">{stat.value}</div>
              <div className="text-[11.5px] tracking-wider uppercase text-cream/50 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
