import Navbar from "@/components/Navbar";
import rackImage from "@/assets/rack01-product.png";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Cpu, Shield, Zap, Radio, Globe, Gauge, BatteryCharging, CircuitBoard } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const techSpecs = [
  { parameter: "AC Input", value: "230 / 400V AC · 50 Hz" },
  { parameter: "DC Output", value: "700V DC" },
  { parameter: "Power Range", value: "50 kW – 200 kW" },
  { parameter: "DC Protection", value: "Solid-State Circuit Breakers (SSCB)" },
  { parameter: "AC Protection", value: "Circuit breakers + residual current protection" },
  { parameter: "Communication", value: "PLC (Power Line Communication)" },
  { parameter: "Protocols", value: "IPv6 ready · OCPP" },
  { parameter: "Monitoring", value: "Self EMS (Energy Management System)" },
];

const features = [
  { icon: Zap, title: "High-Efficiency Conversion", desc: "Programmable AC/DC converters with up to 200 kW output for maximum grid utilisation." },
  { icon: Shield, title: "Advanced Protection", desc: "Solid-state circuit breakers provide ultra-fast DC fault isolation in microseconds." },
  { icon: Radio, title: "PLC Communication", desc: "Data travels over existing power cables — no extra communication wiring required." },
  { icon: Globe, title: "IPv6 & OCPP Ready", desc: "Future-proof connectivity with open charge point protocol for seamless EV integration." },
  { icon: Gauge, title: "Self EMS", desc: "Built-in energy management system monitors, optimises, and reports in real-time." },
  { icon: BatteryCharging, title: "Dual Purpose", desc: "Simultaneously powers LED luminaires and EV chargers from the same DC grid." },
];

const ProductPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Seo
      title="RACK01 / MasterGrid01 product overview"
      description="Explore the RACK01 / MasterGrid01 modular power conversion rack for public lighting grids, DC output, PLC communication and EV charging readiness."
      path="/product"
    />
    <Navbar />

    {/* Hero */}
    <section className="pt-32 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" />
      <div className="section-container relative z-10 text-center">
        <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest">Product</span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black mt-4">
          <span className="gradient-text">GridMaster</span>
        </h1>
        <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg">
          A modular, intelligent power conversion rack that transforms any public lighting grid into a high-capacity DC network for EV charging.
        </p>
      </div>
      {/* Product image */}
      <div className="mt-12 max-w-2xl mx-auto">
        <div className="rounded-xl border border-border bg-card p-4 glow-primary">
          <img
            src={rackImage}
            alt="GridMaster — Modular power conversion rack"
            className="w-full rounded-lg"
          />
        </div>
      </div>
    </section>

    {/* Key stats */}
    <section className="pb-20">
      <div className="section-container">
        <div className="rounded-xl border border-border bg-card p-8 sm:p-12 glow-primary max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-heading font-black text-primary">200</div>
              <div className="text-xs text-muted-foreground mt-1">kW Max Power</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-black text-accent">700V</div>
              <div className="text-xs text-muted-foreground mt-1">DC Output</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-black text-primary">SSCB</div>
              <div className="text-xs text-muted-foreground mt-1">DC Protection</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-black text-accent">24/7</div>
              <div className="text-xs text-muted-foreground mt-1">Self EMS</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Technical Specifications Table */}
    <section className="pb-24">
      <div className="section-container max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest">Specifications</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black mt-3">Technical Details</h2>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-primary font-mono text-xs uppercase tracking-wider w-1/3">Parameter</TableHead>
                <TableHead className="text-primary font-mono text-xs uppercase tracking-wider">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {techSpecs.map((spec) => (
                <TableRow key={spec.parameter} className="border-border">
                  <TableCell className="font-semibold text-foreground">{spec.parameter}</TableCell>
                  <TableCell className="text-muted-foreground">{spec.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>

    {/* Features grid */}
    <section className="pb-24">
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest">Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black mt-3">Built for the Grid of Tomorrow</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:glow-primary">
              <div className="rounded-md bg-primary/10 p-3 w-fit mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default ProductPage;
