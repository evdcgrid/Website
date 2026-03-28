#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  runOverpassQuery,
  buildCandidateQuery,
  pickLevelByExpectedCount,
  relationIdFromFeature,
  convertElementsToRelationFeatures,
  simplifyGeometry,
  normalize,
  slugifyPlaceName,
  sleep,
  clearJsonFilesInDir,
  writeGeoJson,
} from "./lib/osm-admin-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_OUT = path.join(__dirname, "../public/portugal-parishes.json");
const DIR_OUT = path.join(__dirname, "../public/freguesias");
const LEGACY_DIR_OUT = path.join(__dirname, "../public/parishes");
const GEOMETRY_CACHE_DIR = path.join(__dirname, "../public/.cache/freguesias-geometry");

console.log("Fetching parishes (freguesias) from OpenStreetMap...");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data));
}

async function fetchGeometryFeaturesAdaptive(parishIds, depth = 0) {
  if (parishIds.length === 0) return [];

  const idList = parishIds.join(",");
  const timeout = Math.min(260, 90 + parishIds.length);
  const geometryQuery = `[out:json][timeout:${timeout}];relation(id:${idList});out body;>;out skel qt;`;

  try {
    const rawGeometry = await runOverpassQuery(geometryQuery);
    return convertElementsToRelationFeatures(rawGeometry);
  } catch (error) {
    const canSplit = parishIds.length > 12 && depth < 5;
    if (!canSplit) throw error;

    const mid = Math.floor(parishIds.length / 2);
    const leftIds = parishIds.slice(0, mid);
    const rightIds = parishIds.slice(mid);

    console.warn(
      `  Adaptive split: ${parishIds.length} -> ${leftIds.length} + ${rightIds.length} (depth ${depth + 1})`
    );

    const leftFeatures = await fetchGeometryFeaturesAdaptive(leftIds, depth + 1);
    const rightFeatures = await fetchGeometryFeaturesAdaptive(rightIds, depth + 1);
    return [...leftFeatures, ...rightFeatures];
  }
}

