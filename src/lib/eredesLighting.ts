import { totalAC, totalDC } from "@/lib/caseStudyCosts";

const EREDES_PUBLIC_LIGHTING_API =
  "https://e-redes.opendatasoft.com/api/explore/v2.1/catalog/datasets/cadastro_iluminacao_publica/records";

const EV_CHARGER_POWER_KW = 11;
const DC_CIRCUIT_POWER_KW = 193.2;
const AC_CIRCUIT_POWER_KW = 47.8;
const LAMPS_PER_CIRCUIT = 300;
const FALLBACK_LED_LAMP_POWER_W = 50;
const NIGHT_HOURS_PER_YEAR = 12 * 365;
const NIGHT_ELECTRICITY_PRICE_EUR_PER_KWH = 0.07265*2;

interface ERedesLightingRecord {
  ano: string;
  mes: string;
  distrito: string;
  concelho: string;
  freguesia: string;
  tipo_de_lampada: string;
  luminarias: number;
  lampadas: number;
  potencia_instalada_total: number;
}

export interface FreguesiaData {
  period: {
    year: number;
    month: number;
    label: string;
  };
  total: { total_lights: number };
  led: { led_percentage: number };
  dc: {
    current_chargers: number;
    dc_chargers: number;
    ac_power: number;
    dc_power: number;
    number_of_racks: number;
    led_annual_savings: number;
    current_lighting_power: number;
    led_lighting_power: number;
    current_non_led_power: number;
    converted_non_led_power: number;
    investment_value_dc: number;
    investment_value_ac: number;
    investment_savings: number;
  };
}

interface FetchLightingSimulationParams {
  district?: string;
  municipality?: string;
  parish?: string;
  signal: AbortSignal;
}

function normalizePlaceName(value: string | null | undefined): string {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function slugifyPlaceName(value: string | null | undefined): string {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeOdsString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildLightingApiUrl(where: string, limit = 100, offset = 0): string {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    order_by: "ano DESC, mes DESC, tipo_de_lampada",
  });
  if (where) params.set("where", where);
  return `${EREDES_PUBLIC_LIGHTING_API}?${params.toString()}`;
}

function aggregateStaticPath({ district, municipality, parish }: FetchLightingSimulationParams): string | null {
  if (municipality || parish) return null;
  return district
    ? `/eredes-aggregates/districts/${slugifyPlaceName(district)}.json`
    : "/eredes-aggregates/portugal.json";
}

async function fetchStaticAggregate(path: string, signal: AbortSignal): Promise<FreguesiaData | null> {
  try {
    const response = await fetch(path, { signal });
    if (!response.ok) return null;

    return (await response.json()) as FreguesiaData;
  } catch {
    return null;
  }
}

function latestLightingPeriod(records: ERedesLightingRecord[]): number {
  return Math.max(...records.map((record) => Number(record.ano) * 100 + Number(record.mes)));
}

