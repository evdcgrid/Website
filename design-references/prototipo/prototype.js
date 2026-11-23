const network = document.querySelector(".network");
const flowDescriptions = {
  solar: "Durante o dia, o solar alimenta os carregadores e carrega a bateria pelo barramento DC.",
  peak: "A bateria cobre parte do pico de carregamento e reduz a potência pedida à rede nesse momento.",
};

function renderFlow() {
  document.querySelector("#flow").textContent = translate(flowDescriptions[network.dataset.mode]);
}

for (const button of network.querySelectorAll("button[data-mode]")) {
  button.addEventListener("click", () => {
    const mode = button.dataset.mode;
    network.dataset.mode = mode;
    for (const option of network.querySelectorAll("button[data-mode]")) {
      option.setAttribute("aria-pressed", String(option === button));
    }
    renderFlow();
  });
}

const district = document.querySelector("#district");
const municipality = document.querySelector("#municipality");
const parish = document.querySelector("#parish");
const territory = document.querySelector("#territory");
const estimate = document.querySelector("#amount");
const estimateMessage = document.querySelector("#estimate-message");
const retry = document.querySelector("#retry");
const mapBack = document.querySelector("#map-back");
const svgNamespace = "http://www.w3.org/2000/svg";
const api = "https://e-redes.opendatasoft.com/api/explore/v2.1/catalog/datasets/cadastro_iluminacao_publica/records";
const estimateCache = new Map();
let activeRequest;

function populate(select, items, placeholder, value = "") {
  select.replaceChildren(new Option(translate(placeholder), ""), ...items.map(([label, key]) => new Option(label, key)));
  select.value = items.some(([, key]) => key === value) ? value : "";
  select.disabled = items.length === 0;
}

function renderMap(items, selected, select, target = territory) {
  const bounds = [Infinity, Infinity, -Infinity, -Infinity];
  const shapes = items.map(([name, key, rings]) => {
    const path = document.createElementNS(svgNamespace, "path");
    const data = rings.map((ring) => ring.map(([x, y], i) => {
      bounds[0] = Math.min(bounds[0], x);
      bounds[1] = Math.min(bounds[1], y);
      bounds[2] = Math.max(bounds[2], x);
      bounds[3] = Math.max(bounds[3], y);
      return (i === 0 ? "M" : "L") + x + " " + y;
    }).join("") + "Z").join("");
    path.setAttribute("d", data);
    path.setAttribute("fill-rule", "evenodd");
    path.dataset.selected = String(key === selected);
    if (!select) return path;
    const title = document.createElementNS(svgNamespace, "title");
    title.textContent = name;
    path.append(title);
    path.addEventListener("click", () => {
      select.value = key;
      select.dispatchEvent(new Event("change"));
    });
    return path;
  });
  const width = bounds[2] - bounds[0];
  const height = bounds[3] - bounds[1];
  const padding = Math.max(width, height) * .06;
  target.setAttribute("viewBox", shapes.length
    ? [bounds[0] - padding, bounds[1] - padding, width + padding * 2, height + padding * 2].join(" ")
    : "0 0 440 440");
  target.replaceChildren(...shapes);
}

renderMap(territoryData.districts, "", null, document.querySelector("#map-preview"));

function selectedName(select) {
  return select.value ? select.selectedOptions[0].textContent : "";
}

function showEstimate(value, message, period = "", ac, acChargers, dcChargers) {
  const locale = language === "en" ? "en-GB" : "pt-PT";
  function compact(n, money = false) {
    const scale = n >= 1e6 ? 1e6 : n >= 1e3 ? 1e3 : 1;
    const digits = scale === 1e6 ? 2 : scale === 1e3 && !money ? 1 : 0;
    const amount = (n / scale).toLocaleString(locale, {maximumFractionDigits: digits});
    const unit = scale === 1e6 ? "M" : scale === 1e3 ? "k" : "";
    if (language === "en") return (money ? "€" : "") + amount + unit;
    return amount + (unit || money ? " " : "") + unit + (money ? "€" : "");
  }
  const comparison = document.querySelector("#estimate-comparison");
  comparison.hidden = ![value, ac, acChargers, dcChargers].every(Number.isFinite);
  if (!comparison.hidden) {
    const gain = dcChargers - acChargers;
    const difference = ac - value;
    const totalLabel = dcChargers === 1 ? "{n} carregador" : "{n} carregadores";
    const gainLabel = gain === 0 ? "Mesmo número de carregadores que em AC" : gain > 0 ? "Mais {n} do que em AC" : "Menos {n} do que em AC";
    document.querySelector("#capacity-count").textContent = translate(totalLabel).replace("{n}", compact(dcChargers));
    document.querySelector("#capacity-rating").textContent = translate(dcChargers === 1 ? "(11 kW)" : "(11 kW cada)");
    document.querySelector("#capacity-gain").textContent = translate(gainLabel).replace("{n}", compact(Math.abs(gain)));
    document.querySelector("#dc-cost").textContent = compact(value, true);
    document.querySelector("#ac-cost").textContent = compact(ac, true);
    document.querySelector("#cost-label").textContent = translate(difference < 0 ? "Investimento adicional" : "Poupança estimada");
    document.querySelector("#cost-value").textContent = compact(Math.abs(difference), true);
  }
  estimate.hidden = !comparison.hidden;
  estimate.dataset.status = "message";
  if (comparison.hidden) estimate.textContent = typeof value === "number" ? compact(value, true) : translate(value);
  estimateMessage.hidden = !comparison.hidden;
  estimateMessage.textContent = translate(message);
  document.querySelector("#period").textContent = period ? translate("Período dos dados") + ": " + period + "." : "";
}

