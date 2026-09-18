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
import { commonText, useLanguage } from "@/lib/language";
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

const homeText = {
  en: {
    seoTitle: "EVDCGrid | DC infrastructure for the next phase of electrification",
    seoDescription:
      "EVDCGrid develops DC-based infrastructure solutions that connect renewables, storage, public lighting, EV charging and flexible loads through resilient local energy architectures.",
    structuredDescription:
      "DC-based infrastructure solutions for renewables, storage, public lighting, EV charging and flexible local energy systems.",
    heroLines: ["DC microgrids", "for the next phase", "of electrification."],
    heroBody:
      "EVDCGrid designs modular DC infrastructure that helps cities, DSOs and energy operators integrate EV charging, renewables, batteries and smart loads with less conversion complexity and greater local control.",
    explore: "Explore DC Applications",
    about: "About us",
    diagramAria: "DC infrastructure architecture diagram",
    diagramAlt:
      "DC infrastructure diagram linking the existing AC grid, AC/DC interface, DC layer, public lighting, EV charging, storage, renewables and flexible loads.",
    diagram: {
      acTitle: "EXISTING AC GRID",
      acText: "Utility infrastructure [AC]",
      interfaceTitle: "AC / DC INTERFACE",
      interfaceText: "Intelligent conversion & control",
      dcTitle: "DC LAYER",
      dcText: "Safe, efficient, scalable local power network",
      lightingTitle: "PUBLIC LIGHTING",
      lightingText: "LED street lights & controls",
      chargingTitle: "EV CHARGING",
      chargingText: "Fast, reliable DC charging",
      storageTitle: "STORAGE",
      storageText: "Battery systems & backup power",
      renewablesTitle: "RENEWABLES",
      renewablesText: "Local solar generation",
      loadsTitle: "FLEXIBLE LOADS",
      loadsText: "HVAC, pumps, industrial & more",
    },
    transformation: "Grid transformation",
    sectionTitle: "Applying DC where electrification is creating new pressure",
    sectionBody:
      "Low-voltage grids are being asked to host new loads and distributed assets: EV charging, solar PV, batteries, LED lighting, data centres and flexible consumption. EVDCGrid adds a controllable DC layer to existing infrastructure, reducing unnecessary conversions and making local energy systems easier to monitor, expand and optimise.",
    highlightTitle: "From passive infrastructure to active energy layer",
    highlightBody:
      "Instead of treating each new asset as an isolated grid connection, EVDCGrid connects lighting, charging, storage and renewables through a shared DC architecture with centralised conversion, protection and monitoring.",
    values: valueChain,
    projectsTitle: "Projects we are working on",
    viewProject: "View project",
  },
  pt: {
    seoTitle: "EVDCGrid | Infraestrutura DC para a nova fase da eletrificacao",
    seoDescription:
      "A EVDCGrid desenvolve solucoes de infraestrutura em corrente continua que ligam renovaveis, armazenamento, iluminacao publica, carregamento EV e cargas flexiveis atraves de arquiteturas locais de energia resilientes.",
    structuredDescription:
      "Solucoes de infraestrutura em corrente continua para renovaveis, armazenamento, iluminacao publica, carregamento EV e sistemas locais de energia flexiveis.",
    heroLines: ["Micro-redes DC", "para a nova fase", "da eletrificacao."],
    heroBody:
      "A EVDCGrid desenha infraestrutura DC modular que ajuda cidades, ORD e operadores de energia a integrar carregamento EV, renovaveis, baterias e cargas inteligentes com menos complexidade de conversao e maior controlo local.",
    explore: "Explorar aplicacoes DC",
    about: "Sobre nos",
    diagramAria: "Diagrama da arquitetura de infraestrutura DC",
    diagramAlt:
      "Diagrama de infraestrutura DC que liga a rede AC existente, interface AC/DC, camada DC, iluminacao publica, carregamento EV, armazenamento, renovaveis e cargas flexiveis.",
    diagram: {
      acTitle: "REDE AC EXISTENTE",
      acText: "Infraestrutura da rede [AC]",
      interfaceTitle: "INTERFACE AC / DC",
      interfaceText: "Conversao e controlo inteligentes",
      dcTitle: "CAMADA DC",
      dcText: "Rede local segura, eficiente e escalavel",
      lightingTitle: "ILUMINACAO PUBLICA",
      lightingText: "Iluminacao LED e controlo",
      chargingTitle: "CARREGAMENTO EV",
      chargingText: "Carregamento DC rapido e fiavel",
      storageTitle: "ARMAZENAMENTO",
      storageText: "Baterias e energia de reserva",
      renewablesTitle: "RENOVAVEIS",
      renewablesText: "Producao solar local",
      loadsTitle: "CARGAS FLEXIVEIS",
      loadsText: "AVAC, bombas, industria e mais",
    },
    transformation: "Transformacao da rede",
    sectionTitle: "Aplicar DC onde a eletrificacao esta a criar nova pressao",
    sectionBody:
      "As redes de baixa tensao tem de acolher novas cargas e ativos distribuidos: carregamento EV, solar fotovoltaico, baterias, iluminacao LED, centros de dados e consumo flexivel. A EVDCGrid acrescenta uma camada DC controlavel a infraestrutura existente, reduzindo conversoes desnecessarias e tornando os sistemas locais de energia mais faceis de monitorizar, expandir e otimizar.",
    highlightTitle: "De infraestrutura passiva para camada ativa de energia",
    highlightBody:
      "Em vez de tratar cada novo ativo como uma ligacao isolada a rede, a EVDCGrid liga iluminacao, carregamento, armazenamento e renovaveis atraves de uma arquitetura DC partilhada com conversao, protecao e monitorizacao centralizadas.",
    values: [
      {
        label: "Reutilizacao",
        title: "Usar o que ja existe",
        text: "Reaproveitar ativos eletricos e caminhos de cabo existentes quando tecnicamente viavel, reduzindo obras civis e friccao na implementacao.",
        Icon: PlugZap,
      },
      {
        label: "Eficiencia",
        title: "Reduzir custos operacionais",
        text: "Melhorar a eficiencia total do sistema ao reduzir etapas de conversao desnecessarias, ajudando a baixar o OPEX da infraestrutura local de energia.",
        Icon: Euro,
      },
      {
        label: "Escala",
        title: "Adicionar ativos progressivamente",
        text: "Integrar carregadores, iluminacao LED, armazenamento, fotovoltaico e cargas inteligentes atraves de uma camada DC modular.",
        Icon: Network,
      },
    ],
    projectsTitle: "Projetos em desenvolvimento",
    viewProject: "Ver projeto",
  },};

