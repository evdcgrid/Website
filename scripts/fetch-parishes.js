#!/usr/bin/env node
/**
 * Fetches parish (freguesia) boundaries from OpenStreetMap via Overpass API
 * Filters by municipality to ensure correct associations
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const OUTPUT_FILE = path.join(__dirname, "../public/portugal-parishes.json");

// Overpass QL query to get parishes (admin_level=10)
// admin_level 10 = freguesias (parishes)
const QUERY = `
[bbox:37,-9,42,-6];
(
  relation["boundary"="administrative"]["admin_level"="10"]["name"];
);
out geom;
`;

async function fetchParishes() {
  try {
    console.log("📍 Fetching parishes from OpenStreetMap Overpass API...");
    console.log("   This may take a minute...\n");

    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      body: QUERY,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.elements) {
      throw new Error("No data returned from Overpass API");
    }

    const features = [];

    // Process each relation
    for (const element of data.elements) {
      if (element.type !== "relation") continue;

      const tags = element.tags || {};
      const name = tags.name || tags.name_pt;

      if (!name) continue;

      // Try to find municipality from tags or relations
      let municipality = tags.municipality || tags["is_in:municipality"] || "";

      // Convert geometry to GeoJSON
      let geometry = null;
      if (element.geometry && element.geometry.length > 0) {
        const coords = element.geometry.map((p) => [p.lon, p.lat]);
        // Close the polygon if not already closed
        if (
          coords.length > 0 &&
          (coords[0][0] !== coords[coords.length - 1][0] ||
            coords[0][1] !== coords[coords.length - 1][1])
        ) {
          coords.push(coords[0]);
        }
        geometry = {
          type: "Polygon",
          coordinates: [coords],
        };
      }

      if (!geometry) continue;

      const feature = {
        type: "Feature",
        properties: {
          n: name, // parish name (matches MapSimulation.tsx)
          m: municipality, // municipality
          admin_level: tags.admin_level,
        },
        geometry,
      };

      features.push(feature);
    }

    if (features.length === 0) {
      throw new Error("No parish features extracted from API data");
    }

    const geojson = {
      type: "FeatureCollection",
      features,
    };

    // Save to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(geojson, null, 2));

    console.log(`✅ Successfully fetched ${features.length} parishes`);
    console.log(`💾 Saved to: ${OUTPUT_FILE}\n`);

    // Show sample parishes
    console.log("📋 Sample parishes:");
    features.slice(0, 5).forEach((f) => {
      console.log(`   - ${f.properties.n} (${f.properties.m || "N/A"})`);
    });
  } catch (error) {
    console.error("❌ Error fetching parishes:", error.message);
    process.exit(1);
  }
}

fetchParishes();

