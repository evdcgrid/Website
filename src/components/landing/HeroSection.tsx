import { Link } from "react-router-dom";
import { ArrowRight, Play, MapPin } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/100 via-background/70 via-70% to-background/30" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background via-background/85 to-transparent" />
    </div>

    <div className="section-container relative z-10 py-20">
      <div className="max-w-4xl">
        <h1 className="animate-fade-up-delay-1 text-4xl sm:text-5xl lg:text-7xl font-heading font-black leading-[1.05] tracking-tight">
          Powering EV DC Grid Infrastructure{" "}
          <span className="gradient-text">with the Grid</span>{" "}
          of Today
        </h1>

        <p className="animate-fade-up-delay-2 mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          EVDCGrid transforms existing AC public lighting grids into high-capacity DC infrastructure for EV charging.
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
          <Link
            to="/map"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <MapPin size={16} />
            Map Explorer
          </Link>
        </div>

        {/* Stats bar */}
      </div>
    </div>
  </section>
);

export default HeroSection;
