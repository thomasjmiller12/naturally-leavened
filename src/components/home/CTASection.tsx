"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const cards = [
  {
    href: "/classes",
    title: "Join a Class",
    description:
      "Learn to bake sourdough from scratch in a hands-on, beginner-friendly class. You'll leave with your own starter and a fresh loaf.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
        />
      </svg>
    ),
    accent: "golden",
  },
  {
    href: "/recipes",
    title: "Browse Recipes",
    description:
      "From classic country loaves to focaccia and beyond. Simple, tested recipes with the science explained in plain English.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
    accent: "sage",
  },
  {
    href: "/calculator",
    title: "Dough Calculator",
    description:
      "Dial in your hydration, scale your recipes, and calculate feeding ratios. The math is on us — you just focus on the dough.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"
        />
      </svg>
    ),
    accent: "honey",
  },
];

const accentStyles = {
  golden: {
    iconBg: "bg-golden/10",
    iconText: "text-golden-dark",
    hoverBorder: "group-hover:border-golden/30",
    arrow: "text-golden-dark",
  },
  sage: {
    iconBg: "bg-sage/10",
    iconText: "text-sage-dark",
    hoverBorder: "group-hover:border-sage/30",
    arrow: "text-sage-dark",
  },
  honey: {
    iconBg: "bg-honey/10",
    iconText: "text-honey",
    hoverBorder: "group-hover:border-honey/30",
    arrow: "text-honey",
  },
};

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-28 sm:py-36">
      <div className="absolute inset-0 bg-gradient-to-b from-cream to-warm-white" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-golden-dark/60 mb-4">
            Explore
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-brown-dark">
            Start Your Journey
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, i) => {
            const styles =
              accentStyles[card.accent as keyof typeof accentStyles];
            return (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.8 }}
              >
                <Link href={card.href} className="group block h-full">
                  <div
                    className={`relative h-full p-8 bg-warm-white/80 backdrop-blur-sm border border-golden/10 rounded-2xl transition-all duration-500 group-hover:shadow-[0_8px_40px_-12px_rgba(212,163,115,0.15)] group-hover:-translate-y-1 ${styles.hoverBorder}`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl ${styles.iconBg} ${styles.iconText} flex items-center justify-center mb-6`}
                    >
                      {card.icon}
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-2xl text-brown-dark mb-3">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-brown-light/70 leading-relaxed mb-6">
                      {card.description}
                    </p>

                    {/* Arrow */}
                    <div
                      className={`flex items-center gap-2 text-sm ${styles.arrow} transition-all duration-300`}
                    >
                      <span className="tracking-wider uppercase text-[12px]">
                        Explore
                      </span>
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5"
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
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
