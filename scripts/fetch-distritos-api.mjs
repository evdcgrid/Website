#!/usr/bin/env node
import path from "path";
import { fileURLToPath } from "url";
import {
  runOverpassQuery,
  buildCandidateQuery,
  buildGeometryQuery,
  pickLevelByExpectedCount,
  relationIdFromFeature,
  convertElementsToRelationFeatures,
  simplifyGeometry,
  normalize,
  slugifyPlaceName,
  clearJsonFilesInDir,
  writeGeoJson,
} from "./lib/osm-admin-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_OUT = path.join(__dirname, "../public/portugal-districts.json");
const DIR_OUT = path.join(__dirname, "../public/distritos");

console.log("Fetching districts (distritos) from OpenStreetMap...");

try {
  const candidates = await runOverpassQuery(buildCandidateQuery("4|5|6"));
  const level = pickLevelByExpectedCount(candidates, 18);
  if (!level) throw new Error("Could not determine district admin_level");

  const rows = candidates.filter(
    (r) => r.type === "relation" && r.tags?.admin_level === level && r.tags?.name
  );
  const rowById = new Map(rows.map((r) => [r.id, r]));

  const rawGeometry = await runOverpassQuery(buildGeometryQuery(level));
  const relationFeatures = convertElementsToRelationFeatures(rawGeometry);

  const features = relationFeatures.map((feature) => {
    const relId = relationIdFromFeature(feature);
    const row = relId != null ? rowById.get(relId) : null;
    const districtName = normalize(feature.properties?.name || row?.tags?.name);

    return {
      type: "Feature",
      properties: {
        name: districtName,
      },
      geometry: simplifyGeometry(feature.geometry, { tolerance: 0.00012, decimals: 6 }),
    };
  });

  clearJsonFilesInDir(DIR_OUT);
  writeGeoJson(ROOT_OUT, features);

  for (const feature of features) {
    const districtName = feature.properties?.name || "unknown";
    const slug = slugifyPlaceName(districtName) || "unknown";
    writeGeoJson(path.join(DIR_OUT, `${slug}.json`), [feature]);
  }

  console.log(`Detected district admin_level=${level}`);
  console.log(`Saved ${features.length} districts to ${ROOT_OUT}`);
  console.log(`Saved district files to ${DIR_OUT}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
