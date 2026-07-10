import { Link } from "react-router-dom";
import {
  ArrowRight,
  BatteryCharging,
  Euro,
  Lightbulb,
  Network,
  PlugZap,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import publicLightingImage from "@/assets/project-public-lighting-city.png";
import chargingHubImage from "@/assets/project-charging-hub-city.png";
import energyCommunityImage from "@/assets/project-energy-community-city.png";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EVDCGrid",
    alternateName: ["EV DC Grid", "EVDC Grid", "EVDCGRID", "evdc grid", "evdcgrid"],
    url: "https://evdcgrid.pt",
    email: "geral@evdcgrid.pt",
    areaServed: "Portugal",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EVDCGrid",
    alternateName: ["EV DC Grid", "EVDC Grid", "EVDCGRID", "evdc grid", "evdcgrid"],
    url: "https://evdcgrid.pt",
    description:
      "DC-based infrastructure solutions for renewables, storage, public lighting, EV charging and flexible local energy systems.",
  },
];

const valueChain = [
  {
    label: "Reuse",
    title: "Use what already exists",
    text: "Repurpose existing electrical assets and cable routes where technically viable, reducing civil works and deployment friction.",
    Icon: PlugZap,
  },
  {
    label: "Efficiency",
    title: "Reduce operational costs",
    text: "Improve total system efficiency by reducing unnecessary conversion stages, helping lower OPEX across local energy infrastructure.",
    Icon: Euro,
  },
  {
    label: "Scale",
    title: "Add assets progressively",
    text: "Integrate chargers, LED lighting, storage, PV and smart loads through a modular DC layer.",
    Icon: Network,
  },
];

const projects = [
  {
    title: "DC Public Lighting Grid",
    href: "/projects/dc-public-lighting-grid",
    Icon: Lightbulb,
    image: publicLightingImage,
  },
  {
    title: "DC EV Charging Hub",
    href: "/projects/dc-ev-charging-hub",
    Icon: BatteryCharging,
    image: chargingHubImage,
  },
  {
    title: "DC for Energy Communities",
    href: "/projects/dc-energy-communities",
    Icon: Network,
    image: energyCommunityImage,
  },
];

const HeroDiagram = () => (
  <div className="hero-diagram-card" aria-label="DC infrastructure architecture diagram">
    <div className="hero-diagram-stage">
      <img
        src="/images/hero-dc-diagram-clean.png"
        alt="DC infrastructure diagram linking the existing AC grid, AC/DC interface, DC layer, public lighting, EV charging, storage, renewables and flexible loads."
        className="hero-diagram-image"
      />

      <div className="hero-diagram-label hero-diagram-label-ac">
        <strong>EXISTING AC GRID</strong>
        <span>Utility infrastructure [AC]</span>
      </div>
      <div className="hero-diagram-label hero-diagram-label-interface">
        <strong>AC / DC INTERFACE</strong>
        <span>Intelligent conversion & control</span>
      </div>
      <div className="hero-diagram-label hero-diagram-label-dc">
        <strong>DC LAYER</strong>
        <span>Safe, efficient, scalable local power network</span>
      </div>

      <div className="hero-diagram-app hero-diagram-app-lighting">
        <strong>PUBLIC LIGHTING</strong>
        <span>LED street lights & controls</span>
      </div>
      <div className="hero-diagram-app hero-diagram-app-charging">
        <strong>EV CHARGING</strong>
        <span>Fast, reliable DC charging</span>
      </div>
      <div className="hero-diagram-app hero-diagram-app-storage">
        <strong>STORAGE</strong>
        <span>Battery systems & backup power</span>
      </div>
      <div className="hero-diagram-app hero-diagram-app-renewables">
        <strong>RENEWABLES</strong>
        <span>Local solar generation</span>
      </div>
      <div className="hero-diagram-app hero-diagram-app-loads">
        <strong>FLEXIBLE LOADS</strong>
        <span>HVAC, pumps, industrial & more</span>
      </div>
    </div>
  </div>
);

