const milestones = [
  { year: "2026", title: "Pilot Validation", desc: "First pilot deployment and technology validation with municipality partner.", active: true },
  { year: "2027", title: "First 3 Projects", desc: "Commercial deployment of 3 grid conversion projects in Portugal.", active: false },
  { year: "2028", title: "Scale Up", desc: "Expand to 10+ projects. Establish partnerships with utilities and OEMs.", active: false },
  { year: "2030", title: "International Expansion", desc: "Enter European markets: Spain, France, Germany. 100+ grids converted.", active: false },
];

const RoadmapSection = () => (
  <section className="py-24">
    <div className="section-container">
      <div className="text-center mb-16">
        <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest">Timeline</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mt-3">
          Road<span className="gradient-text">map</span>
        </h2>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

        <div className="space-y-12">
          {milestones.map((m, i) => (
            <div
              key={m.year}
              className={`relative flex items-start gap-8 ${
                i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10">
                <div
                  className={`h-3 w-3 rounded-full border-2 ${
                    m.active
                      ? "border-primary bg-primary glow-primary"
                      : "border-muted-foreground/30 bg-card"
                  }`}
                />
              </div>

              {/* Content */}
              <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-8">
                <div
                  className={`rounded-lg border p-6 ${
                    m.active
                      ? "border-primary/30 bg-primary/5 glow-primary"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="font-mono text-xs text-primary">{m.year}</div>
                  <h3 className="font-heading font-bold mt-1">{m.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{m.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default RoadmapSection;
