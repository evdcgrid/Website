import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import ProductSection from "@/components/landing/ProductSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import BusinessModelSection from "@/components/landing/BusinessModelSection";
import RoadmapSection from "@/components/landing/RoadmapSection";
import CTASection from "@/components/landing/CTASection";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <ProblemSection />
    <SolutionSection />
    <ProductSection />
    <HowItWorksSection />
    <BenefitsSection />
    <BusinessModelSection />
    <RoadmapSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
