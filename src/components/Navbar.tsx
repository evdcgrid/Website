import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import logo from "@/assets/logo_c_black.svg";
import { commonText, useLanguage, type Language } from "@/lib/language";

const LanguageToggle = ({ compact = false }: { compact?: boolean }) => {
  const { language, setLanguage } = useLanguage();
  const t = commonText[language];

  const options: Language[] = ["en", "pt"];

  return (
    <div
      className={`inline-flex rounded-md border border-border bg-background p-1 ${
        compact ? "w-fit" : ""
      }`}
      aria-label={t.languageLabel}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          aria-label={option === "en" ? t.switchToEnglish : t.switchToPortuguese}
          className={`rounded-sm px-2.5 py-1 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            language === option
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();
  const t = commonText[language];
  const isProjectsActive = location.pathname.startsWith("/projects");
  const navItems = [
    { label: t.home, key: "home", path: "/" },
    { label: t.technology, key: "technology", path: "/technology" },
    { label: t.projects, key: "projects", path: "/projects" },
    { label: t.about, key: "about", path: "/about" },
    { label: t.contactUs, key: "contact", path: "/contact" },
  ];
  const projectItems = [
    { label: t.projectTitles.publicLighting, path: "/projects/dc-public-lighting-grid" },
    { label: t.projectTitles.chargingHub, path: "/projects/dc-ev-charging-hub" },
    { label: t.projectTitles.energyCommunities, path: "/projects/dc-energy-communities" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/95 shadow-sm backdrop-blur-xl">
      <div className="nav-container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <img src={logo} alt="EVDCGRID" className="h-[42px] w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden h-full items-center gap-8 md:flex">
          {navItems.map((item) => (
            item.key === "projects" ? (
              <div key={item.path} className="relative flex h-full items-center">
                <button
                  type="button"
                  onClick={() => setProjectsOpen((value) => !value)}
                  onBlur={(event) => {
                    if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) {
                      setProjectsOpen(false);
                    }
                  }}
                  aria-expanded={projectsOpen}
                  aria-haspopup="menu"
                  className={`relative inline-flex h-full items-center gap-2 rounded-sm px-1 text-base font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    isProjectsActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                  <ChevronDown className={`h-4 w-4 transition-transform ${projectsOpen ? "rotate-180" : ""}`} />
                  {isProjectsActive && <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-primary" />}
                </button>
                {projectsOpen && (
                  <div
                    role="menu"
                    onMouseDown={(event) => event.preventDefault()}
                    className="absolute right-0 top-[calc(100%-0.25rem)] w-64 rounded-md border border-border bg-background p-2 shadow-lg"
                  >
                    {projectItems.map((project) => (
                      <Link
                        key={project.path}
                        to={project.path}
                        role="menuitem"
                        onClick={() => setProjectsOpen(false)}
                        className="block rounded-sm px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-primary focus:bg-secondary focus:text-primary focus:outline-none"
                      >
                        {project.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`relative inline-flex h-full items-center rounded-sm px-1 text-base font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
                {location.pathname === item.path && <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-primary" />}
              </Link>
            )
          ))}
          <LanguageToggle compact />
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? (language === "pt" ? "Fechar menu de navegação" : "Close navigation menu") : (language === "pt" ? "Abrir menu de navegação" : "Open navigation menu")}
          aria-expanded={open}
          className="rounded-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="section-container py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              item.key === "projects" ? (
                <div key={item.path} className="space-y-2">
                  <span
                    className={`block text-sm font-medium ${
                      isProjectsActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {t.projects}
                  </span>
                  <div className="ml-3 flex flex-col gap-2 border-l border-border pl-3">
                    {projectItems.map((project) => (
                      <Link
                        key={project.path}
                        to={project.path}
                        onClick={() => setOpen(false)}
                        className="rounded-sm text-sm text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        {project.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`rounded-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
            <LanguageToggle compact />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
