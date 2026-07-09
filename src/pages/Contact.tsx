import { Mail, MapPin, MessageSquare, Handshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import lineBackground from "@/assets/evdc-lines-horizontal-1.png";

const contactDetails = [
  {
    label: "Location",
    value: "Lisbon, Portugal",
    Icon: MapPin,
  },
  {
    label: "Email",
    value: "geral@evdcgrid.pt",
    href: "mailto:geral@evdcgrid.pt",
    Icon: Mail,
  },
];

const conversationTopics = [
  "Strategic partnerships",
  "Pilot projects",
  "Technical and commercial discussions",
];

const ContactPage = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title="Contact Us"
      description="Contact EVDCGrid for partnerships, pilot projects and professional discussions about DC infrastructure for local electrification."
      path="/contact"
    />
    <Navbar />

    <main>
      <section
        className="relative overflow-hidden border-b border-border bg-background bg-cover bg-center pt-28 lg:pt-32"
        style={{ backgroundImage: `url(${lineBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/84 via-background/93 to-surface/92" />
        <div className="section-container relative py-16 lg:py-24">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">Contact Us</span>
          <div className="mt-5 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Let’s discuss DC infrastructure opportunities
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                EVDCGrid is open to professional conversations with organisations interested in partnerships, pilot
                projects and technical or commercial discussions around DC-based local energy infrastructure.
              </p>
            </div>

            <article className="rounded-xl border border-primary/15 bg-background/92 p-6 shadow-[0_18px_44px_hsl(214_42%_34%/0.10)] backdrop-blur sm:p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Handshake className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-foreground">Open to conversations</h2>
              <div className="mt-5 grid gap-3">
                {conversationTopics.map((topic) => (
                  <div key={topic} className="flex items-center gap-3 text-sm font-semibold text-foreground">
                    <MessageSquare className="h-4 w-4 shrink-0 text-primary" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 border-t border-border pt-6">
                {contactDetails.map(({ label, value, href, Icon }) => (
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

export default ContactPage;
