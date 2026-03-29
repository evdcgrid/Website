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
import { Info, Calculator, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LUMINAIRE_TYPES = [
  { value: "LED", label: "LED" },
  { value: "Mercury", label: "Mercury" },
  { value: "Sodium", label: "Sodium" },
  { value: "Others", label: "Others" },
];

interface ScenarioData {
  total_energy: number;
  n_chargers: number;
  lights_power: number;
  cost: number;
  savings: number;
  reused_infra_pct: number;
}

interface ApiResponse {
  now: ScenarioData;
  ac: ScenarioData;
  dc: ScenarioData;
}

interface Results {
  now: ScenarioData;
  ac: ScenarioData;
  dc: ScenarioData;
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

const formatEuro = (value: number): string => {
  return value.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " €";
};

const SimulationPage = () => {
  const [distance, setDistance] = useState("");
  const [numLuminaires, setNumLuminaires] = useState("");
  const [luminaireType, setLuminaireType] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const calculate = async () => {
    if (!validate()) return;

    setLoading(true);
    setResults(null);

    try {
      const response = await fetch(
        "https://diogo-guerreiro.app.n8n.cloud/webhook/evdc-grid-simulation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            n_luminarias: Number(numLuminaires),
            distancia: Number(distance),
            tipo_luminarias: luminaireType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: ApiResponse[] = await response.json();
      const result = data[0];

      setResults({
        now: result.now,
        ac: result.ac,
        dc: result.dc,
      });
    } catch (error) {
      toast({
        title: "Calculation failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const metrics: { key: keyof ScenarioData; label: string; tooltip: string; format: (v: number) => string }[] = [
    { key: "n_chargers", label: "Number of Chargers", tooltip: "EV chargers supported by each scenario (22 kW each)", format: (v) => String(v) },
    { key: "lights_power", label: "Power Consumption (Lighting)", tooltip: "Total power consumed by the lighting system", format: (v) => `${v.toFixed(1)} W` },
    { key: "savings", label: "Savings in Euros (Lighting)", tooltip: "Yearly savings from reduced lighting losses", format: formatEuro },
    { key: "cost", label: "Infrastructure Cost", tooltip: "Estimated total cost including cables, converters and chargers", format: formatEuro },
    { key: "total_energy", label: "Power Transported", tooltip: "Effective power delivered accounting for line losses", format: (v) => `${v.toFixed(1)} W` },
    { key: "reused_infra_pct", label: "Infrastructure Reuse", tooltip: "Percentage of existing infrastructure reused vs current case", format: (v) => `${v}%` },
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
              <Button onClick={calculate} size="lg" className="gap-2" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calculator className="h-4 w-4" />}
                {loading ? "Calculating..." : "Calculate"}
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
                  {metrics.map((m) => (
                    <TableRow key={m.key}>
                      <TableCell className="font-medium">
                        {m.label}
                        <MetricTooltip text={m.tooltip} />
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm">
                        {m.format(results.now[m.key])}
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm text-primary font-semibold">
                        {m.format(results.dc[m.key])}
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm">
                        {m.format(results.ac[m.key])}
                      </TableCell>
                    </TableRow>
                  ))}
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
