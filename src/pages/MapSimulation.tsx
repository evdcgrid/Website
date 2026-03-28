import { useState, useEffect } from "react";
import { MapPin, Zap, Car, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_BASE = "https://json.geoapi.pt";

const MapSimulationPage = () => {
  const [districts, setDistricts] = useState<string[]>([]);
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const [parishes, setParishes] = useState<string[]>([]);

  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [selectedParish, setSelectedParish] = useState<string | null>(null);

  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [loadingParishes, setLoadingParishes] = useState(false);

  // Fetch districts on mount
  useEffect(() => {
    fetch(`${API_BASE}/distritos`)
      .then((r) => r.json())
      .then((data) => {
        setDistricts(data.map((d: { distrito: string }) => d.distrito).sort());
      })
      .catch(() => setDistricts([]))
      .finally(() => setLoadingDistricts(false));
  }, []);

  // Fetch municipalities when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setMunicipalities([]);
      return;
    }
    setLoadingMunicipalities(true);
    setSelectedMunicipality(null);
    setSelectedParish(null);
    setParishes([]);
    fetch(`${API_BASE}/distrito/${encodeURIComponent(selectedDistrict)}/municipios`)
      .then((r) => r.json())
      .then((data) => {
        setMunicipalities(
          (data.municipios as { nome: string }[]).map((m) => m.nome).sort()
        );
      })
      .catch(() => setMunicipalities([]))
      .finally(() => setLoadingMunicipalities(false));
  }, [selectedDistrict]);

  // Fetch parishes when municipality changes
  useEffect(() => {
    if (!selectedMunicipality) {
      setParishes([]);
      return;
    }
    setLoadingParishes(true);
    setSelectedParish(null);
    fetch(`${API_BASE}/municipio/${encodeURIComponent(selectedMunicipality)}/freguesias`)
      .then((r) => r.json())
      .then((data) => {
        setParishes((data.freguesias as string[]).sort());
      })
      .catch(() => setParishes([]))
      .finally(() => setLoadingParishes(false));
  }, [selectedMunicipality]);

  // Generate estimate based on parish name hash for consistent "random" data
  const estimate = selectedParish
    ? (() => {
        const hash = selectedParish.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
        const lightingPoints = 200 + (hash * 37) % 5000;
        const evCapacity = Math.floor(lightingPoints * 0.05);
        return {
          lightingPoints,
          evCapacity,
          monthlyRevenue: evCapacity * 800,
          infraSavings: Math.floor(lightingPoints * 120 * 0.41),
          gridSegments: Math.ceil(lightingPoints / 50),
          rackUnits: Math.ceil(lightingPoints / 50),
        };
      })()
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
            {/* Location selector */}
            <div className="lg:col-span-1 space-y-4">
              {/* Breadcrumb */}
              {(selectedDistrict || selectedMunicipality || selectedParish) && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
                  <button onClick={() => { setSelectedDistrict(null); setSelectedMunicipality(null); setSelectedParish(null); }} className="hover:text-primary transition-colors">
                    Portugal
                  </button>
                  {selectedDistrict && (
                    <>
                      <ChevronRight size={12} />
                      <button onClick={() => { setSelectedMunicipality(null); setSelectedParish(null); }} className="hover:text-primary transition-colors">
                        {selectedDistrict}
                      </button>
                    </>
                  )}
                  {selectedMunicipality && (
                    <>
                      <ChevronRight size={12} />
                      <button onClick={() => setSelectedParish(null)} className="hover:text-primary transition-colors">
                        {selectedMunicipality}
                      </button>
                    </>
                  )}
                  {selectedParish && (
                    <>
                      <ChevronRight size={12} />
                      <span className="text-primary font-medium">{selectedParish}</span>
                    </>
                  )}
                </div>
              )}

              {/* Step 1: District */}
              {!selectedDistrict && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="font-heading font-bold text-sm mb-4 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                    Distrito
                  </h3>
                  {loadingDistricts ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-[28rem] overflow-y-auto">
                      {districts.map((d) => (
                        <button
                          key={d}
                          onClick={() => setSelectedDistrict(d)}
                          className="w-full text-left rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-primary/10 hover:text-primary text-muted-foreground"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{d}</span>
                            <ChevronRight size={14} className="opacity-40" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Municipality */}
              {selectedDistrict && !selectedMunicipality && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="font-heading font-bold text-sm mb-4 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                    Concelho
                  </h3>
                  {loadingMunicipalities ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-[28rem] overflow-y-auto">
                      {municipalities.map((m) => (
                        <button
                          key={m}
                          onClick={() => setSelectedMunicipality(m)}
                          className="w-full text-left rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-primary/10 hover:text-primary text-muted-foreground"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{m}</span>
                            <ChevronRight size={14} className="opacity-40" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Parish */}
              {selectedMunicipality && !selectedParish && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="font-heading font-bold text-sm mb-4 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                    Freguesia
                  </h3>
                  {loadingParishes ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-[28rem] overflow-y-auto">
                      {parishes.map((p) => (
                        <button
                          key={p}
                          onClick={() => setSelectedParish(p)}
                          className="w-full text-left rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-primary/10 hover:text-primary text-muted-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span className="font-medium">{p}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Selected summary */}
              {selectedParish && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 glow-primary">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={16} className="text-primary" />
                    <h3 className="font-heading font-bold text-sm">Selecionado</h3>
                  </div>
                  <div className="text-lg font-heading font-black">{selectedParish}</div>
                  <div className="text-sm text-muted-foreground">{selectedMunicipality}, {selectedDistrict}</div>
                  <button
                    onClick={() => { setSelectedDistrict(null); setSelectedMunicipality(null); setSelectedParish(null); }}
                    className="mt-4 text-xs text-primary hover:underline"
                  >
                    Alterar seleção
                  </button>
                </div>
              )}
            </div>

            {/* Results dashboard */}
            <div className="lg:col-span-2">
              {estimate && selectedParish ? (
                <div className="space-y-6">
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 glow-primary">
                    <h3 className="font-heading font-bold text-lg">{selectedParish}</h3>
                    <p className="text-sm text-muted-foreground">{selectedMunicipality}, {selectedDistrict} · Portugal</p>
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
                    <p className="text-muted-foreground">
                      {!selectedDistrict
                        ? "Selecione um distrito para começar"
                        : !selectedMunicipality
                        ? "Selecione um concelho"
                        : "Selecione uma freguesia para ver estimativas"}
                    </p>
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
