"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Stage {
  title: string;
  subtitle: string;
  description: string;
  bgGradient: string;
  blobColors: string;
  blobRadius: string;
  blobSize: number;
  blobGlow: string;
  accent: string;
}

const stages: Stage[] = [
  {
    title: "The Starter",
    subtitle: "Where life begins",
    description:
      "Just flour and water, transformed by time into something alive. Your starter is a living culture — bubbly, fragrant, and ready to rise.",
    bgGradient: "from-cream via-warm-white to-sage-light/10",
    blobColors: "from-[#F5E6D3] via-[#EDD8C0] to-[#E8D0B5]",
    blobRadius: "63% 37% 54% 46% / 55% 48% 52% 45%",
    blobSize: 240,
    blobGlow: "rgba(139, 158, 130, 0.15)",
    accent: "text-sage-dark",
  },
  {
    title: "The Mix",
    subtitle: "Simple ingredients, endless possibility",
    description:
      "Flour, water, salt, and starter. That's it. Four ingredients that have nourished humanity for thousands of years. No complicated recipes needed.",
    bgGradient: "from-warm-white via-cream to-golden-light/10",
    blobColors: "from-[#F0E4D4] via-[#E8D5BE] to-[#DFC8AD]",
    blobRadius: "47% 53% 42% 58% / 52% 45% 55% 48%",
    blobSize: 270,
    blobGlow: "rgba(212, 163, 115, 0.12)",
    accent: "text-brown-light",
  },
  {
    title: "The Rest",
    subtitle: "Patience is the secret ingredient",
    description:
      "This is the magic moment — the dough rests, the gluten develops, the flavors deepen. Good bread can't be rushed. And that's part of its beauty.",
    bgGradient: "from-cream via-golden-light/5 to-warm-white",
    blobColors: "from-[#EAD9C4] via-[#E0CDAF] to-[#D8C4A2]",
    blobRadius: "50% 50% 48% 52% / 49% 51% 49% 51%",
    blobSize: 300,
    blobGlow: "rgba(200, 145, 90, 0.1)",
    accent: "text-honey",
  },
  {
    title: "The Shape",
    subtitle: "Your hands tell the story",
    description:
      "Gentle folds, a confident shape, the satisfying tension of a well-formed loaf. This is where craft meets intuition. You'll feel it in your hands.",
    bgGradient: "from-warm-white via-golden-light/10 to-cream",
    blobColors: "from-[#DFC5A5] via-[#D4B68E] to-[#CAAA80]",
    blobRadius: "40% 60% 55% 45% / 55% 40% 60% 45%",
    blobSize: 280,
    blobGlow: "rgba(184, 134, 78, 0.15)",
    accent: "text-golden-dark",
  },
  {
    title: "The Bake",
    subtitle: "Transformation through fire",
    description:
      "Steam, heat, and the intoxicating aroma that fills your kitchen. The crust sings as it crackles. There's nothing quite like pulling a golden loaf from the oven.",
    bgGradient: "from-golden-light/20 via-cream to-warm-white",
    blobColors: "from-[#D4A373] via-[#C8915A] to-[#B8864E]",
    blobRadius: "52% 48% 46% 54% / 48% 52% 48% 52%",
    blobSize: 290,
    blobGlow: "rgba(212, 163, 115, 0.3)",
    accent: "text-golden-dark",
  },
  {
    title: "The Share",
    subtitle: "Bread is meant to be broken together",
    description:
      "The crackle of the crust, the soft, open crumb inside — this is what it's all about. Bread made with love, shared with people you care about.",
    bgGradient: "from-cream via-golden-light/10 to-brown-dark/5",
    blobColors: "from-[#8B6F5E] via-[#A0826E] to-[#D4A373]",
    blobRadius: "50% 50% 47% 53% / 50% 48% 52% 50%",
    blobSize: 310,
    blobGlow: "rgba(139, 111, 94, 0.2)",
    accent: "text-brown-medium",
  },
];

export default function BreadJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadGsap = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const totalStages = stages.length;
      const scrollPerStage = window.innerHeight * 1.5;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalStages * scrollPerStage}`,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);
          const stageIndex = Math.min(
            Math.floor(p * totalStages),
            totalStages - 1
          );
          setActiveStage(stageIndex);
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    };

    loadGsap();
  }, []);

  const stage = stages[activeStage];
  const stageProgress =
    (progress * stages.length - activeStage) /
    1;

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Background gradient — transitions between stages */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${stage.bgGradient} transition-all duration-1000`}
      />

      {/* Subtle radial glow behind the blob */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full transition-all duration-1000 blur-3xl"
        style={{ background: stage.blobGlow }}
      />

      {/* Main content container */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-6 max-w-6xl mx-auto">
        {/* Left: Blob */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          {/* Outer ring */}
          <div
            className="absolute rounded-full border border-golden/10 transition-all duration-1000 animate-breathe"
            style={{
              width: `${stage.blobSize + 80}px`,
              height: `${stage.blobSize + 80}px`,
              borderRadius: stage.blobRadius,
            }}
          />

          {/* Main blob */}
          <div
            className={`blob-shape bg-gradient-to-br ${stage.blobColors} shadow-2xl`}
            style={{
              width: `${stage.blobSize}px`,
              height: `${stage.blobSize}px`,
              borderRadius: stage.blobRadius,
              boxShadow: `0 25px 60px -20px ${stage.blobGlow}, 0 0 80px -30px ${stage.blobGlow}`,
            }}
          >
            {/* Inner shimmer */}
            <div
              className="w-full h-full rounded-[inherit] bg-gradient-to-t from-white/0 via-white/10 to-white/20"
              style={{
                transform: `rotate(${activeStage * 30}deg)`,
                transition: "transform 1.5s ease",
              }}
            />
          </div>

          {/* Small decorative dots */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-golden/20 transition-all duration-1000"
              style={{
                top: `${20 + i * 30}%`,
                left: i % 2 === 0 ? "-20px" : "auto",
                right: i % 2 === 1 ? "-20px" : "auto",
                transform: `translateY(${Math.sin((activeStage + i) * 1.2) * 15}px)`,
              }}
            />
          ))}
        </div>

        {/* Right: Text content */}
        <div className="text-center lg:text-left max-w-md">
          {/* Stage counter */}
          <motion.div
            key={`counter-${activeStage}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] tracking-[0.3em] uppercase text-golden-dark/60 mb-4"
          >
            {String(activeStage + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
          </motion.div>

          {/* Title */}
          <motion.h2
            key={`title-${activeStage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-brown-dark mb-3"
          >
            {stage.title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            key={`subtitle-${activeStage}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`font-serif italic text-lg ${stage.accent} mb-6`}
          >
            {stage.subtitle}
          </motion.p>

          {/* Decorative line */}
          <motion.div
            key={`line-${activeStage}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-12 h-px bg-golden/40 mb-6 mx-auto lg:mx-0 origin-left"
          />

          {/* Description */}
          <motion.p
            key={`desc-${activeStage}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-brown-light/80 leading-relaxed"
          >
            {stage.description}
          </motion.p>
        </div>
      </div>

      {/* Progress dots — right edge */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {stages.map((s, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i === activeStage
                ? "bg-golden scale-125 shadow-[0_0_8px_rgba(212,163,115,0.4)]"
                : i < activeStage
                  ? "bg-golden/40"
                  : "bg-brown-light/20"
            }`}
          />
        ))}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent z-10 pointer-events-none" />
    </section>
  );
}
