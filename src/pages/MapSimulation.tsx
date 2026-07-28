import { useState, useEffect, useMemo, useCallback } from "react";
import { MapPin, Zap, Car, TrendingUp, ChevronRight, Loader2, Lightbulb, DollarSign, Server, BarChart3 } from "lucide-react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { geoJSON as createGeoJSONLayer } from "leaflet";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Layer, LeafletMouseEvent, LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import {
  fetchFreguesiaLightingSimulation as fetchParishLightingSimulation,
  type FreguesiaData as ParishData,
} from "@/lib/eredesLighting";

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

function getFeatureBounds(feature: GeoJSON.Feature): LatLngBoundsExpression {
  return createGeoJSONLayer(feature).getBounds();
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
  const navigate = useNavigate();
  const { district: districtParam, municipality: municipalityParam, parish: parishParam } = useParams();
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
      .then((data: GeoJSONData) => {
        setDistrictsData(data);
        if (!districtParam) {
          setSelectedDistrict(null);
          setSelectedMunicipality(null);
          setSelectedParish(null);
          setDefaultView(true);
          return;
        }

        const district = data.features.find(
          (feature) => slugifyPlaceName(feature.properties?.name) === districtParam
        );
        if (!district) {
          navigate("/map", { replace: true });
          return;
        }

        setSelectedDistrict(district.properties?.name);
        setDefaultView(false);
        setFlyBounds(getFeatureBounds(district));
      })
      .catch(console.error);
  }, [districtParam, navigate]);

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

        if (municipalityParam) {
          const municipality = data.features.find(
            (feature: GeoJSON.Feature) =>
              slugifyPlaceName(feature.properties?.name) === municipalityParam
          );
          if (municipality) {
            setSelectedMunicipality(municipality.properties?.name);
            setFlyBounds(getFeatureBounds(municipality));
          } else {
            navigate(`/map/${districtSlug}`, { replace: true });
          }
        } else {
          setSelectedMunicipality(null);
          setSelectedParish(null);
        }
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
  }, [municipalityParam, navigate, selectedDistrict]);

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

        if (parishParam) {
          const parish = data.features.find(
            (feature: GeoJSON.Feature) =>
              slugifyPlaceName(feature.properties?.n) === parishParam
          );
          if (parish) {
            setSelectedParish(parish.properties?.n);
            setFlyBounds(getFeatureBounds(parish));
          } else {
            navigate(`/map/${districtSlug}/${muniSlug}`, { replace: true });
          }
        } else {
          setSelectedParish(null);
        }
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
  }, [navigate, parishParam, selectedDistrict, selectedMunicipality]);

  const [parishData, setParishData] = useState<ParishData | null>(null);
  const [loadingParishData, setLoadingParishData] = useState(false);
  const [parishError, setParishError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDistrict || !selectedMunicipality || !selectedParish) {
      setParishData(null);
      setParishError(null);
      return;
    }
    let active = true;
    const controller = new AbortController();

    setLoadingParishData(true);
    setParishData(null);
    setParishError(null);

    fetchParishLightingSimulation({
      district: selectedDistrict,
      municipality: selectedMunicipality,
      parish: selectedParish,
      signal: controller.signal,
    })
      .then((data) => {
        if (!active) return;
        setParishData(data);
        setLoadingParishData(false);
      })
      .catch((err) => {
        if (!active || err?.name === "AbortError") return;
        setParishError("Error loading data. Please try again.");
        setLoadingParishData(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedDistrict, selectedMunicipality, selectedParish]);

  const formatEuro = (value: number) =>
    value.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";

  const formatPercent = (value: number) =>
    value.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "%";

  const chargerIncrease = parishData ? parishData.dc.dc_chargers - parishData.dc.current_chargers : 0;
  const chargerIncreasePercent =
    parishData && parishData.dc.current_chargers > 0 ? (chargerIncrease / parishData.dc.current_chargers) * 100 : null;
  const investmentSavings = parishData ? parishData.dc.investment_savings : 0;

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
          navigate(`/map/${slugifyPlaceName(name)}`);
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
    [navigate, selectedDistrict]
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
          navigate(
            `/map/${slugifyPlaceName(selectedDistrict)}/${slugifyPlaceName(name)}`
          );
          const bounds = (layer as any).getBounds?.();
          if (bounds) {
            setZoomTargetLevel("municipality");
            setIsMunicipalityZooming(true);
            setFlyBounds(bounds);
          }
        },
      });
    },
    [navigate, selectedDistrict, selectedMunicipality]
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
          navigate(
            `/map/${slugifyPlaceName(selectedDistrict)}/${slugifyPlaceName(selectedMunicipality)}/${slugifyPlaceName(name)}`
          );
          const bounds = (layer as any).getBounds?.();
          if (bounds) {
            setZoomTargetLevel("parish");
            setFlyBounds(bounds);
          }
        },
      });
    },
    [navigate, selectedDistrict, selectedMunicipality, selectedParish]
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
    navigate("/map");
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
  const locationPath = [
    "/map",
    selectedDistrict && slugifyPlaceName(selectedDistrict),
    selectedMunicipality && slugifyPlaceName(selectedMunicipality),
    selectedParish && slugifyPlaceName(selectedParish),
  ].filter(Boolean).join("/");
  const locationName = selectedParish || selectedMunicipality || selectedDistrict;
  const seoTitle = selectedParish
    ? `${selectedParish}, ${selectedMunicipality} - mapa e iluminação pública`
    : selectedMunicipality
      ? `${selectedMunicipality}, ${selectedDistrict} - mapa por freguesia`
      : selectedDistrict
        ? `Distrito de ${selectedDistrict} - mapa por concelho`
        : "Mapa de Portugal por distrito, concelho e freguesia";
  const seoDescription = selectedParish
    ? `Explore o mapa de ${selectedParish}, no concelho de ${selectedMunicipality}, distrito de ${selectedDistrict}, e consulte a simulação EVDCGrid para iluminação pública e carregamento elétrico.`
    : selectedMunicipality
      ? `Explore o concelho de ${selectedMunicipality}, distrito de ${selectedDistrict}, e selecione uma freguesia no mapa EVDCGrid.`
      : selectedDistrict
        ? `Explore o distrito de ${selectedDistrict} por concelho e freguesia no mapa EVDCGrid.`
        : "Explore o mapa EVDCGrid de Portugal por distrito, concelho e freguesia e consulte oportunidades de iluminação pública e redes DC.";
  const breadcrumbs = [
    { name: "Mapa de Portugal", path: "/map" },
    ...(selectedDistrict ? [{ name: selectedDistrict, path: `/map/${slugifyPlaceName(selectedDistrict)}` }] : []),
    ...(selectedMunicipality ? [{
      name: selectedMunicipality,
      path: `/map/${slugifyPlaceName(selectedDistrict)}/${slugifyPlaceName(selectedMunicipality)}`,
    }] : []),
    ...(selectedParish ? [{ name: selectedParish, path: locationPath }] : []),
  ];

  return (
    <div className="min-h-screen">
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={locationPath}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: locationName ? `Mapa EVDCGrid - ${locationName}` : "Mapa EVDCGrid de Portugal",
            url: `https://evdcgrid.pt${locationPath}`,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: `https://evdcgrid.pt${item.path}`,
            })),
          },
        ]}
      />
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

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* Map + info */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap min-h-[1.5rem]">
                <Link to="/map" onClick={resetSelection} className="hover:text-primary transition-colors font-medium">
                  Portugal
                </Link>
                {selectedDistrict && (
                  <>
                    <ChevronRight size={12} />
                    <Link
                      to={`/map/${slugifyPlaceName(selectedDistrict)}`}
                      onClick={() => { setSelectedMunicipality(null); setSelectedParish(null); setFilteredParishes(null); }}
                      className="hover:text-primary transition-colors"
                    >
                      {selectedDistrict}
                    </Link>
                  </>
                )}
                {selectedMunicipality && (
                  <>
                    <ChevronRight size={12} />
                    <Link
                      to={`/map/${slugifyPlaceName(selectedDistrict)}/${slugifyPlaceName(selectedMunicipality)}`}
                      onClick={() => { setSelectedParish(null); }}
                      className="hover:text-primary transition-colors"
                    >
                      {selectedMunicipality}
                    </Link>
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
              <div className="rounded-lg border border-border overflow-hidden h-[420px] lg:h-auto lg:min-h-[600px] lg:flex-1">
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
                    👆 Click a <span className="text-primary font-medium">district</span> on the map
                  </p>
                )}
                {currentStep === "municipality" && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      District: <span className="text-primary font-medium">{selectedDistrict}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      👆 Now click a <span className="text-[hsl(35,80%,50%)] font-medium">municipality</span>
                    </p>
                    {loadingMunis && (
                      <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" /> Loading municipalities...
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
                      👆 Now click a <span className="text-[hsl(270,60%,65%)] font-medium">parish</span>
                    </p>
                    {loadingParishes && (
                      <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" /> Loading parishes...
                      </div>
                    )}
                  </div>
                )}
                {currentStep === "result" && (
                  <div className="text-center">
                    <p className="text-sm font-medium text-primary">{selectedParish}</p>
                    <p className="text-xs text-muted-foreground">{selectedMunicipality}, {selectedDistrict}</p>
                    <button onClick={resetSelection} className="mt-2 text-xs text-primary hover:underline">
                      New search
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Results dashboard */}
            <div className="lg:col-span-2 relative">
              {/* Loading overlay */}
              {loadingParishData && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading parish data...</p>
                  </div>
                </div>
              )}

              {parishError && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                  <p className="text-sm text-destructive">{parishError}</p>
                </div>
              )}

              {parishData && selectedParish ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 glow-primary">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h3 className="font-heading font-bold text-xl">{selectedParish}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{selectedMunicipality}, {selectedDistrict} · Portugal</p>
                      </div>
                      <div className="self-start rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-mono font-medium text-primary">
                        E-REDES data · {parishData.period.label}
                      </div>
                    </div>
                  </div>

                  {/* Lighting Overview */}
                  <div>
                    <h4 className="text-sm font-mono font-medium text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" /> Lighting Overview
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Total Luminaires</div>
                        <div className="text-3xl font-heading font-black text-foreground">{parishData.total.total_lights.toLocaleString("de-DE")}</div>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Percentage of LEDs</div>
                        <div className="text-3xl font-heading font-black text-foreground">{typeof parishData.led.led_percentage === "number" ? parishData.led.led_percentage.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%" : String(parishData.led.led_percentage).replace(".", ",")}</div>
                      </div>
                      <div className={`rounded-lg border p-5 ${parishData.dc.led_annual_savings >= 0 ? "border-emerald-500/25 bg-emerald-500/5" : "border-destructive/30 bg-destructive/5"}`}>
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Annual LED Energy Savings</div>
                        <div className={`text-3xl font-heading font-black ${parishData.dc.led_annual_savings >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                          {parishData.dc.led_annual_savings >= 0 ? formatEuro(parishData.dc.led_annual_savings) : `-${formatEuro(Math.abs(parishData.dc.led_annual_savings))}`}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {Math.round(parishData.dc.current_non_led_power).toLocaleString("de-DE")} kW non-LED → {Math.round(parishData.dc.converted_non_led_power).toLocaleString("de-DE")} kW LED
                        </div>
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
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">AC Chargers Possible Now</div>
                        <div className="text-3xl font-heading font-black text-foreground">{parishData.dc.current_chargers.toLocaleString("de-DE")}</div>
                      </div>
                      <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 glow-primary">
                        <div className="text-[0.68rem] xl:text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1 whitespace-nowrap">EV Chargers with DC Solution</div>
                        <div className="text-3xl font-heading font-black text-primary">{parishData.dc.dc_chargers.toLocaleString("de-DE")}</div>
                      </div>
                      <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-5">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Increase in Chargers</div>
                        <div className="text-3xl font-heading font-black text-emerald-600">
                          +{chargerIncrease.toLocaleString("de-DE")}
                        </div>
                        {chargerIncreasePercent !== null && (
                          <div className="mt-2 inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            +{formatPercent(chargerIncreasePercent)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Power & Infrastructure */}
                  <div>
                    <h4 className="text-sm font-mono font-medium text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Server className="h-4 w-4" /> Power & Infrastructure
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Current AC Power Available</div>
                        <div className="text-2xl font-heading font-black text-foreground">{Math.round(parishData.dc.ac_power).toLocaleString("de-DE")} kW</div>
                      </div>
                      <div className="rounded-lg border border-primary/25 bg-primary/5 p-5">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Additional DC Power Capacity</div>
                        <div className="text-2xl font-heading font-black text-primary">{Math.round(parishData.dc.dc_power).toLocaleString("de-DE")} kW</div>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-5">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Number of Racks Required</div>
                        <div className="text-2xl font-heading font-black text-foreground">{parishData.dc.number_of_racks.toLocaleString("de-DE")}</div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Comparison */}
                  <div>
                    <h4 className="text-sm font-mono font-medium text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" /> Financial Comparison
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-5">
                        <div className="text-[0.68rem] xl:text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1 whitespace-nowrap">Traditional AC Investment Cost</div>
                        <div className="text-2xl font-heading font-black text-destructive">{formatEuro(parishData.dc.investment_value_ac)}</div>
                      </div>
                      <div className="rounded-lg border border-primary/25 bg-primary/5 p-5">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">DC Solution Investment</div>
                        <div className="text-2xl font-heading font-black text-primary">{formatEuro(parishData.dc.investment_value_dc)}</div>
                      </div>
                      <div className={`rounded-lg border p-5 ${investmentSavings >= 0 ? "border-emerald-500/25 bg-emerald-500/5" : "border-destructive/30 bg-destructive/5"}`}>
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Savings vs Traditional AC</div>
                        <div className={`text-2xl font-heading font-black ${investmentSavings >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                          {parishData.dc.investment_value_ac > 0
                            ? formatEuro(parishData.dc.investment_savings)
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : !loadingParishData && !parishError ? (
                <div className="flex items-center justify-center h-full rounded-lg border border-dashed border-border bg-card/50 p-16">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {currentStep === "district" && "Select a district on the map"}
                      {currentStep === "municipality" && "Select a municipality on the map"}
                      {currentStep === "parish" && "Select a parish on the map"}
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
