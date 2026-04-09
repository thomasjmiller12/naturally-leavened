"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

/* ─── Stage Data ─── */

interface Stage {
  title: string;
  subtitle: string;
  description: string;
  illustration: string;
  accent: string;
  warmth: number; // 0 = cool/neutral, 1 = warmest (for background warmth shift)
}

const stages: Stage[] = [
  {
    title: "The Starter",
    subtitle: "Where life begins",
    description:
      "Just flour and water, transformed by time into something alive. Your starter is a living culture — bubbly, fragrant, and ready to rise.",
    illustration: "/images/journey/01-starter.svg",
    accent: "text-sage-dark",
    warmth: 0,
  },
  {
    title: "The Mix",
    subtitle: "Simple ingredients, endless possibility",
    description:
      "Flour, water, salt, and starter. That's it. Four ingredients that have nourished humanity for thousands of years.",
    illustration: "/images/journey/02-mix.svg",
    accent: "text-brown-light",
    warmth: 0.15,
  },
  {
    title: "The Stretch",
    subtitle: "Building strength, one fold at a time",
    description:
      "Gentle folds, patient hands. With each stretch, the gluten develops and the dough transforms from shaggy mess to silky promise.",
    illustration: "/images/journey/03-stretch.svg",
    accent: "text-honey",
    warmth: 0.3,
  },
  {
    title: "The Rise",
    subtitle: "Patience is the secret ingredient",
    description:
      "The dough rests, the wild cultures work their magic, the flavors deepen. Good bread can't be rushed. And that's part of its beauty.",
    illustration: "/images/journey/04-proof.svg",
    accent: "text-golden-dark",
    warmth: 0.45,
  },
  {
    title: "The Score",
    subtitle: "A baker's signature",
    description:
      "One confident slash of the blade — part art, part science. The score guides the bread's bloom and becomes your personal mark on every loaf.",
    illustration: "/images/journey/05-score.svg",
    accent: "text-golden-dark",
    warmth: 0.6,
  },
  {
    title: "The Bake",
    subtitle: "Transformation through fire",
    description:
      "Steam, heat, and the intoxicating aroma that fills your kitchen. The crust sings as it crackles. There's nothing quite like pulling a golden loaf from the oven.",
    illustration: "/images/journey/06-bloom.svg",
    accent: "text-golden-dark",
    warmth: 0.85,
  },
  {
    title: "The Share",
    subtitle: "Bread is meant to be broken together",
    description:
      "The crackle of the crust, the soft open crumb inside — this is what it's all about. Bread made with love, shared with people you care about.",
    illustration: "/images/journey/07-crumb.svg",
    accent: "text-brown-medium",
    warmth: 1,
  },
];

/* ─── Flour Dust Particles (Feature #2) ─── */

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  angle: number;
  speed: number;
  opacity: number;
}

