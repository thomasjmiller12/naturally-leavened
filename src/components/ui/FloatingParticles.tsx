"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
}

export default function FloatingParticles({
  count = 25,
  color = "golden",
}: {
  count?: number;
  color?: string;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 15,
        opacity: Math.random() * 0.25 + 0.05,
        drift: (Math.random() - 0.5) * 50,
      }))
    );
  }, [count]);

  const colorMap: Record<string, string> = {
    golden: "bg-golden",
    cream: "bg-cream",
    brown: "bg-brown-light",
    white: "bg-white",
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full ${colorMap[color] || "bg-golden"}`}
          style={{
            left: `${p.x}%`,
            bottom: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `float ${p.duration}s ${p.delay}s infinite linear`,
          }}
        />
      ))}
    </div>
  );
}
