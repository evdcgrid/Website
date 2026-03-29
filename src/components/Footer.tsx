import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import logo from "@/assets/logo_c_white.svg";

const Footer = () => (
  <footer className="border-t border-border bg-card py-12">
    <div className="section-container">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="EVDCGRID" className="h-[30px] w-auto text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Transforming public lighting grids into DC infrastructure for EV charging.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Navigation</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/simulation" className="text-sm text-muted-foreground hover:text-primary transition-colors">Simulation</Link>
            <Link to="/map" className="text-sm text-muted-foreground hover:text-primary transition-colors">Map Explorer</Link>
            <Link to="/case-study" className="text-sm text-muted-foreground hover:text-primary transition-colors">Case Study</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Technology</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>DC Grid Conversion</span>
            <span>GridMaster System</span>
            <span>SaaS Platform</span>
            <span>Grid Monitoring</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>info@evdcgrid.com</span>
            <span>Lisbon, Portugal</span>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} EVDCGRID. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
