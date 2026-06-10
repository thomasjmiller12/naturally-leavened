import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

const ingredients = [
  { n: "01", name: "Flour", role: "the structure" },
  { n: "02", name: "Water", role: "brings it to life" },
  { n: "03", name: "Salt", role: "flavor & control" },
  { n: "04", name: "Starter", role: "the wild rise" },
];

export default function WhatIsSourdough() {
  return (
    <section
      id="sourdough"
      className="scroll-mt-24 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-30"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
        <div>
          <Reveal>
            <p className="text-[11px] tracking-[0.32em] uppercase text-golden-dark mb-5">
              What is sourdough, really?
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.875rem] leading-[1.06] text-brown-dark [letter-spacing:-0.4px]">
              Four ingredients.
              <br />A little time. That&rsquo;s the whole secret.
            </h2>
            <div className="w-14 h-px bg-golden-dark/50 my-6" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[17px] leading-[1.7] text-brown-medium max-w-lg mb-4">
              &ldquo;Naturally leavened&rdquo; means no commercial yeast — just
              a living culture of wild yeast and bacteria that you grow
              yourself. It&rsquo;s the oldest way to make bread, and it&rsquo;s
              far simpler than the internet makes it look.
            </p>
            <p className="text-[17px] leading-[1.7] text-brown-medium max-w-lg">
              Once you understand what each ingredient is doing, the mystery
              falls away. Here&rsquo;s everything that goes into a loaf:
            </p>
          </Reveal>
          <Reveal delay={0.2} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8 lg:max-w-md">
            {ingredients.map((ing) => (
              <div
                key={ing.n}
                className="flex items-center gap-3.5 bg-cream/55 border border-golden-dark/20 rounded-2xl px-4 py-3.5"
              >
                <span className="font-serif italic text-[15px] text-golden-dark w-5 flex-none">
                  {ing.n}
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-brown-dark">
                    {ing.name}
                  </span>
                  <span className="block text-xs text-brown-light">
                    {ing.role}
                  </span>
                </span>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal
          delay={0.15}
          className="relative aspect-[16/11] lg:aspect-[4/5] rounded-[22px] overflow-hidden shadow-[0_36px_80px_-34px_rgba(92,61,46,0.45)] order-first lg:order-none"
        >
          <Image
            src="/images/starter-active.jpg"
            alt="An active sourdough starter bubbling over the top of its jar"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <span className="absolute left-4 bottom-4 bg-brown-dark/80 text-cream text-xs tracking-wide px-3.5 py-2 rounded-xl backdrop-blur-sm">
            A starter at its peak — doubled and bubbling over
          </span>
        </Reveal>
      </div>
    </section>
  );
}
