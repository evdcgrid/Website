import { useState, useEffect, useMemo } from "react";
import { MapPin, Zap, Car, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { Layer, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import districtsGeoJSON from "@/assets/portugal-districts.json";

const API_BASE = "https://json.geoapi.pt";

const defaultStyle = {
  fillColor: "hsl(200, 80%, 35%)",
  weight: 1.5,
  opacity: 0.8,
  color: "hsl(200, 80%, 50%)",
  fillOpacity: 0.25,
};

const hoverStyle = {
  fillColor: "hsl(150, 80%, 45%)",
  weight: 2,
  fillOpacity: 0.4,
  color: "hsl(150, 80%, 55%)",
};

const selectedStyle = {
  fillColor: "hsl(150, 80%, 45%)",
  weight: 2.5,
  fillOpacity: 0.5,
  color: "hsl(150, 80%, 60%)",
};

function FlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1 });
  }, [center, zoom, map]);
  return null;
}

const MapSimulationPage = () => {
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const [parishes, setParishes] = useState<string[]>([]);

  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [selectedParish, setSelectedParish] = useState<string | null>(null);

  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [loadingParishes, setLoadingParishes] = useState(false);

  const [mapCenter, setMapCenter] = useState<[number, number]>([39.5, -8.0]);
  const [mapZoom, setMapZoom] = useState(7);

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

  const onEachFeature = useMemo(() => {
    return (feature: GeoJSON.Feature, layer: Layer) => {
      const name = feature.properties?.name;
      layer.bindTooltip(name, { sticky: true, className: "district-tooltip" });
      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          if (selectedDistrict !== name) {
            e.target.setStyle(hoverStyle);
          }
        },
        mouseout: (e: LeafletMouseEvent) => {
          if (selectedDistrict !== name) {
            e.target.setStyle(defaultStyle);
          }
        },
        click: () => {
          setSelectedDistrict(name);
          // Compute center of district from bounds
          const bounds = (layer as any).getBounds?.();
          if (bounds) {
            const center = bounds.getCenter();
            setMapCenter([center.lat, center.lng]);
            setMapZoom(9);
          }
        },
      });
    };
  }, [selectedDistrict]);

  const styleFeature = useMemo(() => {
    return (feature: any) => {
      if (feature?.properties?.name === selectedDistrict) return selectedStyle;
      return defaultStyle;
    };
  }, [selectedDistrict]);

  const resetSelection = () => {
    setSelectedDistrict(null);
    setSelectedMunicipality(null);
    setSelectedParish(null);
    setMapCenter([39.5, -8.0]);
    setMapZoom(7);
  };

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
              Click on a district in the map, then select concelho and freguesia.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map + selectors */}
            <div className="lg:col-span-1 space-y-4">
              {/* Breadcrumb */}
              {selectedDistrict && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
                  <button onClick={resetSelection} className="hover:text-primary transition-colors">
                    Portugal
                  </button>
                  <ChevronRight size={12} />
                  <button
                    onClick={() => { setSelectedMunicipality(null); setSelectedParish(null); }}
                    className="hover:text-primary transition-colors"
                  >
                    {selectedDistrict}
                  </button>
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

              {/* Map */}
              <div className="rounded-lg border border-border overflow-hidden h-[360px]">
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  className="h-full w-full"
                  zoomControl={false}
                  style={{ background: "hsl(222, 47%, 8%)" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  <GeoJSON
                    key={selectedDistrict || "all"}
                    data={districtsGeoJSON as any}
                    style={styleFeature}
                    onEachFeature={onEachFeature}
                  />
                  <FlyTo center={mapCenter} zoom={mapZoom} />
                </MapContainer>
              </div>

              {/* Dropdowns */}
              {selectedDistrict && (
                <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                  {/* Municipality select */}
                  <div>
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      Concelho
                    </label>
                    {loadingMunicipalities ? (
                      <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> A carregar...
                      </div>
                    ) : (
                      <select
                        value={selectedMunicipality || ""}
                        onChange={(e) => setSelectedMunicipality(e.target.value || null)}
                        className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Selecionar concelho...</option>
                        {municipalities.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Parish select */}
                  {selectedMunicipality && (
                    <div>
                      <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        Freguesia
                      </label>
                      {loadingParishes ? (
                        <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" /> A carregar...
                        </div>
                      ) : (
                        <select
                          value={selectedParish || ""}
                          onChange={(e) => setSelectedParish(e.target.value || null)}
                          className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">Selecionar freguesia...</option>
                          {parishes.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!selectedDistrict && (
                <p className="text-xs text-muted-foreground text-center">
                  Clica num distrito no mapa para começar
                </p>
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
                        ? "Seleciona um distrito no mapa"
                        : !selectedMunicipality
                        ? "Seleciona um concelho"
                        : "Seleciona uma freguesia para ver estimativas"}
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
