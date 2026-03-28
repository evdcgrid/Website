import { Zap, Recycle, PiggyBank, Clock, Plug } from "lucide-react";

const benefits = [
  { icon: Zap, title: "4× More Power", desc: "Capacity from existing infrastructure", value: "4×" },
  { icon: Recycle, title: "98% Reuse", desc: "Of existing cables and infrastructure", value: "98%" },
  { icon: PiggyBank, title: "41% Savings", desc: "Cost reduction vs traditional approach", value: "41%" },
  { icon: Clock, title: "75% Faster", desc: "Deployment timeline", value: "75%" },
  { icon: Plug, title: "EV Ready", desc: "Integrated charging infrastructure", value: "∞" },
];

const BenefitsSection = () => (
  <section className="py-24">
    <div className="section-container">
      <div className="text-center mb-16">
        <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest">Advantages</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mt-3">
          Why <span className="gradient-text">EVDCGRID</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="group rounded-lg border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:glow-primary"
          >
            <div className="mx-auto mb-3 inline-flex rounded-full bg-primary/10 p-3">
              <b.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-heading font-black gradient-text">{b.value}</div>
            <h3 className="font-semibold text-sm mt-2">{b.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
