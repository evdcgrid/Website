import { Battery, Cable, Cpu, Gauge, Plug, Zap } from "lucide-react";

const benefits = [
  { icon: Zap, title: "Fewer Conversions", desc: "Less AC/DC conversion duplicated across endpoints.", value: "01" },
  { icon: Gauge, title: "More Usable Capacity", desc: "Better utilisation of conductors and voltage windows.", value: "02" },
  { icon: Cable, title: "Infrastructure Reuse", desc: "Existing corridors, poles and cables stay valuable.", value: "03" },
  { icon: Battery, title: "Storage Integration", desc: "Batteries connect naturally to a DC architecture.", value: "04" },
  { icon: Cpu, title: "DC-Native Loads", desc: "EVs, LEDs, PV, electronics and data-centre loads align.", value: "05" },
  { icon: Plug, title: "Modular Deployment", desc: "Distributed charging and power modules scale by site.", value: "06" },
];

const BenefitsSection = () => (
  <section className="py-24">
    <div className="section-container">
      <div className="text-center mb-16">
        <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest">DC advantages</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mt-3">
          Why DC over <span className="gradient-text">AC for new assets</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          AC remains essential for transmission and legacy distribution. The opportunity is to stop forcing every new DC asset to behave like an AC load.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 hover:glow-primary"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="inline-flex rounded-full bg-primary/10 p-3">
                <b.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="font-mono text-sm font-bold text-primary/70">{b.value}</div>
            </div>
            <h3 className="font-semibold">{b.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
