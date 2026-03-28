import fs from "fs";
import path from "path";
import osmtogeojson from "osmtogeojson";

export const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://z.overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];

export const PT_AREA_PREFIX = `
[out:json][timeout:180];
area["ISO3166-1"="PT"][admin_level=2]->.pt;
`;

export function normalize(value) {
  return (value || "").trim();
}

export function normalizeKey(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

export function slugifyPlaceName(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let lastOverpassRequestAt = 0;

async function paceOverpassRequests(minGapMs = 1200) {
  const now = Date.now();
  const elapsed = now - lastOverpassRequestAt;
  if (elapsed < minGapMs) {
    await sleep(minGapMs - elapsed);
  }
  lastOverpassRequestAt = Date.now();
}

function rotateEndpoints(list) {
  if (list.length <= 1) return list;
  const shift = Math.floor(Math.random() * list.length);
  return [...list.slice(shift), ...list.slice(0, shift)];
}

export async function runOverpassQuery(query) {
  let lastError = null;
  const requestTimeoutMs = 45000;
  const endpoints = rotateEndpoints(OVERPASS_ENDPOINTS);

  for (const endpoint of endpoints) {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        await paceOverpassRequests();
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), requestTimeoutMs);

        const response = await fetch(endpoint, {
          method: "POST",
          body: query,
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (response.status === 429) {
          const retryAfterHeader = response.headers.get("retry-after");
          const retryAfterSeconds = Number.parseInt(retryAfterHeader || "", 10);
          const backoffMs = Number.isFinite(retryAfterSeconds)
            ? retryAfterSeconds * 1000
            : 4000 * attempt;
          throw new Error(`HTTP 429 from ${endpoint} (backoff ${backoffMs}ms)`);
        }

        const text = await response.text();

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} from ${endpoint}`);
        }

        if (text.startsWith("<?xml")) {
          throw new Error(`XML error response from ${endpoint}`);
        }

        const data = JSON.parse(text);
        if (!data.elements || !Array.isArray(data.elements)) {
          throw new Error(`Invalid JSON payload from ${endpoint}`);
        }

        return data.elements;
      } catch (error) {
        if (error?.name === "AbortError") {
          lastError = new Error(`Timeout after ${requestTimeoutMs}ms on ${endpoint}`);
        } else {
          lastError = error;
        }

        const message = lastError?.message || "Unknown error";
        console.warn(`Overpass failed (${endpoint}, attempt ${attempt}/3): ${message}`);

        if (String(message).includes("HTTP 429")) {
          const matched = String(message).match(/backoff\s+(\d+)ms/);
          const backoffMs = matched ? Number.parseInt(matched[1], 10) : 4000 * attempt;
          await sleep(backoffMs);
        } else {
          await sleep(1200 * attempt);
        }
      }
    }
  }

  throw lastError || new Error("All Overpass endpoints failed");
}

export function buildCandidateQuery(levelRegex) {
  return `${PT_AREA_PREFIX}
(
  relation(area.pt)["boundary"="administrative"]["admin_level"~"${levelRegex}"]["name"];
);
out center tags;`;
}

export function buildGeometryQuery(level) {
  return `${PT_AREA_PREFIX}
(
  relation(area.pt)["boundary"="administrative"]["admin_level"="${level}"]["name"];
);
out body;
>;
out skel qt;`;
}

export function groupByAdminLevel(relations) {
  const groups = new Map();
  for (const rel of relations) {
    const level = rel.tags?.admin_level || "unknown";
    if (!groups.has(level)) groups.set(level, []);
    groups.get(level).push(rel);
  }
  return groups;
}

export function pickLevelByLargestCount(relations) {
  const grouped = groupByAdminLevel(relations);
  let bestLevel = null;
  let bestCount = -1;

  for (const [level, rows] of grouped.entries()) {
    if (!/^[0-9]+$/.test(level)) continue;
    if (rows.length > bestCount) {
      bestCount = rows.length;
      bestLevel = level;
    }
  }

  return bestLevel;
}

export function pickLevelByExpectedCount(relations, expected) {
  const grouped = groupByAdminLevel(relations);
  let bestLevel = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const [level, rows] of grouped.entries()) {
    if (!/^[0-9]+$/.test(level)) continue;
    const distance = Math.abs(rows.length - expected);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestLevel = level;
    }
  }

  return bestLevel;
}

export function relationIdFromFeature(feature) {
  const idValue = feature?.properties?.id ?? feature?.properties?.["@id"];
  if (typeof idValue === "number") return idValue;
  if (typeof idValue === "string") {
    if (idValue.startsWith("relation/")) {
      return Number(idValue.split("/")[1]);
    }
    const asNum = Number(idValue);
    if (!Number.isNaN(asNum)) return asNum;
  }

  return null;
}

export function convertElementsToRelationFeatures(elements) {
  const geojson = osmtogeojson({ elements });
  const allFeatures = geojson?.features || [];

  return allFeatures.filter((feature) => {
    const relId = relationIdFromFeature(feature);
    return relId != null;
  });
}

export function squaredDistance(a, b) {
  const dx = (a?.lon ?? 0) - (b?.lon ?? 0);
  const dy = (a?.lat ?? 0) - (b?.lat ?? 0);
  return dx * dx + dy * dy;
}

export function clearJsonFilesInDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".json")) {
      fs.unlinkSync(path.join(dirPath, entry.name));
    }
  }
}

export function writeGeoJson(filePath, features) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    JSON.stringify(
      {
        type: "FeatureCollection",
        features,
      },
      null,
      2
    )
  );
}
