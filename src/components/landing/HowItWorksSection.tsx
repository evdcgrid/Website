import { Server, Lightbulb, Zap, Car } from "lucide-react";

const steps = [
  {
    icon: Server,
    step: "01",
    title: "Install GridMaster",
    desc: "Deploy the conversion rack at the LV transformation point.",
  },
  {
    icon: Lightbulb,
    step: "02",
    title: "Replace Luminaires",
    desc: "Swap AC bulbs with DC LED luminaires — existing cables stay.",
  },
  {
    icon: Zap,
    step: "03",
    title: "Grid Goes DC",
    desc: "The public lighting grid becomes a 1400V DC power network.",
  },
  {
    icon: Car,
    step: "04",
    title: "Enable EV Charging",
    desc: "Integrate EV chargers directly into the DC grid infrastructure.",
  },
];

const HowItWorksSection = () => (
  <section className="py-24 bg-card/50">
    <div className="section-container">
      <div className="text-center mb-16">
        <span className="text-xs font-mono font-medium text-accent uppercase tracking-widest">Process</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mt-3">
          How It <span className="gradient-text">Works</span>
        </h2>
      </div>

      <div className="relative">
        {/* Connection line */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-card">
                <s.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="text-xs font-mono text-primary mb-2">{s.step}</div>
              <h3 className="font-heading font-bold">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
