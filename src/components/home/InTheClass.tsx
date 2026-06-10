import Reveal from "@/components/ui/Reveal";
import { TAKEAWAYS } from "@/lib/takeaways";

const curriculum = [
  {
    num: "01",
    title: "Read your starter",
    desc: "Get to know the living culture — how to feed it, and how to tell the exact moment it's ripe to bake.",
  },
  {
    num: "02",
    title: "Hands in the dough",
    desc: "You'll do every step yourself, with Haylee beside you to catch what your hands haven't learned yet.",
  },
  {
    num: "03",
    title: "The why, not just the how",
    desc: "The food science behind the rise, in plain English. Understand it once and the recipe becomes optional.",
  },
  {
    num: "04",
    title: "Taste & troubleshoot",
    desc: "Break into a fresh loaf together, and walk through the fixes for what trips up every beginner.",
  },
];

const takeaways = TAKEAWAYS;

export default function InTheClass() {
  return (
    <section
      id="learn"
      className="scroll-mt-24 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-30"
    >
      <Reveal className="max-w-2xl mb-12">
        <p className="text-[11px] tracking-[0.32em] uppercase text-cream/70 mb-5">
          In the class
        </p>
        <h2 className="font-serif text-[2rem] sm:text-4xl lg:text-5xl leading-[1.06] text-cream [letter-spacing:-0.4px]">
          Three hours, start to finish.
        </h2>
        <div className="w-14 h-px bg-golden-light/60 mt-6" />
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        <div className="flex flex-col">
          {curriculum.map((item, i) => (
            <Reveal
              key={item.num}
              delay={i * 0.08}
              className={`flex gap-5 py-5.5 ${i > 0 ? "border-t border-golden-light/25" : ""}`}
            >
              <span className="font-serif text-[22px] text-golden-light w-9 flex-none">
                {item.num}
              </span>
              <div>
                <h3 className="font-serif text-xl text-cream">{item.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-cream/70 mt-1.5">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal
          delay={0.15}
          className="bg-brown-deep/40 border border-golden-light/20 rounded-3xl p-7 sm:p-9 backdrop-blur-[3px]"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-golden-light/80">
            You&rsquo;ll walk away with
          </p>
          <h3 className="font-serif text-2xl text-cream mt-2.5 mb-6">
            More than a loaf.
          </h3>
          <ol className="flex flex-col gap-4">
            {takeaways.map((item, i) => (
              <li
                key={item}
                className="flex gap-4 items-baseline text-[14.5px] leading-normal text-cream/85"
              >
                <span className="font-serif text-base text-golden-light/90 w-6 flex-none tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
