"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import FloatingParticles from "@/components/ui/FloatingParticles";

const classDetails = [
  {
    icon: "01",
    title: "Meet Your Starter",
    description:
      "You'll learn what a sourdough starter is, how to feed it, and how to tell when it's ready to bake. You'll take one home with you.",
  },
  {
    icon: "02",
    title: "Mix & Shape",
    description:
      "Hands-on time with the dough — from mixing your ingredients to stretching, folding, and shaping a beautiful loaf.",
  },
  {
    icon: "03",
    title: "The Science (Made Simple)",
    description:
      "Why does dough rise? What does salt actually do? We'll cover the food science behind sourdough in a way that actually makes sense.",
  },
  {
    icon: "04",
    title: "Bake & Take Home",
    description:
      "Watch your loaf go into the oven. While it bakes, we'll talk scoring techniques and troubleshooting. You leave with a warm loaf.",
  },
];

const faqs = [
  {
    q: "Do I need any baking experience?",
    a: "Not at all! This class is designed for complete beginners. If you've never touched dough before, you're exactly who this is for.",
  },
  {
    q: "What do I need to bring?",
    a: "Just yourself and an appetite! We provide all ingredients, tools, and materials. You'll go home with a starter kit and your bread.",
  },
  {
    q: "How long is the class?",
    a: "Plan for about 4 hours. Sourdough takes time, and we don't rush it. There will be coffee, snacks, and plenty of time for questions.",
  },
  {
    q: "How many people per class?",
    a: "We keep classes small — usually 6-8 people — so everyone gets personal attention and plenty of hands-on time with the dough.",
  },
];

export default function ClassesPage() {
  const detailsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const detailsInView = useInView(detailsRef, { once: true, margin: "-80px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-golden-light/15 via-cream to-warm-white" />
        <FloatingParticles count={15} color="golden" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <p className="text-[11px] tracking-[0.35em] uppercase text-golden-dark/60 mb-6">
            Hands-On Learning
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-brown-dark mb-6">
            Sourdough{" "}
            <span className="italic text-golden-dark">Classes</span>
          </h1>
          <p className="text-lg text-brown-light/80 max-w-xl mx-auto leading-relaxed">
            Learn to bake beautiful sourdough from scratch. No experience needed
            — just curiosity and a love of good bread.
          </p>
          <div className="w-16 h-px bg-golden/40 mx-auto mt-8" />
        </motion.div>
      </section>

      {/* What you'll learn */}
      <section ref={detailsRef} className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={detailsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-golden-dark/60 mb-4">
              The Curriculum
            </p>
            <h2 className="font-serif text-4xl text-brown-dark">
              What You&apos;ll <span className="italic">Learn</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {classDetails.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={detailsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 * i, duration: 0.8 }}
                className="group relative p-8 bg-warm-white/60 border border-golden/10 rounded-2xl hover:border-golden/25 transition-all duration-500 hover:shadow-[0_8px_40px_-15px_rgba(212,163,115,0.12)]"
              >
                {/* Number */}
                <span className="text-5xl font-serif text-golden/15 absolute top-4 right-6">
                  {item.icon}
                </span>

                <h3 className="font-serif text-xl text-brown-dark mb-3 relative">
                  {item.title}
                </h3>
                <p className="text-sm text-brown-light/70 leading-relaxed relative">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-20 sm:py-28 bg-warm-white/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-3 -right-3 w-full h-full border border-golden/15 rounded-2xl" />
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/pumpkin-trio.jpg"
                  alt="Three beautifully scored pumpkin-shaped sourdough loaves"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            {/* What's included list */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-[11px] tracking-[0.3em] uppercase text-golden-dark/60 mb-4">
                Everything You Need
              </p>
              <h2 className="font-serif text-3xl text-brown-dark mb-8">
                You&apos;ll Walk Away <span className="italic">With</span>
              </h2>

              <ul className="space-y-5">
                {[
                  "Your own sourdough starter (named and ready to go)",
                  "A fresh loaf of bread you baked yourself",
                  "A printed recipe card and feeding guide",
                  "Access to our online recipe collection",
                  "Confidence to bake at home",
                  "New friends who love bread as much as you do",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-golden/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-golden-dark"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span className="text-brown-light/80 text-sm leading-relaxed">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-golden-dark/60 mb-4">
              Questions?
            </p>
            <h2 className="font-serif text-4xl text-brown-dark">
              Frequently <span className="italic">Asked</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 * i, duration: 0.6 }}
                className="border-b border-golden/10 pb-8"
              >
                <h3 className="font-serif text-lg text-brown-dark mb-3">
                  {faq.q}
                </h3>
                <p className="text-sm text-brown-light/70 leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up CTA */}
      <section className="py-24 sm:py-32 bg-brown-dark text-cream relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-golden/30 to-transparent" />

        {/* Decorative blurs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-golden/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-golden/5 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-2xl mx-auto px-6 text-center"
        >
          <p className="text-[11px] tracking-[0.35em] uppercase text-golden/60 mb-6">
            Reserve Your Spot
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-cream mb-6">
            Ready to get your hands in some{" "}
            <span className="italic text-golden">dough</span>?
          </h2>
          <p className="text-cream/50 mb-10 leading-relaxed">
            Classes fill up quickly and are kept intentionally small. Text us to
            check availability and reserve your spot.
          </p>

          <a
            href="sms:+15551234567"
            className="inline-flex items-center gap-3 px-10 py-5 bg-golden text-brown-dark font-medium tracking-wider uppercase text-sm rounded-full hover:bg-golden-light transition-all duration-300 shadow-[0_0_30px_rgba(212,163,115,0.2)] hover:shadow-[0_0_50px_rgba(212,163,115,0.3)]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
            <span>Text (555) 123-4567</span>
          </a>

          <p className="text-cream/30 text-xs mt-6">
            We&apos;ll get back to you within 24 hours
          </p>
        </motion.div>
      </section>
    </>
  );
}
