import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default function Hero() {
  return (
    <section className="relative min-h-dvh grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] items-center gap-8 lg:gap-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 lg:pt-32 pb-16">
      {/* Copy */}
      <Reveal className="max-w-xl order-2 lg:order-1">
        <p className="text-[11px] tracking-[0.32em] uppercase text-golden-dark mb-6">
          Small-batch sourdough &middot; Castro Valley, CA
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-[4.5rem] leading-[1.02] text-brown-dark [letter-spacing:-0.4px]">
          Sourdough is simpler
          <br />
          than you <em className="italic text-golden-dark">think.</em>
        </h1>
        <p className="text-lg leading-relaxed text-brown-medium mt-6 max-w-md">
          Haylee&rsquo;s a food scientist who teaches hands-on classes for
          people who are sure they&rsquo;re &lsquo;not a baker.&rsquo; Give her
          one afternoon — she&rsquo;ll prove you wrong.
        </p>
        <div className="flex items-center flex-wrap gap-6 mt-9">
          <Link
            href="/classes"
            className="inline-flex items-center gap-2.5 bg-golden text-brown-dark font-semibold text-sm tracking-wider uppercase px-8 py-4 rounded-full shadow-[0_12px_30px_-12px_rgba(184,134,78,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-golden-light hover:shadow-[0_18px_40px_-14px_rgba(184,134,78,0.7)]"
          >
            Book a class
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
            href="#learn"
            className="text-sm font-semibold text-brown-medium border-b border-golden-dark/40 pb-1 transition-colors duration-300 hover:border-golden-dark"
          >
            See what you&rsquo;ll learn
          </a>
        </div>
        <div className="flex items-center flex-wrap gap-4 mt-9 text-[13.5px] font-medium text-sage-dark">
          <span>Groups of 2–4</span>
          <span className="opacity-40">•</span>
          <span>$95 per person</span>
          <span className="opacity-40">•</span>
          <span>About 3 hours</span>
        </div>
      </Reveal>

      {/* Photography — the star, no longer ghosted behind text */}
      <Reveal
        delay={0.15}
        className="relative order-1 lg:order-2 h-[50vh] min-h-[330px] lg:h-[74vh] lg:max-h-[620px]"
      >
        <div
          aria-hidden
          className="absolute -left-1.5 top-4 bottom-4 right-3.5 lg:top-8 lg:bottom-8 lg:right-7 border border-golden/40 rounded-[22px]"
        />
        <div className="relative w-full h-full rounded-[22px] overflow-hidden shadow-[0_36px_80px_-34px_rgba(92,61,46,0.5)]">
          <Image
            src="/images/class-1.jpg"
            alt="A golden scored sourdough boule held up against a blue sky"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
            priority
          />
        </div>
        <Link
          href="/about"
          className="absolute bottom-7 lg:bottom-12 -left-2 lg:-left-4 flex items-center gap-3 bg-warm-white rounded-2xl px-5 py-3 shadow-[0_18px_40px_-14px_rgba(92,61,46,0.45)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          <span className="relative w-10 h-10 rounded-full overflow-hidden flex-none">
            <Image
              src="/images/haylee-portrait.jpg"
              alt="Haylee"
              fill
              className="object-cover"
              sizes="40px"
            />
          </span>
          <span>
            <span className="block font-serif italic text-[15px] text-brown-dark">
              Taught by Haylee
            </span>
            <span className="block text-[11.5px] text-brown-light tracking-wide mt-px">
              Food scientist &amp; baker
            </span>
          </span>
        </Link>
      </Reveal>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2.5">
        <span className="text-[10px] tracking-[0.3em] uppercase text-brown-light/50">
          Scroll
        </span>
        <i className="w-px h-8 bg-gradient-to-b from-golden-dark/50 to-transparent animate-cue" />
      </div>
    </section>
  );
}
