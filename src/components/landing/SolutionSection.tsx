import { BatteryCharging, Cable, Gauge, PlugZap, Zap } from "lucide-react";
import gridDiagram from "@/assets/dc-lighting-grid-diagram.png";

const features = [
  {
    icon: Zap,
    title: "Native DC Backbone",
    description: "Moves power as DC where new electrical assets already need DC, reducing repeated AC/DC conversion stages.",
  },
  {
    icon: Cable,
    title: "Existing Conductors",
    description: "Reuses available electrical corridors and cabling instead of making civil works the default answer.",
  },
  {
    icon: Gauge,
    title: "Higher Utilisation",
    description: "DC operation can unlock more usable power from the same physical infrastructure.",
  },
  {
    icon: BatteryCharging,
    title: "EV Charging Ready",
    description: "Connects distributed EV charging, storage and power electronics directly to the DC network.",
  },
  {
    icon: PlugZap,
    title: "DC Loads by Design",
    description: "Solar PV, batteries, EVs, LEDs and modern electronics all converge naturally around DC.",
  },
];

const SolutionSection = () => (
  <section id="solution" className="py-24 bg-card/50">
    <div className="section-container">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs font-mono font-medium text-accent uppercase tracking-widest">Our Solution</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mt-3">
            A DC layer for the{" "}
            <span className="gradient-text">electrification era</span>
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            EVDCGrid is building practical DC distribution systems for the places where electrification pressure is growing fastest: public lighting grids, EV charging corridors, charging hubs, logistics sites and high-density electrical loads.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Instead of converting AC to DC at every endpoint, we centralise conversion and distribute DC closer to the assets that actually consume or store energy.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <div className="text-xs font-mono text-muted-foreground mb-2">BEFORE (AC)</div>
              <div className="font-mono text-sm text-muted-foreground">
                Repeated conversion<br />
                Endpoint complexity<br />
                AC-first legacy design
              </div>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 glow-primary">
              <div className="text-xs font-mono text-primary mb-2">AFTER (DC)</div>
              <div className="font-mono text-sm text-foreground">
                Central conversion<br />
                DC-native assets<br />
                Lighting + EV + storage
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <img
              src={gridDiagram}
              alt="Bipolar DC grid supplying LED lighting and EV chargers"
              className="mx-auto max-h-[420px] w-auto"
              loading="lazy"
            />
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
    </div>
  </section>
);

export default SolutionSection;
