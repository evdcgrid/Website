import { useState } from "react";
import { MapPin, Zap, Car, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const parishes = [
  { name: "Alcântara", lightingPoints: 1200, municipality: "Lisboa" },
  { name: "Areeiro", lightingPoints: 850, municipality: "Lisboa" },
  { name: "Belém", lightingPoints: 1500, municipality: "Lisboa" },
  { name: "Benfica", lightingPoints: 2200, municipality: "Lisboa" },
  { name: "Campo de Ourique", lightingPoints: 900, municipality: "Lisboa" },
  { name: "Cascais e Estoril", lightingPoints: 3200, municipality: "Cascais" },
  { name: "Almada", lightingPoints: 4500, municipality: "Almada" },
  { name: "Sintra", lightingPoints: 5800, municipality: "Sintra" },
  { name: "Oeiras", lightingPoints: 2800, municipality: "Oeiras" },
  { name: "Amadora", lightingPoints: 3100, municipality: "Amadora" },
  { name: "Porto Centro", lightingPoints: 3400, municipality: "Porto" },
  { name: "Vila Nova de Gaia", lightingPoints: 6200, municipality: "V.N. Gaia" },
  { name: "Braga", lightingPoints: 4100, municipality: "Braga" },
  { name: "Coimbra", lightingPoints: 3800, municipality: "Coimbra" },
  { name: "Faro", lightingPoints: 2100, municipality: "Faro" },
];

const MapSimulationPage = () => {
  const [selected, setSelected] = useState<typeof parishes[0] | null>(null);
  const [search, setSearch] = useState("");

  const filtered = parishes.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.municipality.toLowerCase().includes(search.toLowerCase())
  );

  const estimate = selected
    ? {
        lightingPoints: selected.lightingPoints,
        evCapacity: Math.floor(selected.lightingPoints * 0.05),
        monthlyRevenue: Math.floor(selected.lightingPoints * 0.05 * 800),
        infraSavings: Math.floor(selected.lightingPoints * 120 * 0.41),
        gridSegments: Math.ceil(selected.lightingPoints / 50),
        rackUnits: Math.ceil(selected.lightingPoints / 50),
      }
    : null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-medium text-accent uppercase tracking-widest">Map Explorer</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mt-3">
              Explore <span className="gradient-text">Portugal</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Select a freguesia to estimate EV charging potential from public lighting conversion.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Parish selector */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-heading font-bold text-sm mb-4">Select Freguesia</h3>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground mb-4 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {filtered.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => setSelected(p)}
                      className={`w-full text-left rounded-md px-3 py-2.5 text-sm transition-colors ${
                        selected?.name === p.name
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span className="font-medium">{p.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground ml-6">
                        {p.municipality} · {p.lightingPoints.toLocaleString()} lighting points
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results dashboard */}
            <div className="lg:col-span-2">
              {estimate ? (
                <div className="space-y-6">
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 glow-primary">
                    <h3 className="font-heading font-bold text-lg">{selected!.name}</h3>
                    <p className="text-sm text-muted-foreground">{selected!.municipality}, Portugal</p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { icon: Zap, label: "Lighting Points", value: estimate.lightingPoints.toLocaleString() },
                      { icon: Car, label: "Potential EV Chargers", value: estimate.evCapacity.toLocaleString() },
                      { icon: TrendingUp, label: "Monthly Revenue", value: `€${estimate.monthlyRevenue.toLocaleString()}` },
                    ].map((card) => (
                      <div key={card.label} className="rounded-lg border border-border bg-card p-5">
                        <card.icon className="h-5 w-5 text-primary mb-2" />
                        <div className="text-2xl font-heading font-black">{card.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border bg-card p-5">
                      <div className="text-sm text-muted-foreground mb-1">Infrastructure Savings</div>
                      <div className="text-3xl font-heading font-black text-accent">€{estimate.infraSavings.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground mt-1">vs traditional grid extension</div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-5">
                      <div className="text-sm text-muted-foreground mb-1">RACK01 Units Required</div>
                      <div className="text-3xl font-heading font-black text-primary">{estimate.rackUnits}</div>
                      <div className="text-xs text-muted-foreground mt-1">Grid segments to convert: {estimate.gridSegments}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full rounded-lg border border-dashed border-border bg-card/50 p-16">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a freguesia to view estimates</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MapSimulationPage;
