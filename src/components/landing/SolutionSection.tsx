import { Cable, Zap, ArrowRightLeft, BatteryCharging } from "lucide-react";

const features = [
  {
    icon: ArrowRightLeft,
    title: "AC → DC Conversion",
    description: "Converts existing 3-phase AC public lighting grids into 2× 1400V DC lines without replacing cables.",
  },
  {
    icon: Cable,
    title: "Existing 4-Wire System",
    description: "Uses existing 4-wire infrastructure (3 phase + neutral) — no civil works, no disruption.",
  },
  {
    icon: Zap,
    title: "4× More Capacity",
    description: "DC operation unlocks up to 4× the power capacity from the same cables.",
  },
  {
    icon: BatteryCharging,
    title: "EV Charging Ready",
    description: "Seamlessly integrate EV chargers into the public lighting network.",
  },
];

const SolutionSection = () => (
  <section id="solution" className="py-24 bg-card/50">
    <div className="section-container">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs font-mono font-medium text-accent uppercase tracking-widest">Our Solution</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mt-3">
            The Smartest Path to{" "}
            <span className="gradient-text">EV Infrastructure</span>
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            EVDCGRID converts existing AC public lighting grids into high-capacity DC grids. By reusing 98% of existing infrastructure, we deliver EV charging capability at 41% lower cost and 75% faster deployment.
          </p>

          {/* AC vs DC visual */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <div className="text-xs font-mono text-muted-foreground mb-2">BEFORE (AC)</div>
              <div className="font-mono text-sm text-muted-foreground">
                3 Phase + Neutral<br />
                Limited capacity<br />
                Lighting only
              </div>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 glow-primary">
              <div className="text-xs font-mono text-primary mb-2">AFTER (DC)</div>
              <div className="font-mono text-sm text-foreground">
                2× 1400V DC Lines<br />
                4× Capacity<br />
                Lighting + EV Charging
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30"
            >
              <div className="mb-4 inline-flex rounded-md bg-primary/10 p-2.5">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-sm">{f.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default SolutionSection;
