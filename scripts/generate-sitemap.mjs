import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mapRoot = path.join(root, "public", "portugal_map");
const output = path.join(root, "public", "sitemap.xml");
const siteUrl = "https://evdcgrid.pt";
const lastModified = new Date().toISOString().slice(0, 10);

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const urls = new Map();

const addUrl = (pathname, priority, changefreq = "monthly") => {
  urls.set(pathname, { pathname, priority, changefreq });
};

addUrl("/", "1.0", "weekly");
addUrl("/product", "0.9", "weekly");
addUrl("/simulation", "0.9", "weekly");
addUrl("/map", "0.9");
addUrl("/case-study", "0.8");
addUrl("/contact", "0.6", "yearly");

const districts = readJson(path.join(mapRoot, "districts.json"));
for (const district of districts.features) {
  const districtName = district.properties?.name;
  const districtSlug = slugify(districtName);
  addUrl(`/map/${districtSlug}`, "0.8");

  const municipalitiesFile = path.join(mapRoot, districtSlug, "municipalities.json");
  if (!fs.existsSync(municipalitiesFile)) continue;

  const municipalities = readJson(municipalitiesFile);
  for (const municipality of municipalities.features) {
    const municipalityName = municipality.properties?.name;
    const municipalitySlug = slugify(municipalityName);
    const municipalityPath = `/map/${districtSlug}/${municipalitySlug}`;
    addUrl(municipalityPath, "0.7");

    const parishesFile = path.join(mapRoot, districtSlug, municipalitySlug, "parishes.json");
    if (!fs.existsSync(parishesFile)) continue;

    const parishes = readJson(parishesFile);
    for (const parish of parishes.features) {
      const parishName = parish.properties?.n;
      if (parishName) {
        addUrl(`${municipalityPath}/${slugify(parishName)}`, "0.6");
      }
    }
  }
}

const entries = [...urls.values()].map(({ pathname, priority, changefreq }) => `  <url>
    <loc>${siteUrl}${pathname}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n\n");

fs.writeFileSync(
  output,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
);

console.log(`Generated ${urls.size} sitemap URLs.`);
