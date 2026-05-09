"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const photos = [
  { src: "/images/class-1.jpg", alt: "A moment from a Naturally Leavened class" },
  { src: "/images/class-2.jpg", alt: "Hands shaping dough during a sourdough class" },
  { src: "/images/class-3.jpg", alt: "Fresh sourdough from a class session" },
  { src: "/images/class-4.jpg", alt: "Bread shaping in progress" },
  { src: "/images/class-5.jpg", alt: "A class scene at Naturally Leavened" },
  { src: "/images/class-6.jpg", alt: "Sourdough class in motion" },
  { src: "/images/class-7.jpg", alt: "A finished bake from class" },
  { src: "/images/class-8.jpg", alt: "Class memory at Naturally Leavened" },
];

const ROTATIONS = [-4, 5, -3, 6, -5, 3, -2, 4];
const VISIBLE = 3;
const ADVANCE_MS = 4500;

type Stack = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

const stackFor = (pos: number, rotation: number): Stack => {
  if (pos === 0) return { x: 0, y: 0, rotate: rotation, scale: 1, opacity: 1, zIndex: 30 };
  if (pos === 1) return { x: 14, y: 10, rotate: rotation * 0.55, scale: 0.97, opacity: 1, zIndex: 20 };
  if (pos === 2) return { x: -12, y: 20, rotate: rotation * 0.4, scale: 0.94, opacity: 1, zIndex: 10 };
  return { x: 0, y: 28, rotate: 0, scale: 0.9, opacity: 0, zIndex: 0 };
};

export default function PolaroidStack() {
  const [topIndex, setTopIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const advance = useCallback(() => {
    setTopIndex((i) => (i + 1) % photos.length);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = window.setInterval(advance, ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [advance, paused, reduceMotion]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9 }}
      className="relative mx-auto aspect-[4/5] w-full max-w-[22rem] sm:max-w-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="Photo stack"
      aria-label={`Class moment ${topIndex + 1} of ${photos.length} — tap to see the next`}
    >
      {photos.map((photo, i) => {
        const pos = (i - topIndex + photos.length) % photos.length;
        const visible = pos < VISIBLE;
        const target = stackFor(pos, ROTATIONS[i % ROTATIONS.length]);

        return (
          <motion.div
            key={photo.src}
            initial={false}
            animate={target}
            transition={{
              type: "spring",
              stiffness: 170,
              damping: 24,
              opacity: { duration: 0.4 },
            }}
            aria-hidden={pos !== 0}
            className="absolute inset-0 origin-center rounded-[3px] bg-warm-white p-3 pb-12 shadow-[0_18px_40px_-22px_rgba(61,43,31,0.45),0_4px_10px_-4px_rgba(61,43,31,0.18)] ring-1 ring-brown-dark/5"
            style={{ pointerEvents: visible ? "auto" : "none" }}
          >
            <div className="relative h-full w-full overflow-hidden bg-cream">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 80vw, 22rem"
                priority={i < 2}
              />
            </div>
          </motion.div>
        );
      })}

      <button
        type="button"
        onClick={advance}
        aria-label={`Show next class photo (${((topIndex + 1) % photos.length) + 1} of ${photos.length})`}
        className="absolute inset-0 z-40 cursor-pointer rounded-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-golden-dark/60 focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
      />

      {/* Tiny counter to hint at the rest of the stack */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-3 left-1/2 z-50 -translate-x-1/2 rounded-full bg-warm-white/95 px-3 py-1 text-[10px] tracking-[0.25em] uppercase text-brown-light/60 shadow-sm ring-1 ring-golden/10"
      >
        {String(topIndex + 1).padStart(2, "0")} <span className="text-brown-light/30">/</span>{" "}
        {String(photos.length).padStart(2, "0")}
      </div>
    </motion.div>
  );
}
