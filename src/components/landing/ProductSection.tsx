import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ProductSection = () => (
  <section className="py-24">
    <div className="section-container">
      <div className="text-center">
        <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest">Product</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mt-3">
          <span className="gradient-text">GridMaster</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          A modular power conversion and control platform for turning local AC feeds into DC distribution infrastructure for lighting, charging and storage.
        </p>
        <div className="mt-8">
          <Link
            to="/technology"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary"
          >
            Learn more about technology
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default ProductSection;
