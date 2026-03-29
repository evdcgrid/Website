import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TrendingDown, Zap, Cable, MapPin, CheckCircle2 } from "lucide-react";

const acExcavation = [
  { item: "Mechanical Excavation", range: "25€ - 40€/m³", value: "25€/m³" },
  { item: "Trench Opening & Closing (Urban)", range: "80€ - 120€", value: "80€" },
  { item: "Cabling & Piping", range: "20€ - 30€", value: "20€" },
  { item: "Labour & Licensing", range: "150€ - 200€/m", value: "150€/m" },
  { item: "Distance", range: "400 - 800m", value: "400m" },
];

const acObras = [
  { item: "Project Design", value: 2500 },
  { item: "Licensing", value: 400 },
  { item: "QGBT Output", value: 2500 },
  { item: "AIP", value: 2500 },
  { item: "Construction", value: 15000 },
  { item: "Installation", value: 22900 },
];

const dcItems = [
  { item: "Rack", value: 104000 },
  { item: "LED Lamps", value: 4500 },
  { item: "Licensing", value: 300 },
  { item: "Installation", value: 11650 },
];

const totalAC = 132900 * 3;
const totalDC = 120450;
const savingsPercent = ((totalAC - totalDC) / totalAC) * 100;

const fmt = (n: number) => n.toLocaleString("de-DE");

const CaseStudyPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="section-container relative z-10">
          <div className="flex items-center gap-2 text-primary mb-4">
            <MapPin size={18} />
            <span className="text-sm font-mono font-semibold tracking-wider uppercase">Areeiro, Lisbon</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-4 leading-tight">
            Case Study:<br />
            <span className="text-primary">Areeiro Neighbourhood</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Comparative cost analysis between traditional AC public lighting infrastructure and the DC Grid system, demonstrating significant savings in civil works and installation.
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="section-container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-border bg-card p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider mb-2">Total AC Cost</p>
              <p className="text-3xl font-heading font-black text-destructive">{fmt(totalAC)} €</p>
              <p className="text-xs text-muted-foreground mt-1">Traditional system</p>
            </div>
          </div>
          <div className="rounded-xl border border-primary/30 bg-card p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider mb-2">Total DC Cost</p>
              <p className="text-3xl font-heading font-black text-primary">{fmt(totalDC)} €</p>
              <p className="text-xs text-muted-foreground mt-1">DC Grid system</p>
            </div>
          </div>
          <div className="rounded-xl border border-accent/30 bg-card p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider mb-2">Savings</p>
              <p className="text-3xl font-heading font-black text-accent">
                {savingsPercent.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %
              </p>
              <p className="text-xs text-muted-foreground mt-1">{fmt(totalAC - totalDC)} € saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Tables */}
      <section className="section-container pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AC Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Cable size={20} className="text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold">Traditional AC System</h2>
                <p className="text-sm text-muted-foreground">Conventional infrastructure</p>
              </div>
            </div>

            {/* Excavation */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/30">
                <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground">Excavation</h3>
              </div>
              <div className="divide-y divide-border">
                {acExcavation.map((row) => (
                  <div key={row.item} className="flex items-center justify-between px-5 py-3 text-sm">
                    <div>
                      <p className="text-foreground font-medium">{row.item}</p>
                      <p className="text-xs text-muted-foreground">{row.range}</p>
                    </div>
                    <span className="font-mono font-semibold text-foreground">{row.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-5 py-3 bg-secondary/20">
                  <span className="text-sm font-semibold text-foreground">Works Subtotal</span>
                  <span className="font-mono font-bold text-foreground">{fmt(110000)} €</span>
                </div>
              </div>
            </div>

            {/* Works */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/30">
                <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground">Works & Installation</h3>
              </div>
              <div className="divide-y divide-border">
                {acObras.map((row) => (
                  <div key={row.item} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="text-foreground font-medium">{row.item}</span>
                    <span className="font-mono font-semibold text-foreground">{fmt(row.value)} €</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AC Total */}
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 flex items-center justify-between">
              <span className="text-lg font-heading font-bold">Total AC</span>
              <span className="text-2xl font-heading font-black text-destructive">{fmt(totalAC)} €</span>
            </div>
          </div>

          {/* DC Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold">DC Grid System</h2>
                <p className="text-sm text-muted-foreground">Optimised infrastructure</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/30">
                <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground">Components</h3>
              </div>
              <div className="divide-y divide-border">
                {dcItems.map((row) => (
                  <div key={row.item} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="text-foreground font-medium">{row.item}</span>
                    <span className="font-mono font-semibold text-foreground">{fmt(row.value)} €</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DC Total */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex items-center justify-between">
              <span className="text-lg font-heading font-bold">Total DC</span>
              <span className="text-2xl font-heading font-black text-primary">{fmt(totalDC)} €</span>
            </div>

            {/* Advantages */}
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 space-y-4">
              <h3 className="text-lg font-heading font-bold text-accent">DC Grid Advantages</h3>
              <ul className="space-y-3">
                {[
                  "No excavation — full elimination of civil works",
                  "Faster and less disruptive installation",
                  "Lower licensing and project design costs",
                  "Modular and scalable infrastructure",
                ].map((text) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Savings Bar */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Savings</span>
                <div className="flex items-center gap-1 text-accent">
                  <TrendingDown size={16} />
                  <span className="font-mono font-bold">
                    {savingsPercent.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %
                  </span>
                </div>
              </div>
              <div className="w-full h-4 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                  style={{ width: `${savingsPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>0 €</span>
                <span className="font-semibold text-accent">{fmt(totalAC - totalDC)} € saved</span>
                <span>{fmt(totalAC)} €</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CaseStudyPage;
