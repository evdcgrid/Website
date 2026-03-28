#!/usr/bin/env node
import path from "path";
import { fileURLToPath } from "url";
import {
  runOverpassQuery,
  buildCandidateQuery,
  buildGeometryQuery,
  pickLevelByExpectedCount,
  pickLevelByExpectedCount as pickClosestLevel,
  relationIdFromFeature,
  convertElementsToRelationFeatures,
  simplifyGeometry,
  squaredDistance,
  normalize,
  normalizeKey,
  slugifyPlaceName,
  clearJsonFilesInDir,
  writeGeoJson,
} from "./lib/osm-admin-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_OUT = path.join(__dirname, "../public/portugal-municipalities.json");
const DIR_OUT = path.join(__dirname, "../public/concelhos");

console.log("Fetching municipalities (concelhos) from OpenStreetMap...");

try {
  const municipalityCandidates = await runOverpassQuery(buildCandidateQuery("6|7|8"));
  const districtCandidates = await runOverpassQuery(buildCandidateQuery("4|5|6"));

  const municipalityLevel = pickLevelByExpectedCount(municipalityCandidates, 308);
  const districtLevel = pickClosestLevel(districtCandidates, 18);

  if (!municipalityLevel) throw new Error("Could not determine municipality admin_level");
  if (!districtLevel) throw new Error("Could not determine district admin_level");

  const municipalities = municipalityCandidates.filter(
    (r) => r.type === "relation" && r.tags?.admin_level === municipalityLevel && r.tags?.name && r.center
  );

  const districts = districtCandidates.filter(
    (r) => r.type === "relation" && r.tags?.admin_level === districtLevel && r.tags?.name && r.center
  );

  if (municipalities.length === 0) throw new Error("No municipalities found after filtering");
  if (districts.length === 0) throw new Error("No districts found after filtering");

  const municipalityById = new Map(municipalities.map((r) => [r.id, r]));
  const districtById = new Map(districts.map((r) => [r.id, r]));
  
  // Build municipality->district mapping from OSM hierarchy (single batch query)
  console.log("Building municipality->district hierarchy from OSM...");
  console.log(`Querying ${districts.length} districts in batch for member municipalities...`);
  const districtByMunicipality = new Map();
  const districtMemberCounts = new Map();

  try {
    const districtIds = districts.map((d) => d.id).join(",");
    const hierarchyQuery = `[out:json][timeout:90];relation(id:${districtIds});out body;`;
    const parentRelations = await runOverpassQuery(hierarchyQuery);

    for (const relation of parentRelations) {
      if (relation?.type !== "relation" || !districtById.has(relation.id)) continue;

      const district = districtById.get(relation.id);
      const districtName = normalize(district?.tags?.name);
      let childrenFound = 0;

      for (const member of relation.members || []) {
        if (member?.type !== "relation") continue;
        if (!municipalityById.has(member.ref)) continue;
        districtByMunicipality.set(member.ref, districtName);
        childrenFound += 1;
      }

      districtMemberCounts.set(districtName, childrenFound);
    }

    let processedCount = 0;
    for (const district of districts) {
      const districtName = normalize(district.tags?.name);
      const childrenFound = districtMemberCounts.get(districtName) || 0;
      processedCount += 1;
      console.log(`  [${processedCount}/${districts.length}] ✓ ${districtName}: ${childrenFound} municipalities`);
    }
  } catch (error) {
    console.warn(`Hierarchy batch query failed, using nearest fallback only: ${error.message}`);
  }
  
  console.log(`✓ Hierarchy complete: ${districtByMunicipality.size} municipalities assigned to districts`);

  const rawGeometry = await runOverpassQuery(buildGeometryQuery(municipalityLevel));
  const relationFeatures = convertElementsToRelationFeatures(rawGeometry);

  const features = relationFeatures.map((feature) => {
    const relId = relationIdFromFeature(feature);
    const municipalityRow = relId != null ? municipalityById.get(relId) : null;
    const municipalityName = normalize(feature.properties?.name || municipalityRow?.tags?.name);

    let districtName = districtByMunicipality.get(relId) || "";
    
    // Fallback to nearest center only if hierarchy lookup fails
    if (!districtName && municipalityRow?.center) {
      let nearest = districts[0];
      let best = squaredDistance(municipalityRow.center, districts[0].center);

      for (let i = 1; i < districts.length; i += 1) {
        const d = squaredDistance(municipalityRow.center, districts[i].center);
        if (d < best) {
          best = d;
          nearest = districts[i];
        }
      }

      districtName = normalize(nearest.tags?.name);
    }

    return {
      type: "Feature",
      properties: {
        name: municipalityName,
        district: districtName,
      },
      geometry: simplifyGeometry(feature.geometry, { tolerance: 0.009, decimals: 5 }),
    };
  });

  clearJsonFilesInDir(DIR_OUT);
  writeGeoJson(ROOT_OUT, features);

  const groupedByDistrict = new Map();
  for (const feature of features) {
    const district = normalize(feature.properties?.district) || "Unknown";
    if (!groupedByDistrict.has(district)) groupedByDistrict.set(district, []);
    groupedByDistrict.get(district).push(feature);
  }

  for (const [districtName, districtFeatures] of groupedByDistrict.entries()) {
    const slug = slugifyPlaceName(districtName) || "unknown";
    writeGeoJson(path.join(DIR_OUT, `${slug}.json`), districtFeatures);
  }

  console.log(`Detected municipality admin_level=${municipalityLevel}`);
  console.log(`Detected district admin_level=${districtLevel}`);
  console.log(`Saved ${features.length} municipalities to ${ROOT_OUT}`);
  console.log(`Saved district-grouped municipality files to ${DIR_OUT}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
