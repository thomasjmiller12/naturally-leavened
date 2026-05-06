"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const photos = [
  {
    src: "/images/boule-crumb.jpg",
    alt: "Open crumb structure of a freshly sliced sourdough boule",
  },
  {
    src: "/images/boule-outdoors.jpg",
    alt: "A scored sourdough boule resting outdoors in natural light",
  },
  {
    src: "/images/cranberry-pumpkin.jpg",
    alt: "A cranberry pumpkin sourdough loaf with deep golden crust",
  },
  {
    src: "/images/pumpkin-scored.jpg",
    alt: "A pumpkin-shaped sourdough loaf with intricate scoring",
  },
  {
    src: "/images/gift-wrapped.jpg",
    alt: "A loaf of sourdough wrapped as a gift",
  },
];

export default function ClassesGallery() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollPrev(scrollLeft > 4);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 4);

    const index = Math.round(scrollLeft / clientWidth);
    setActiveIndex(Math.min(Math.max(index, 0), photos.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByIndex = (delta: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const target = Math.min(
      Math.max(activeIndex + delta, 0),
      photos.length - 1,
    );
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative group"
    >
      <div className="absolute -top-3 -right-3 w-full h-full border border-golden/15 rounded-2xl pointer-events-none" />

      <div className="relative aspect-square rounded-2xl overflow-hidden">
        <div
          ref={scrollerRef}
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          aria-roledescription="carousel"
          aria-label="Sourdough class gallery"
        >
          {photos.map((photo, i) => (
            <div
              key={photo.src}
              className="relative shrink-0 w-full h-full snap-center snap-always"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${photos.length}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Prev / Next arrows — desktop only, fade in on hover */}
        <button
          type="button"
          onClick={() => scrollByIndex(-1)}
          disabled={!canScrollPrev}
          aria-label="Previous photo"
          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-warm-white/85 text-brown-dark backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0 hover:bg-warm-white"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollByIndex(1)}
          disabled={!canScrollNext}
          aria-label="Next photo"
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-warm-white/85 text-brown-dark backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0 hover:bg-warm-white"
        >
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === activeIndex}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 bg-warm-white"
                  : "w-1.5 bg-warm-white/60 hover:bg-warm-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