const HeroDiagram = () => {
  const { language } = useLanguage();
  const text = homeText[language];
  return (
  <div className="hero-diagram-card" aria-label={text.diagramAria}>
    <div className="hero-diagram-stage">
      <img
        src="/images/hero-dc-diagram-clean.png"
        alt={text.diagramAlt}
        className="hero-diagram-image"
      />

      <div className="hero-diagram-label hero-diagram-label-ac">
        <strong>{text.diagram.acTitle}</strong>
        <span>{text.diagram.acText}</span>
      </div>
      <div className="hero-diagram-label hero-diagram-label-interface">
        <strong>{text.diagram.interfaceTitle}</strong>
        <span>{text.diagram.interfaceText}</span>
      </div>
      <div className="hero-diagram-label hero-diagram-label-dc">
        <strong>{text.diagram.dcTitle}</strong>
        <span>{text.diagram.dcText}</span>
      </div>

      <div className="hero-diagram-app hero-diagram-app-lighting">
        <strong>{text.diagram.lightingTitle}</strong>
        <span>{text.diagram.lightingText}</span>
      </div>
      <div className="hero-diagram-app hero-diagram-app-charging">
        <strong>{text.diagram.chargingTitle}</strong>
        <span>{text.diagram.chargingText}</span>
      </div>
      <div className="hero-diagram-app hero-diagram-app-storage">
        <strong>{text.diagram.storageTitle}</strong>
        <span>{text.diagram.storageText}</span>
      </div>
      <div className="hero-diagram-app hero-diagram-app-renewables">
        <strong>{text.diagram.renewablesTitle}</strong>
        <span>{text.diagram.renewablesText}</span>
      </div>
      <div className="hero-diagram-app hero-diagram-app-loads">
        <strong>{text.diagram.loadsTitle}</strong>
        <span>{text.diagram.loadsText}</span>
      </div>
    </div>
  </div>
  );
};

const Index = () => {
  const { language } = useLanguage();
  const text = homeText[language];
  const common = commonText[language];
  const localizedStructuredData = structuredData.map((item) =>
    item["@type"] === "WebSite" ? { ...item, description: text.structuredDescription } : item
  );
  const projects = [
    {
      title: common.projectTitles.publicLighting,
      href: "/projects/dc-public-lighting-grid",
      Icon: Lightbulb,
      image: publicLightingImage,
    },
    {
      title: common.projectTitles.chargingHub,
      href: "/projects/dc-ev-charging-hub",
      Icon: BatteryCharging,
      image: chargingHubImage,
    },
    {
      title: common.projectTitles.energyCommunities,
      href: "/projects/dc-energy-communities",
      Icon: Network,
      image: energyCommunityImage,
    },
  ];

  return (
  <div className="site-page">
    <Seo
      title={text.seoTitle}
      description={text.seoDescription}
      path="/"
      structuredData={localizedStructuredData}
    />
    <Navbar />

    <main>
      <section className="hero-shell">
        <div className="section-container hero-layout">
          <div className="hero-copy">
            <h1>
              {text.heroLines.map((line) => (
                <span key={line} className="hero-heading-line">{line}</span>
              ))}
            </h1>
            <span className="hero-title-rule" />
            <p>{text.heroBody}</p>
            <div className="hero-actions">
              <Link to="/projects/dc-public-lighting-grid" className="hero-primary-action">
                {text.explore}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/about" className="hero-secondary-action">
                {text.about}
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
                {text.transformation}
                <span className="h-[3px] w-12 rounded-full bg-primary" />
              </span>
              <h2 className="mt-4 max-w-[38rem] text-3xl font-black leading-[1.06] text-foreground sm:text-4xl lg:text-5xl">
                {text.sectionTitle}
              </h2>
              <p className="mt-5 max-w-[39rem] text-base leading-7 text-muted-foreground">
                {text.sectionBody}
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
                      {text.highlightTitle}
                    </h3>
                    <span className="mt-3 block h-[2px] w-10 rounded-full bg-emerald-600" />
                    <p className="mt-4 max-w-lg text-sm leading-6 text-emerald-950/75 sm:text-base">
                      {text.highlightBody}
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div className="relative flex h-full items-end">
              <div className="grid w-full gap-4 lg:ml-auto lg:max-w-[39rem]">
                {text.values.map(({ label, title, text: valueText, Icon }) => (
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
                        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">{valueText}</p>
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
              {text.projectsTitle}
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
                    {text.viewProject}
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
};

export default Index;
