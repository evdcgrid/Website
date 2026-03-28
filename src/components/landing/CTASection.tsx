import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, FileText } from "lucide-react";

const CTASection = () => (
  <section className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 grid-pattern opacity-10" />
    <div className="section-container relative z-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black">
          Ready to <span className="gradient-text">Transform</span> Your Grid?
        </h2>
        <p className="text-muted-foreground mt-4">
          Run our simulator to estimate your grid's DC conversion potential, or get in touch with our team.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/simulation"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary"
          >
            Simulate Your Grid
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <Mail size={16} />
            Contact Us
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <MapPin size={16} />
            Map Explorer
          </Link>
          <Link
            to="/case-study"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <FileText size={16} />
            Case Study
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
