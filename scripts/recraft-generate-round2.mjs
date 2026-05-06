#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function loadEnv() {
  const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
  return env;
}

const API_KEY = loadEnv().RECRAFT_API_KEY;
if (!API_KEY) throw new Error("RECRAFT_API_KEY missing from .env.local");

const STYLE =
  "Warm minimal vector illustration, soft earthy tones (golden #D4A373, cream #FFF8F0, warm brown #5C3D2E, sage green #8B9E82), flat color fills with gentle hand-drawn line work, cozy kitchen aesthetic, white background, calm and inviting.";

const SCORE_BASE =
  "A bread lame is a baker's scoring tool — a slender pencil-length wooden or plastic handle with a tiny curved razor fixed at the very tip. It is unmistakably small and slim. NOT a kitchen knife. NOT a chef's knife. NOT a paring knife. NOT a cleaver.";
const SCORE_NEG =
  "kitchen knife, chef knife, chef's knife, paring knife, butcher knife, cleaver, sword, large blade, scissors, full-size knife handle";

const RED_CERISE = [{ rgb: [200, 16, 46] }];
const RED_CHERRY = [{ rgb: [212, 32, 40] }];
const RED_BRIGHT = [{ rgb: [218, 28, 40] }];

const VARIANTS = [
  // ── RISE — 8 variants, no banneton word, varied vessels ────────────
  {
    stage: "rise",
    prompt:
      "A smooth round ball of unbaked sourdough resting on a wooden cutting board, lightly dusted with flour, soft warm light. The dough is uniformly domed and smooth — no patterns, no swirls, no concentric circles, no spiral, no cinnamon roll texture.",
  },
  {
    stage: "rise",
    prompt:
      "Two hands gently cupping a smooth ball of risen dough, side view, blurred kitchen counter behind. Just clean smooth dough — no surface decoration of any kind.",
  },
  {
    stage: "rise",
    prompt:
      "A clear glass mixing bowl on a wooden counter, dough rising inside, covered with a folded cotton kitchen cloth on top. The visible bulge of the smooth dough is gently rounded.",
  },
  {
    stage: "rise",
    prompt:
      "A round ball of dough on a wooden bread peel, lightly floured top, ready to slide into the oven. Quiet kitchen still life, calm composition, generous negative space.",
  },
  {
    stage: "rise",
    prompt:
      "Closeup of a smooth domed dough surface from a slight three-quarter angle. Soft shadows, warm golden tone, calm and minimal — no surface decoration, no patterns.",
  },
  {
    stage: "rise",
    prompt:
      "A small ball of dough resting on parchment paper on a wooden countertop, top-down view, surrounded by a faint dusting of flour. Soft and quiet.",
  },
  {
    stage: "rise",
    prompt:
      "A ceramic bowl with a clean cotton cloth draped over it on a kitchen counter — the gentle bulge of dough is visible underneath the cloth. Simple shapes, calm composition.",
  },
  {
    stage: "rise",
    prompt:
      "A round dough on a wooden surface beside a small ceramic bowl of flour, calm bakery still life, warm earthy palette, minimal scene.",
  },

  // ── SCORE — 6 variants, with negative_prompt to dodge knives ──────
  {
    stage: "score",
    prompt: `${SCORE_BASE} Top-down view of a hand holding the lame like a pencil, mid-motion drawing a confident curve across the top of a round raw dough. Only the hand, the slim lame tool, and the dough.`,
    negative_prompt: SCORE_NEG,
  },
  {
    stage: "score",
    prompt: `${SCORE_BASE} A bread lame resting on a wooden cutting board next to a freshly scored round dough — flat-lay still life, instructional and minimal. The lame is small and slender.`,
    negative_prompt: SCORE_NEG,
  },
  {
    stage: "score",
    prompt: `${SCORE_BASE} Side view: a slim wooden-handled lame with a tiny curved razor making a single slash across the top of a round dough ball. Soft warm shadows, focus on the small tool.`,
    negative_prompt: SCORE_NEG,
  },
  {
    stage: "score",
    prompt:
      "Closeup of a freshly baked sourdough loaf showing a dramatic 'ear' where it bloomed open at the score line — the lifted ridge of golden brown crust against a darker crumb. No tools, just the bread.",
  },
  {
    stage: "score",
    prompt: `${SCORE_BASE} A simple bread lame and a kitchen towel beside a round dough with a single fresh score across the top. Minimal still life on a wooden surface.`,
    negative_prompt: SCORE_NEG,
  },
  {
    stage: "score",
    prompt: `${SCORE_BASE} A hand at a slight angle holds the slim bread lame above a round of unbaked dough. Fresh slash visible in the dough, warm cream background, focused composition.`,
    negative_prompt: SCORE_NEG,
  },

  // ── BAKE — 8 variants, brighter reds + framing variation ──────────
  {
    stage: "bake",
    prompt:
      "A bright cherry-red enameled cast iron Dutch oven sitting on a wooden cutting board. Lid set aside, freshly baked golden sourdough loaf inside, gentle steam rising. The pot's red is vibrant and saturated — Le Creuset cerise, brighter than rust, NOT brown, NOT terracotta.",
    colors: RED_CERISE,
  },
  {
    stage: "bake",
    prompt:
      "Side view of a saturated red enameled Dutch oven on a wooden surface. Lid off and propped behind. A round loaf with deep golden crust inside. Soft steam curls rising upward. Cozy warm scene.",
    colors: RED_CERISE,
  },
  {
    stage: "bake",
    prompt:
      "Top-down view looking straight down into an open red enameled Dutch oven. A golden round sourdough loaf inside with bloomed score marks visible. The pot is bright cherry red, NOT rust, NOT brown.",
    colors: RED_CHERRY,
  },
  {
    stage: "bake",
    prompt:
      "A vibrant red Dutch oven sitting on top of a stove with subtle burner indicators. Lid removed and resting beside it on the counter. Golden bread visible inside. Warm cozy kitchen.",
    colors: RED_BRIGHT,
  },
  {
    stage: "bake",
    prompt:
      "A red enameled Dutch oven inside an oven with the door open. Gentle warm orange glow emanating from inside the oven. The domed shape of the loaf is visible inside the open pot.",
    colors: RED_CERISE,
  },
  {
    stage: "bake",
    prompt:
      "A freshly baked sourdough loaf being lifted out of a red Dutch oven onto a wooden cutting board with a folded kitchen towel. Steam rising. Hands at the edges with oven mitts.",
    colors: RED_CHERRY,
  },
  {
    stage: "bake",
    prompt:
      "Minimalist still life: a single bright red enameled Dutch oven, lid off, a domed golden loaf inside. White background, clean composition, plenty of negative space.",
    colors: RED_BRIGHT,
  },
  {
    stage: "bake",
    prompt:
      "A red Dutch oven cradled in two oven mitts being placed on a wooden trivet. The top of the loaf peeks out — a quiet moment of warmth and care.",
    colors: RED_CERISE,
  },

  // ── MIX — 4 more variants with the curved bowl scraper ────────────
  {
    stage: "mix",
    prompt:
      "Top-down view: a ceramic mixing bowl on a wooden counter filled with shaggy raw sourdough dough. A curved flexible plastic bowl scraper rests against the rim of the bowl — half-moon shape, one curved edge and one flat edge, no handle. NO wooden spoon, NO spatula, NO whisk.",
  },
  {
    stage: "mix",
    prompt:
      "A hand using a curved flexible plastic bench scraper to scrape down the side of a bowl of dough. The tool is unmistakably a baker's bowl scraper: half-moon plastic, curved edge, flat edge, NO handle. Calm focused motion.",
  },
  {
    stage: "mix",
    prompt:
      "Two hands working a curved plastic bowl scraper through soft dough on a wooden countertop. The scraper is folding the dough over itself. Minimal kitchen scene, warm tones.",
  },
  {
    stage: "mix",
    prompt:
      "Minimal still life on a wooden surface: a small ceramic bowl, a curved white plastic dough scraper laid flat beside it, a small mound of flour. Calm flat-lay composition, generous negative space.",
  },
];