const Index = () => (
  <div className="site-page">
    <Seo
      title="EVDCGrid | DC infrastructure for the next phase of electrification"
      description="EVDCGrid develops DC-based infrastructure solutions that connect renewables, storage, public lighting, EV charging and flexible loads through resilient local energy architectures."
      path="/"
      structuredData={structuredData}
    />
    <Navbar />

    <main>
      <section className="hero-shell">
        <div className="section-container hero-layout">
          <div className="hero-copy">
            <h1>
              <span className="hero-heading-line">DC microgrids</span>
              <span className="hero-heading-line">for the next phase</span>
              <span className="hero-heading-line">of electrification.</span>
            </h1>
            <span className="hero-title-rule" />
            <p>
              EVDCGrid designs modular DC infrastructure that helps cities, DSOs and energy operators integrate EV
              charging, renewables, batteries and smart loads with less conversion complexity and greater local control.
            </p>
            <div className="hero-actions">
              <Link to="/projects/dc-public-lighting-grid" className="hero-primary-action">
                Explore DC Applications
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/about" className="hero-secondary-action">
                About us
              </Link>
            </div>
          </div>
          <HeroDiagram />
        </div>
      </section>

      <section className="site-section-soft relative overflow-hidden py-12 lg:py-14">
        <div className="absolute inset-0 grid-pattern opacity-[0.18]" />
        <div className="absolute -left-16 top-16 hidden h-px w-64 bg-gradient-to-r from-transparent via-primary/25 to-transparent lg:block" />
        <div className="absolute left-0 top-28 hidden h-px w-40 bg-gradient-to-r from-transparent via-primary/20 to-transparent lg:block" />
        <div className="section-container relative">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch xl:gap-12">
            <div className="max-w-2xl">
              <span className="inline-flex flex-col gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Grid transformation
                <span className="h-[3px] w-12 rounded-full bg-primary" />
              </span>
              <h2 className="mt-4 max-w-[38rem] text-3xl font-black leading-[1.06] text-foreground sm:text-4xl lg:text-5xl">
                Applying DC where electrification is creating new pressure
              </h2>
              <p className="mt-5 max-w-[39rem] text-base leading-7 text-muted-foreground">
                Low-voltage grids are being asked to host new loads and distributed assets: EV charging, solar PV,
                batteries, LED lighting, data centres and flexible consumption. EVDCGrid adds a controllable DC layer to
                existing infrastructure, reducing unnecessary conversions and making local energy systems easier to
                monitor, expand and optimise.
              </p>

              <article className="relative mt-7 overflow-hidden rounded-lg border border-emerald-300/60 bg-emerald-50/90 p-5 shadow-[0_14px_34px_hsl(158_64%_32%/0.10)] backdrop-blur sm:p-6">
                <div className="absolute -bottom-16 -right-12 h-56 w-56 rounded-full border border-emerald-300/35" />
                <div className="absolute -bottom-10 -right-8 h-44 w-44 rounded-full border border-emerald-300/35" />
                <div className="relative grid gap-5 sm:grid-cols-[3.25rem_1fr]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/70 bg-white/80 text-emerald-700 shadow-inner">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="max-w-md text-xl font-black leading-tight text-emerald-950 sm:text-2xl">
                      From passive infrastructure to active energy layer
                    </h3>
                    <span className="mt-3 block h-[2px] w-10 rounded-full bg-emerald-600" />
                    <p className="mt-4 max-w-lg text-sm leading-6 text-emerald-950/75 sm:text-base">
                      Instead of treating each new asset as an isolated grid connection, EVDCGrid connects lighting,
                      charging, storage and renewables through a shared DC architecture with centralised conversion,
                      protection and monitoring.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div className="relative flex h-full items-end">
              <div className="grid w-full gap-4 lg:ml-auto lg:max-w-[39rem]">
                {valueChain.map(({ label, title, text, Icon }) => (
                  <article
                    key={label}
                    className="relative rounded-xl border border-primary/15 bg-background/95 p-5 shadow-[0_14px_34px_hsl(214_42%_34%/0.10)] backdrop-blur transition-colors hover:border-primary/35 sm:p-6"
                  >
                    <div className="grid gap-4 sm:grid-cols-[4.5rem_1fr]">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-primary/15 bg-primary/5 text-primary shadow-inner">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
                          {label}
                        </span>
                        <h3 className="mt-2 text-xl font-black leading-tight text-foreground">{title}</h3>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">{text}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section border-y border-border py-20 lg:py-24">
        <div className="section-container">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-2xl text-3xl font-black leading-tight text-foreground sm:text-4xl">
              Projects we are working on
            </h2>
            <div className="hidden h-px flex-1 bg-border sm:block" />
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {projects.map(({ title, href, Icon, image }) => (
              <Link
                key={title}
                to={href}
                className="group overflow-hidden rounded-lg border border-border bg-card/95 shadow-sm backdrop-blur transition-colors hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <div className="aspect-[16/10] overflow-hidden bg-secondary">
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-6 flex items-center justify-between border-b border-border pb-5">
                    <Icon className="h-7 w-7 text-primary" />
                    <span className="font-mono text-xs font-semibold text-muted-foreground">DC</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{title}</h3>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    View project
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default Index;
