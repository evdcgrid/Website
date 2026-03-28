#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");
const forceRefresh = process.argv.includes("--force");

function hasJsonWithFeatures(filePath) {
  try {
    if (!fs.existsSync(filePath)) return false;
    const raw = fs.readFileSync(filePath, "utf8");
    if (!raw.trim()) return false;
    const parsed = JSON.parse(raw);
    return parsed?.type === "FeatureCollection" && Array.isArray(parsed?.features) && parsed.features.length > 0;
  } catch {
    return false;
  }
}

function hasJsonFilesInDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) return false;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    return entries.some((entry) => entry.isFile() && entry.name.endsWith(".json"));
  } catch {
    return false;
  }
}

function hasPortugalMapTree() {
  const rootFile = path.join(publicDir, "portugal_map", "districts.json");
  return hasJsonWithFeatures(rootFile);
}

const stageConfig = [
  {
    script: "fetch-distritos-api.mjs",
    outputReady: () =>
      hasJsonWithFeatures(path.join(publicDir, "portugal-districts.json")) &&
      hasJsonFilesInDir(path.join(publicDir, "distritos")),
  },
  {
    script: "fetch-concelhos-api.mjs",
    outputReady: () =>
      hasJsonWithFeatures(path.join(publicDir, "portugal-municipalities.json")) &&
      hasJsonFilesInDir(path.join(publicDir, "concelhos")),
  },
  {
    script: "fetch-freguesias-api.mjs",
    outputReady: () => hasJsonWithFeatures(path.join(publicDir, "portugal-parishes.json")),
  },
  {
    script: "build-portugal-map-tree.mjs",
    outputReady: () => hasPortugalMapTree(),
  },
];

let skippedCount = 0;

for (const { script, outputReady } of stageConfig) {
  if (!forceRefresh && outputReady()) {
    skippedCount += 1;
    console.log(`Skipping ${script} (already generated)`);
    continue;
  }

  const fullPath = path.join(__dirname, script);
  const result = spawnSync(process.execPath, ["--no-warnings", fullPath], { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

if (forceRefresh) {
  console.log("All administrative datasets generated successfully (forced refresh).");
} else if (skippedCount === stageConfig.length) {
  console.log("All datasets already exist. Nothing to fetch.");
} else {
  console.log("Administrative datasets generation completed.");
}
