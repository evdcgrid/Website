import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.join(__dirname, "../public/portugal-parishes.json");
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

const QUERY = `[bbox:37,-9,42,-6];(relation["boundary"="administrative"]["admin_level"="10"]["name"];);out geom;`;

console.log("📍 Fetching parishes from OpenStreetMap...");
const response = await fetch(OVERPASS_URL, {
  method: "POST",
  body: QUERY,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

const data = await response.json();
const features = [];

for (const element of data.elements || []) {
  if (element.type !== "relation") continue;
  const tags = element.tags || {};
  const name = tags.name || tags.name_pt;
  if (!name) continue;
  
  let municipality = tags.municipality || tags["is_in:municipality"] || "";
  let geometry = null;
  
  if (element.geometry && element.geometry.length > 0) {
    const coords = element.geometry.map((p) => [p.lon, p.lat]);
    if (coords.length > 0 && (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])) {
      coords.push(coords[0]);
    }
    geometry = { type: "Polygon", coordinates: [coords] };
  }
  
  if (geometry) {
    features.push({
      type: "Feature",
      properties: { n: name, m: municipality },
      geometry,
    });
  }
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ type: "FeatureCollection", features }, null, 2));
console.log(`✅ Done! ${features.length} parishes saved.`);
