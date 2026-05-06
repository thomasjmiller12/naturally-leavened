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

const VARIANTS = [
  // ── RISE — 5 variants WITH "proofing basket" wording, smooth dough ─
  {
    stage: "rise",
    prompt:
      "A round ball of risen sourdough dough resting in a round wooden proofing basket. The top of the dough is smooth, gently domed, completely uniform — no swirls, no spiral, no concentric ring patterns. Side three-quarter view, calm warm light.",
  },
  {
    stage: "rise",
    prompt:
      "Top-down view straight down into a round proofing basket. A smooth ball of dough sits inside, the dough surface is plain and uniform — no flour spiral pattern, no ring marks, just a calm rounded surface.",
  },
  {
    stage: "rise",
    prompt:
      "A sourdough boule rising in a banneton (round proofing basket) on a wooden counter. The dough has a perfectly smooth domed surface, no decorative patterns, no spirals. A linen cloth is folded neatly beside it.",
  },
  {
    stage: "rise",
    prompt:
      "A round wicker proofing basket on a wooden table, holding a single ball of unbaked sourdough with a clean smooth top. The basket's woven texture is visible on the outside, but the dough on top has no surface decoration whatsoever.",
  },
  {
    stage: "rise",
    prompt:
      "Side view of a round proofing basket cradling a smooth domed ball of risen sourdough. The dough is dusted very lightly with flour but has no pattern, no ring, no spiral on top. Quiet warm composition.",
  },

  // ── SCORE — 6 variants, no 'pencil' wording, fresh approaches ─────
  {
    stage: "score",
    prompt:
      "A bread lame in a baker's hand, scoring a single curved cut into the top of an unbaked round sourdough boule. The lame is a sourdough scoring tool — small curved blade attached to a short bone-shaped handle. Calm focused composition.",
    negative_prompt:
      "kitchen knife, chef knife, paring knife, butcher knife, cleaver, large blade, scissors",
  },
  {
    stage: "score",
    prompt:
      "Top-down view: a sourdough boule on parchment paper showing a single fresh curved slash across the top. A small bread-scoring tool rests on the parchment beside the loaf. Minimal still life, focus on the bread.",
  },
  {
    stage: "score",
    prompt:
      "A pair of hands gently holding an unbaked round sourdough loaf and making a single curved cut across the top with a tiny curved blade. The blade is so small it disappears into the hand — the focus is on the cut and the dough.",
    negative_prompt:
      "kitchen knife, chef knife, paring knife, butcher knife, cleaver, large blade",
  },
  {
    stage: "score",
    prompt:
      "Closeup study of a single fresh score line newly cut into the smooth top of an unbaked dough. Just the dough surface and the visible slash — no tool in frame. Calm quiet composition with warm shadows.",
  },
  {
    stage: "score",
    prompt:
      "A round sourdough boule on a wooden board, showing the classic baker's scoring pattern — a single confident curved slash across the top. A tiny curved scoring tool sits to one side of the board. Warm earthy palette.",
  },
  {
    stage: "score",
    prompt:
      "An aerial flat-lay: a freshly baked round sourdough loaf from above with a beautifully bloomed score line — the curved cut has opened up dramatically during baking, showing the lighter crumb beneath the golden crust. Just the loaf, no tools.",
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
  const queue = filterStage ? VARIANTS.filter((v) => v.stage === filterStage) : VARIANTS;
  if (!queue.length) throw new Error(`No variants for stage: ${filterStage}`);

  const counters = new Map();
  for (const v of queue) {
    if (!counters.has(v.stage)) {
      const dir = join(ROOT, "public", "recraft-variants", v.stage);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      counters.set(v.stage, { dir, idx: nextFreeIndex(dir) });
    }
  }

  console.log(`→ Round 3: ${queue.length} variants across ${counters.size} stage(s).`);

  for (const cfg of queue) {
    const c = counters.get(cfg.stage);
    try {
      const url = await generate(cfg);
      const svg = await downloadSvg(url);
      writeFileSync(join(c.dir, `v${c.idx}.svg`), svg);
      console.log(`  ✓ ${cfg.stage} v${c.idx}`);
      c.idx++;
    } catch (e) {
      console.error(`  ✗ ${cfg.stage}: ${e.message}`);
    }
  }
  console.log(`\nDone.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
