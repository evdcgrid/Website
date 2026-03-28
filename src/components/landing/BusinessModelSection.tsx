import { Server, Wrench, Monitor } from "lucide-react";

const models = [
  {
    icon: Server,
    title: "Hardware",
    price: "~€52k",
    desc: "RACK01 unit with AC/DC converters, DC protections, and embedded control.",
    features: ["2× 50kW converters", "Full DC protection", "Plug-and-play installation"],
  },
  {
    icon: Wrench,
    title: "Engineering & Consultancy",
    price: "Custom",
    desc: "Grid assessment, system design, installation supervision, and commissioning.",
    features: ["Site assessment", "Grid modeling", "Installation support"],
  },
  {
    icon: Monitor,
    title: "SaaS Platform",
    price: "~€50/month",
    desc: "Per-grid monitoring, analytics, predictive maintenance, and remote control.",
    features: ["Real-time monitoring", "Predictive maintenance", "Remote management"],
  },
];

const BusinessModelSection = () => (
  <section className="py-24 bg-card/50">
    <div className="section-container">
      <div className="text-center mb-16">
        <span className="text-xs font-mono font-medium text-accent uppercase tracking-widest">Revenue</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mt-3">
          Business <span className="gradient-text">Model</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {models.map((m, i) => (
          <div
            key={m.title}
            className={`rounded-lg border p-8 transition-all ${
              i === 0
                ? "border-primary/40 bg-primary/5 glow-primary"
                : "border-border bg-card hover:border-primary/20"
            }`}
          >
            <div className="inline-flex rounded-md bg-primary/10 p-2.5 mb-4">
              <m.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg">{m.title}</h3>
            <div className="text-2xl font-heading font-black text-primary mt-2">{m.price}</div>
            <p className="text-sm text-muted-foreground mt-3">{m.desc}</p>
            <ul className="mt-4 space-y-2">
              {m.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BusinessModelSection;