function FlourBurst({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const prevTrigger = useRef(trigger);

  useEffect(() => {
    if (trigger !== prevTrigger.current) {
      prevTrigger.current = trigger;
      const burst: Particle[] = Array.from({ length: 10 }, (_, i) => ({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50 + (Math.random() - 0.5) * 20,
        size: 2 + Math.random() * 4,
        angle: Math.random() * Math.PI * 2,
        speed: 30 + Math.random() * 50,
        opacity: 0.4 + Math.random() * 0.4,
      }));
      setParticles(burst);
      const timer = setTimeout(() => setParticles([]), 1200);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-golden-light/60"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: 0,
            animation: `flour-drift 1.2s ease-out forwards`,
            // @ts-expect-error CSS custom properties
            "--drift-x": `${Math.cos(p.angle) * p.speed}px`,
            "--drift-y": `${Math.sin(p.angle) * p.speed}px`,
            "--start-opacity": p.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Cursor Flour Trail (Feature #5) ─── */

interface TrailDot {
  id: number;
  x: number;
  y: number;
}

function CursorTrail({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [dots, setDots] = useState<TrailDot[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 20) return;
    lastPos.current = { x, y };
    const dot: TrailDot = { id: Date.now(), x, y };
    setDots((prev) => [...prev.slice(-8), dot]);
    setTimeout(() => {
      setDots((prev) => prev.filter((d) => d.id !== dot.id));
    }, 600);
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [containerRef, handleMouseMove]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {dots.map((d) => (
        <div
          key={d.id}
          className="absolute w-1.5 h-1.5 rounded-full bg-golden-light/40 animate-fade-out"
          style={{ left: d.x, top: d.y, transform: "translate(-50%, -50%)" }}
        />
      ))}
    </div>
  );
}

/* ─── Progress Line (Feature #4) ─── */

function ProgressLine({
  activeStage,
  total,
}: {
  activeStage: number;
  total: number;
}) {
  const progress = (activeStage / (total - 1)) * 100;

  return (
    <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center h-48">
      {/* Track */}
      <div className="relative w-px h-full bg-brown-light/10">
        {/* Fill */}
        <div
          className="absolute top-0 left-0 w-full bg-golden transition-all duration-700 ease-out"
          style={{ height: `${progress}%` }}
        />
        {/* Stage markers */}
        {stages.map((_, i) => {
          const y = (i / (total - 1)) * 100;
          return (
            <div
              key={i}
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: `${y}%` }}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-500 ${
                  i === activeStage
                    ? "bg-golden border-golden scale-125 shadow-[0_0_8px_rgba(212,163,115,0.5)]"
                    : i < activeStage
                      ? "bg-golden/60 border-golden/60"
                      : "bg-cream border-brown-light/20"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

export default function BreadJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [prevStage, setPrevStage] = useState(0);

  // Track stage changes for flour burst
  useEffect(() => {
    if (activeStage !== prevStage) {
      setPrevStage(activeStage);
    }
  }, [activeStage, prevStage]);

  useEffect(() => {
    const loadGsap = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const totalStages = stages.length;
      const scrollPerStage = window.innerHeight * 1.2;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalStages * scrollPerStage}`,
        pin: true,
        scrub: 0.3,
        onUpdate: (self) => {
          const stageIndex = Math.min(
            Math.floor(self.progress * totalStages),
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

  // Feature #7: Background warmth shift
  const warmth = stage.warmth;
  const bgStyle = {
    background: `linear-gradient(to bottom,
      hsl(30, ${20 + warmth * 30}%, ${97 - warmth * 4}%),
      hsl(35, ${15 + warmth * 25}%, ${98 - warmth * 3}%),
      hsl(30, ${20 + warmth * 30}%, ${97 - warmth * 4}%))`,
    transition: "background 1s ease",
  };

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Feature #7: Dynamic warm background */}
      <div className="absolute inset-0 transition-all duration-1000" style={bgStyle} />

      {/* Radial glow — shifts with warmth */}
      <div
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, hsla(35, ${40 + warmth * 30}%, 70%, ${0.06 + warmth * 0.06}) 0%, transparent 70%)`,
        }}
      />

      {/* Feature #5: Cursor flour trail */}
      <CursorTrail containerRef={containerRef} />

      {/* Main content — illustration left, text right */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 px-6 lg:px-16 max-w-7xl mx-auto">
        {/* Left: Illustration */}
        <div
          ref={illustrationRef}
          className="relative flex-shrink-0 w-64 h-64 sm:w-72 sm:h-72 lg:w-[340px] lg:h-[340px]"
        >
          {/* Decorative ring */}
          <div className="absolute -inset-4 rounded-[2rem] border border-golden/10 animate-breathe" />

          {/* Feature #2: Flour burst on transition */}
          <FlourBurst trigger={activeStage} />

          {/* Illustration container */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(139,111,94,0.15)]">
            {stages.map((s, i) => {
              const isActive = i === activeStage;
              const wasActive = i === prevStage && i !== activeStage;
              // Feature #3: Page-turn direction (outgoing slides up-left, incoming slides from down-right)
              const slideX = isActive ? 0 : wasActive ? -15 : 15;
              const slideY = isActive ? 0 : wasActive ? -10 : 10;

              return (
                <div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: `translate(${slideX}px, ${slideY}px) scale(${isActive ? 1 : 1.03})`,
                    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    zIndex: isActive ? 2 : 1,
                  }}
                >
                  {/* Feature #6: Illustration breathing — subtle scale pulse */}
                  <div
                    className={isActive ? "w-full h-full animate-breathe-subtle" : "w-full h-full"}
                  >
                    <Image
                      src={s.illustration}
                      alt={s.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 340px"
                      priority={i < 2}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating accent dots — Feature #1 parallax feel */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-golden/20 transition-all duration-[1.2s] ease-out"
              style={{
                top: `${10 + i * 22}%`,
                left: i % 2 === 0 ? "-18px" : "auto",
                right: i % 2 === 1 ? "-18px" : "auto",
                transform: `translateY(${Math.sin((activeStage + i) * 1.1) * 15}px)`,
              }}
            />
          ))}
        </div>

        {/* Right: Text content */}
        <div className="text-center lg:text-left flex-1 min-w-0">
          {/* Feature #8: Staggered text entrance — counter */}
          <motion.div
            key={`counter-${activeStage}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[11px] tracking-[0.3em] uppercase text-golden-dark/60 mb-4"
          >
            {String(activeStage + 1).padStart(2, "0")} /{" "}
            {String(stages.length).padStart(2, "0")}
          </motion.div>

          {/* Title — stagger delay 0.1 */}
          <motion.h2
            key={`title-${activeStage}`}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
            className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] text-brown-dark mb-3"
          >
            {stage.title}
          </motion.h2>

          {/* Subtitle — stagger delay 0.2 */}
          <motion.p
            key={`subtitle-${activeStage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`font-serif italic text-lg ${stage.accent} mb-6`}
          >
            {stage.subtitle}
          </motion.p>

          {/* Decorative line — stagger delay 0.3 */}
          <motion.div
            key={`line-${activeStage}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-12 h-px bg-golden/40 mb-6 mx-auto lg:mx-0 origin-left"
          />

          {/* Description — stagger delay 0.35 */}
          <motion.p
            key={`desc-${activeStage}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-brown-light/80 leading-relaxed"
          >
            {stage.description}
          </motion.p>
        </div>
      </div>

      {/* Feature #4: Progress line instead of dots */}
      <ProgressLine activeStage={activeStage} total={stages.length} />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent z-10 pointer-events-none" />
    </section>
  );
}