function clause(field, value) {
  return field + "=" + JSON.stringify(value.normalize("NFC"));
}

async function getRecords(where, limit, signal, offset = 0) {
  const params = new URLSearchParams({where, limit, offset, order_by:"ano DESC,mes DESC"});
  const response = await fetch(api + "?" + params, {signal});
  if (!response.ok) throw new Error("E-REDES request failed");
  const data = await response.json();
  return data.results;
}

async function readEstimate(names, signal) {
  const fields = ["distrito", "concelho", "freguesia"];
  const location = names.map((name, index) => clause(fields[index], name)).join(" AND ");
  const [latest] = await getRecords(location, 1, signal);
  if (!latest) return null;
  const month = location + " AND " + clause("ano", String(latest.ano)) + " AND " + clause("mes", String(latest.mes));
  let total = 0;
  for (let offset = 0; ; offset += 100) {
    const records = await getRecords(month, 100, signal, offset);
    total += records.reduce((sum, row) => sum + (Number(row.lampadas) || 0), 0);
    if (records.length < 100) break;
  }
  const circuits = Math.ceil(total / 300);
  return [circuits * 158940, String(latest.mes).padStart(2, "0") + "/" + latest.ano, circuits * 253733, Math.floor(total / 300 * 47.8 / 11), Math.floor(total / 300 * 193.2 / 11)];
}

async function refreshEstimate() {
  activeRequest?.abort();
  const request = new AbortController();
  activeRequest = request;
  const key = [district.value, municipality.value, parish.value].filter(Boolean).join("/");
  const names = [district, municipality, parish].map(selectedName).filter(Boolean);
  document.querySelector("#location-label").textContent = names.join(" / ") || translate("Portugal continental");
  retry.hidden = true;
  const saved = names.length < 2 ? territoryData.estimates[key || "portugal"] : estimateCache.get(key);
  if (saved) {
    showEstimate(saved[0], "Estimativa indicativa de investimento.", ...saved.slice(1));
    return;
  }
  showEstimate("A consultar…", "A obter dados do cadastro E‑REDES.");
  try {
    const result = await readEstimate(names, request.signal);
    if (request.signal.aborted) return;
    if (result) {
      estimateCache.set(key, result);
      showEstimate(result[0], "Estimativa indicativa de investimento.", ...result.slice(1));
    } else {
      showEstimate("Sem dados para este local", "Selecione outro local ou volte ao nível anterior.");
    }
  } catch {
    if (request.signal.aborted) return;
    showEstimate("Estimativa indisponível", "A consulta à E‑REDES falhou.");
    retry.hidden = false;
  }
}

function refreshMap() {
  const towns = territoryData.municipalities[district.value] || [];
  const parishes = territoryData.parishes[district.value + "/" + municipality.value] || [];
  const level = municipality.value ? "Freguesias" : district.value ? "Concelhos" : "Distritos";
  document.querySelector("#map-level").textContent = translate(level);
  const explore = document.querySelector("#map-explore");
  const next = !district.value ? district : !municipality.value ? municipality : parish;
  explore.hidden = Boolean(parish.value) || next.disabled;
  explore.href = "#" + next.id;
  explore.textContent = translate(next === district ? "Explorar por distrito" : next === municipality ? "Explorar por concelho" : "Explorar por freguesia");
  mapBack.hidden = !district.value;
  if (municipality.value && parishes.length) renderMap(parishes, parish.value, parish);
  else if (district.value && towns.length) renderMap(towns, municipality.value, municipality);
  else renderMap(territoryData.districts, district.value, district);
  refreshEstimate();
}

function saveSelection() {
  const url = new URL(window.location.href);
  for (const [key, select] of [["distrito", district], ["concelho", municipality], ["freguesia", parish]]) {
    if (select.value) url.searchParams.set(key, select.value);
    else url.searchParams.delete(key);
  }
  if (language === "pt") url.searchParams.set("lang", "pt");
  else url.searchParams.delete("lang");
  history.replaceState(null, "", url);
}

const query = new URLSearchParams(location.search);
populate(district, territoryData.districts, "Todos os distritos", query.get("distrito"));
populate(municipality, territoryData.municipalities[district.value] || [], "Todos os concelhos", query.get("concelho"));
populate(parish, territoryData.parishes[district.value + "/" + municipality.value] || [], "Todas as freguesias", query.get("freguesia"));
district.addEventListener("change", () => {
  populate(municipality, territoryData.municipalities[district.value] || [], "Todos os concelhos");
  populate(parish, [], "Todas as freguesias");
  saveSelection();
  refreshMap();
});
municipality.addEventListener("change", () => {
  populate(parish, territoryData.parishes[district.value + "/" + municipality.value] || [], "Todas as freguesias");
  saveSelection();
  refreshMap();
});
parish.addEventListener("change", () => {
  saveSelection();
  refreshMap();
});
mapBack.addEventListener("click", () => {
  const select = parish.value ? parish : municipality.value ? municipality : district;
  select.value = "";
  select.dispatchEvent(new Event("change"));
  if (mapBack.hidden) district.focus();
});
retry.addEventListener("click", refreshEstimate);
refreshMap();

for (const button of languageButtons) {
  button.addEventListener("click", () => {
    language = button.dataset.language;
    renderLanguage();
    renderFlow();
    district.options[0].textContent = translate("Todos os distritos");
    municipality.options[0].textContent = translate("Todos os concelhos");
    parish.options[0].textContent = translate("Todas as freguesias");
    saveSelection();
    refreshMap();
  });
}
