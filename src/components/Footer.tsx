import { Link } from "react-router-dom";
import logo from "@/assets/logo_c_black.svg";

const Footer = () => (
  <footer className="site-footer border-t border-border py-12">
    <div className="section-container">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <img src={logo} alt="EVDCGRID" className="h-[30px] w-auto text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            DC-based infrastructure solutions for renewables, storage, public lighting, EV charging and flexible loads.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Navigation</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">Home</Link>
            <Link to="/technology" className="text-sm text-muted-foreground transition-colors hover:text-primary">Technology</Link>
            <Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-primary">About Us</Link>
            <Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">Contact Us</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Projects</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/projects/dc-public-lighting-grid" className="transition-colors hover:text-primary">
              DC Public Lighting Grid
            </Link>
            <Link to="/projects/dc-ev-charging-hub" className="transition-colors hover:text-primary">
              DC EV Charging Hub
            </Link>
            <Link to="/projects/dc-energy-communities" className="transition-colors hover:text-primary">
              DC for Energy Communities
            </Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="mailto:geral@evdcgrid.pt" className="transition-colors hover:text-primary">geral@evdcgrid.pt</a>
            <span>Lisbon, Portugal</span>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} EVDCGRID. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
