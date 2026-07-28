import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ProductPage from "./pages/Product.tsx";
import SimulationPage from "./pages/Simulation.tsx";
import MapSimulationPage from "./pages/MapSimulation.tsx";
import ContactPage from "./pages/Contact.tsx";
import CaseStudyPage from "./pages/CaseStudy.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/map" element={<MapSimulationPage />} />
          <Route path="/map/:district" element={<MapSimulationPage />} />
          <Route path="/map/:district/:municipality" element={<MapSimulationPage />} />
          <Route path="/map/:district/:municipality/:parish" element={<MapSimulationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/case-study" element={<CaseStudyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
