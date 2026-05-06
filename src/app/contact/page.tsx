"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import FloatingParticles from "@/components/ui/FloatingParticles";

const contactMethods = [
  {
    icon: "01",
    label: "Email",
    value: "hey.lee.luo@gmail.com",
    href: "mailto:hey.lee.luo@gmail.com",
    description:
      "The best way to reach me for class inquiries, custom orders, or just to say hi.",
    glyph: (
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
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
  {
    icon: "02",
    label: "Text or Call",
    value: "(385) 539-0544",
    href: "sms:+13855390544",
    secondaryHref: "tel:+13855390544",
    secondaryLabel: "Or call",
    description:
      "Text is fastest for class sign-ups and quick questions. Calls are welcome too.",
    glyph: (
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
    ),
  },
  {
    icon: "03",
    label: "Instagram",
    value: "@naturally_leavened",
    href: "https://www.instagram.com/naturally_leavened/",
    external: true,
    description:
      "Follow along for fresh loaves, behind-the-scenes process shots, and class announcements.",
    glyph: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <rect
          x={3}
          y={3}
          width={18}
          height={18}
          rx={5}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={12} cy={12} r={4} strokeWidth={1.5} />
        <circle cx={17.5} cy={6.5} r={1} fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-warm-white via-cream to-golden-light/10" />
        <FloatingParticles count={15} color="golden" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <p className="text-[11px] tracking-[0.35em] uppercase text-golden-dark/60 mb-6">
            Say Hello
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-brown-dark mb-6">
            Get in <span className="italic text-golden-dark">Touch</span>
          </h1>
          <p className="text-lg text-brown-light/80 max-w-xl mx-auto leading-relaxed">
            Questions about a class, a custom loaf, or just want to talk bread?
            Pick whichever way feels easiest — I&apos;d love to hear from you.
          </p>
          <div className="w-16 h-px bg-golden/40 mx-auto mt-8" />
        </motion.div>
      </section>

      {/* Contact methods */}
      <section ref={cardsRef} className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={cardsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-golden-dark/60 mb-4">
              How to Reach Me
            </p>
            <h2 className="font-serif text-4xl text-brown-dark">
              Three Easy <span className="italic">Ways</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, i) => (
              <motion.a
                key={method.label}
                href={method.href}
                target={method.external ? "_blank" : undefined}
                rel={method.external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 30 }}
                animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 * i, duration: 0.8 }}
                className="group relative p-8 bg-warm-white/60 border border-golden/10 rounded-2xl hover:border-golden/25 transition-all duration-500 hover:shadow-[0_8px_40px_-15px_rgba(212,163,115,0.12)] flex flex-col"
              >
                {/* Number */}
                <span className="text-5xl font-serif text-golden/15 absolute top-4 right-6 pointer-events-none">
                  {method.icon}
                </span>

                <div className="w-12 h-12 rounded-xl bg-golden/10 text-golden-dark flex items-center justify-center mb-5">
                  {method.glyph}
                </div>

                <p className="text-[11px] tracking-[0.25em] uppercase text-golden-dark/60 mb-2">
                  {method.label}
                </p>
                <h3 className="font-serif text-xl text-brown-dark mb-3 break-words group-hover:text-golden-dark transition-colors duration-300">
                  {method.value}
                </h3>
                <p className="text-sm text-brown-light/70 leading-relaxed mb-4">
                  {method.description}
                </p>

                {method.secondaryHref && method.secondaryLabel && (
                  <span className="mt-auto text-xs text-brown-light/60">
                    {method.secondaryLabel}{" "}
                    <a
                      href={method.secondaryHref}
                      onClick={(e) => e.stopPropagation()}
                      className="text-golden-dark hover:text-golden underline-offset-4 hover:underline"
                    >
                      (385) 539-0544
                    </a>
                  </span>
                )}
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 sm:py-28 bg-brown-dark text-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] tracking-[0.35em] uppercase text-golden/60 mb-6">
              Want to Learn?
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl mb-6">
              Come bake with{" "}
              <span className="italic text-golden">me</span>
            </h2>
            <p className="text-cream/60 mb-10 max-w-md mx-auto leading-relaxed">
              The best way to start your sourdough journey is hands-on. Browse
              upcoming classes and reserve your spot.
            </p>
            <Link
              href="/classes"
              className="inline-flex items-center gap-3 px-8 py-4 bg-golden text-brown-dark font-medium tracking-wider uppercase text-sm rounded-full hover:bg-golden-light transition-colors duration-300"
            >
              <span>Join a Class</span>
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
