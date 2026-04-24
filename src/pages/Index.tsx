import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import DeploymentSection from "@/components/landing/DeploymentSection";
import ProductSection from "@/components/landing/ProductSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import CTASection from "@/components/landing/CTASection";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <ProblemSection />
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
