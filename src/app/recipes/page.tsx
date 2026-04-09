"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import FloatingParticles from "@/components/ui/FloatingParticles";

interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  time: string;
  hydration: string;
  description: string;
  ingredients: string[];
  steps: string[];
  tips: string;
  gradient: string;
  image?: string;
}

const recipes: Recipe[] = [
  {
    id: "country-loaf",
    title: "Classic Country Loaf",
    subtitle: "The one that started it all",
    difficulty: "Beginner",
    time: "24 hours (mostly waiting)",
    hydration: "75%",
    description:
      "A beautiful, rustic loaf with a crackly crust and open crumb. This is the bread that hooks people on sourdough. Simple enough for your very first bake.",
    ingredients: [
      "400g bread flour",
      "100g whole wheat flour",
      "375g water (75% hydration)",
      "100g active starter",
      "10g salt",
    ],
    steps: [
      "Mix flour and water, rest 30 minutes (autolyse)",
      "Add starter and salt, mix until combined",
      "Stretch and fold every 30 minutes for 2 hours",
      "Bulk ferment 4-6 hours at room temperature",
      "Shape and place in banneton, seam side up",
      "Cold retard in fridge overnight (12-16 hours)",
      "Preheat Dutch oven at 500°F for 1 hour",
      "Score and bake: 20 min covered, 25 min uncovered at 450°F",
    ],
    tips: "The fridge is your best friend. Cold retarding develops flavor and makes scoring easier. Don't rush it.",
    gradient: "from-golden-light/40 via-cream to-golden/10",
    image: "/images/classic-crumb.jpg",
  },
  {
    id: "focaccia",
    title: "Olive Oil Focaccia",
    subtitle: "Crispy, dimpled, irresistible",
    difficulty: "Beginner",
    time: "18 hours",
    hydration: "80%",
    description:
      "Pillowy soft inside, golden and crispy outside, and drenched in good olive oil. This is the most forgiving bread you'll ever make — perfect for beginners.",
    ingredients: [
      "500g bread flour",
      "400g water (80% hydration)",
      "100g active starter",
      "10g salt",
      "Generous olive oil",
      "Flaky salt, rosemary, or toppings of choice",
    ],
    steps: [
      "Mix all ingredients in a large bowl",
      "Stretch and fold every 30 minutes for 1.5 hours",
      "Bulk ferment 4-5 hours",
      "Pour generous olive oil into a sheet pan",
      "Transfer dough to pan, dimple with oiled fingers",
      "Proof 1 hour or cold retard overnight",
      "Add toppings, drizzle more olive oil",
      "Bake at 425°F for 25-30 minutes until deeply golden",
    ],
    tips: "Don't be shy with the olive oil. Seriously. More than you think. That's what gives focaccia its incredible crust.",
    gradient: "from-sage-light/30 via-cream to-sage/10",
    image: "/images/toast-butter-honey.jpg",
  },
  {
    id: "cinnamon-raisin",
    title: "Cinnamon Raisin Swirl",
    subtitle: "Weekend morning luxury",
    difficulty: "Intermediate",
    time: "26 hours",
    hydration: "70%",
    description:
      "A tender, enriched sourdough loaf swirled with cinnamon sugar and plump raisins. Makes incredible toast and even better French toast the next day.",
    ingredients: [
      "450g bread flour",
      "50g whole wheat flour",
      "315g milk (70% hydration)",
      "100g active starter",
      "50g sugar",
      "50g soft butter",
      "8g salt",
      "100g raisins (soaked)",
      "Cinnamon sugar filling",
    ],
    steps: [
      "Mix flour, milk, and starter. Rest 30 minutes",
      "Add sugar, salt, and softened butter. Mix until smooth",
      "Stretch and fold every 30 minutes for 2 hours",
      "Fold in drained raisins on the last set",
      "Bulk ferment 3-4 hours",
      "Roll out, spread cinnamon sugar, roll into a tight log",
      "Place in greased loaf pan, cold retard overnight",
      "Bake at 375°F for 40-45 minutes",
    ],
    tips: "Soak the raisins in warm water for 20 minutes first. Dry raisins steal moisture from your dough.",
    gradient: "from-golden-light/30 via-cream to-honey/10",
    image: "/images/cinnamon-rolls.jpg",
  },
  {
    id: "everything-bagels",
    title: "Sourdough Bagels",
    subtitle: "Better than the bagel shop",
    difficulty: "Intermediate",
    time: "20 hours",
    hydration: "55%",
    description:
      "Chewy, dense, and beautifully burnished. These sourdough bagels have a tang that commercial bagels can only dream of. Top with everything seasoning, obviously.",
    ingredients: [
      "500g bread flour",
      "275g water (55% hydration)",
      "100g active starter",
      "30g honey or barley malt syrup",
      "10g salt",
      "Everything bagel seasoning",
    ],
    steps: [
      "Mix all ingredients until a stiff dough forms",
      "Knead 8-10 minutes until smooth and elastic",
      "Bulk ferment 4-5 hours",
      "Divide into 8 pieces, shape into balls, poke holes",
      "Cold retard on a lined sheet pan overnight",
      "Boil in malt water, 1 minute per side",
      "Top with seasoning",
      "Bake at 425°F for 20-22 minutes",
    ],
    tips: "Low hydration is key. The dough should feel stiff — that's what gives bagels their signature chew.",
    gradient: "from-golden/20 via-cream to-brown-light/5",
    image: "/images/sandwich-loaf.jpg",
  },
  {
    id: "sourdough-pizza",
    title: "72-Hour Pizza Dough",
    subtitle: "Friday night perfected",
    difficulty: "Beginner",
    time: "72 hours (3 days cold ferment)",
    hydration: "65%",
    description:
      "A long, slow cold ferment develops incredible flavor and those gorgeous charred bubbles. This is the only pizza dough recipe you'll ever need.",
    ingredients: [
      "500g bread flour or 00 flour",
      "325g water (65% hydration)",
      "100g active starter",
      "15g olive oil",
      "10g salt",
      "5g sugar",
    ],
    steps: [
      "Mix all ingredients until a smooth dough forms",
      "Stretch and fold every 30 minutes for 1.5 hours",
      "Bulk ferment 2 hours at room temperature",
      "Divide into 4 dough balls (about 240g each)",
      "Place in oiled containers, refrigerate 48-72 hours",
      "Remove from fridge 2 hours before baking",
      "Stretch by hand (never a rolling pin!)",
      "Bake at highest oven temp (500-550°F) for 8-12 minutes",
    ],
    tips: "The longer the cold ferment, the better the flavor. Day 3 is where the magic happens. Be patient!",
    gradient: "from-sage-light/20 via-cream to-golden-light/10",
    image: "/images/hero-boule.jpg",
  },
  {
    id: "discard-crackers",
    title: "Sourdough Discard Crackers",
    subtitle: "Never waste your discard again",
    difficulty: "Beginner",
    time: "1 hour",
    hydration: "N/A (uses discard)",
    description:
      "Thin, shatteringly crispy crackers made from sourdough discard. Customize with herbs, seeds, or everything bagel seasoning. Absurdly easy and addictive.",
    ingredients: [
      "200g sourdough discard",
      "50g olive oil",
      "4g salt",
      "Fresh herbs, seeds, or spices",
      "Flaky salt for topping",
    ],
    steps: [
      "Mix discard, olive oil, and salt",
      "Spread paper-thin on parchment-lined sheet pan",
      "Sprinkle with toppings and flaky salt",
      "Bake at 350°F for 20-25 minutes until golden and crispy",
      "Break into rustic pieces once cooled",
    ],
    tips: "Thinner is better. If you can see through the dough on the pan, you're doing it right.",
    gradient: "from-honey/15 via-cream to-sage-light/10",
    image: "/images/cranberry-pumpkin.jpg",
  },
];

