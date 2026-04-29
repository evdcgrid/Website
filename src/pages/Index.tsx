import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";

import SolutionSection from "@/components/landing/SolutionSection";
import DeploymentSection from "@/components/landing/DeploymentSection";
import ProductSection from "@/components/landing/ProductSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import CTASection from "@/components/landing/CTASection";
import Seo from "@/components/Seo";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EVDCGRID",
    url: "https://evdcgrid.pt",
    email: "info@evdcgrid.pt",
    areaServed: "Portugal",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EVDCGRID",
    url: "https://evdcgrid.pt",
    description:
      "DC grid infrastructure for public lighting and EV charging across Portugal.",
  },
];

const Index = () => (
  <div className="min-h-screen">
    <Seo
      title="EVDCGRID | DC grid infrastructure for public lighting and EV charging"
      description="EVDCGRID transforms public lighting grids into DC infrastructure for EV charging, with modular power conversion, simulation tools and a municipal case study."
      path="/"
      structuredData={structuredData}
    />
    <Navbar />
    <HeroSection />
    
    <SolutionSection />
    <DeploymentSection />
    <ProductSection />
    <HowItWorksSection />
    <BenefitsSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
