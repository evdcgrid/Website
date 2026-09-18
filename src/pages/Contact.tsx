import { Handshake, Mail, MapPin, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { useLanguage } from "@/lib/language";

const contactText = {
  en: {
    seoTitle: "Contact Us",
    seoDescription:
      "Contact EVDCGrid for partnerships, pilot projects and professional discussions about DC infrastructure for local electrification.",
    eyebrow: "Contact Us",
    title: "Let's discuss DC infrastructure opportunities",
    body:
      "EVDCGrid is open to professional conversations with organisations interested in partnerships, pilot projects and technical or commercial discussions around DC-based local energy infrastructure.",
    openTitle: "Open to conversations",
    topics: ["Strategic partnerships", "Pilot projects", "Technical and commercial discussions"],
    details: [
      { label: "Location", value: "Lisbon, Portugal", Icon: MapPin },
      { label: "Email", value: "geral@evdcgrid.pt", href: "mailto:geral@evdcgrid.pt", Icon: Mail },
    ],
  },
  pt: {
    seoTitle: "Contactos",
    seoDescription:
      "Contacte a EVDCGrid para parcerias, projetos-piloto e conversas profissionais sobre infraestrutura DC para eletrificacao local.",
    eyebrow: "Contactos",
    title: "Vamos discutir oportunidades de infraestrutura DC",
    body:
      "A EVDCGrid esta aberta a conversas profissionais com organizacoes interessadas em parcerias, projetos-piloto e discussoes tecnicas ou comerciais sobre infraestrutura local de energia baseada em DC.",
    openTitle: "Abertos a conversas",
    topics: ["Parcerias estrategicas", "Projetos-piloto", "Discussoes tecnicas e comerciais"],
    details: [
      { label: "Localizacao", value: "Lisboa, Portugal", Icon: MapPin },
      { label: "Email", value: "geral@evdcgrid.pt", href: "mailto:geral@evdcgrid.pt", Icon: Mail },
    ],
  },
} as const;

const ContactPage = () => {
  const { language } = useLanguage();
  const text = contactText[language];

  return (
    <div className="site-page">
      <Seo title={text.seoTitle} description={text.seoDescription} path="/contact" />
      <Navbar />

      <main>
        <section className="site-section-strong relative overflow-hidden border-b border-border pt-28 lg:pt-32">
          <div className="absolute inset-0 bg-gradient-to-b from-background/84 via-background/93 to-surface/92" />
          <div className="section-container relative py-16 lg:py-24">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              {text.eyebrow}
            </span>
            <div className="mt-5 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">
                  {text.title}
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">{text.body}</p>
              </div>

              <article className="rounded-xl border border-primary/15 bg-background/92 p-6 shadow-[0_18px_44px_hsl(214_42%_34%/0.10)] backdrop-blur sm:p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Handshake className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-black text-foreground">{text.openTitle}</h2>
                <div className="mt-5 grid gap-3">
                  {text.topics.map((topic) => (
                    <div key={topic} className="flex items-center gap-3 text-sm font-semibold text-foreground">
                      <MessageSquare className="h-4 w-4 shrink-0 text-primary" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 border-t border-border pt-6">
                  {text.details.map(({ label, value, href, Icon }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/15 bg-primary/5 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-primary">{label}</p>
                        {href ? (
                          <a
                            href={href}
                            className="mt-1 block text-base font-semibold text-foreground transition-colors hover:text-primary"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