async function generate({ prompt, negative_prompt, colors }) {
  const body = {
    prompt: `${prompt} ${STYLE}`,
    model: "recraftv3_vector",
    style: "vector_illustration",
    n: 1,
    response_format: "url",
  };
  if (negative_prompt) body.negative_prompt = negative_prompt;
  if (colors) body.controls = { colors };

  const res = await fetch("https://external.api.recraft.ai/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Recraft ${res.status}: ${text}`);
  return JSON.parse(text).data[0].url;
}

async function downloadSvg(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download ${res.status}: ${url}`);
  return await res.text();
}

function nextFreeIndex(dir) {
  let i = 1;
  while (existsSync(join(dir, `v${i}.svg`))) i++;
  return i;
}

async function main() {
  const filterStage = process.argv[2];
  const queue = filterStage
    ? VARIANTS.filter((v) => v.stage === filterStage)
    : VARIANTS;
  if (!queue.length) throw new Error(`No variants for stage: ${filterStage}`);

  const counters = new Map();
  for (const v of queue) {
    if (!counters.has(v.stage)) {
      const dir = join(ROOT, "public", "recraft-variants", v.stage);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      counters.set(v.stage, { dir, idx: nextFreeIndex(dir) });
    }
  }

  console.log(`→ Queued ${queue.length} variants across ${counters.size} stage(s).`);

  for (const cfg of queue) {
    const c = counters.get(cfg.stage);
    try {
      const url = await generate(cfg);
      const svg = await downloadSvg(url);
      const path = join(c.dir, `v${c.idx}.svg`);
      writeFileSync(path, svg);
      console.log(`  ✓ ${cfg.stage} v${c.idx}`);
      c.idx++;
    } catch (e) {
      console.error(`  ✗ ${cfg.stage}: ${e.message}`);
    }
  }

  console.log(`\nDone. Refresh /recraft-variants/index.html`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
