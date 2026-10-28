import { useState } from "react";
import { Award, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { useLanguage } from "@/lib/language";
import diogoImage from "@/assets/founder-diogo-guerreiro.jpg";
import luisImage from "@/assets/founder-luis-fernandes.jpg";
import duarteImage from "@/assets/founder-duarte-domingues.png";

const team = [
  {
    name: "Diogo Guerreiro",
    image: diogoImage,
    objectPosition: "42% 46%",
  },
  {
    name: "Luis Fernandes",
    image: luisImage,
    objectPosition: "50% 44%",
  },
  {
    name: "Duarte Domingues",
    image: duarteImage,
    objectPosition: "50% 38%",
  },
];

const programmes = [
  {
    id: "tecstorm",
    label: "Tecstorm",
    title: "Tecstorm",
    description:
      "EVDCGrid participated in Tecstorm, where the project was recognised for its potential to apply DC infrastructure to real electrification challenges.",
    image: "/accelerators/tecstorm.png",
    logo: "/accelerators/tecstorm.png",
    background: "#000000",
    imageAlt: "Tecstorm competition logo or event image",
    url: "https://www.tecstorm.pt/",
    type: "Competition",
  },
  {
    id: "future-innovators",
    label: "Future Innovators Program (UFL)",
    title: "Future Innovators Program",
    description:
      "EVDCGrid participated in the Future Innovators Program, developing the project's technical and entrepreneurial positioning.",
    image: "/accelerators/future-innovators.png",
    logo: "/accelerators/future-innovators.png",
    background: "#3ee3a0",
    imageAlt: "Future Innovators Program by Unicorn Factory Lisboa image",
    url: "https://www.futureinnovators.pt/",
    type: "Competition",
  },
  {
    id: "digital-built-accelerator",
    label: "Digital Built Accelerator \u2014 T\u00e9cnico Venture Labs",
    title: "Digital Built Accelerator \u2014 T\u00e9cnico Venture Labs",
    description:
      "EVDCGrid participated in the Digital Built Accelerator by T\u00e9cnico Venture Labs, strengthening the project's path from research to deployment.",
    image: "/accelerators/digital-built-accelerator.png",
    logo: "/accelerators/digital-built-accelerator.png",
    background: "#000000",
    imageAlt: "Digital Built Accelerator programme image",
    url: "https://www.digitalbuiltaccelerator.pt/",
    type: "Accelerator",
  },
  {
    id: "eit-jumpstarter",
    label: "EIT Jumpstarter Program - Smart Cities",
    title: "EIT Jumpstarter Program - Smart Cities & Urban Mobility",
    description:
      "EVDCGrid participated in the EIT Jumpstarter Program in the Smart Cities category, positioning DC infrastructure as an urban electrification solution.",
    image: "/accelerators/eit-jumpstarter.png",
    logo: "/accelerators/eit-jumpstarter.png",
    background: "hsl(var(--background))",
    imageAlt: "EIT Jumpstarter Smart Cities and Urban Mobility programme image",
    url: "https://eitjumpstarter.eu/programme-details/",
    type: "Accelerator",
  },
  {
    id: "urban-mobility-disruptor",
    label: "Urban Mobility Disruptor",
    title: "Urban Mobility Disruptor",
    description:
      "EVDCGrid joined Urban Mobility Disruptor, a programme focused on helping urban mobility innovators translate research and early-stage solutions into market-ready projects for smarter, cleaner and more connected cities.",
    image: "/accelerators/urban-mobility-disruptor.png",
    logo: "/accelerators/urban-mobility-disruptor.png",
    background: "hsl(var(--background))",
    imageAlt: "Urban Mobility Disruptor programme image",
    url: "https://www.bgi.pt/disruptor/urban-mobility-disruptor",
    type: "Accelerator",
  },
  {
    id: "the-ventures",
    label: "The Ventures Award Portugal 2026",
    title: "The Ventures Award Portugal 2026",
    description:
      "EVDCGrid was selected as a finalist for The Ventures Award Portugal 2026, joining the final cohort of high-potential startups pitching to investors and ecosystem leaders.",
    image: "/accelerators/the-ventures.jpg",
    logo: "/accelerators/the-ventures.jpg",
    background: "#ffffff",
    imageAlt: "The Ventures Award Portugal 2026 logo",
    url: "https://www.the-ventures.com/portugal-2026",
    type: "Competition",
  },
];

const aboutText = {
  en: {
    seoTitle: "About Us",
    seoDescription:
      "EVDCGrid was born from energy systems research, combining expertise in DC grids, power electronics, protection systems and sustainable energy infrastructure.",
    eyebrow: "About Us",
    title: "About Us",
    intro:
      "EVDCGrid was born from energy systems research, combining expertise in DC grids, power electronics, protection systems and sustainable energy infrastructure. We are focused on turning advanced research into practical solutions for real-world energy systems.",
    team: "The Team",
    programmes: "Competitions, awards and accelerators",
    visit: "Visit website",
    view: "View programme",
    visitAria: "Visit",
    viewAria: "View programme source page for",
    type: { Competition: "Competition", Accelerator: "Accelerator" },
    descriptions: Object.fromEntries(programmes.map((programme) => [programme.id, programme.description])),
  },
  pt: {
    seoTitle: "Sobre Nos",
    seoDescription:
      "A EVDCGrid nasceu de investigacao em sistemas de energia, combinando conhecimento em redes DC, eletronica de potencia, sistemas de protecao e infraestrutura energetica sustentavel.",
    eyebrow: "Sobre Nos",
    title: "Sobre Nos",
    intro:
      "A EVDCGrid nasceu de investigacao em sistemas de energia, combinando conhecimento em redes DC, eletronica de potencia, sistemas de protecao e infraestrutura energetica sustentavel. Estamos focados em transformar investigacao avancada em solucoes praticas para sistemas de energia reais.",
    team: "A Equipa",
    programmes: "Concursos, premios e aceleradores",
    visit: "Visitar website",
    view: "Ver programa",
    visitAria: "Visitar",
    viewAria: "Ver pagina do programa para",
    type: { Competition: "Concurso", Accelerator: "Acelerador" },
    descriptions: {
      tecstorm:
        "A EVDCGrid participou no Tecstorm, onde o projeto foi reconhecido pelo seu potencial para aplicar infraestrutura DC a desafios reais de eletrificacao.",
      "future-innovators":
        "A EVDCGrid participou no Future Innovators Program, desenvolvendo o posicionamento tecnico e empreendedor do projeto.",
      "digital-built-accelerator":
        "A EVDCGrid participou no Digital Built Accelerator by Tecnico Venture Labs, reforcando o caminho do projeto desde a investigacao ate a implementacao.",
      "eit-jumpstarter":
        "A EVDCGrid participou no EIT Jumpstarter Program na categoria Smart Cities, posicionando infraestrutura DC como solucao de eletrificacao urbana.",
      "urban-mobility-disruptor":
        "A EVDCGrid integrou o Urban Mobility Disruptor, um programa focado em ajudar inovadores de mobilidade urbana a transformar investigacao e solucoes early-stage em projetos prontos para o mercado.",
      "the-ventures":
        "A EVDCGrid foi selecionada como finalista do The Ventures Award Portugal 2026, integrando o grupo final de startups de elevado potencial a apresentar perante investidores e lideres do ecossistema.",
    },
  },
} as const;

const AboutPage = () => {
  const { language } = useLanguage();
  const text = aboutText[language];
  const [activeProgramme, setActiveProgramme] = useState(programmes[0].id);
  const selectedProgramme = programmes.find((programme) => programme.id === activeProgramme) ?? programmes[0];

  return (
    <div className="site-page">
      <Seo
        title={text.seoTitle}
        description={text.seoDescription}
        path="/about"
      />
      <Navbar />

      <main>
        <section className="site-section-strong relative overflow-hidden border-b border-border pt-28 lg:pt-32">
          <div className="absolute inset-0 bg-gradient-to-b from-background/84 via-background/93 to-surface/92" />
          <div className="section-container relative py-16 lg:py-24">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">{text.eyebrow}</span>
            <div className="mt-5 max-w-4xl">
              <h1 className="text-4xl font-black leading-tight text-foreground sm:text-5xl">{text.title}</h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">{text.intro}</p>
            </div>
          </div>
        </section>

        <section className="site-section-soft py-20 lg:py-24">
          <div className="section-container">
            <h2 className="text-3xl font-black text-foreground sm:text-4xl">{text.team}</h2>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {team.map(({ name, image, objectPosition }) => (
                <article key={name} className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                  <div className="aspect-square overflow-hidden bg-secondary">
                    <img
                      src={image}
                      alt={name}
                      className="h-full w-full object-cover object-center"
                      style={{ objectPosition }}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground">{name}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="site-section border-t border-border py-20 lg:py-24">
          <div className="section-container">
            <div className="mb-10 flex items-center gap-3">
              <Award className="h-7 w-7 text-primary" />
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">
                {text.programmes}
              </h2>
            </div>

            <div className="overflow-x-auto pb-2">
              <div
                className="flex min-w-max gap-2 lg:min-w-0 lg:flex-wrap"
                role="tablist"
                aria-label={text.programmes}
              >
                {programmes.map((programme) => (
                  <button
                    key={programme.id}
                    id={`programme-tab-${programme.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selectedProgramme.id === programme.id}
                    aria-controls={`programme-panel-${programme.id}`}
                    onClick={() => setActiveProgramme(programme.id)}
                    className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors focus:outline-none ${
                      selectedProgramme.id === programme.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {programme.label}
                  </button>
                ))}
              </div>
            </div>

            <article
              id={`programme-panel-${selectedProgramme.id}`}
              role="tabpanel"
              aria-labelledby={`programme-tab-${selectedProgramme.id}`}
              className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="bg-surface p-4 sm:p-6">
                  <img
                    src={selectedProgramme.image}
                    alt={selectedProgramme.imageAlt}
                    className="h-[280px] w-full rounded-md border border-border object-contain p-4 shadow-sm sm:h-[320px] lg:h-[340px]"
                    style={{ background: selectedProgramme.background }}
                  />
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <span className="mb-4 inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                    {text.type[selectedProgramme.type as keyof typeof text.type]}
                  </span>
                  <h3 className="text-2xl font-black text-foreground">{selectedProgramme.title}</h3>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                    {text.descriptions[selectedProgramme.id as keyof typeof text.descriptions]}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={selectedProgramme.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${text.visitAria} ${selectedProgramme.title} website`}
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      {text.visit}
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>

                    {"sourceUrl" in selectedProgramme && selectedProgramme.sourceUrl ? (
                      <a
                        href={selectedProgramme.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${text.viewAria} ${selectedProgramme.title}`}
                        className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        {text.view}
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
