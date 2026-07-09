import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import logo from "@/assets/logo_c_black.svg";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Technology", path: "/technology" },
  { label: "Projects", path: "/projects" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];

const projectItems = [
  { label: "DC Public Lighting Grid", path: "/projects/dc-public-lighting-grid" },
  { label: "DC EV Charging Hub", path: "/projects/dc-ev-charging-hub" },
  { label: "DC for Energy Communities", path: "/projects/dc-energy-communities" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const location = useLocation();
  const isProjectsActive = location.pathname.startsWith("/projects");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/95 shadow-sm backdrop-blur-xl">
      <div className="nav-container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <img src={logo} alt="EVDCGRID" className="h-[42px] w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden h-full items-center gap-10 md:flex">
          {navItems.map((item) => (
            item.label === "Projects" ? (
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
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
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
              item.label === "Projects" ? (
                <div key={item.path} className="space-y-2">
                  <span
                    className={`block text-sm font-medium ${
                      isProjectsActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Projects
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
