import { Link } from "react-router-dom";
import logo from "@/assets/logo_c_black.svg";
import { commonText, useLanguage } from "@/lib/language";

const Footer = () => {
  const { language } = useLanguage();
  const t = commonText[language];

  return (
    <footer className="site-footer border-t border-border py-12">
      <div className="section-container">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <img src={logo} alt="EVDCGRID" className="h-[30px] w-auto text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">{t.footerDescription}</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">{t.navigation}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">{t.home}</Link>
              <Link to="/technology" className="text-sm text-muted-foreground transition-colors hover:text-primary">{t.technology}</Link>
              <Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-primary">{t.about}</Link>
              <Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">{t.contactUs}</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">{t.projects}</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/projects/dc-public-lighting-grid" className="transition-colors hover:text-primary">
                {t.projectTitles.publicLighting}
              </Link>
              <Link to="/projects/dc-ev-charging-hub" className="transition-colors hover:text-primary">
                {t.projectTitles.chargingHub}
              </Link>
              <Link to="/projects/dc-energy-communities" className="transition-colors hover:text-primary">
                {t.projectTitles.energyCommunities}
              </Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">{t.contact}</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="mailto:geral@evdcgrid.pt" className="transition-colors hover:text-primary">geral@evdcgrid.pt</a>
              <span>{t.location}</span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} EVDCGRID. {t.rights}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
