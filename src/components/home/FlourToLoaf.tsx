import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

const steps = [
  { num: "01", name: "Starter", desc: "A living culture, bubbly and ready", img: "/images/journey/01-starter.svg" },
  { num: "02", name: "Mix", desc: "Flour, water, salt, starter", img: "/images/journey/02-mix.svg" },
  { num: "03", name: "Stretch", desc: "Gentle folds build strength", img: "/images/journey/03-stretch.svg" },
  { num: "04", name: "Rise", desc: "Patience deepens flavor", img: "/images/journey/04-proof.svg" },
  { num: "05", name: "Score", desc: "One confident slash", img: "/images/journey/05-score.svg" },
  { num: "06", name: "Bake", desc: "Steam, heat, a singing crust", img: "/images/journey/06-bloom.svg" },
  { num: "07", name: "Share", desc: "Broken together, warm", img: "/images/journey/07-crumb.svg" },
];

export default function FlourToLoaf() {
  return (
    <section
      id="process"
      className="scroll-mt-24 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-30"
    >
      <div className="max-w-2xl">
        <Reveal>
          <p className="text-[11px] tracking-[0.32em] uppercase text-golden-dark mb-5">
            From flour to loaf
          </p>
          <h2 className="font-serif text-[2rem] sm:text-4xl lg:text-5xl leading-[1.06] text-brown-dark [letter-spacing:-0.4px]">
            Bread is a process — not a recipe.
          </h2>
          <div className="w-14 h-px bg-golden-dark/50 my-6" />
          <p className="text-[17px] leading-[1.7] text-brown-medium max-w-xl">
            Every loaf travels the same seven moments — from a jar of wild
            yeast to a crackling, shareable crust. None of them is hard once
            someone shows you how.
          </p>
        </Reveal>
      </div>

      <Reveal
        delay={0.1}
        className="mt-12 bg-cream/60 border border-golden-dark/25 rounded-3xl px-6 py-8 lg:px-10 lg:py-11 backdrop-blur-[3px] shadow-[0_30px_70px_-40px_rgba(92,61,46,0.4)]"
      >
        {/* Horizontal ribbon on desktop, vertical timeline on mobile */}
        <div className="relative grid grid-cols-1 lg:grid-cols-7 lg:gap-2">
          <div
            aria-hidden
            className="absolute bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-golden-dark/45 to-transparent top-0 bottom-0 left-[37px] w-px lg:top-[46px] lg:bottom-auto lg:left-[7%] lg:right-[7%] lg:w-auto lg:h-px"
          />
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative flex lg:flex-col items-center lg:text-center gap-4.5 lg:gap-0 py-3.5 lg:py-0"
            >
              <span className="relative z-10 w-[74px] h-[74px] lg:w-[92px] lg:h-[92px] flex-none rounded-full overflow-hidden bg-warm-white border border-golden-dark/30 shadow-[0_8px_22px_-10px_rgba(92,61,46,0.35)]">
                <Image
                  src={step.img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="92px"
                />
              </span>
              <span className="flex flex-col lg:items-center">
                <span className="text-[10px] tracking-[0.22em] text-golden-dark lg:mt-3.5">
                  {step.num}
                </span>
                <span className="font-serif text-[17px] text-brown-dark mt-0.5">
                  {step.name}
                </span>
                <span className="text-xs leading-snug text-brown-light mt-1 lg:max-w-[130px]">
                  {step.desc}
                </span>
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
