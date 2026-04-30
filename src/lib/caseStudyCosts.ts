export const acExcavation = [
  { item: "Mechanical Excavation", range: "25€ - 40€/m³", value: "33€/m³" },
  { item: "Trench Opening & Closing (Urban)", range: "80€ - 120€", value: "100€/m" },
  { item: "Cabling & Piping", range: "20€ - 30€", value: "25€/m" },
  { item: "Labour & Licensing", range: "150€ - 200€/m", value: "175€/m" },
  { item: "Distance", range: "500 - 1000m", value: "750m" },
];

export const acObras = [
  { item: "Project Design", value: 3750 },
  { item: "Licensing", value: 700 },
  { item: "QGBT Output", value: 3750 },
  { item: "AIP", value: 3000 },
  { item: "Construction", value: 17500 },
];

export const dcItems = [
  { item: "Rack", value: 30000 + 86940 },
  { item: "Rack Installation", value: 5000 },
  { item: "LED Lamps", value: 25000 },
  { item: "Lamp Installation", value: 7000 },
  { item: "Licensing", value: 1000 },
  { item: "Insurance", value: 4000 },
];

const parseAmount = (value: string) => Number.parseFloat(value.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;
const distanceMeters = parseAmount(acExcavation.find((item) => item.item === "Distance")?.value ?? "0m");

export const acWorks = acExcavation.reduce((sum, item) => {
  if (item.item === "Distance") return sum;

  const amount = parseAmount(item.value);
  const isDistanceBased = item.value.includes("€/m");

  return sum + (isDistanceBased ? amount * distanceMeters : amount);
}, 0);

export const acInstallation = acObras.reduce((sum, item) => sum + item.value, 0);
export const totalAC = acWorks + acInstallation;
export const totalDC = dcItems.reduce((sum, item) => sum + item.value, 0);
export const savingsPercent = ((totalAC - totalDC) / totalAC) * 100;
