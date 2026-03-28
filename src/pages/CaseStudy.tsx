import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TrendingDown, Zap, Cable, Wrench, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

const acExcavation = [
  { item: "Escavação Mecânica", range: "25€ - 40€/m³", value: "25€/m³" },
  { item: "Abertura e Fecho de Vala (Ambiente Urbano)", range: "80€ - 120€", value: "80€" },
  { item: "Cablagem e Tubagem", range: "20€ - 30€", value: "20€" },
  { item: "Mão de Obra e Licenciamento", range: "150€ - 200€/m", value: "150€/m" },
  { item: "Distância", range: "400 - 800m", value: "400m" },
];

const acObras = [
  { item: "Projeto", value: 2500 },
  { item: "Licenciamento", value: 400 },
  { item: "Saída QGBT", value: 2500 },
  { item: "AIP", value: 2500 },
  { item: "Construção", value: 15000 },
  { item: "Instalação", value: 22900 },
];

const dcItems = [
  { item: "Rack", value: 52000 },
  { item: "Lâmpadas", value: 4500 },
  { item: "Instalação", value: 40000 },
];

const totalAC = 132900;
const totalDC = 96500;
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
            <span className="text-sm font-mono font-semibold tracking-wider uppercase">Areeiro, Lisboa</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-4 leading-tight">
            Caso de Estudo:<br />
            <span className="text-primary">Bairro no Areeiro</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Análise comparativa de custos entre infraestrutura de iluminação pública tradicional (AC) e o sistema DC Grid, demonstrando poupanças significativas em obra civil e instalação.
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="section-container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-border bg-card p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider mb-2">Custo Total AC</p>
              <p className="text-3xl font-heading font-black text-destructive">{fmt(totalAC)} €</p>
              <p className="text-xs text-muted-foreground mt-1">Sistema tradicional</p>
            </div>
          </div>
          <div className="rounded-xl border border-primary/30 bg-card p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider mb-2">Custo Total DC</p>
              <p className="text-3xl font-heading font-black text-primary">{fmt(totalDC)} €</p>
              <p className="text-xs text-muted-foreground mt-1">Sistema DC Grid</p>
            </div>
          </div>
          <div className="rounded-xl border border-accent/30 bg-card p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider mb-2">Poupança</p>
              <p className="text-3xl font-heading font-black text-accent">
                {savingsPercent.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %
              </p>
              <p className="text-xs text-muted-foreground mt-1">{fmt(totalAC - totalDC)} € de poupança</p>
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
                <h2 className="text-xl font-heading font-bold">Sistema AC Tradicional</h2>
                <p className="text-sm text-muted-foreground">Infraestrutura convencional</p>
              </div>
            </div>

            {/* Escavação */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/30">
                <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground">Escavação</h3>
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
                  <span className="text-sm font-semibold text-foreground">Subtotal Obras</span>
                  <span className="font-mono font-bold text-foreground">{fmt(110000)} €</span>
                </div>
              </div>
            </div>

            {/* Obras */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/30">
                <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground">Obras & Instalação</h3>
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
                <h2 className="text-xl font-heading font-bold">Sistema DC Grid</h2>
                <p className="text-sm text-muted-foreground">Infraestrutura otimizada</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/30">
                <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground">Componentes</h3>
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
              <h3 className="text-lg font-heading font-bold text-accent">Vantagens DC Grid</h3>
              <ul className="space-y-3">
                {[
                  "Sem escavação — eliminação total de obra civil",
                  "Instalação mais rápida e menos disruptiva",
                  "Menor custo de licenciamento e projeto",
                  "Infraestrutura modular e escalável",
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
                <span className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Poupança</span>
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
                <span className="font-semibold text-accent">{fmt(totalAC - totalDC)} € poupados</span>
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
