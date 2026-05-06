#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function loadEnv() {
  const envPath = join(ROOT, ".env.local");
  const raw = readFileSync(envPath, "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
  return env;
}

const env = loadEnv();
const API_KEY = env.RECRAFT_API_KEY;
if (!API_KEY) throw new Error("RECRAFT_API_KEY missing from .env.local");

const STYLE_PREAMBLE =
  "Warm minimal vector illustration, soft earthy tones (golden #D4A373, cream #FFF8F0, warm brown #5C3D2E, sage green #8B9E82), flat color fills with gentle hand-drawn line work, cozy kitchen aesthetic, white background, calm and inviting.";

const STAGES = [
  {
    key: "starter",
    file: "01-starter.svg",
    prompt:
      "A glass mason jar of sourdough starter on a wooden kitchen counter, with a cloth napkin tied around the lid with twine. The starter inside has a smooth creamy surface — completely uniform with no visible bubbles, no foam, no holes, no air pockets, no froth. Calm and quiet composition.",
  },
  {
    key: "mix",
    file: "02-mix.svg",
    prompt:
      "A ceramic mixing bowl filled with shaggy raw sourdough dough on a wooden counter. Resting against the bowl is a curved flexible plastic dough bowl scraper (a sourdough bench/bowl scraper — the half-moon shaped kind bakers use for handling and scraping dough). Do not include a wooden spoon, spatula, or kitchen utensil — only the curved plastic dough scraper.",
  },
  {
    key: "rise",
    file: "04-proof.svg",
    prompt:
      "A single round ball of risen sourdough dough resting inside a circular woven wicker proofing basket (banneton). The dough has a smooth, uniform, gently domed top. No spiral pattern, no concentric ring patterns, no swirls, no cinnamon roll texture, no flour ring artifacts on the surface. Just a calm, smooth, round dough. Viewed from a slightly elevated three-quarter angle.",
  },
  {
    key: "score",
    file: "05-score.svg",
    prompt:
      "A hand holding a bread lame (a baker's scoring tool: a thin handle with a small, curved razor blade at the tip) scoring a slash into the top of an unbaked round sourdough loaf. The tool is clearly a bread lame — slender wooden or plastic handle, very small curved razor blade — not a chef's knife, paring knife, kitchen knife, or any other utensil. Top-down or three-quarter view.",
  },
  {
    key: "bake",
    file: "06-bloom.svg",
    prompt:
      "A round golden-crusted sourdough loaf blooming inside an open enameled cast iron Dutch oven. The Dutch oven is painted a bright, vibrant, saturated classic red (Le Creuset Cerise / classic red — a clean cherry red, NOT rust, NOT terracotta, NOT burnt orange, NOT brown). Soft steam rising from the loaf. Warm cozy oven-baking scene.",
  },
];

async function generate(stage, n = 4) {
  const body = {
    prompt: `${stage.prompt} ${STYLE_PREAMBLE}`,
    model: "recraftv3_vector",
    style: "vector_illustration",
    n,
    response_format: "url",
  };
  const res = await fetch("https://external.api.recraft.ai/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Recraft API ${res.status} for ${stage.key}: ${text}`);
  const json = JSON.parse(text);
  return json.data.map((d) => d.url);
}

async function downloadSvg(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  return await res.text();
}

async function main() {
  const onlyKey = process.argv[2];
  const stages = onlyKey ? STAGES.filter((s) => s.key === onlyKey) : STAGES;
  if (!stages.length) throw new Error(`Unknown stage: ${onlyKey}`);

  const outRoot = join(ROOT, "public", "recraft-variants");
  if (!existsSync(outRoot)) mkdirSync(outRoot, { recursive: true });

  for (const stage of stages) {
    console.log(`\n→ Generating 4 variants for "${stage.key}"…`);
    const stageDir = join(outRoot, stage.key);
    if (!existsSync(stageDir)) mkdirSync(stageDir, { recursive: true });

    let urls;
    try {
      urls = await generate(stage, 4);
    } catch (err) {
      console.error(`  ✗ ${stage.key}: ${err.message}`);
      continue;
    }

    for (let i = 0; i < urls.length; i++) {
      const svg = await downloadSvg(urls[i]);
      const path = join(stageDir, `v${i + 1}.svg`);
      writeFileSync(path, svg);
      console.log(`  ✓ saved ${path.replace(ROOT + "/", "")}`);
    }
  }

  console.log(`\nDone. Preview at /recraft-variants/<stage>/v{1..4}.svg in dev server.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
