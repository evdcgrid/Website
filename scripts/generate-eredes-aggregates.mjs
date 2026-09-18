import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EREDES_PUBLIC_LIGHTING_API =
  "https://e-redes.opendatasoft.com/api/explore/v2.1/catalog/datasets/cadastro_iluminacao_publica/records";

const EV_CHARGER_POWER_KW = 11;
const DC_CIRCUIT_POWER_KW = 193.2;
const AC_CIRCUIT_POWER_KW = 47.8;
const LAMPS_PER_CIRCUIT = 300;
const FALLBACK_LED_LAMP_POWER_W = 50;
const NIGHT_HOURS_PER_YEAR = 12 * 365;
const NIGHT_ELECTRICITY_PRICE_EUR_PER_KWH = 0.07265 * 2;
const totalAC = 175000 + 28700;
const totalDC = 169940;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mapRoot = path.join(root, "public", "portugal_map");
const outputRoot = path.join(root, "public", "eredes-aggregates");
const districtOutputRoot = path.join(outputRoot, "districts");

function normalizePlaceName(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function slugifyPlaceName(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeOdsString(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildLightingApiUrl(where, limit = 100, offset = 0) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    order_by: "ano DESC, mes DESC, tipo_de_lampada",
  });
  if (where) params.set("where", where);
  return `${EREDES_PUBLIC_LIGHTING_API}?${params.toString()}`;
}

function latestLightingPeriod(records) {
  return Math.max(...records.map((record) => Number(record.ano) * 100 + Number(record.mes)));
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`E-REDES API error ${response.status}`);
  return response.json();
}

async function fetchLightingRecords(district) {
  const exactWhere = district ? `distrito="${escapeOdsString(district)}"` : "";
  const exactData = await fetchJson(buildLightingApiUrl(exactWhere, 100));
  const initialRecords = Array.isArray(exactData.results) ? exactData.results : [];
  if (initialRecords.length === 0) return [];

  const latestPeriod = latestLightingPeriod(initialRecords);
  const latestYear = Math.floor(latestPeriod / 100);
  const latestMonth = latestPeriod % 100;
  const latestWhere = [
    exactWhere || undefined,
    `ano="${latestYear}"`,
    `mes="${latestMonth}"`,
  ].filter(Boolean).join(" AND ");
  const latestRecords = [];
  const pageSize = 100;

  for (let offset = 0; ; offset += pageSize) {
    const data = await fetchJson(buildLightingApiUrl(latestWhere, pageSize, offset));
    const page = Array.isArray(data.results) ? data.results : [];
    latestRecords.push(...page);
    if (page.length < pageSize) break;
  }

  return latestRecords;
}

function calculateSimulation(records) {
  const latestPeriod = latestLightingPeriod(records);
  const latestRecords = records.filter((record) => Number(record.ano) * 100 + Number(record.mes) === latestPeriod);
  const latestYear = Math.floor(latestPeriod / 100);
  const latestMonth = latestPeriod % 100;
  const totalLuminaires = latestRecords.reduce((sum, record) => sum + (Number(record.luminarias) || 0), 0);
  const totalLamps = latestRecords.reduce((sum, record) => sum + (Number(record.lampadas) || 0), 0);
  const currentLampPowerKw =
    latestRecords.reduce((sum, record) => sum + (Number(record.potencia_instalada_total) || 0), 0) / 1000;
  const currentNonLedPowerKw = latestRecords
    .filter((record) => !normalizePlaceName(record.tipo_de_lampada).includes("LED"))
    .reduce((sum, record) => sum + (Number(record.potencia_instalada_total) || 0), 0) / 1000;
  const currentLedPowerKw = latestRecords
    .filter((record) => normalizePlaceName(record.tipo_de_lampada).includes("LED"))
    .reduce((sum, record) => sum + (Number(record.potencia_instalada_total) || 0), 0) / 1000;
  const ledLamps = latestRecords
    .filter((record) => normalizePlaceName(record.tipo_de_lampada).includes("LED"))
    .reduce((sum, record) => sum + (Number(record.lampadas) || 0), 0);
  const nonLedLamps = Math.max(0, totalLamps - ledLamps);
  const averageLedLampPowerKw = ledLamps > 0 ? currentLedPowerKw / ledLamps : FALLBACK_LED_LAMP_POWER_W / 1000;

  const circuits = totalLamps / LAMPS_PER_CIRCUIT;
  const currentAcCircuitPowerKw = circuits * AC_CIRCUIT_POWER_KW;
  const dcCircuitPowerKw = circuits * DC_CIRCUIT_POWER_KW;
  const convertedNonLedPowerKw = nonLedLamps * averageLedLampPowerKw;
  const ledPowerKw = currentLedPowerKw + convertedNonLedPowerKw;
  const dcEvPowerKw = Math.max(0, dcCircuitPowerKw);
  const billedCircuits = Math.ceil(circuits);

  return {
    period: {
      year: latestYear,
      month: latestMonth,
      label: `${String(latestMonth).padStart(2, "0")}/${latestYear}`,
    },
    total: { total_lights: totalLuminaires },
    led: { led_percentage: totalLamps > 0 ? (ledLamps / totalLamps) * 100 : 0 },
    dc: {
      current_chargers: Math.floor(Math.max(0, currentAcCircuitPowerKw) / EV_CHARGER_POWER_KW),
      dc_chargers: Math.floor(dcEvPowerKw / EV_CHARGER_POWER_KW),
      ac_power: Math.max(0, currentAcCircuitPowerKw),
      dc_power: dcEvPowerKw,
      number_of_racks: Math.ceil(Math.floor(dcEvPowerKw / EV_CHARGER_POWER_KW) / 4),
      led_annual_savings:
        (currentLampPowerKw - ledPowerKw) *
        NIGHT_HOURS_PER_YEAR *
        NIGHT_ELECTRICITY_PRICE_EUR_PER_KWH,
      current_lighting_power: currentLampPowerKw,
      led_lighting_power: ledPowerKw,
      current_non_led_power: currentNonLedPowerKw,
      converted_non_led_power: convertedNonLedPowerKw,
      investment_value_dc: billedCircuits * totalDC,
      investment_value_ac: billedCircuits * totalAC,
      investment_savings: billedCircuits * totalAC - billedCircuits * totalDC,
    },
  };
}

async function writeAggregate(file, district) {
  const records = await fetchLightingRecords(district);
  if (records.length === 0) throw new Error(`No E-REDES records for ${district || "Portugal"}`);
  const payload = {
    generated_at: new Date().toISOString(),
    scope: district ? { type: "district", district } : { type: "country", country: "Portugal" },
    data: calculateSimulation(records),
  };

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(payload.data, null, 2)}\n`);
  console.log(`Generated ${file}`);
}

const districts = JSON.parse(fs.readFileSync(path.join(mapRoot, "districts.json"), "utf8"));
fs.mkdirSync(districtOutputRoot, { recursive: true });

await writeAggregate(path.join(outputRoot, "portugal.json"));
for (const district of districts.features) {
  const name = district.properties?.name;
  await writeAggregate(path.join(districtOutputRoot, `${slugifyPlaceName(name)}.json`), name);
}
