"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import FloatingParticles from "@/components/ui/FloatingParticles";

export default function RecipesPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const bodyInView = useInView(bodyRef, { once: true, margin: "-80px" });

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim().length === 0) return;
    setSubmitted(true);
  };

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
            Coming Soon
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-brown-dark mb-6">
            Recipes <span className="italic text-golden-dark">— Brewing</span>
          </h1>
          <p className="text-lg text-brown-light/80 max-w-xl mx-auto leading-relaxed">
            Haylee&apos;s favorite recipes are being written down, tested
            again, and photographed. They&apos;ll be here soon — promise.
          </p>
          <div className="w-16 h-px bg-golden/40 mx-auto mt-8" />
        </motion.div>
      </section>

      {/* In the meantime */}
      <section ref={bodyRef} className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={bodyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] tracking-[0.35em] uppercase text-golden-dark/60 mb-6">
              In the Meantime
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-brown-dark mb-6">
              The best way to learn is{" "}
              <span className="italic text-golden-dark">hands-on</span>.
            </h2>
            <p className="text-base sm:text-lg text-brown-light/80 leading-relaxed mb-4">
              Recipes are wonderful, but bread is a feel — the tackiness of
              dough, the smell of a ripe starter, the shape of a loaf when
              it&apos;s ready to bake. Those things are hard to put on a page.
            </p>
            <p className="text-base sm:text-lg text-brown-light/80 leading-relaxed mb-10">
              Come bake with Haylee in person. You&apos;ll leave with a
              starter, a warm loaf, and the confidence to bake on your own.
            </p>

            <Link
              href="/classes"
              className="inline-flex items-center gap-3 px-8 py-4 bg-golden text-brown-dark font-medium tracking-wider uppercase text-sm rounded-full hover:bg-golden-light transition-colors duration-300"
            >
              <span>Explore Classes</span>
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

            <div className="w-16 h-px bg-golden/40 mx-auto mt-16 mb-12" />

            {/* Notify form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={bodyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-[11px] tracking-[0.35em] uppercase text-golden-dark/60 mb-4">
                Get a Heads-Up
              </p>
              <p className="font-serif italic text-lg text-brown-dark/80 mb-6">
                Want to know when the recipes drop?
              </p>

              {submitted ? (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-sm text-sage-dark"
                >
                  Thanks — we&apos;ll let you know the moment they&apos;re
                  ready.
                </motion.p>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto"
                >
                  <label htmlFor="recipes-notify-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="recipes-notify-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-5 py-3 rounded-full bg-warm-white/80 border border-golden/20 text-sm text-brown-dark placeholder:text-brown-light/40 focus:outline-none focus:border-golden/50 transition-colors duration-300"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-brown-dark text-cream text-sm tracking-wider uppercase font-medium hover:bg-brown-medium transition-colors duration-300"
                  >
                    Notify Me
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
