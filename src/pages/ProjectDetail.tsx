import type { ComponentType } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BatteryCharging,
  CheckCircle2,
  CircuitBoard,
  Lightbulb,
  MapPin,
  Network,
  PlugZap,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import publicLightingImage from "@/assets/project-public-lighting-city.png";
import chargingHubImage from "@/assets/project-charging-hub-city.png";
import energyCommunityImage from "@/assets/project-energy-community-city.png";

type IconComponent = ComponentType<{ className?: string }>;

type TextCard = {
  title: string;
  text: string;
};

type SolutionProject = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  Icon: IconComponent;
  image: string;
  heroSubtitle: string;
  problem: {
    title: string;
    text: string;
    cards: TextCard[];
  };
  approach: {
    title: string;
    text: string;
    points: string[];
  };
  architecture: {
    title: string;
    text: string;
    image: string;
    alt: string;
    compact?: boolean;
    transparent?: boolean;
  };
  outcomes: TextCard[];
  partners: TextCard[];
  requirements: string[];
  cta: {
    title: string;
    text: string;
    primary: string;
    secondary: string;
  };
};

const projects: SolutionProject[] = [
  {
    slug: "dc-public-lighting-grid",
    title: "DC Public Lighting Grid",
    seoTitle: "DC Public Lighting Grid | EVDCGrid",
    seoDescription:
      "Convert existing public lighting circuits into monitored DC infrastructure for LED lighting, distributed EV charging and future urban energy assets.",
    eyebrow: "Public infrastructure",
    Icon: Lightbulb,
    image: publicLightingImage,
    heroSubtitle:
      "Convert existing public lighting circuits into a monitored bipolar DC infrastructure layer for street lighting, distributed EV charging and future urban energy assets.",
    problem: {
      title: "Urban electrification needs faster infrastructure deployment.",
      text: "Cities need to expand EV charging, modernize public lighting and prepare for new electrified loads. However, conventional deployment often depends on new cables, civil works, grid reinforcement and long approval cycles.",
      cards: [
        {
          title: "Slow EV charging rollout",
          text: "Public charging deployment is delayed by grid connection constraints, permitting and construction work.",
        },
        {
          title: "Underused public infrastructure",
          text: "Existing public lighting circuits already reach streets and parking areas but are rarely used as part of the energy transition.",
        },
        {
          title: "Limited local visibility",
          text: "Many low-voltage public infrastructure networks lack the monitoring and control needed for flexible electrification.",
        },
      ],
    },
    approach: {
      title: "A controlled DC layer using existing public lighting assets.",
      text: "EVDCGrid converts selected public lighting circuits into a galvanically isolated bipolar DC network. A central conversion cabinet connects to the existing AC infrastructure and supplies DC-compatible LED lighting and distributed EV chargers through the reused lighting circuit.",
      points: [
        "Reuse of existing cables and grid assets",
        "Central AC/DC conversion cabinet",
        "Galvanic isolation and protection",
        "Monitoring and control of the converted circuit",
        "Future integration with storage, PV or other DC assets",
      ],
    },
    architecture: {
      title: "Electrical architecture",
      text: "The architecture connects the AC low-voltage grid to a central EVDCGrid cabinet, creating a protected and monitored DC distribution layer for public lighting and EV charging.",
      image: "/images/schematic-public-lighting.png",
      alt: "Electrical schematic of the EVDCGrid DC public lighting grid architecture.",
      compact: true,
      transparent: true,
    },
    outcomes: [
      {
        title: "Faster urban charging deployment",
        text: "EV charging points can be deployed closer to existing public infrastructure with reduced civil work.",
      },
      {
        title: "Shared infrastructure layer",
        text: "The same DC network can supply LED lighting, EV chargers and future urban energy assets.",
      },
      {
        title: "Higher control and monitoring",
        text: "The converted circuit becomes measurable, controllable and easier to operate safely.",
      },
      {
        title: "Future-ready public infrastructure",
        text: "Storage, PV or flexible loads can be integrated progressively into the same DC layer.",
      },
    ],
    partners: [
      {
        title: "Municipalities",
        text: "For public lighting modernization, urban charging and smart infrastructure pilots.",
      },
      {
        title: "DSOs",
        text: "For monitored low-voltage infrastructure, grid-aware operation and local flexibility studies.",
      },
      {
        title: "CPOs",
        text: "For distributed public charging locations with lower infrastructure barriers.",
      },
    ],
    requirements: [
      "One selected public lighting circuit",
      "Access to the local low-voltage connection point",
      "Existing lighting assets suitable for LED replacement",
      "Location for the EVDCGrid conversion cabinet",
      "Technical coordination with the municipality and DSO",
      "Optional EV charging points, storage or PV integration",
    ],
    cta: {
      title: "Want to test DC public infrastructure in your municipality?",
      text: "We are open to technical discussions and pilot projects with municipalities, DSOs and charging operators.",
      primary: "Discuss a Pilot",
      secondary: "Contact EVDCGrid",
    },
  },
  {
    slug: "dc-ev-charging-hub",
    title: "DC EV Charging Hub",
    seoTitle: "DC EV Charging Hub | EVDCGrid",
    seoDescription:
      "Shared DC bus architecture for fast charging hubs, integrating grid supply, battery storage and multiple EV chargers under centralized control.",
    eyebrow: "Charging infrastructure",
    Icon: BatteryCharging,
    image: chargingHubImage,
    heroSubtitle:
      "A shared DC bus architecture for fast charging hubs, integrating grid supply, power conversion, battery storage and multiple EV chargers under centralized control.",
    problem: {
      title: "Fast charging creates high local power demand.",
      text: "EV charging hubs concentrate several high-power charging points in one location. When each charger operates as an isolated AC-connected asset, the site can require expensive grid connections, high peak capacity and duplicated conversion stages.",
      cards: [
        {
          title: "High peak demand",
          text: "Multiple fast chargers can create large simultaneous power peaks on the local grid connection.",
        },
        {
          title: "Duplicated conversion hardware",
          text: "Independent AC-connected chargers repeat power conversion across each charging unit.",
        },
        {
          title: "Difficult expansion",
          text: "Adding more chargers can require redesigning electrical infrastructure or requesting additional grid capacity.",
        },
      ],
    },
    approach: {
      title: "A shared DC bus for centralized power management.",
      text: "EVDCGrid connects multiple fast chargers through a common DC layer. Grid supply, battery storage and power conversion are managed centrally, allowing the hub to distribute available power dynamically across chargers and reduce stress on the upstream grid.",
      points: [
        "Common DC bus for multiple chargers",
        "Centralized AC/DC conversion",
        "Battery-ready architecture",
        "Dynamic power allocation",
        "Modular charger expansion",
        "Future integration with PV or local energy assets",
      ],
    },
    architecture: {
      title: "Electrical architecture",
      text: "The architecture uses a shared DC bus between the grid interface, energy storage and EV chargers, enabling centralized power flow control across the charging hub.",
      image: "/images/schematic-charging-hub.png",
      alt: "Electrical schematic of the EVDCGrid DC EV charging hub architecture.",
      transparent: true,
    },
    outcomes: [
      {
        title: "Lower grid stress",
        text: "Battery storage and centralized power management can reduce peak demand from the grid.",
      },
      {
        title: "Modular expansion",
        text: "Additional chargers can be integrated into the common DC layer more easily.",
      },
      {
        title: "Higher energy efficiency",
        text: "Fewer unnecessary conversion stages improve the electrical architecture of the site.",
      },
      {
        title: "Storage and renewables ready",
        text: "Batteries and PV can be connected directly into the DC layer for local optimization.",
      },
    ],
    partners: [
      {
        title: "CPOs",
        text: "For scalable fast charging sites with centralized power management.",
      },
      {
        title: "Fleet operators",
        text: "For depots, logistics hubs and high-utilization charging operations.",
      },
      {
        title: "Service areas and parking operators",
        text: "For charging hubs where power availability and expansion capacity are critical.",
      },
      {
        title: "DSOs",
        text: "For grid-aware charging hubs with local flexibility potential.",
      },
    ],
    requirements: [
      "One charging hub site",
      "Existing or planned EV charging demand",
      "Available grid connection data",
      "Space for conversion cabinet and optional battery storage",
      "Technical requirements for charger integration",
      "Monitoring and control objectives",
      "Optional PV or storage integration",
    ],
    cta: {
      title: "Planning a charging hub with grid constraints?",
      text: "EVDCGrid can help evaluate DC architectures for fast charging, storage integration and local power management.",
      primary: "Discuss a Charging Hub",
      secondary: "Contact EVDCGrid",
    },
  },
  {
    slug: "dc-energy-communities",
    title: "DC for Energy Communities",
    seoTitle: "DC for Energy Communities | EVDCGrid",
    seoDescription:
      "Monitored DC infrastructure for connecting local generation, storage, EV charging and flexible loads inside energy communities.",
    eyebrow: "Local energy systems",
    Icon: Network,
    image: energyCommunityImage,
    heroSubtitle:
      "A monitored DC infrastructure layer for connecting local generation, storage, EV charging and flexible loads inside energy communities.",
    problem: {
      title: "Energy communities need simpler local energy sharing.",
      text: "Energy communities depend on coordinating local generation, storage and consumption. However, when every asset is connected separately through conventional AC interfaces, the system becomes harder to monitor, balance and scale.",
      cards: [
        {
          title: "Fragmented local assets",
          text: "PV, batteries, chargers and loads are often installed as separate systems with limited coordination.",
        },
        {
          title: "Unnecessary grid exchanges",
          text: "Local renewable energy may flow back and forth through the grid instead of being used directly nearby.",
        },
        {
          title: "Complex community growth",
          text: "Adding new members, chargers, storage or generation assets can increase technical and operational complexity.",
        },
      ],
    },
    approach: {
      title: "A shared DC layer for local energy coordination.",
      text: "EVDCGrid enables energy communities to connect renewable generation, battery storage, EV charging and flexible loads through a monitored DC network. This creates a simpler local energy layer for balancing production and consumption closer to where energy is used.",
      points: [
        "Shared DC infrastructure layer",
        "PV and battery integration",
        "EV charging and flexible load connection",
        "Local monitoring and control",
        "Modular expansion points",
        "Reduced unnecessary power exchanges",
      ],
    },
    architecture: {
      title: "Electrical architecture",
      text: "The architecture connects local generation, storage and consumption through a common monitored DC network, enabling local energy balancing and progressive community expansion.",
      image: "/images/schematic-energy-community.svg",
      alt: "Electrical schematic of the EVDCGrid DC energy community architecture.",
    },
    outcomes: [
      {
        title: "Better local energy use",
        text: "Renewable generation can be consumed closer to where it is produced.",
      },
      {
        title: "Smarter energy sharing",
        text: "Storage, EV charging and flexible loads can be coordinated through a common local layer.",
      },
      {
        title: "Easier community growth",
        text: "New assets and members can be added progressively through modular connection points.",
      },
      {
        title: "More resilient local infrastructure",
        text: "Monitoring and control improve visibility and operational flexibility.",
      },
    ],
    partners: [
      {
        title: "Energy communities",
        text: "For local generation, storage and shared consumption projects.",
      },
      {
        title: "Municipalities",
        text: "For neighbourhood-scale renewable energy and electrification pilots.",
      },
      {
        title: "Campuses and industrial parks",
        text: "For local energy systems with multiple buildings, loads and charging points.",
      },
      {
        title: "DSOs and energy operators",
        text: "For monitored community infrastructure and flexibility studies.",
      },
    ],
    requirements: [
      "Local generation asset, such as PV",
      "One or more local consumption points",
      "Optional battery storage",
      "Optional EV charging points",
      "Defined community or campus boundary",
      "Monitoring and control requirements",
      "Technical coordination with grid operator and local stakeholders",
    ],
    cta: {
      title: "Building an energy community with local electrification needs?",
      text: "EVDCGrid is open to partnerships and pilots for DC-based local energy systems.",
      primary: "Discuss an Energy Community Pilot",
      secondary: "Contact EVDCGrid",
    },
  },
];

