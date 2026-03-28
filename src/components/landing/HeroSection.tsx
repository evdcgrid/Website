import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
    </div>

    <div className="section-container relative z-10 py-20">
      <div className="max-w-4xl">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-8">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-mono font-medium text-primary">Deep-Tech Energy Innovation</span>
        </div>

        <h1 className="animate-fade-up-delay-1 text-4xl sm:text-5xl lg:text-7xl font-heading font-black leading-[1.05] tracking-tight">
          Powering the Future{" "}
          <span className="gradient-text">with the Grid</span>{" "}
          of Today
        </h1>

        <p className="animate-fade-up-delay-2 mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Transforming existing AC public lighting grids into high-capacity DC infrastructure for EV charging.
        </p>

        <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap gap-4">
          <a
            href="#solution"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary"
          >
            Explore the Solution
            <ArrowRight size={16} />
          </a>
          <Link
            to="/simulation"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <Play size={16} />
            Run Simulation
          </Link>
        </div>

        {/* Stats bar */}
        <div className="animate-fade-up-delay-3 mt-16 grid grid-cols-3 gap-6 border-t border-border pt-8 max-w-lg">
          {[
            { value: "9×", label: "More charging capacity needed" },
            { value: "€100B", label: "Investment required in EU" },
            { value: "98%", label: "Infrastructure reuse" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl font-heading font-black text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
