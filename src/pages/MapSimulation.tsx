import { useState, useEffect, useMemo, useCallback } from "react";
import { MapPin, Zap, Car, TrendingUp, ChevronRight, Loader2, Lightbulb, DollarSign, Server, BarChart3 } from "lucide-react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { Layer, LeafletMouseEvent, LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type GeoJSONData = GeoJSON.FeatureCollection;

function normalizePlaceName(value: string | null | undefined): string {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function slugifyPlaceName(value: string | null | undefined): string {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const colors = {
  default: { fillColor: "#1a6b8a", weight: 1.5, opacity: 0.8, color: "#2a9bc0", fillOpacity: 0.2 },
  hover: { fillColor: "#2dba6e", weight: 2, fillOpacity: 0.35, color: "#3de88a" },
  selected: { fillColor: "#2dba6e", weight: 2.5, fillOpacity: 0.45, color: "#4af59a" },
  muni: { fillColor: "#c47a20", weight: 1, opacity: 0.8, color: "#e8a030", fillOpacity: 0.2 },
  muniHover: { fillColor: "#e8a030", weight: 2, fillOpacity: 0.35, color: "#f0c060" },
  muniSelected: { fillColor: "#e8a030", weight: 2.5, fillOpacity: 0.45, color: "#f0c060" },
  parish: { fillColor: "#8a3ac0", weight: 1, opacity: 0.8, color: "#b060e0", fillOpacity: 0.2 },
  parishHover: { fillColor: "#b060e0", weight: 2, fillOpacity: 0.35, color: "#d080ff" },
  parishSelected: { fillColor: "#b060e0", weight: 2.5, fillOpacity: 0.5, color: "#d080ff" },
};

function FlyToBounds({
  bounds,
  onDone,
}: {
  bounds: LatLngBoundsExpression | null;
  onDone?: () => void;
}) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      const handleMoveEnd = () => {
        onDone?.();
      };
      map.once("moveend", handleMoveEnd);
      map.flyToBounds(bounds, { padding: [30, 30], duration: 0.8 });

      return () => {
        map.off("moveend", handleMoveEnd);
      };
    }
  }, [bounds, map, onDone]);
  return null;
}

function FlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