const sectionHeadingClass = "text-3xl font-black tracking-tight text-foreground sm:text-4xl";

const SolutionHero = ({ project }: { project: SolutionProject }) => {
  const { Icon } = project;

  return (
    <section className="site-section-strong relative overflow-hidden border-b border-border pt-28 lg:pt-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background/82 via-background/94 to-surface/90" />
      <div className="section-container relative py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              {project.eyebrow}
            </span>
            <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
              <Icon className="h-7 w-7" />
            </div>
            <h1 className="mt-7 text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              {project.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {project.cta.primary}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#architecture"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input bg-background/80 px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                View architecture
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-primary/15 bg-background/88 shadow-[0_24px_70px_rgba(7,22,45,0.12)] backdrop-blur">
            <div className="aspect-[16/10] overflow-hidden bg-secondary">
              <img src={project.image} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ExplorerSection = ({ highlighted = false }: { highlighted?: boolean }) => (
  <section className="site-section py-14 lg:py-16">
    <div className="section-container">
      <div className="grid gap-5 lg:grid-cols-2">
        <Link
          to="/map"
          className={`group rounded-xl p-6 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 lg:p-7 ${
            highlighted
              ? "border border-primary bg-primary text-primary-foreground shadow-[0_20px_50px_hsl(216_92%_47%/0.18)] hover:bg-primary/92"
              : "border border-primary/18 bg-background/92 hover:border-primary/45"
          }`}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md border ${
                highlighted
                  ? "border-white/25 bg-white/14 text-white"
                  : "border-primary/20 bg-primary/10 text-primary"
              }`}
            >
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <span
                className={`font-mono text-xs font-semibold uppercase tracking-widest ${
                  highlighted ? "text-white/75" : "text-primary"
                }`}
              >
                Map Explorer
              </span>
              <h2 className={`mt-3 text-2xl font-black ${highlighted ? "text-white" : "text-foreground"}`}>
                See the potential of the solution in each municipality.
              </h2>
              <p className={`mt-3 text-sm leading-6 ${highlighted ? "text-white/82" : "text-muted-foreground"}`}>
                Explore Portuguese municipalities and local public lighting data to understand where a DC infrastructure layer can unlock more charging capacity, lower civil works and improve local monitoring.
              </p>
              <span
                className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${
                  highlighted ? "text-white" : "text-primary"
                }`}
              >
                Open Map Explorer
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>

        <Link
          to="/case-study"
          className={`group rounded-xl p-6 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 lg:p-7 ${
            highlighted
              ? "border border-primary bg-primary text-primary-foreground shadow-[0_20px_50px_hsl(216_92%_47%/0.18)] hover:bg-primary/92"
              : "border border-primary/18 bg-background/92 hover:border-primary/45"
          }`}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md border ${
                highlighted
                  ? "border-white/25 bg-white/14 text-white"
                  : "border-primary/20 bg-primary/10 text-primary"
              }`}
            >
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <span
                className={`font-mono text-xs font-semibold uppercase tracking-widest ${
                  highlighted ? "text-white/75" : "text-primary"
                }`}
              >
                Case Study
              </span>
              <h2 className={`mt-3 text-2xl font-black ${highlighted ? "text-white" : "text-foreground"}`}>
                Compare the DC deployment model with conventional AC works.
              </h2>
              <p className={`mt-3 text-sm leading-6 ${highlighted ? "text-white/82" : "text-muted-foreground"}`}>
                Review the Areeiro case study to see how reusing existing public infrastructure can reduce civil works, shorten deployment and support distributed EV charging.
              </p>
              <span
                className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${
                  highlighted ? "text-white" : "text-primary"
                }`}
              >
                View Case Study
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  </section>
);

