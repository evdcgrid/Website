import { useEffect, useRef, useState } from "react";
import { TrendingUp, AlertTriangle, Plug, Car } from "lucide-react";

const stats = [
  { icon: TrendingUp, value: 9, suffix: "×", label: "More EV charging capacity needed in Europe", color: "text-primary" },
  { icon: AlertTriangle, value: 100, suffix: "B€", label: "Investment required in infrastructure", color: "text-accent" },
  { icon: Plug, value: 40, suffix: "%", label: "Of costs are grid infrastructure alone", color: "text-primary" },
  { icon: Car, value: 2, suffix: "×", label: "Europe's EV fleet will double by 2030", color: "text-accent" },
];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const duration = 1500;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <div ref={ref}>{count}{suffix}</div>;
};

const ProblemSection = () => (
  <section className="py-24 relative">
    <div className="absolute inset-0 grid-pattern opacity-10" />
    <div className="section-container relative z-10">
      <div className="text-center mb-16">
        <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest">The Challenge</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mt-3">
          Europe's Grid <span className="gradient-text">Can't Keep Up</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          The transition to electric mobility demands massive grid upgrades. Current approaches are too slow and expensive.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 hover:glow-primary"
          >
            <stat.icon className={`h-8 w-8 ${stat.color} mb-4`} />
            <div className={`text-4xl font-heading font-black ${stat.color}`}>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
