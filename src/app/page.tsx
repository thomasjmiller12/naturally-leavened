import Hero from "@/components/home/Hero";
import WhatIsSourdough from "@/components/home/WhatIsSourdough";
import FlourToLoaf from "@/components/home/FlourToLoaf";
import InTheClass from "@/components/home/InTheClass";
import BakeCTA from "@/components/home/BakeCTA";

export default function Home() {
  return (
    // The page "bakes" as you scroll: a single gradient warms the background
    // from raw-dough cream to deep crust brown, while grain texture firms up
    // toward the baked end. The footer's deep brown continues seamlessly.
    <div className="relative isolate">
      <div aria-hidden className="absolute inset-0 -z-10 bake-bg" />
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none bake-grain" />
      <Hero />
      <WhatIsSourdough />
      <FlourToLoaf />
      <InTheClass />
      <BakeCTA />
    </div>
  );
}
