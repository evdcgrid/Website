import { BatteryCharging, Building2, Lightbulb, Server, Ship, Warehouse } from "lucide-react";

const projects = [
  { label: "Public lighting DC grids", Icon: Lightbulb },
  { label: "Curbside EV charging", Icon: BatteryCharging },
  { label: "Charging hubs", Icon: Building2 },
  { label: "Ports and logistics", Icon: Ship },
  { label: "Industrial fleets", Icon: Warehouse },
  { label: "DC-ready data centres", Icon: Server },
];

const FocusProjectsBar = () => (
  <section className="border-y border-border bg-background/95">
    <div className="section-container">
      <div className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center">
        <div className="shrink-0 text-xs font-mono font-semibold uppercase tracking-[0.22em] text-primary">
          Focus projects
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
          {projects.map(({ label, Icon }) => (
            <div
              key={label}
              className="flex shrink-0 items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-foreground"
            >
              <Icon className="h-4 w-4 text-primary" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default FocusProjectsBar;
