const flowPreference = matchMedia("(prefers-reduced-motion: reduce)");
const flowDiagrams = document.querySelectorAll("[data-flow-diagram]");
const flowNamespace = "http://www.w3.org/2000/svg";

function makeFlowElement(name, attributes = {}) {
  const element = document.createElementNS(flowNamespace, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}

function drawEnergyRoute(layer, name, points, speed) {
  const route = makeFlowElement("g", {"class":"energy-route","data-energy-route":name});
  const wavelength = 36;
  let distance = 0;
  if (speed) route.style.setProperty("--flow-duration", wavelength / speed + "s");

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
drawEnergyRoute(storyFlow, "solar", [[146,84],[270,84],[270,223],[146,223]]);
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
const dcLoadsNode = wiring.querySelector(".dc-loads");
const gridNode = wiring.querySelector(".grid");
const solarNode = wiring.querySelector(".solar");
const batteryNode = wiring.querySelector(".battery");
const chargingNode = wiring.querySelector(".ev");

function updateWiringFlow() {
  const bounds = wiring.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;

  const dcLoads = dcLoadsNode.getBoundingClientRect();
  const grid = gridNode.getBoundingClientRect();
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

  const rightEnd = dcLoads.left - bounds.left;
  const tracks = [
    [grid.right - bounds.left, busY, rightEnd, busY],
    [solarX, solar.bottom - bounds.top, solarX, busY],
    [batteryX, busY, batteryX, battery.top - bounds.top],
    [chargerX, busY, chargerX, charger.top - bounds.top],
  ];
  wiringFlow.replaceChildren(...tracks.map(([x1, y1, x2, y2]) =>
    makeFlowElement("line", {class: "energy-track", x1, y1, x2, y2})
  ));
  const evSpeed = 60;
  const batterySpeed = 30;
  const solarSpeed = evSpeed + batterySpeed;
  const junction = [Math.max(solarX, batteryX), busY];
  drawEnergyRoute(wiringFlow, "solar", [[solarX,solar.bottom - bounds.top],[solarX,busY],junction], solarSpeed);
  drawEnergyRoute(wiringFlow, "solar", [junction,...destination], evSpeed);
  drawEnergyRoute(wiringFlow, "solar", [junction,[batteryX,busY],[batteryX,battery.top - bounds.top]], batterySpeed);
  drawEnergyRoute(wiringFlow,"peak",[[batteryX,battery.top - bounds.top],[batteryX,busY],...destination]);
  wiringDiagram.classList.add("flow-ready");
}

updateWiringFlow();
if ("ResizeObserver" in window) {
  const wiringObserver = new ResizeObserver(updateWiringFlow);
  for (const element of [wiring, dcLoadsNode, gridNode, solarNode, batteryNode, chargingNode]) wiringObserver.observe(element);
} else {
  addEventListener("resize", updateWiringFlow);
}
