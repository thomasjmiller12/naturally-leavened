"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import FloatingParticles from "@/components/ui/FloatingParticles";

const milestones = [
  {
    year: "The Science",
    text: "Haylee studied food science in college, learning the chemistry behind fermentation, gluten development, and what makes bread rise.",
  },
  {
    year: "The Spark",
    text: "A sourdough starter gifted from a friend changed everything. What began as a weekend experiment became an obsession — in the best possible way.",
  },
  {
    year: "The Practice",
    text: "Hundreds of loaves later, she discovered that the secret isn't perfection — it's patience, intuition, and letting the dough guide you.",
  },
  {
    year: "The Sharing",
    text: "Friends and neighbors started asking for bread. Then they asked how to make it. Naturally Leavened was born from those kitchen-table conversations.",
  },
];

const values = [
  {
    title: "Simplicity",
    description:
      "Sourdough has been made with the same four ingredients for thousands of years. We don't believe in overcomplicating something that's meant to be simple.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    title: "Science Made Friendly",
    description:
      "Understanding why dough behaves the way it does makes you a better baker. We break down the science without the jargon.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    title: "Community",
    description:
      "Bread is meant to be shared. Whether it's a loaf for a neighbor or teaching someone to bake their first one — this is about connection.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });

  return (
    <>
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-24"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-warm-white via-cream to-golden-light/10" />
        <FloatingParticles count={15} color="golden" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <p className="text-[11px] tracking-[0.35em] uppercase text-golden-dark/60 mb-6">
            The Baker Behind the Bread
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-brown-dark mb-6">
            Meet <span className="italic text-golden-dark">Haylee</span>
          </h1>
          <p className="text-lg text-brown-light/80 max-w-xl mx-auto leading-relaxed">
            Food scientist, sourdough enthusiast, and firm believer that
            the best things in life take a little time.
          </p>
          <div className="w-16 h-px bg-golden/40 mx-auto mt-8" />
        </motion.div>
      </section>

      {/* Portrait + intro */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-3 -left-3 w-full h-full border border-sage/20 rounded-2xl" />
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src="/images/boule-outdoors.jpg"
                  alt="Haylee holding a beautiful sourdough boule outdoors"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-[11px] tracking-[0.3em] uppercase text-golden-dark/60 mb-6">
                Her Story
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-brown-dark mb-6 leading-snug">
                From lab coat to{" "}
                <span className="italic text-golden-dark">apron</span>
              </h2>
              <div className="space-y-4 text-brown-light/80 leading-relaxed">
                <p>
                  I never planned to become a bread baker. I was a food
                  scientist — the kind of person who reads ingredient labels for
                  fun and gets excited about the Maillard reaction. Bread was
                  just... bread.
                </p>
                <p>
                  Then a friend gave me a jar of sourdough starter, and
                  everything changed. I became fascinated by the living culture,
                  the way a few simple ingredients could transform into something
                  so complex and beautiful. I started baking every weekend, then
                  every other day, then... well, you get the idea.
                </p>
                <p>
                  What surprised me most was how simple it really is. All that
                  science I studied? It helps, but the truth is that people have
                  been making sourdough for thousands of years without knowing a
                  thing about gluten networks or lactic acid bacteria. If they
                  could do it, so can you.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline / Journey */}
      <section ref={storyRef} className="py-20 sm:py-28 bg-warm-white/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-golden-dark/60 mb-4">
              The Journey
            </p>
            <h2 className="font-serif text-4xl text-brown-dark">
              How It All <span className="italic">Started</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-golden/20 -translate-x-1/2" />

            {milestones.map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.8 }}
                className={`relative flex flex-col md:flex-row items-start gap-8 mb-16 last:mb-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 w-3 h-3 bg-golden rounded-full -translate-x-1/2 mt-1.5 shadow-[0_0_10px_rgba(212,163,115,0.3)]" />

                {/* Content */}
                <div
                  className={`ml-14 md:ml-0 md:w-1/2 ${
                    i % 2 === 0
                      ? "md:pr-16 md:text-right"
                      : "md:pl-16 md:text-left"
                  }`}
                >
                  <h3 className="font-serif text-xl text-golden-dark mb-2">
                    {milestone.year}
                  </h3>
                  <p className="text-brown-light/80 leading-relaxed text-sm">
                    {milestone.text}
                  </p>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-golden-dark/60 mb-4">
              What We Believe
            </p>
            <h2 className="font-serif text-4xl text-brown-dark">
              Baked Into Everything We{" "}
              <span className="italic">Do</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.8 }}
                className="text-center p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-golden/10 text-golden-dark flex items-center justify-center mx-auto mb-5">
                  {value.icon}
                </div>
                <h3 className="font-serif text-xl text-brown-dark mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-brown-light/70 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-brown-dark text-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl sm:text-5xl mb-6">
              Ready to bake?
            </h2>
            <p className="text-cream/60 mb-10 max-w-md mx-auto leading-relaxed">
              Join one of my classes and leave with your own sourdough starter, a
              fresh loaf, and the confidence to keep baking.
            </p>
            <Link
              href="/classes"
              className="inline-flex items-center gap-3 px-8 py-4 bg-golden text-brown-dark font-medium tracking-wider uppercase text-sm rounded-full hover:bg-golden-light transition-colors duration-300"
            >
              <span>View Classes</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
