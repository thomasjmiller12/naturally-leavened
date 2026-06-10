"use client";

import { motion } from "framer-motion";
import { REVIEWS } from "@/lib/reviews";

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5 mb-4" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-3.5 h-3.5 ${i < rating ? "text-golden" : "text-golden/20"}`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ))}
  </div>
);

export default function Testimonials() {
  // Stays hidden until real reviews are added in src/lib/reviews.ts —
  // no placeholder or fake content ever shows on the live site.
  if (REVIEWS.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-golden-dark/60 mb-4">
            Kind words
          </p>
          <h2 className="font-serif text-4xl text-brown-dark">
            From past <span className="italic">bakers</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className="flex flex-col rounded-2xl border border-golden/15 bg-warm-white/80 p-7"
            >
              <svg
                className="w-8 h-8 text-golden/30 mb-3"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.5 7C6.46 7 4 9.46 4 12.5V17h5v-5H6.5c0-1.66 1.34-3 3-3V7zm9 0C15.46 7 13 9.46 13 12.5V17h5v-5h-2.5c0-1.66 1.34-3 3-3V7z" />
              </svg>

              {review.rating ? <StarRow rating={review.rating} /> : null}

              <blockquote className="font-serif italic text-lg leading-relaxed text-brown-dark">
                &ldquo;{review.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-auto pt-6">
                <p className="text-sm font-semibold text-brown-dark">
                  {review.name}
                </p>
                {review.detail && (
                  <p className="text-xs text-brown-light/70 mt-0.5">
                    {review.detail}
                  </p>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
