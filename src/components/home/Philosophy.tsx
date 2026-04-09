"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

export default function Philosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 sm:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-warm-white to-cream" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-golden/[0.04] blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 rounded-full bg-sage/[0.04] blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Quote and philosophy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[11px] tracking-[0.3em] uppercase text-golden-dark/60 mb-8">
                Our Philosophy
              </p>

              <blockquote className="mb-8">
                <p className="font-serif text-3xl sm:text-4xl text-brown-dark leading-snug">
                  &ldquo;Sourdough doesn&apos;t have to be complicated.
                </p>
                <p className="font-serif text-3xl sm:text-4xl text-brown-dark leading-snug mt-2">
                  It just has to be{" "}
                  <span className="italic text-golden-dark">made with care.</span>&rdquo;
                </p>
              </blockquote>

              <div className="w-12 h-px bg-golden/40 mb-6" />

              <p className="text-brown-light/80 leading-relaxed mb-4">
                As a food scientist, I spent years studying what makes bread
                work at a molecular level. But the real secret? It&apos;s simpler
                than any textbook makes it seem.
              </p>
              <p className="text-brown-light/80 leading-relaxed">
                Naturally Leavened was born from a belief that everyone deserves
                to experience the joy of pulling a warm, crackling loaf from
                their own oven. No fancy equipment. No intimidating techniques.
                Just flour, water, salt, time — and a little guidance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-10"
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-3 text-sm tracking-wider uppercase text-golden-dark hover:text-brown-dark transition-colors duration-300 group"
              >
                <span>Meet Haylee</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Right: Image placeholder with decorative frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative"
          >
            {/* Decorative offset border */}
            <div className="absolute -top-4 -right-4 w-full h-full border border-golden/20 rounded-2xl" />

            {/* Image area */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/images/classic-crumb.jpg"
                alt="Classic sourdough with beautiful open crumb"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Subtle inner shadow */}
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_60px_rgba(0,0,0,0.05)]" />
            </div>

            {/* Floating accent */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-sage/10 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