const MapSimulationPage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [selectedParish, setSelectedParish] = useState<string | null>(null);

  const [districtsData, setDistrictsData] = useState<GeoJSONData | null>(null);
  const [filteredMunis, setFilteredMunis] = useState<GeoJSONData | null>(null);
  const [filteredParishes, setFilteredParishes] = useState<GeoJSONData | null>(null);

  const [loadingMunis, setLoadingMunis] = useState(false);
  const [loadingParishes, setLoadingParishes] = useState(false);

  const [flyBounds, setFlyBounds] = useState<LatLngBoundsExpression | null>(null);
  const [defaultView, setDefaultView] = useState(true);
  const [zoomTargetLevel, setZoomTargetLevel] = useState<"district" | "municipality" | "parish" | null>(null);
  const [isDistrictZooming, setIsDistrictZooming] = useState(false);
  const [isMunicipalityZooming, setIsMunicipalityZooming] = useState(false);

  // Load districts from portugal_map hierarchy.
  useEffect(() => {
    fetch("/portugal_map/districts.json")
      .then((r) => r.json())
      .then((data) => setDistrictsData(data))
      .catch(console.error);
  }, []);

  // Load municipalities of selected district only.
  useEffect(() => {
    if (!selectedDistrict) {
      setFilteredMunis(null);
      return;
    }
    let active = true;
    const controller = new AbortController();

    setLoadingMunis(true);
    setFilteredMunis(null);
    const districtSlug = slugifyPlaceName(selectedDistrict);
    fetch(`/portugal_map/${districtSlug}/municipalities.json`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("No district municipality file");
        return r.json();
      })
      .then((data) => {
        if (!active) return;
        setFilteredMunis(data);
        setLoadingMunis(false);
      })
      .catch((error) => {
        if (!active || error?.name === "AbortError") return;
        setFilteredMunis({ type: "FeatureCollection", features: [] });
        setLoadingMunis(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedDistrict]);

  // Load parishes of selected municipality only.
  useEffect(() => {
    if (!selectedDistrict || !selectedMunicipality) {
      setFilteredParishes(null);
      return;
    }
    let active = true;
    const controller = new AbortController();

    setLoadingParishes(true);
    setFilteredParishes(null);

    const districtSlug = slugifyPlaceName(selectedDistrict);
    const muniSlug = slugifyPlaceName(selectedMunicipality);
    fetch(`/portugal_map/${districtSlug}/${muniSlug}/parishes.json`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("No municipality parish file");
        return r.json();
      })
      .then((data) => {
        if (!active) return;
        setFilteredParishes(data);
        setLoadingParishes(false);
      })
      .catch((error) => {
        if (!active || error?.name === "AbortError") return;
        setFilteredParishes({ type: "FeatureCollection", features: [] });
        setLoadingParishes(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedDistrict, selectedMunicipality]);

  interface FreguesiaData {
    total: { total_lights: number };
    led: { led_percentage: number };
    dc: {
      current_chargers: number;
      dc_chargers: number;
      ac_power: number;
      dc_power: number;
      number_of_racks: number;
      led_annual_savings: number;
      investment_value_dc: number;
      investment_value_ac: number;
      investment_savings: number;
    };
  }

  const [freguesiaData, setFreguesiaData] = useState<FreguesiaData | null>(null);
  const [loadingFreguesiaData, setLoadingFreguesiaData] = useState(false);
  const [freguesiaError, setFreguesiaError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedParish) {
      setFreguesiaData(null);
      setFreguesiaError(null);
      return;
    }
    let active = true;
    const controller = new AbortController();

    setLoadingFreguesiaData(true);
    setFreguesiaData(null);
    setFreguesiaError(null);

    fetch("https://diogo-guerreiro.app.n8n.cloud/webhook/evdc-grid-freguesias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ freguesia: selectedParish }),
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error("Backend error");
        return r.json();
      })
      .then((data) => {
        if (!active) return;
        setFreguesiaData(data[0]);
        setLoadingFreguesiaData(false);
      })
      .catch((err) => {
        if (!active || err?.name === "AbortError") return;
        setFreguesiaError("Erro ao carregar dados. Tenta novamente.");
        setLoadingFreguesiaData(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedParish]);

  const formatEuro = (value: number) =>
    value.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";

  // District layer handlers
  const onEachDistrict = useCallback(
    (feature: GeoJSON.Feature, layer: Layer) => {
      const name = feature.properties?.name;
      layer.bindTooltip(name, { sticky: true, className: "map-tooltip" });
      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          if (selectedDistrict !== name) e.target.setStyle(colors.hover);
        },
        mouseout: (e: LeafletMouseEvent) => {
          if (selectedDistrict !== name) e.target.setStyle(colors.default);
        },
        click: () => {
          setSelectedDistrict(name);
          setSelectedMunicipality(null);
          setSelectedParish(null);
          setDefaultView(false);
          const bounds = (layer as any).getBounds?.();
          if (bounds) {
            setZoomTargetLevel("district");
            setIsDistrictZooming(true);
            setIsMunicipalityZooming(false);
            setFlyBounds(bounds);
          }
        },
      });
    },
    [selectedDistrict]
  );

  const styleDistrict = useCallback(
    (feature: any) => {
      if (feature?.properties?.name === selectedDistrict) return colors.selected;
      return colors.default;
    },
    [selectedDistrict]
  );

  // Municipality layer handlers
  const onEachMuni = useCallback(
    (feature: GeoJSON.Feature, layer: Layer) => {
      const name = feature.properties?.name;
      layer.bindTooltip(name, { sticky: true, className: "map-tooltip" });
      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          if (selectedMunicipality !== name) e.target.setStyle(colors.muniHover);
        },
        mouseout: (e: LeafletMouseEvent) => {
          if (selectedMunicipality !== name) e.target.setStyle(colors.muni);
        },
        click: () => {
          setSelectedMunicipality(name);
          setSelectedParish(null);
          const bounds = (layer as any).getBounds?.();
          if (bounds) {
            setZoomTargetLevel("municipality");
            setIsMunicipalityZooming(true);
            setFlyBounds(bounds);
          }
        },
      });
    },
    [selectedMunicipality]
  );

  const styleMuni = useCallback(
    (feature: any) => {
      if (feature?.properties?.name === selectedMunicipality) return colors.muniSelected;
      return colors.muni;
    },
    [selectedMunicipality]
  );

  // Parish layer handlers
  const onEachParish = useCallback(
    (feature: GeoJSON.Feature, layer: Layer) => {
      const name = feature.properties?.n;
      layer.bindTooltip(name, { sticky: true, className: "map-tooltip" });
      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          if (selectedParish !== name) e.target.setStyle(colors.parishHover);
        },
        mouseout: (e: LeafletMouseEvent) => {
          if (selectedParish !== name) e.target.setStyle(colors.parish);
        },
        click: () => {
          setSelectedParish(name);
          const bounds = (layer as any).getBounds?.();
          if (bounds) {
            setZoomTargetLevel("parish");
            setFlyBounds(bounds);
          }
        },
      });
    },
    [selectedParish]
  );

  const styleParish = useCallback(
    (feature: any) => {
      if (feature?.properties?.n === selectedParish) return colors.parishSelected;
      return colors.parish;
    },
    [selectedParish]
  );

  const resetSelection = () => {
    setSelectedDistrict(null);
    setSelectedMunicipality(null);
    setSelectedParish(null);
    setFilteredMunis(null);
    setFilteredParishes(null);
    setFlyBounds(null);
    setDefaultView(true);
    setZoomTargetLevel(null);
    setIsDistrictZooming(false);
    setIsMunicipalityZooming(false);
  };

  const onFlyBoundsDone = useCallback(() => {
    if (zoomTargetLevel === "district") {
      setIsDistrictZooming(false);
    }
    if (zoomTargetLevel === "municipality") {
      setIsMunicipalityZooming(false);
    }
    setZoomTargetLevel(null);
  }, [zoomTargetLevel]);

  const goBackToDistrict = () => {
    setSelectedMunicipality(null);
    setSelectedParish(null);
    setFilteredParishes(null);
    // Re-zoom to district
    if (selectedDistrict && filteredMunis) {
      // Will re-fly via district selection
      setSelectedDistrict((prev) => {
        // Trigger re-render
        return prev;
      });
    }
  };

  // Determine what to show in the status area
  const currentStep = !selectedDistrict ? "district" : !selectedMunicipality ? "municipality" : !selectedParish ? "parish" : "result";

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
              Navigate the map to select a district, municipality, and parish.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map + info */}
            <div className="lg:col-span-1 space-y-4">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap min-h-[1.5rem]">
                <button onClick={resetSelection} className="hover:text-primary transition-colors font-medium">
                  Portugal
                </button>
                {selectedDistrict && (
                  <>
                    <ChevronRight size={12} />
                    <button
                      onClick={() => { setSelectedMunicipality(null); setSelectedParish(null); setFilteredParishes(null); }}
                      className="hover:text-primary transition-colors"
                    >
                      {selectedDistrict}
                    </button>
                  </>
                )}
                {selectedMunicipality && (
                  <>
                    <ChevronRight size={12} />
                    <button
                      onClick={() => { setSelectedParish(null); }}
                      className="hover:text-primary transition-colors"
                    >
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

              {/* Map */}
              <div className="rounded-lg border border-border overflow-hidden h-[420px]">
                <MapContainer
                  center={[39.6, -8.0]}
                  zoom={7}
                  className="h-full w-full"
                  zoomControl={false}
                  style={{ background: "hsl(222, 47%, 8%)" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />

                  {/* Districts layer - always visible */}
                  {districtsData && (
                    <GeoJSON
                      key={"districts-" + (selectedDistrict || "none")}
                      data={districtsData as any}
                      style={styleDistrict}
                      onEachFeature={onEachDistrict}
                    />
                  )}

                  {/* Municipalities layer */}
                  {filteredMunis && selectedDistrict && !isDistrictZooming && (
                    <GeoJSON
                      key={"munis-" + selectedDistrict + "-" + (selectedMunicipality || "none")}
                      data={filteredMunis as any}
                      style={styleMuni}
                      onEachFeature={onEachMuni}
                    />
                  )}

                  {/* Parishes layer */}
                  {filteredParishes && selectedMunicipality && !isMunicipalityZooming && (
                    <GeoJSON
                      key={"parishes-" + selectedMunicipality + "-" + (selectedParish || "none")}
                      data={filteredParishes as any}
                      style={styleParish}
                      onEachFeature={onEachParish}
                    />
                  )}

                  {flyBounds && <FlyToBounds bounds={flyBounds} onDone={onFlyBoundsDone} />}
                  {defaultView && <FlyTo center={[39.6, -8.0]} zoom={7} />}
                </MapContainer>
              </div>

              {/* Status */}
              <div className="rounded-lg border border-border bg-card p-4">
                {currentStep === "district" && (
                  <p className="text-sm text-muted-foreground text-center">
                    👆 Clica num <span className="text-primary font-medium">distrito</span> no mapa
                  </p>
                )}
                {currentStep === "municipality" && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Distrito: <span className="text-primary font-medium">{selectedDistrict}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      👆 Agora clica num <span className="text-[hsl(35,80%,50%)] font-medium">concelho</span>
                    </p>
                    {loadingMunis && (
                      <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" /> A carregar concelhos...
                      </div>
                    )}
                  </div>
                )}
                {currentStep === "parish" && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {selectedDistrict} → <span className="text-[hsl(35,80%,50%)] font-medium">{selectedMunicipality}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      👆 Agora clica numa <span className="text-[hsl(270,60%,65%)] font-medium">freguesia</span>
                    </p>
                    {loadingParishes && (
                      <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" /> A carregar freguesias...
                      </div>
                    )}
                  </div>
                )}
                {currentStep === "result" && (
                  <div className="text-center">
                    <p className="text-sm font-medium text-primary">{selectedParish}</p>
                    <p className="text-xs text-muted-foreground">{selectedMunicipality}, {selectedDistrict}</p>
                    <button onClick={resetSelection} className="mt-2 text-xs text-primary hover:underline">
                      Nova pesquisa
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Results dashboard */}
            <div className="lg:col-span-2 relative">
              {/* Loading overlay */}
              {loadingFreguesiaData && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">A carregar dados da freguesia...</p>
                  </div>
                </div>
              )}

              {freguesiaError && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                  <p className="text-sm text-destructive">{freguesiaError}</p>
                </div>
              )}

              {freguesiaData && selectedParish ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 glow-primary">
                    <h3 className="font-heading font-bold text-lg">{selectedParish}</h3>
                    <p className="text-sm text-muted-foreground">{selectedMunicipality}, {selectedDistrict} · Portugal</p>
                  </div>

                  {/* Lighting Overview */}
                  <div>
                    <h4 className="text-sm font-mono font-medium text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" /> Lighting Overview
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs text-muted-foreground mb-1">Total Luminaires</div>
                        <div className="text-2xl font-heading font-black">{freguesiaData.total.total_lights.toLocaleString("de-DE")}</div>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs text-muted-foreground mb-1">Percentage of LEDs</div>
                        <div className="text-2xl font-heading font-black">{typeof freguesiaData.led.led_percentage === "number" ? freguesiaData.led.led_percentage.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%" : String(freguesiaData.led.led_percentage).replace(".", ",")}</div>
                      </div>
                    </div>
                  </div>

                  {/* EV Charging Capacity */}
                  <div>
                    <h4 className="text-sm font-mono font-medium text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Car className="h-4 w-4" /> EV Charging Capacity
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs text-muted-foreground mb-1">Current EV Chargers (Now)</div>
                        <div className="text-2xl font-heading font-black">{freguesiaData.dc.current_chargers.toLocaleString("de-DE")}</div>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs text-muted-foreground mb-1">EV Chargers with DC Solution</div>
                        <div className="text-2xl font-heading font-black text-primary">{freguesiaData.dc.dc_chargers.toLocaleString("de-DE")}</div>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs text-muted-foreground mb-1">Increase in Chargers</div>
                        <div className="text-2xl font-heading font-black text-accent">+{(freguesiaData.dc.dc_chargers - freguesiaData.dc.current_chargers).toLocaleString("de-DE")}</div>
                      </div>
                    </div>
                  </div>

                  {/* Power & Infrastructure */}
                  <div>
                    <h4 className="text-sm font-mono font-medium text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Server className="h-4 w-4" /> Power & Infrastructure
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs text-muted-foreground mb-1">Current AC Power Available</div>
                        <div className="text-2xl font-heading font-black">{Math.round(freguesiaData.dc.ac_power).toLocaleString("de-DE")} kW</div>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs text-muted-foreground mb-1">Additional DC Power Capacity</div>
                        <div className="text-2xl font-heading font-black text-primary">{Math.round(freguesiaData.dc.dc_power).toLocaleString("de-DE")} kW</div>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs text-muted-foreground mb-1">Number of Racks Required</div>
                        <div className="text-2xl font-heading font-black">{freguesiaData.dc.number_of_racks.toLocaleString("de-DE")}</div>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs text-muted-foreground mb-1">Annual LED Energy Savings</div>
                        <div className="text-2xl font-heading font-black text-accent">{formatEuro(freguesiaData.dc.led_annual_savings)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Comparison */}
                  <div>
                    <h4 className="text-sm font-mono font-medium text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" /> Financial Comparison
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs text-muted-foreground mb-1">DC Solution Investment</div>
                        <div className="text-2xl font-heading font-black text-primary">{formatEuro(freguesiaData.dc.investment_value_dc)}</div>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs text-muted-foreground mb-1">Traditional AC Investment Cost</div>
                        <div className="text-2xl font-heading font-black">{formatEuro(freguesiaData.dc.investment_value_ac)}</div>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs text-muted-foreground mb-1">Savings vs Traditional AC</div>
                        <div className="text-2xl font-heading font-black text-accent">
                          {freguesiaData.dc.investment_value_ac > 0
                            ? ((freguesiaData.dc.investment_savings)).toFixed(1) + "%"
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : !loadingFreguesiaData && !freguesiaError ? (
                <div className="flex items-center justify-center h-full rounded-lg border border-dashed border-border bg-card/50 p-16">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {currentStep === "district" && "Seleciona um distrito no mapa"}
                      {currentStep === "municipality" && "Seleciona um concelho no mapa"}
                      {currentStep === "parish" && "Seleciona uma freguesia no mapa"}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MapSimulationPage;
