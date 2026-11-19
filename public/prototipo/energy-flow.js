const flowPreference = matchMedia("(prefers-reduced-motion: reduce)");
const flowDiagrams = document.querySelectorAll("[data-flow-diagram]");
const flowNamespace = "http://www.w3.org/2000/svg";

function makeFlowElement(name, attributes = {}) {
  const element = document.createElementNS(flowNamespace, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}

function drawEnergyRoute(layer, name, points) {
  const route = makeFlowElement("g", {"class":"energy-route","data-energy-route":name});
  const wavelength = 36;
  let distance = 0;

  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    const length = Math.hypot(x2 - x1, y2 - y1);
    if (!length) continue;
    // Keep the dashes aligned at the bends, including at the bus junction.
    const phase = distance % wavelength;
    const line = makeFlowElement("line", {"class":"energy-line", x1, y1, x2, y2});
    line.style.setProperty("--dash-phase", phase + "px");
    route.append(line);
    distance += length;
  }

  layer.append(route);
}

const flowObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        entry.target.classList.toggle("flow-in-view", entry.isIntersecting);
      }
    }, {threshold:.1})
  : null;

const storyFlow = document.querySelector(".story-visual .energy-flow-layer");
drawEnergyRoute(storyFlow, "solar", [[146,84],[270,84],[270,152]]);
drawEnergyRoute(storyFlow, "bus", [[146,84],[270,84],[270,152],[429,152]]);
drawEnergyRoute(storyFlow, "battery", [[146,223],[270,223],[270,152],[429,152]]);
storyFlow.closest("[data-flow-diagram]").classList.add("flow-ready");

for (const diagram of flowDiagrams) {
  if (flowObserver) flowObserver.observe(diagram);
  else diagram.classList.add("flow-in-view");

  const toggle = diagram.querySelector(".flow-toggle");
  if (!toggle) continue;
  const [pauseLabel, resumeLabel] = toggle.querySelectorAll("span");

  toggle.addEventListener("click", () => {
    const paused = diagram.classList.toggle("flow-paused");
    pauseLabel.hidden = paused;
    resumeLabel.hidden = !paused;
  });

  function adaptFlowToPreference() {
    toggle.hidden = flowPreference.matches;
  }

  adaptFlowToPreference();
  flowPreference.addEventListener("change", adaptFlowToPreference);
}

const wiring = document.querySelector(".wiring");
const wiringDiagram = wiring.closest("[data-flow-diagram]");
const wiringFlow = wiring.querySelector(".energy-flow-layer");
const powerBus = wiring.querySelector(".bus");
const solarNode = wiring.querySelector(".solar");
const batteryNode = wiring.querySelector(".battery");
const chargingNode = wiring.querySelector(".ev");

function updateWiringFlow() {
  const bounds = wiring.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;

  const solar = solarNode.getBoundingClientRect();
  const battery = batteryNode.getBoundingClientRect();
  const charger = chargingNode.getBoundingClientRect();
  const bus = powerBus.getBoundingClientRect();
  const centerX = box => box.left + box.width / 2 - bounds.left;
  const busY = bus.top + bus.height / 2 - bounds.top;
  const chargerX = centerX(charger);
  const destination = [[chargerX,busY],[chargerX,charger.top - bounds.top]];
  const solarX = centerX(solar);
  const batteryX = centerX(battery);

  wiringFlow.replaceChildren(
    makeFlowElement("line", {"class":"idle-bus", x1:bus.left - bounds.left, y1:busY, x2:solarX, y2:busY}),
    makeFlowElement("line", {"class":"idle-bus", x1:chargerX, y1:busY, x2:bus.right - bounds.left, y2:busY}),
  );
  drawEnergyRoute(wiringFlow,"solar",[[solarX,solar.bottom - bounds.top],[solarX,busY],...destination]);
  drawEnergyRoute(wiringFlow,"peak",[[batteryX,battery.top - bounds.top],[batteryX,busY],...destination]);
  wiringDiagram.classList.add("flow-ready");
}

updateWiringFlow();
if ("ResizeObserver" in window) {
  const wiringObserver = new ResizeObserver(updateWiringFlow);
  for (const element of [wiring, solarNode, batteryNode, chargingNode]) wiringObserver.observe(element);
} else {
  addEventListener("resize", updateWiringFlow);
}
