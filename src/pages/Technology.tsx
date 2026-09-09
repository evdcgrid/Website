import { Euro, ExternalLink, Gauge, Globe, Layers3, PlugZap, Quote, ShieldCheck, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const advantages = [
  {
    title: "Fewer conversion stages",
    text: "PV, batteries, EVs, LEDs and electronics already use DC internally. A DC architecture reduces repeated AC/DC conversion.",
    Icon: PlugZap,
  },
  {
    title: "Higher system efficiency",
    text: "Fewer conversion steps can reduce losses, equipment complexity and unnecessary power exchanges.",
    Icon: Zap,
  },
  {
    title: "Simpler integration of storage and renewables",
    text: "A common DC layer makes it easier to integrate batteries, PV, EV chargers and flexible loads.",
    Icon: Layers3,
  },
  {
    title: "Lower OPEX",
    text: "Higher total system efficiency and fewer unnecessary conversion stages can reduce operational energy losses and maintenance complexity.",
    Icon: Euro,
  },
  {
    title: "Local balancing and control",
    text: "Power flows can be measured and managed locally, improving visibility and resilience.",
    Icon: Gauge,
  },
  {
    title: "Reduced grid reinforcement pressure",
    text: "By reusing existing infrastructure and managing power locally, DC systems can reduce dependence on long reinforcement cycles.",
    Icon: ShieldCheck,
  },
];

// TODO: verify exact quote wording and source URLs before publication.
const validationReferences = [
  {
    quote: "Direct current is an essential tool to make energy in Europe more sustainable.",
    author: "Yannick Neyret",
    role: "President, Current/OS",
    sourceLabel: "odca.zvei.org",
    url: "https://odca.zvei.org/",
  },
  {
    quote: "DC systems are key to unlocking the next generation of resilient, efficient infrastructure.",
    author: "Axel Schlumberger",
    role: "SVP R&D, Southwire",
    sourceLabel: "southwire.com",
    url: "https://www.southwire.com/",
  },
  {
    quote: "The next decades will be the age of HVDC.",
    author: "Andreas Schierenbeck",
    role: "CEO, Hitachi Energy",
    sourceLabel: "mckinsey.com",
    url: "https://www.mckinsey.com/",
  },
  {
    quote: "Public charging capacity for light-duty EVs would need to grow by almost ninefold to 2030.",
    author: "IEA",
    role: "Global EV Outlook 2025",
    sourceLabel: "iea.org",
    url: "https://www.iea.org/reports/global-ev-outlook-2025",
    signal: true,
  },
];

const TechnologyPage = () => (
  <div className="site-page">
    <Seo
      title="Why DC, Why now"
      description="Why Direct Current is relevant for local electrification, and how EVDCGrid applies DC infrastructure to connect renewables, storage, lighting, EV charging and flexible loads."
      path="/technology"
    />
    <Navbar />

    <main>
      <section className="site-section-strong relative overflow-hidden border-b border-border pt-28 lg:pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/92 to-surface/90" />
        <div className="section-container relative py-16 lg:py-24">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">Technology</span>
          <div className="mt-5 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <h1 className="text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Why DC, Why now
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Many of the assets driving electrification already operate natively in DC: solar PV, batteries, electric
              vehicles, LEDs, electronics and power converters. Yet most local energy systems still convert power back
              and forth through AC infrastructure. A DC layer reduces unnecessary conversion steps and creates a simpler
              interface between generation, storage and flexible loads.
            </p>
          </div>
        </div>
      </section>

      <section className="site-section-soft py-20 lg:py-24">
        <div className="section-container">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr]">
            <div>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">Our approach</h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                EVDCGrid designs DC-based local energy architectures inspired by the principles behind Current/OS:
                interoperable DC systems, safe electrical protection, self-regulating power behaviour and smoother
                integration between DC microgrids and the existing AC grid. Our objective is not to replace the AC grid,
                but to add a controllable DC layer where it creates technical and economic value.
              </p>
            </div>
            <article className="rounded-lg border border-[#2d16d7]/30 bg-[#2d16d7] p-6 text-white shadow-[0_18px_38px_hsl(249_82%_46%/0.22)]">
              <h3 className="flex flex-wrap items-center gap-2 text-xl font-bold text-white">
                <span>Following the direction of</span>
                <img
                  src="/images/current-os-logo.png"
                  alt="Current/OS"
                  className="h-10 w-auto max-w-[16rem] rounded-sm px-2 py-1"
                />
              </h3>
              <p className="mt-4 text-sm leading-6 text-white/82">
                Current/OS is helping define rules for safe, interoperable DC microgrids. EVDCGrid follows this direction
                by designing DC architectures that prioritise interoperability, safety, modularity and grid-aware
                operation.
              </p>
              <a
                href="https://currentos.org/"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/35 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#2d16d7]"
              >
                Learn more about Current/OS
                <ExternalLink className="h-4 w-4" />
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="site-section py-20 lg:py-24">
        <div className="section-container">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-black text-foreground sm:text-4xl">Advantages of DC</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map(({ title, text, Icon }) => (
              <article
                key={title}
                className="rounded-lg border border-emerald-300/60 bg-emerald-50/90 p-6 shadow-[0_14px_34px_hsl(158_64%_32%/0.10)]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-emerald-300/70 bg-white/80 text-emerald-700 shadow-inner">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-emerald-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-emerald-950/75">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section relative overflow-hidden border-t border-border py-16 lg:py-20">
        <div className="absolute inset-0 grid-pattern opacity-[0.14]" />
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="section-container relative">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">
              Industry validation
            </span>
            <h2 className="mt-3 text-2xl font-black leading-tight text-foreground sm:text-3xl lg:text-4xl">
              Why the market is moving toward smarter DC infrastructure
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              External voices and market signals point to the same direction: electrification requires more efficient,
              flexible and grid-aware infrastructure.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {validationReferences.map(({ quote, author, role, sourceLabel, url, signal }) => (
              <article
                key={`${author}-${sourceLabel}`}
                className="group relative overflow-hidden rounded-lg border border-primary/15 bg-background/95 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_14px_34px_hsl(214_42%_34%/0.10)] sm:p-5"
              >
                <Quote className="absolute right-5 top-4 h-12 w-12 text-primary/[0.08]" aria-hidden="true" />
                <div className="relative">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md border border-primary/15 bg-primary/5 text-primary">
                    {signal ? <Globe className="h-4 w-4" /> : <Quote className="h-4 w-4" />}
                  </div>
                  <p className="text-base font-bold leading-7 text-foreground">"{quote}"</p>
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-sm font-semibold text-foreground">{author}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{role}</p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-widest text-primary">
                        {sourceLabel}
                      </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Read source from ${sourceLabel}`}
                        className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        Read source
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default TechnologyPage;
