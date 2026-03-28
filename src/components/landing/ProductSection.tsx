import { Cpu, Shield, BarChart3, Plug } from "lucide-react";

const specs = [
  { icon: Cpu, title: "2× 50kW AC/DC Converters", desc: "Programmable, high-efficiency power conversion" },
  { icon: Shield, title: "DC Protections", desc: "Integrated safety and fault detection systems" },
  { icon: BarChart3, title: "Embedded Microprocessor", desc: "Real-time grid monitoring and control" },
  { icon: Plug, title: "EV + Lighting", desc: "Simultaneous power for luminaires and chargers" },
];

const ProductSection = () => (
  <section className="py-24">
    <div className="section-container">
      <div className="text-center mb-16">
        <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest">Product</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mt-3">
          RACK01 / <span className="gradient-text">MasterGrid01</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          A modular, intelligent power conversion rack that transforms any public lighting grid into a DC-powered EV charging network.
        </p>
      </div>

      {/* Product visual */}
      <div className="relative mx-auto max-w-3xl">
        <div className="rounded-xl border border-border bg-card p-8 sm:p-12 glow-primary animate-pulse-glow">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-heading font-black text-primary">100</div>
              <div className="text-xs text-muted-foreground mt-1">kW Total Power</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-black text-accent">2×</div>
              <div className="text-xs text-muted-foreground mt-1">DC Lines</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-black text-primary">1400V</div>
              <div className="text-xs text-muted-foreground mt-1">DC Output</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-black text-accent">24/7</div>
              <div className="text-xs text-muted-foreground mt-1">Monitoring</div>
            </div>
          </div>

          <div className="circuit-line w-full my-8" />

          <div className="grid sm:grid-cols-2 gap-4">
            {specs.map((s) => (
              <div key={s.title} className="flex gap-3 items-start">
                <div className="rounded-md bg-primary/10 p-2 shrink-0">
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ProductSection;
