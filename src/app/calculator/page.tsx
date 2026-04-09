"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FloatingParticles from "@/components/ui/FloatingParticles";

type CalculatorTab = "dough" | "starter";

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>("dough");

  // Dough calculator state
  const [totalDough, setTotalDough] = useState(900);
  const [hydration, setHydration] = useState(75);
  const [starterPercent, setStarterPercent] = useState(20);
  const [saltPercent, setSaltPercent] = useState(2);

  // Starter calculator state
  const [currentStarter, setCurrentStarter] = useState(50);
  const [flourRatio, setFlourRatio] = useState(5);
  const [waterRatio, setWaterRatio] = useState(5);

  // Dough calculations
  const flourWeight = Math.round(
    totalDough / (1 + hydration / 100 + starterPercent / 100 + saltPercent / 100)
  );
  const waterWeight = Math.round(flourWeight * (hydration / 100));
  const starterWeight = Math.round(flourWeight * (starterPercent / 100));
  const saltWeight = Math.round(flourWeight * (saltPercent / 100));

  // Starter feeding calculations
  const feedFlour = Math.round(currentStarter * flourRatio);
  const feedWater = Math.round(currentStarter * waterRatio);
  const totalAfterFeed = currentStarter + feedFlour + feedWater;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-warm-white via-cream to-golden-light/5" />
        <FloatingParticles count={10} color="golden" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <p className="text-[11px] tracking-[0.35em] uppercase text-golden-dark/60 mb-6">
            The Math Is On Us
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-brown-dark mb-6">
            Dough{" "}
            <span className="italic text-golden-dark">Calculator</span>
          </h1>
          <p className="text-lg text-brown-light/80 max-w-xl mx-auto leading-relaxed">
            Dial in your hydration, scale your recipes, and calculate feeding
            ratios. You focus on the dough.
          </p>
        </motion.div>
      </section>

      {/* Calculator */}
      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Tab switcher */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-warm-white/80 border border-golden/10 rounded-full p-1">
              {[
                { id: "dough" as const, label: "Dough Calculator" },
                { id: "starter" as const, label: "Starter Feeding" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-full text-sm tracking-wider transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-golden text-brown-dark shadow-sm"
                      : "text-brown-light hover:text-brown-dark"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dough Calculator */}
          {activeTab === "dough" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
            >
              {/* Inputs */}
              <div className="space-y-8">
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-golden-dark/60 mb-6">
                    Adjust Your Recipe
                  </p>

                  {/* Total dough weight */}
                  <div className="mb-8">
                    <div className="flex justify-between items-baseline mb-3">
                      <label className="text-sm text-brown-dark font-medium">
                        Total Dough Weight
                      </label>
                      <span className="text-2xl font-serif text-golden-dark">
                        {totalDough}g
                      </span>
                    </div>
                    <input
                      type="range"
                      min={300}
                      max={2000}
                      step={50}
                      value={totalDough}
                      onChange={(e) => setTotalDough(Number(e.target.value))}
                      className="w-full h-1.5 bg-golden/15 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-golden [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(212,163,115,0.3)] [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-brown-light/40 mt-1">
                      <span>300g</span>
                      <span>2000g</span>
                    </div>
                  </div>

                  {/* Hydration */}
                  <div className="mb-8">
                    <div className="flex justify-between items-baseline mb-3">
                      <label className="text-sm text-brown-dark font-medium">
                        Hydration
                      </label>
                      <span className="text-2xl font-serif text-golden-dark">
                        {hydration}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={100}
                      step={1}
                      value={hydration}
                      onChange={(e) => setHydration(Number(e.target.value))}
                      className="w-full h-1.5 bg-golden/15 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-golden [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(212,163,115,0.3)] [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-brown-light/40 mt-1">
                      <span>50% (stiff)</span>
                      <span>100% (very wet)</span>
                    </div>
                  </div>

                  {/* Starter % */}
                  <div className="mb-8">
                    <div className="flex justify-between items-baseline mb-3">
                      <label className="text-sm text-brown-dark font-medium">
                        Starter
                      </label>
                      <span className="text-2xl font-serif text-golden-dark">
                        {starterPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={40}
                      step={1}
                      value={starterPercent}
                      onChange={(e) =>
                        setStarterPercent(Number(e.target.value))
                      }
                      className="w-full h-1.5 bg-golden/15 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-golden [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(212,163,115,0.3)] [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-brown-light/40 mt-1">
                      <span>5% (slow rise)</span>
                      <span>40% (fast rise)</span>
                    </div>
                  </div>

                  {/* Salt % */}
                  <div>
                    <div className="flex justify-between items-baseline mb-3">
                      <label className="text-sm text-brown-dark font-medium">
                        Salt
                      </label>
                      <span className="text-2xl font-serif text-golden-dark">
                        {saltPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={saltPercent}
                      onChange={(e) => setSaltPercent(Number(e.target.value))}
                      className="w-full h-1.5 bg-golden/15 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-golden [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(212,163,115,0.3)] [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-brown-light/40 mt-1">
                      <span>1%</span>
                      <span>3%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-golden-dark/60 mb-6">
                  Your Recipe
                </p>

                <div className="bg-warm-white/80 border border-golden/10 rounded-2xl p-8 space-y-1">
                  {[
                    {
                      label: "Flour",
                      value: flourWeight,
                      pct: "100%",
                      bar: 100,
                    },
                    {
                      label: "Water",
                      value: waterWeight,
                      pct: `${hydration}%`,
                      bar: hydration,
                    },
                    {
                      label: "Starter",
                      value: starterWeight,
                      pct: `${starterPercent}%`,
                      bar: starterPercent * 2.5,
                    },
                    {
                      label: "Salt",
                      value: saltWeight,
                      pct: `${saltPercent}%`,
                      bar: saltPercent * 10,
                    },
                  ].map((item) => (
                    <div key={item.label} className="py-4">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm text-brown-dark">
                          {item.label}
                        </span>
                        <div className="flex items-baseline gap-3">
                          <span className="text-xs text-brown-light/50">
                            {item.pct}
                          </span>
                          <span className="text-xl font-serif text-brown-dark tabular-nums">
                            {item.value}g
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-golden/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-golden/40 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(item.bar, 100)}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 mt-4 border-t border-golden/10">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-medium text-brown-dark">
                        Total Dough
                      </span>
                      <span className="text-2xl font-serif text-golden-dark">
                        {flourWeight + waterWeight + starterWeight + saltWeight}g
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick tip */}
                <div className="mt-6 p-4 bg-sage/5 rounded-xl border border-sage/10">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-sage-dark/60 mb-1">
                    Quick Tip
                  </p>
                  <p className="text-xs text-brown-light/70 leading-relaxed">
                    {hydration < 65
                      ? "Low hydration doughs are great for bagels and pretzels. They'll be stiff but easy to shape."
                      : hydration < 75
                        ? "This is a great all-purpose hydration. Easy to handle with a nice open crumb."
                        : hydration < 85
                          ? "Higher hydration means a more open crumb but stickier dough. Use wet hands!"
                          : "Very high hydration! This will be quite wet. Best for ciabatta or focaccia-style bakes."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Starter Calculator */}
          {activeTab === "starter" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
            >
              {/* Inputs */}
              <div className="space-y-8">
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-golden-dark/60 mb-6">
                    Feeding Ratio
                  </p>

                  {/* Current starter */}
                  <div className="mb-8">
                    <div className="flex justify-between items-baseline mb-3">
                      <label className="text-sm text-brown-dark font-medium">
                        Starter Amount
                      </label>
                      <span className="text-2xl font-serif text-golden-dark">
                        {currentStarter}g
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={200}
                      step={5}
                      value={currentStarter}
                      onChange={(e) =>
                        setCurrentStarter(Number(e.target.value))
                      }
                      className="w-full h-1.5 bg-golden/15 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-golden [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(212,163,115,0.3)] [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>

                  {/* Flour ratio */}
                  <div className="mb-8">
                    <div className="flex justify-between items-baseline mb-3">
                      <label className="text-sm text-brown-dark font-medium">
                        Flour Ratio
                      </label>
                      <span className="text-2xl font-serif text-golden-dark">
                        1:{flourRatio}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={flourRatio}
                      onChange={(e) => setFlourRatio(Number(e.target.value))}
                      className="w-full h-1.5 bg-golden/15 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-golden [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(212,163,115,0.3)] [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-brown-light/40 mt-1">
                      <span>1:1 (quick)</span>
                      <span>1:10 (slow, mild)</span>
                    </div>
                  </div>

                  {/* Water ratio */}
                  <div>
                    <div className="flex justify-between items-baseline mb-3">
                      <label className="text-sm text-brown-dark font-medium">
                        Water Ratio
                      </label>
                      <span className="text-2xl font-serif text-golden-dark">
                        1:{waterRatio}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={waterRatio}
                      onChange={(e) => setWaterRatio(Number(e.target.value))}
                      className="w-full h-1.5 bg-golden/15 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-golden [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(212,163,115,0.3)] [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-brown-light/40 mt-1">
                      <span>1:1</span>
                      <span>1:10</span>
                    </div>
                  </div>
                </div>

                {/* Ratio display */}
                <div className="p-6 bg-warm-white/80 border border-golden/10 rounded-2xl text-center">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-golden-dark/60 mb-2">
                    Your Feeding Ratio
                  </p>
                  <p className="font-serif text-4xl text-brown-dark">
                    1 : {flourRatio} : {waterRatio}
                  </p>
                  <p className="text-xs text-brown-light/50 mt-2">
                    starter : flour : water
                  </p>
                </div>
              </div>

              {/* Results */}
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-golden-dark/60 mb-6">
                  Feeding Amounts
                </p>

                <div className="bg-warm-white/80 border border-golden/10 rounded-2xl p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-golden/5 rounded-xl">
                      <div>
                        <p className="text-xs text-brown-light/50">
                          Keep Starter
                        </p>
                        <p className="text-2xl font-serif text-brown-dark">
                          {currentStarter}g
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-golden/10 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-golden-dark/50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-center text-brown-light/30">
                      <div className="w-8 h-px bg-golden/20" />
                      <span className="text-xs">add</span>
                      <div className="w-8 h-px bg-golden/20" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-cream rounded-xl text-center">
                        <p className="text-xs text-brown-light/50 mb-1">
                          Flour
                        </p>
                        <p className="text-2xl font-serif text-brown-dark">
                          {feedFlour}g
                        </p>
                      </div>
                      <div className="p-4 bg-cream rounded-xl text-center">
                        <p className="text-xs text-brown-light/50 mb-1">
                          Water
                        </p>
                        <p className="text-2xl font-serif text-brown-dark">
                          {feedWater}g
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-center text-brown-light/30">
                      <div className="w-8 h-px bg-golden/20" />
                      <span className="text-xs">equals</span>
                      <div className="w-8 h-px bg-golden/20" />
                    </div>

                    <div className="p-5 bg-golden/10 rounded-xl text-center">
                      <p className="text-xs text-golden-dark/60 mb-1">
                        Total After Feeding
                      </p>
                      <p className="text-3xl font-serif text-golden-dark">
                        {totalAfterFeed}g
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tip */}
                <div className="mt-6 p-4 bg-sage/5 rounded-xl border border-sage/10">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-sage-dark/60 mb-1">
                    Feeding Tip
                  </p>
                  <p className="text-xs text-brown-light/70 leading-relaxed">
                    {flourRatio <= 2
                      ? "A low ratio (1:1:1 or 1:2:2) means your starter will peak faster — great when you need it ready in 4-6 hours."
                      : flourRatio <= 5
                        ? "A moderate ratio gives your starter plenty of food. Expect peak activity in 6-10 hours at room temperature."
                        : "A high ratio means a very slow, mild fermentation. Useful for overnight feeds or keeping your starter less sour."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Baker's percentages explanation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 max-w-2xl mx-auto text-center"
          >
            <div className="w-12 h-px bg-golden/30 mx-auto mb-8" />
            <h3 className="font-serif text-2xl text-brown-dark mb-4">
              What Are Baker&apos;s Percentages?
            </h3>
            <p className="text-sm text-brown-light/70 leading-relaxed mb-4">
              In baking, every ingredient is expressed as a percentage of the
              total flour weight. Flour is always 100%. So when a recipe says
              &ldquo;75% hydration,&rdquo; it means the water weighs 75% of
              what the flour weighs.
            </p>
            <p className="text-sm text-brown-light/70 leading-relaxed">
              This makes it incredibly easy to scale recipes up or down. Once
              you understand baker&apos;s percentages, you can adapt any bread
              recipe to any quantity.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
