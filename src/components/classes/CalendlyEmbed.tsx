"use client";

import Script from "next/script";

export default function CalendlyEmbed() {
  return (
    <>
      <div
        className="calendly-inline-widget rounded-2xl overflow-hidden border border-golden/15 bg-warm-white/40"
        data-url="https://calendly.com/thomasjmiller12/sourdough-class?background_color=f0eee3&primary_color=15af42"
        style={{ minWidth: 320, height: 700 }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </>
  );
}
