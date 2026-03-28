#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "../public");

const DISTRICTS_FILE = path.join(PUBLIC_DIR, "portugal-districts.json");
const MUNICIPALITIES_FILE = path.join(PUBLIC_DIR, "portugal-municipalities.json");
const PARISHES_FILE = path.join(PUBLIC_DIR, "portugal-parishes.json");

const PORTUGAL_MAP_DIR = path.join(PUBLIC_DIR, "portugal_map");

function normalizeKey(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function slugify(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toFeatureCollection(features) {
  return {
    type: "FeatureCollection",
    features,
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

console.log("Building public/portugal_map tree...");

try {
  const districts = readJson(DISTRICTS_FILE);
  const municipalities = readJson(MUNICIPALITIES_FILE);
  const parishes = readJson(PARISHES_FILE);

  fs.rmSync(PORTUGAL_MAP_DIR, { recursive: true, force: true });
  ensureDir(PORTUGAL_MAP_DIR);

  // Root JSON with all district boundaries.
  writeJson(path.join(PORTUGAL_MAP_DIR, "districts.json"), districts);

  let districtCount = 0;
  let municipalityCount = 0;
  let parishCount = 0;

  for (const districtFeature of districts.features || []) {
    const districtName = districtFeature?.properties?.name || "";
    if (!districtName) continue;

    districtCount += 1;

    const districtSlug = slugify(districtName) || "unknown-district";
    const districtDir = path.join(PORTUGAL_MAP_DIR, districtSlug);
    ensureDir(districtDir);

    const districtMunicipalities = (municipalities.features || []).filter(
      (f) => normalizeKey(f?.properties?.district) === normalizeKey(districtName)
    );

    writeJson(path.join(districtDir, "municipalities.json"), toFeatureCollection(districtMunicipalities));

    for (const municipalityFeature of districtMunicipalities) {
      const municipalityName = municipalityFeature?.properties?.name || "";
      if (!municipalityName) continue;

      municipalityCount += 1;

      const municipalitySlug = slugify(municipalityName) || "unknown-municipality";
      const municipalityDir = path.join(districtDir, municipalitySlug);
      ensureDir(municipalityDir);

      const municipalityParishes = (parishes.features || []).filter(
        (f) => normalizeKey(f?.properties?.m) === normalizeKey(municipalityName)
      );

      parishCount += municipalityParishes.length;

      writeJson(path.join(municipalityDir, "parishes.json"), toFeatureCollection(municipalityParishes));
    }
  }

  console.log(`Created ${PORTUGAL_MAP_DIR}`);
  console.log(`District folders: ${districtCount}`);
  console.log(`Municipality folders: ${municipalityCount}`);
  console.log(`Parish features written: ${parishCount}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