const difficultyColors = {
  Beginner: "bg-sage/15 text-sage-dark",
  Intermediate: "bg-golden/15 text-golden-dark",
  Advanced: "bg-honey/15 text-brown-medium",
};

export default function RecipesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-warm-white via-cream to-golden-light/5" />
        <FloatingParticles count={12} color="golden" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <p className="text-[11px] tracking-[0.35em] uppercase text-golden-dark/60 mb-6">
            Tried & Tested
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-brown-dark mb-6">
            <span className="italic text-golden-dark">Recipes</span>
          </h1>
          <p className="text-lg text-brown-light/80 max-w-xl mx-auto leading-relaxed">
            Simple, reliable recipes with the science explained in plain
            English. From your first loaf to your fiftieth.
          </p>
          <div className="w-16 h-px bg-golden/40 mx-auto mt-8" />
        </motion.div>
      </section>

      {/* Recipe Grid */}
      <section ref={headerRef} className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {recipes.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 30 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i, duration: 0.7 }}
              >
                <div
                  className={`group relative bg-warm-white/80 border border-golden/10 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_-15px_rgba(212,163,115,0.12)] ${
                    expandedId === recipe.id
                      ? "hover:border-golden/25"
                      : "hover:border-golden/20"
                  }`}
                >
                  {/* Image area */}
                  <div
                    className={`relative h-48 bg-gradient-to-br ${recipe.gradient} overflow-hidden`}
                  >
                    {recipe.image && (
                      <Image
                        src={recipe.image}
                        alt={recipe.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        {...(i === 0 ? { priority: true } : {})}
                      />
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span
                        className={`text-[10px] tracking-wider uppercase px-3 py-1 rounded-full ${
                          difficultyColors[recipe.difficulty]
                        }`}
                      >
                        {recipe.difficulty}
                      </span>
                      <span className="text-[10px] tracking-wider uppercase px-3 py-1 rounded-full bg-white/60 text-brown-light backdrop-blur-sm">
                        {recipe.hydration} hydration
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-2xl text-brown-dark mb-1">
                      {recipe.title}
                    </h3>
                    <p className="font-serif italic text-sm text-golden-dark/70 mb-3">
                      {recipe.subtitle}
                    </p>
                    <p className="text-sm text-brown-light/70 leading-relaxed mb-4">
                      {recipe.description}
                    </p>

                    {/* Time */}
                    <div className="flex items-center gap-2 text-xs text-brown-light/50 mb-4">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{recipe.time}</span>
                    </div>

                    {/* Expand button */}
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === recipe.id ? null : recipe.id
                        )
                      }
                      className="flex items-center gap-2 text-sm text-golden-dark hover:text-brown-dark transition-colors duration-300"
                    >
                      <span className="tracking-wider uppercase text-[11px]">
                        {expandedId === recipe.id
                          ? "Show Less"
                          : "View Recipe"}
                      </span>
                      <motion.svg
                        animate={{
                          rotate: expandedId === recipe.id ? 180 : 0,
                        }}
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </motion.svg>
                    </button>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {expandedId === recipe.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 mt-6 border-t border-golden/10">
                            {/* Ingredients */}
                            <h4 className="text-[11px] tracking-[0.2em] uppercase text-golden-dark/60 mb-3">
                              Ingredients
                            </h4>
                            <ul className="space-y-1.5 mb-6">
                              {recipe.ingredients.map((ing, j) => (
                                <li
                                  key={j}
                                  className="flex items-start gap-2 text-sm text-brown-light/80"
                                >
                                  <span className="w-1 h-1 rounded-full bg-golden/40 mt-2 flex-shrink-0" />
                                  {ing}
                                </li>
                              ))}
                            </ul>

                            {/* Steps */}
                            <h4 className="text-[11px] tracking-[0.2em] uppercase text-golden-dark/60 mb-3">
                              Steps
                            </h4>
                            <ol className="space-y-3 mb-6">
                              {recipe.steps.map((step, j) => (
                                <li
                                  key={j}
                                  className="flex items-start gap-3 text-sm text-brown-light/80"
                                >
                                  <span className="text-[10px] font-medium text-golden-dark/40 mt-0.5 w-4 flex-shrink-0">
                                    {String(j + 1).padStart(2, "0")}
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ol>

                            {/* Tips */}
                            <div className="p-4 bg-golden/5 rounded-xl">
                              <p className="text-[11px] tracking-[0.2em] uppercase text-golden-dark/60 mb-1">
                                Haylee&apos;s Tip
                              </p>
                              <p className="text-sm text-brown-light/80 italic leading-relaxed">
                                {recipe.tips}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