async function fetchLightingRecords({
  district,
  municipality,
  parish,
  signal,
}: FetchLightingSimulationParams): Promise<ERedesLightingRecord[]> {
  const clauses = district ? [`distrito="${escapeOdsString(district)}"`] : [];
  if (municipality) clauses.push(`concelho="${escapeOdsString(municipality)}"`);
  if (parish) clauses.push(`freguesia="${escapeOdsString(parish)}"`);
  const exactWhere = clauses.join(" AND ");

  const exactResponse = await fetch(buildLightingApiUrl(exactWhere, 100), { signal });
  if (!exactResponse.ok) throw new Error("E-REDES API error");
  const exactData = await exactResponse.json();
  const initialRecords = Array.isArray(exactData.results) ? exactData.results : [];
  if (initialRecords.length > 0) {
    const latestPeriod = latestLightingPeriod(initialRecords);
    const latestYear = Math.floor(latestPeriod / 100);
    const latestMonth = latestPeriod % 100;
    const latestWhere = [
      exactWhere || undefined,
      `ano="${latestYear}"`,
      `mes="${latestMonth}"`,
    ].filter(Boolean).join(" AND ");
    const latestRecords: ERedesLightingRecord[] = [];
    const pageSize = 100;

    for (let offset = 0; ; offset += pageSize) {
      const response = await fetch(buildLightingApiUrl(latestWhere, pageSize, offset), { signal });
      if (!response.ok) throw new Error("E-REDES API error");
      const data = await response.json();
      const page = Array.isArray(data.results) ? data.results : [];
      latestRecords.push(...page);
      if (page.length < pageSize) break;
    }

    return latestRecords;
  }

  if (!district || !parish || !municipality) return [];

  const fallbackResponse = await fetch(buildLightingApiUrl(`"${escapeOdsString(parish)}"`), { signal });
  if (!fallbackResponse.ok) throw new Error("E-REDES API error");
  const fallbackData = await fallbackResponse.json();
  const districtName = normalizePlaceName(district);
  const municipalityName = normalizePlaceName(municipality);
  const parishName = normalizePlaceName(parish);

  return (fallbackData.results || []).filter(
    (record: ERedesLightingRecord) =>
      normalizePlaceName(record.distrito) === districtName &&
      normalizePlaceName(record.concelho) === municipalityName &&
      normalizePlaceName(record.freguesia) === parishName
  );
}

function calculateSimulation(records: ERedesLightingRecord[]): FreguesiaData {
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
  const currentAcEvPowerKw = Math.max(0, currentAcCircuitPowerKw);
  const convertedNonLedPowerKw = nonLedLamps * averageLedLampPowerKw;
  const ledPowerKw = currentLedPowerKw + convertedNonLedPowerKw;
  const dcEvPowerKw = Math.max(0, dcCircuitPowerKw);
  const acChargers = Math.floor(currentAcEvPowerKw / EV_CHARGER_POWER_KW);
  const dcChargers = Math.floor(dcEvPowerKw / EV_CHARGER_POWER_KW);
  const ledAnnualSavings =
    (currentLampPowerKw - ledPowerKw) *
    NIGHT_HOURS_PER_YEAR *
    NIGHT_ELECTRICITY_PRICE_EUR_PER_KWH;
  const billedCircuits = Math.ceil(circuits);
  const investmentValueAc = billedCircuits * totalAC;
  const investmentValueDc = billedCircuits * totalDC;

  return {
    period: {
      year: latestYear,
      month: latestMonth,
      label: `${String(latestMonth).padStart(2, "0")}/${latestYear}`,
    },
    total: { total_lights: totalLuminaires },
    led: { led_percentage: totalLamps > 0 ? (ledLamps / totalLamps) * 100 : 0 },
    dc: {
      current_chargers: acChargers,
      dc_chargers: dcChargers,
      ac_power: currentAcEvPowerKw,
      dc_power: dcEvPowerKw,
      number_of_racks: Math.ceil(dcChargers / 4),
      led_annual_savings: ledAnnualSavings,
      current_lighting_power: currentLampPowerKw,
      led_lighting_power: ledPowerKw,
      current_non_led_power: currentNonLedPowerKw,
      converted_non_led_power: convertedNonLedPowerKw,
      investment_value_dc: investmentValueDc,
      investment_value_ac: investmentValueAc,
      investment_savings: investmentValueAc - investmentValueDc,
    },
  };
}

export async function fetchFreguesiaLightingSimulation(
  params: FetchLightingSimulationParams
): Promise<FreguesiaData> {
  const staticPath = aggregateStaticPath(params);
  const staticAggregate = staticPath ? await fetchStaticAggregate(staticPath, params.signal) : null;
  if (staticAggregate) return staticAggregate;

  const records = await fetchLightingRecords(params);
  if (records.length === 0) throw new Error("No E-REDES records for location");
  return calculateSimulation(records);
}
