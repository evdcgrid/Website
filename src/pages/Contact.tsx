import { useState } from "react";
import { Send, Mail, Building2, User } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", pilot: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", company: "", message: "", pilot: false });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest">Get in Touch</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mt-3">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Interested in a pilot project or want to learn more? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1.5">
                  <User size={14} /> Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1.5">
                  <Mail size={14} /> Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-md border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1.5">
                  <Building2 size={14} /> Company
                </label>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full rounded-md border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-md border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.pilot}
                  onChange={(e) => setForm({ ...form, pilot: e.target.checked })}
                  className="accent-primary"
                />
                I'm interested in a pilot project
              </label>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary"
              >
                <Send size={16} /> Send Message
              </button>
            </form>

            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-heading font-bold mb-3">Direct Contact</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-primary" />
                    info@evdcgrid.com
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-primary" />
                    Lisbon, Portugal
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 glow-primary">
                <h3 className="font-heading font-bold mb-3">Request a Pilot Project</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We're actively seeking municipality partners for our 2026 pilot program. If you represent a local authority or utility, let's explore how EVDCGRID can transform your lighting infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