try {
  const municipalityCandidates = await runOverpassQuery(buildCandidateQuery("6|7|8"));
  const municipalityLevel = pickLevelByExpectedCount(municipalityCandidates, 308);

  if (!municipalityLevel) throw new Error("Could not determine municipality admin_level");

  const municipalities = municipalityCandidates.filter(
    (r) =>
      r.type === "relation" &&
      r.tags?.admin_level === municipalityLevel &&
      r.tags?.name &&
      r.center
  );

  if (municipalities.length === 0) throw new Error("No municipality relations found after filtering");

  const municipalityById = new Map(municipalities.map((m) => [m.id, m]));

  // Build parish->municipality mapping from municipality members.
  console.log("Building parish->municipality hierarchy from OSM...");
  console.log(`Querying ${municipalities.length} municipalities in chunks for parish member relations...`);
  const municipalityByParish = new Map();
  const parishIdsSet = new Set();

  const parishCountsByMunicipality = new Map();
  const chunkSize = 40;
  const totalChunks = Math.ceil(municipalities.length / chunkSize);

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
    const start = chunkIndex * chunkSize;
    const end = start + chunkSize;
    const chunk = municipalities.slice(start, end);
    const ids = chunk.map((m) => m.id).join(",");
    console.log(`  Querying chunk ${chunkIndex + 1}/${totalChunks} (${chunk.length} municipalities)...`);

    try {
      const hierarchyQuery = `[out:json][timeout:120];relation(id:${ids});out body;`;
      const parentRelations = await runOverpassQuery(hierarchyQuery);

      for (const relation of parentRelations) {
        if (relation?.type !== "relation" || !municipalityById.has(relation.id)) continue;

        const municipalityName = normalize(municipalityById.get(relation.id)?.tags?.name);
        let childrenFound = 0;

        for (const member of relation.members || []) {
          if (member?.type !== "relation") continue;

          municipalityByParish.set(member.ref, municipalityName);
          parishIdsSet.add(member.ref);
          childrenFound += 1;
        }

        parishCountsByMunicipality.set(municipalityName, childrenFound);
      }
    } catch (error) {
      console.warn(`  ⚠️ Chunk ${chunkIndex + 1}/${totalChunks} failed: ${error.message}`);
    }
  }

  let processedCount = 0;
  for (const municipality of municipalities) {
    const municipalityName = normalize(municipality.tags?.name);
    const childrenFound = parishCountsByMunicipality.get(municipalityName) || 0;
    processedCount += 1;
    if (processedCount % 25 === 0 || processedCount === municipalities.length) {
      console.log(`  [${processedCount}/${municipalities.length}] ${municipalityName}: ${childrenFound} parishes`);
    }
  }
  
  const parishIds = Array.from(parishIdsSet);
  if (parishIds.length === 0) {
    throw new Error("No parish IDs discovered from municipality relation members");
  }

  console.log(`✓ Hierarchy complete: ${municipalityByParish.size} parishes assigned to municipalities`);
  console.log(`Discovered ${parishIds.length} parish relation IDs from municipality members`);

  fs.mkdirSync(GEOMETRY_CACHE_DIR, { recursive: true });

  const geometryChunkSize = 60;
  const geometryChunkCount = Math.ceil(parishIds.length / geometryChunkSize);
  const relationFeatures = [];

  console.log(`Fetching parish geometries in ${geometryChunkCount} chunks...`);

  for (let i = 0; i < geometryChunkCount; i += 1) {
    const start = i * geometryChunkSize;
    const end = start + geometryChunkSize;
    const idChunk = parishIds.slice(start, end);
    const cacheFile = path.join(GEOMETRY_CACHE_DIR, `chunk-${String(i + 1).padStart(3, "0")}.json`);

    if (fs.existsSync(cacheFile)) {
      const cached = readJson(cacheFile);
      relationFeatures.push(...(cached.features || []));
      console.log(`  Geometry chunk ${i + 1}/${geometryChunkCount} loaded from cache (${idChunk.length} relations)`);
      continue;
    }

    console.log(`  Geometry chunk ${i + 1}/${geometryChunkCount} (${idChunk.length} relations)...`);

    const chunkFeatures = await fetchGeometryFeaturesAdaptive(idChunk);
    writeJson(cacheFile, { features: chunkFeatures });
    relationFeatures.push(...chunkFeatures);

    // Gentle pacing between geometry chunks to reduce 429 probability.
    await sleep(1500);
  }

  const features = relationFeatures.map((feature) => {
    const relId = relationIdFromFeature(feature);
    const parishName = normalize(feature.properties?.name);
    const municipalityName = normalize(municipalityByParish.get(relId) || "Unknown");

    return {
      type: "Feature",
      properties: {
        n: parishName,
        m: municipalityName,
      },
      geometry: simplifyGeometry(feature.geometry, { tolerance: 0.00008, decimals: 6 }),
    };
  });

  if (features.length === 0) {
    throw new Error("No polygon features were generated from OSM geometry");
  }

  clearJsonFilesInDir(DIR_OUT);
  clearJsonFilesInDir(LEGACY_DIR_OUT);
  writeGeoJson(ROOT_OUT, features);

  const groupedByMunicipality = new Map();
  for (const feature of features) {
    const muni = normalize(feature.properties?.m) || "Unknown";
    if (!groupedByMunicipality.has(muni)) groupedByMunicipality.set(muni, []);
    groupedByMunicipality.get(muni).push(feature);
  }

  for (const [municipality, muniFeatures] of groupedByMunicipality.entries()) {
    const slug = slugifyPlaceName(municipality) || "unknown";
    writeGeoJson(path.join(DIR_OUT, `${slug}.json`), muniFeatures);
    writeGeoJson(path.join(LEGACY_DIR_OUT, `${slug}.json`), muniFeatures);
  }

  console.log(`Detected municipality admin_level=${municipalityLevel}`);
  console.log(`Saved ${features.length} parishes to ${ROOT_OUT}`);
  console.log(`Saved municipality-grouped parish files to ${DIR_OUT}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
