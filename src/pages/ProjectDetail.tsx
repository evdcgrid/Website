import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, BatteryCharging, Lightbulb, Network } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import lineBackground from "@/assets/evdc-lines-horizontal-1.png";
import publicLightingImage from "@/assets/project-public-lighting-city.png";
import chargingHubImage from "@/assets/project-charging-hub-city.png";
import energyCommunityImage from "@/assets/project-energy-community-city.png";

const projects = [
  {
    slug: "dc-public-lighting-grid",
    title: "DC Public Lighting Grid",
    eyebrow: "Public infrastructure",
    Icon: Lightbulb,
    image: publicLightingImage,
    text: "EVDCGrid converts existing public lighting circuits into a galvanically isolated bipolar DC network, reusing current cables and grid assets. The DC grid supplies LED street lighting and distributed EV chargers, creating a shared urban energy layer for public infrastructure.",
    technical:
      "A central conversion cabinet manages AC/DC conversion, protection, monitoring and control. This enables safer operation, higher usable capacity and easier future integration of storage or renewables.",
    benefits: [
      "Existing cable reuse",
      "LED public lighting supply",
      "Distributed EV charging",
      "Centralised protection and monitoring",
      "Future storage and renewable integration",
    ],
    actions: true,
  },
  {
    slug: "dc-ev-charging-hub",
    title: "DC EV Charging Hub",
    eyebrow: "Charging infrastructure",
    Icon: BatteryCharging,
    image: chargingHubImage,
    text: "A DC charging hub connects multiple fast chargers through a shared DC bus, integrating grid supply, battery storage and power conversion in one controlled architecture.",
    technical:
      "Instead of each charger operating as an isolated AC-connected asset, the hub manages power centrally. This can reduce peak demand on the grid, improve energy efficiency and simplify the integration of storage or renewable generation.",
    benefits: [
      "Shared DC bus",
      "Centralised power conversion",
      "Battery-ready architecture",
      "Lower peak demand",
      "Modular charger expansion",
    ],
  },
  {
    slug: "dc-energy-communities",
    title: "DC for Energy Communities",
    eyebrow: "Local energy systems",
    Icon: Network,
    image: energyCommunityImage,
    text: "DC connects local generation, storage and consumption through a simpler energy layer, making it easier to use renewable energy close to where it is produced.",
    technical:
      "New members, chargers, batteries or renewable assets can be added progressively through modular connection points and shared control. A monitored DC network enables local balancing, reduces unnecessary grid exchanges and supports more resilient energy communities.",
    benefits: [
      "Local energy use",
      "Easy community growth",
      "Smarter energy sharing",
      "Modular connection points",
      "Local balancing",
    ],
  },
];

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <Navigate to="/projects/dc-public-lighting-grid" replace />;
  }

  const otherProjects = projects.filter((item) => item.slug !== project.slug);
  const { Icon } = project;

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={project.title}
        description={project.text}
        path={`/projects/${project.slug}`}
      />
      <Navbar />

      <main>
        <section
          className="relative overflow-hidden border-b border-border bg-background bg-cover bg-center pt-28 lg:pt-32"
          style={{ backgroundImage: `url(${lineBackground})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/86 via-background/94 to-surface/92" />
          <div className="section-container relative py-16 lg:py-24">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              {project.eyebrow}
            </span>
            <div className="mt-5 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <h1 className="text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">
                  {project.title}
                </h1>
              </div>
              <div className="overflow-hidden rounded-xl border border-primary/15 bg-background/88 shadow-sm backdrop-blur">
                <div className="aspect-[16/9] overflow-hidden bg-secondary">
                  <img src={project.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-base leading-8 text-muted-foreground">{project.text}</p>
                  <p className="mt-5 text-base leading-8 text-muted-foreground">{project.technical}</p>
                  {project.actions && (
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <Link
                        to="/map"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        Open Map Explorer
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        to="/case-study"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        View Case Study
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface py-16 lg:py-20">
          <div className="section-container">
            <h2 className="text-3xl font-black text-foreground sm:text-4xl">Project capabilities</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-lg border border-border bg-background p-5 text-sm font-semibold text-foreground shadow-sm"
                >
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-16 lg:py-20">
          <div className="section-container">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">Other projects</h2>
              <div className="hidden h-px flex-1 bg-border sm:block" />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {otherProjects.map(({ slug: otherSlug, title, Icon: OtherIcon, text, image }) => (
                <Link
                  key={otherSlug}
                  to={`/projects/${otherSlug}`}
                  className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-colors hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-secondary">
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-5 flex items-center justify-between border-b border-border pb-5">
                      <OtherIcon className="h-7 w-7 text-primary" />
                      <span className="font-mono text-xs font-semibold text-muted-foreground">DC</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      View project
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetailPage;
