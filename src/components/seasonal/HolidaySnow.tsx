"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Snowfall from "react-snowfall";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const motion = window.matchMedia(MOTION_QUERY);
  motion.addEventListener("change", onChange);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    motion.removeEventListener("change", onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
}

function getSnowflakeCount() {
  if (document.hidden || window.matchMedia(MOTION_QUERY).matches) return 0;
  return 129;
}

export default function HolidaySnow() {
  const count = useSyncExternalStore(subscribe, getSnowflakeCount, () => 0);
  const [snowflakeCount, setSnowflakeCount] = useState(129);

  useEffect(() => {
    const startedAt = performance.now();
    const interval = window.setInterval(() => {
      const progress = Math.min((performance.now() - startedAt) / 60_000, 1);
      setSnowflakeCount(Math.round(129 - 119 * progress));
      if (progress === 1) window.clearInterval(interval);
    }, 500);
    return () => window.clearInterval(interval);
  }, []);

  if (!count) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40">
      <Snowfall
        color="#dee4fd"
        snowflakeCount={snowflakeCount}
        radius={[0.5, 5.5]}
        speed={[0, 3]}
        wind={[0, 4.5]}
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