const ProblemSection = ({ problem }: { problem: SolutionProject["problem"] }) => (
  <section className="site-section-soft py-16 lg:py-20">
    <div className="section-container">
      <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            Problem
          </span>
          <h2 className={`${sectionHeadingClass} mt-4`}>{problem.title}</h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">{problem.text}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
          {problem.cards.map((card) => (
            <article
              key={card.title}
              className="rounded-lg border border-border bg-background/92 p-6 shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const ApproachSection = ({ approach }: { approach: SolutionProject["approach"] }) => (
  <section className="site-section py-16 lg:py-20">
    <div className="section-container">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            DC Approach
          </span>
          <h2 className={`${sectionHeadingClass} mt-4`}>{approach.title}</h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">{approach.text}</p>
        </div>
        <div className="rounded-xl border border-emerald-300/70 bg-emerald-50/82 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-300 bg-white text-emerald-700">
              <CircuitBoard className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-emerald-950">Technical scope</h3>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {approach.points.map((point) => (
              <li key={point} className="flex gap-3 text-sm font-semibold leading-6 text-emerald-950">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const ArchitectureSection = ({
  architecture,
  technicalScopePoints,
}: {
  architecture: SolutionProject["architecture"];
  technicalScopePoints?: string[];
}) => (
  <section id="architecture" className="site-section-strong border-y border-border py-16 lg:py-20">
    <div className="section-container">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <figure className="flex h-full flex-col justify-center">
          <div
            className={
              architecture.transparent
                ? "flex min-h-[28rem] items-center justify-center overflow-visible bg-transparent p-0"
                : "overflow-hidden rounded-xl border border-primary/20 bg-[#02060b] p-4 shadow-[0_18px_55px_rgba(4,16,35,0.16)]"
            }
          >
            <img
              src={architecture.image}
              alt={architecture.alt}
              className={`mx-auto w-full object-contain ${
                architecture.compact
                  ? "max-h-[30rem] max-w-[21rem] lg:max-h-[32rem]"
                  : architecture.transparent
                    ? "max-h-[20rem] max-w-[44rem] lg:max-h-[22rem]"
                    : "max-h-[18rem] lg:max-h-[17rem]"
              }`}
              loading="lazy"
            />
          </div>
          <figcaption className={architecture.transparent ? "sr-only" : "mt-3 text-center text-xs text-muted-foreground"}>
            Simplified electrical architecture for the proposed DC infrastructure layer.
          </figcaption>
        </figure>
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            Electrical Architecture
          </span>
          <h2 className={`${sectionHeadingClass} mt-4`}>{architecture.title}</h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">{architecture.text}</p>
          <div className="mt-7 rounded-xl border border-border bg-background/92 p-6 shadow-sm">
            <h3 className="text-lg font-black text-foreground">Technical description</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              The schematic shows EVDCGrid as a complementary local DC layer connected to existing AC infrastructure through controlled conversion, protection and monitoring. It is designed to integrate assets progressively while keeping grid interaction visible and manageable.
            </p>
          </div>
          {technicalScopePoints && (
            <div className="mt-4 rounded-xl border border-emerald-300/70 bg-emerald-50/82 p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-300 bg-white text-emerald-700">
                  <CircuitBoard className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-emerald-950">Technical scope</h3>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {technicalScopePoints.map((point) => (
                  <li key={point} className="flex gap-3 text-sm font-semibold leading-6 text-emerald-950">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  </section>
);

const OutcomeCards = ({ outcomes, twoByTwo = false }: { outcomes: TextCard[]; twoByTwo?: boolean }) => (
  <section className="site-section py-16 lg:py-20">
    <div className="section-container">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            Outcome
          </span>
          <h2 className={`${sectionHeadingClass} mt-4`}>What this enables</h2>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
      </div>
      <div className={`grid gap-4 md:grid-cols-2 ${twoByTwo ? "xl:grid-cols-2" : "xl:grid-cols-4"}`}>
        {outcomes.map((outcome) => (
          <article key={outcome.title} className="h-full rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{outcome.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{outcome.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const IdealPartners = ({ partners, threeAcross = false }: { partners: TextCard[]; threeAcross?: boolean }) => (
  <section className="site-section-soft py-16 lg:py-20">
    <div className="section-container">
      <div className="max-w-3xl">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
          Partners
        </span>
        <h2 className={`${sectionHeadingClass} mt-4`}>Ideal partners</h2>
      </div>
      <div className={`mt-8 grid gap-4 md:grid-cols-2 ${threeAcross ? "xl:grid-cols-3" : "xl:grid-cols-4"}`}>
        {partners.map((partner) => (
          <article
            key={partner.title}
            className="h-full rounded-lg border border-border bg-background/92 p-6 shadow-sm"
          >
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{partner.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{partner.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const DeploymentRequirements = ({ requirements }: { requirements: string[] }) => (
  <section className="site-section py-16 lg:py-20">
    <div className="section-container">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            Pilot / Deployment Requirements
          </span>
          <h2 className={`${sectionHeadingClass} mt-4`}>Typical pilot requirements</h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            A pilot starts with a defined infrastructure boundary, access to the relevant electrical data
            and technical coordination between asset owners and grid stakeholders.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background/92 p-6 shadow-sm">
          <ul className="grid gap-3 sm:grid-cols-2">
            {requirements.map((requirement) => (
              <li key={requirement} className="flex gap-3 text-sm font-semibold leading-6 text-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const RelatedSolutions = ({
  currentSlug,
}: {
  currentSlug: string;
}) => {
  const related = projects.filter((project) => project.slug !== currentSlug);

  return (
    <section className="site-section-soft py-14">
      <div className="section-container">
        <h2 className="text-2xl font-black text-foreground">Explore DC applications</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {related.map(({ slug, title, heroSubtitle, Icon, image }) => (
            <Link
              key={slug}
              to={`/projects/${slug}`}
              className="group overflow-hidden rounded-lg border border-border bg-background/92 shadow-sm transition-colors hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <div className="aspect-[16/9] overflow-hidden bg-secondary">
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <Icon className="h-7 w-7 text-primary" />
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{heroSubtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const SolutionCTA = ({ cta }: { cta: SolutionProject["cta"] }) => (
  <section className="site-section-strong py-16 lg:py-20">
    <div className="section-container">
      <div className="rounded-xl border border-primary/20 bg-background/92 p-8 shadow-[0_24px_70px_rgba(7,22,45,0.12)] lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              Next step
            </span>
            <h2 className={`${sectionHeadingClass} mt-4`}>{cta.title}</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">{cta.text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              to="/contact"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <PlugZap className="h-4 w-4" />
              {cta.secondary}
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <Navigate to="/projects/dc-public-lighting-grid" replace />;
  }

  const isPublicLightingProject = project.slug === "dc-public-lighting-grid";

  return (
    <div className="site-page">
      <Seo
        title={project.seoTitle}
        description={project.seoDescription}
        path={`/projects/${project.slug}`}
      />
      <Navbar />

      <main>
        <SolutionHero project={project} />
        <ExplorerSection highlighted={isPublicLightingProject} />
        {project.slug !== "dc-energy-communities" && (
          <ArchitectureSection
            architecture={project.architecture}
            technicalScopePoints={isPublicLightingProject ? project.approach.points : undefined}
          />
        )}
        <ProblemSection problem={project.problem} />
        {!isPublicLightingProject && <ApproachSection approach={project.approach} />}
        <OutcomeCards outcomes={project.outcomes} twoByTwo={isPublicLightingProject} />
        <IdealPartners partners={project.partners} threeAcross={isPublicLightingProject} />
        <DeploymentRequirements requirements={project.requirements} />
        <RelatedSolutions currentSlug={project.slug} />
        <SolutionCTA cta={project.cta} />
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetailPage;
