import { useState, useEffect, useMemo, useCallback } from "react";
import { MapPin, Zap, Car, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
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

  const estimate = selectedParish
    ? (() => {
        const hash = selectedParish.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
        const lightingPoints = 200 + ((hash * 37) % 5000);
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
                      {currentStep === "district" && "Seleciona um distrito no mapa"}
                      {currentStep === "municipality" && "Seleciona um concelho no mapa"}
                      {currentStep === "parish" && "Seleciona uma freguesia no mapa"}
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
