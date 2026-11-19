const pageNames = new Set(["tecnologia", "aplicacoes"]);
const requestedPage = new URLSearchParams(location.search).get("pagina");
const legacyAnchors = { "#tecnologia": "tecnologia", "#aplicacoes": "aplicacoes", "#mapa": "aplicacoes" };
const hasMapSelection = new URLSearchParams(location.search).has("distrito");
const currentPage = pageNames.has(requestedPage)
  ? requestedPage
  : legacyAnchors[location.hash] || (hasMapSelection ? "aplicacoes" : "home");

document.body.dataset.page = currentPage;
for (const section of document.querySelectorAll("[data-page]")) {
  section.hidden = section.dataset.page !== currentPage;
}

function localizeNavigation() {
  for (const link of document.querySelectorAll("a[href]")) {
    if (link.origin !== location.origin || link.pathname !== location.pathname) continue;
    const url = new URL(link.href);
    const targetPage = link.dataset.pageLink || url.searchParams.get("pagina");
    if (!targetPage && !link.classList.contains("brand")) continue;
    if (language === "pt") url.searchParams.set("lang", "pt");
    else url.searchParams.delete("lang");
    link.href = url.href;
    if (link.dataset.pageLink === currentPage) link.setAttribute("aria-current", "page");
  }
}

const scenarios = {
  power: ["Instalar carregadores com a potência disponível", "Avaliamos o limite da ligação e os picos de carregamento. Uma bateria pode cobrir parte desses picos e reduzir a necessidade de reforçar a ligação."],
  expand: ["Acrescentar carregadores a uma instalação", "Identificamos os ativos e percursos de cabo que podem ser reaproveitados e avaliamos como integrar o carregamento com menos intervenções."],
  new: ["Preparar o local para crescer", "Dimensionamos a micro-rede para o perfil inicial de carregamento e prevemos a integração de mais carregadores, solar ou baterias por etapas."],
};
let scenario = "power";
const options = document.querySelectorAll("[data-scenario]");
function renderScenario() {
  const [title, copy] = scenarios[scenario];
  document.querySelector("#scenario-title").textContent = translate(title);
  document.querySelector("#scenario-copy").textContent = translate(copy);
  for (const option of options) option.setAttribute("aria-pressed", String(option.dataset.scenario === scenario));
}
for (const option of options) {
  option.addEventListener("click", () => {
    scenario = option.dataset.scenario;
    renderScenario();
  });
}
for (const button of languageButtons) {
  button.addEventListener("click", () => {
    localizeNavigation();
    renderScenario();
  });
}
localizeNavigation();
renderScenario();
if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
