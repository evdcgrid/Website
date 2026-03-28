import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Calculator } from "lucide-react";

const LUMINAIRE_TYPES = [
  { value: "led-60", label: "LED 60W", power: 60 },
  { value: "led-100", label: "LED 100W", power: 100 },
  { value: "led-150", label: "LED 150W", power: 150 },
  { value: "led-200", label: "LED 200W", power: 200 },
  { value: "hps-150", label: "HPS 150W", power: 150 },
  { value: "hps-250", label: "HPS 250W", power: 250 },
  { value: "hps-400", label: "HPS 400W", power: 400 },
];

interface Results {
  numChargers: { current: number; dc: number; ac: number };
  powerConsumption: { current: string; dc: string; ac: string };
  savingsLighting: { current: string; dc: string; ac: string };
  infraCost: { current: string; dc: string; ac: string };
  energyTransported: { current: string; dc: string; ac: string };
  infraReuse: { current: string; dc: string; ac: string };
}

const MetricTooltip = ({ text }: { text: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Info className="h-3.5 w-3.5 text-muted-foreground inline-block ml-1 cursor-help" />
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-[220px] text-xs">
      {text}
    </TooltipContent>
  </Tooltip>
);

const SimulationPage = () => {
  const [distance, setDistance] = useState("");
  const [numLuminaires, setNumLuminaires] = useState("");
  const [luminaireType, setLuminaireType] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const dist = Number(distance);
    const num = Number(numLuminaires);

    if (!distance || dist <= 0) newErrors.distance = "Enter a positive distance";
    if (dist > 50000) newErrors.distance = "Max 50 000 m";
    if (!numLuminaires || num <= 0) newErrors.numLuminaires = "Enter a positive number";
    if (num > 5000) newErrors.numLuminaires = "Max 5 000 luminaires";
    if (!luminaireType) newErrors.luminaireType = "Select a luminaire type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    if (!validate()) return;

    const dist = Number(distance);
    const num = Number(numLuminaires);
    const lum = LUMINAIRE_TYPES.find((l) => l.value === luminaireType)!;
    const power = lum.power;

    // Total lighting power
    const totalLightingKW = (num * power) / 1000;

    // Current case – AC only, no chargers
    const currentInfraCost = dist * 85 + num * 120;
    const currentEnergy = totalLightingKW * 0.92; // 8% losses AC

    // DC installation – reuses cables, adds chargers
    const dcCapacityFactor = 2.8;
    const dcAvailableKW = totalLightingKW * dcCapacityFactor;
    const dcChargersMax = Math.floor((dcAvailableKW - totalLightingKW) / 22);
    const dcChargers = Math.max(dcChargersMax, 0);
    const dcLightingPower = totalLightingKW * 0.95; // 5% DC-DC losses
    const dcSavings = (totalLightingKW - dcLightingPower) * 8760 * 0.15; // yearly €
    const dcInfraCost = dist * 12 + dcChargers * 2500 + 8000; // converter + charger stations
    const dcEnergy = dcAvailableKW * 0.97; // 3% losses

    // AC installation – new parallel AC grid for chargers
    const acChargers = dcChargers > 0 ? dcChargers : 1;
    const acInfraCost = dist * 85 + acChargers * 8000 + num * 120 + 25000; // new trench + transformers
    const acEnergy = totalLightingKW * 0.92 + acChargers * 22 * 0.90;
    const acSavings = 0;

    const infraReuseDC = Math.round(((currentInfraCost - dcInfraCost) / currentInfraCost) * 100);

    setResults({
      numChargers: {
        current: 0,
        dc: dcChargers,
        ac: acChargers,
      },
      powerConsumption: {
        current: `${totalLightingKW.toFixed(1)} kW`,
        dc: `${dcLightingPower.toFixed(1)} kW`,
        ac: `${totalLightingKW.toFixed(1)} kW`,
      },
      savingsLighting: {
        current: "€0",
        dc: `€${Math.round(dcSavings).toLocaleString()}`,
        ac: `€${Math.round(acSavings).toLocaleString()}`,
      },
      infraCost: {
        current: `€${Math.round(currentInfraCost).toLocaleString()}`,
        dc: `€${Math.round(dcInfraCost).toLocaleString()}`,
        ac: `€${Math.round(acInfraCost).toLocaleString()}`,
      },
      energyTransported: {
        current: `${currentEnergy.toFixed(1)} kW`,
        dc: `${dcEnergy.toFixed(1)} kW`,
        ac: `${acEnergy.toFixed(1)} kW`,
      },
      infraReuse: {
        current: "—",
        dc: `${Math.max(infraReuseDC, 0)}%`,
        ac: "0%",
      },
    });
  };

  const metrics: { key: keyof Results; label: string; tooltip: string }[] = [
    { key: "numChargers", label: "Number of Chargers", tooltip: "EV chargers supported by each scenario (22 kW each)" },
    { key: "powerConsumption", label: "Power Consumption (Lighting)", tooltip: "Total power consumed by the lighting system" },
    { key: "savingsLighting", label: "Savings in Euros (Lighting)", tooltip: "Yearly savings from reduced lighting losses" },
    { key: "infraCost", label: "Infrastructure Cost", tooltip: "Estimated total cost including cables, converters and chargers" },
    { key: "energyTransported", label: "Energy Transported", tooltip: "Effective energy delivered accounting for line losses" },
    { key: "infraReuse", label: "Infrastructure Reuse", tooltip: "Percentage of existing infrastructure reused vs current case" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="section-container max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest">
              Technical Calculator
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mt-3">
              Lighting Infrastructure{" "}
              <span className="gradient-text">Simulation</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Compare current, DC and AC scenarios for your lighting grid.
            </p>
          </div>

          {/* Inputs Card */}
          <div className="rounded-lg border border-border bg-card p-6 sm:p-8 mb-8">
            <h3 className="font-heading font-bold text-lg mb-6">Grid Parameters</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {/* Distance */}
              <div className="space-y-2">
                <Label htmlFor="distance">Distance of the line (m)</Label>
                <Input
                  id="distance"
                  type="number"
                  min={1}
                  placeholder="e.g. 500"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className={errors.distance ? "border-destructive" : ""}
                />
                {errors.distance && (
                  <p className="text-xs text-destructive">{errors.distance}</p>
                )}
              </div>

              {/* Num Luminaires */}
              <div className="space-y-2">
                <Label htmlFor="numLuminaires">Number of luminaires</Label>
                <Input
                  id="numLuminaires"
                  type="number"
                  min={1}
                  placeholder="e.g. 50"
                  value={numLuminaires}
                  onChange={(e) => setNumLuminaires(e.target.value)}
                  className={errors.numLuminaires ? "border-destructive" : ""}
                />
                {errors.numLuminaires && (
                  <p className="text-xs text-destructive">{errors.numLuminaires}</p>
                )}
              </div>

              {/* Luminaire Type */}
              <div className="space-y-2">
                <Label>Type of luminaire</Label>
                <Select value={luminaireType} onValueChange={setLuminaireType}>
                  <SelectTrigger className={errors.luminaireType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LUMINAIRE_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.luminaireType && (
                  <p className="text-xs text-destructive">{errors.luminaireType}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={calculate} size="lg" className="gap-2">
                <Calculator className="h-4 w-4" />
                Calculate
              </Button>
            </div>
          </div>

          {/* Results Table */}
          {results && (
            <div className="rounded-lg border border-border bg-card overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-border">
                <h3 className="font-heading font-bold text-lg">Results</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[240px]">Metric</TableHead>
                    <TableHead className="text-center">Current Case</TableHead>
                    <TableHead className="text-center text-primary font-bold">DC Installation</TableHead>
                    <TableHead className="text-center">AC Installation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((m) => {
                    const row = results[m.key];
                    return (
                      <TableRow key={m.key}>
                        <TableCell className="font-medium">
                          {m.label}
                          <MetricTooltip text={m.tooltip} />
                        </TableCell>
                        <TableCell className="text-center font-mono text-sm">
                          {typeof row.current === "number" ? row.current : row.current}
                        </TableCell>
                        <TableCell className="text-center font-mono text-sm text-primary font-semibold">
                          {typeof row.dc === "number" ? row.dc : row.dc}
                        </TableCell>
                        <TableCell className="text-center font-mono text-sm">
                          {typeof row.ac === "number" ? row.ac : row.ac}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SimulationPage;
