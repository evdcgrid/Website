import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SimulationPage = () => {
  const [inputs, setInputs] = useState({
    cableLength: 500,
    cableSection: 16,
    voltageLevelAC: 230,
    numLuminaires: 50,
    powerPerLuminaire: 100,
    numChargers: 5,
    chargerPower: 22,
  });

  const update = (key: string, val: number) => setInputs((prev) => ({ ...prev, [key]: val }));

  const results = useMemo(() => {
    const totalLightingPower = inputs.numLuminaires * inputs.powerPerLuminaire;
    const totalChargingPower = inputs.numChargers * inputs.chargerPower * 1000;
    const totalPowerAC = totalLightingPower;
    const dcVoltageFactor = (2 * 1400) / (Math.sqrt(3) * inputs.voltageLevelAC);
    const totalPowerDC = totalLightingPower + totalChargingPower;
    const capacityGain = Math.min(dcVoltageFactor, 4);
    const maxDCCapacity = totalPowerAC * capacityGain;
    const infraReuse = 98;
    const costSavings = 41;
    const traditionalCost = inputs.cableLength * 120 + inputs.numChargers * 15000 + 80000;
    const evdcCost = traditionalCost * (1 - costSavings / 100);
    const savings = traditionalCost - evdcCost;
    const monthlyRevenue = inputs.numChargers * 800;
    const roiMonths = evdcCost > 0 ? Math.ceil(evdcCost / monthlyRevenue) : 0;

    return {
      totalPowerAC: (totalPowerAC / 1000).toFixed(1),
      totalPowerDC: (totalPowerDC / 1000).toFixed(1),
      maxDCCapacity: (maxDCCapacity / 1000).toFixed(1),
      capacityGain: capacityGain.toFixed(1),
      infraReuse,
      costSavings,
      traditionalCost: Math.round(traditionalCost),
      evdcCost: Math.round(evdcCost),
      savings: Math.round(savings),
      roiMonths,
    };
  }, [inputs]);

  const chartData = [
    { name: "Power Capacity (kW)", AC: parseFloat(results.totalPowerAC), DC: parseFloat(results.maxDCCapacity) },
    { name: "Total Load (kW)", AC: parseFloat(results.totalPowerAC), DC: parseFloat(results.totalPowerDC) },
  ];

  const costData = [
    { name: "Traditional", cost: results.traditionalCost / 1000 },
    { name: "EVDCGRID", cost: results.evdcCost / 1000 },
  ];

  const inputFields = [
    { key: "cableLength", label: "Cable Length (m)", min: 50, max: 5000, step: 50 },
    { key: "cableSection", label: "Cable Section (mm²)", min: 4, max: 95, step: 2 },
    { key: "voltageLevelAC", label: "AC Voltage (V)", min: 220, max: 400, step: 10 },
    { key: "numLuminaires", label: "Number of Luminaires", min: 5, max: 500, step: 5 },
    { key: "powerPerLuminaire", label: "Power per Luminaire (W)", min: 30, max: 400, step: 10 },
    { key: "numChargers", label: "Number of EV Chargers", min: 1, max: 50, step: 1 },
    { key: "chargerPower", label: "Charger Power (kW)", min: 7, max: 150, step: 1 },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest">
              Technical Calculator
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mt-3">
              Grid <span className="gradient-text">Simulation</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Configure your grid parameters and see the potential of DC conversion.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Inputs */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-heading font-bold mb-4 text-sm">Grid Parameters</h3>
                {inputFields.map((f) => (
                  <div key={f.key} className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{f.label}</span>
                      <span className="font-mono text-primary">{inputs[f.key as keyof typeof inputs]}</span>
                    </div>
                    <input
                      type="range"
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      value={inputs[f.key as keyof typeof inputs]}
                      onChange={(e) => update(f.key, Number(e.target.value))}
                      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* KPI cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "DC Capacity Gain", value: `${results.capacityGain}×`, color: "text-primary" },
                  { label: "Infrastructure Reuse", value: `${results.infraReuse}%`, color: "text-accent" },
                  { label: "Cost Savings", value: `${results.costSavings}%`, color: "text-primary" },
                  { label: "Est. ROI", value: `${results.roiMonths} mo`, color: "text-accent" },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-lg border border-border bg-card p-4 text-center">
                    <div className={`text-2xl font-heading font-black ${kpi.color}`}>{kpi.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="rounded-lg border border-border bg-card p-6">
                  <h4 className="font-heading font-bold text-sm mb-4">Power: AC vs DC (kW)</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 16%)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(220 18% 8%)",
                          border: "1px solid hsl(220 15% 16%)",
                          borderRadius: 8,
                        }}
                        labelStyle={{ color: "hsl(210 20% 92%)" }}
                      />
                      <Legend />
                      <Bar dataKey="AC" fill="hsl(215 15% 35%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="DC" fill="hsl(195 100% 50%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                  <h4 className="font-heading font-bold text-sm mb-4">Cost Comparison (k€)</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={costData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 16%)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(220 18% 8%)",
                          border: "1px solid hsl(220 15% 16%)",
                          borderRadius: 8,
                        }}
                        labelStyle={{ color: "hsl(210 20% 92%)" }}
                      />
                      <Bar dataKey="cost" fill="hsl(155 100% 45%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 glow-primary">
                <h4 className="font-heading font-bold text-sm mb-3">Summary</h4>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Traditional Cost: </span>
                    <span className="font-mono font-bold">€{results.traditionalCost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">EVDCGRID Cost: </span>
                    <span className="font-mono font-bold text-primary">€{results.evdcCost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">You Save: </span>
                    <span className="font-mono font-bold text-accent">€{results.savings.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SimulationPage;
