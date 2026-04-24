import { Route, ParkingCircle, Anchor, Plane, Warehouse } from "lucide-react";
import roads from "@/assets/deploy-roads.jpg";
import carparks from "@/assets/deploy-carparks.jpg";
import ports from "@/assets/deploy-ports.jpg";
import airports from "@/assets/deploy-airports.jpg";
import logistics from "@/assets/deploy-logistics.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const useCases = [
  {
    title: "Public Roads",
    description: "Convert existing streetlight grids into curbside DC charging for residential and commercial streets.",
    image: roads,
    Icon: Route,
  },
  {
    title: "Car Parks",
    description: "Deploy distributed charging across surface lots without costly trenching or new substations.",
    image: carparks,
    Icon: ParkingCircle,
  },
  {
    title: "Ports",
    description: "Electrify terminal tractors, reach stackers and heavy logistics fleets with high-capacity DC backbones.",
    image: ports,
    Icon: Anchor,
  },
  {
    title: "Airports",
    description: "Power ground support equipment and shuttle fleets using existing perimeter lighting infrastructure.",
    image: airports,
    Icon: Plane,
  },
  {
    title: "Logistics Centers",
    description: "Scale fleet charging at distribution hubs with modular GridMaster units and zero downtime.",
    image: logistics,
    Icon: Warehouse,
  },
];

const DeploymentSection = () => (
  <section id="deployment" className="py-24 bg-surface">
    <div className="section-container">
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-mono font-semibold text-primary uppercase tracking-widest">
          Deployment Scenarios
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-foreground">
          Where the solution can be{" "}
          <span className="gradient-text">deployed</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          From dense urban streets to industrial-scale logistics, our DC grid adapts to any environment with existing electrical infrastructure.
        </p>
      </div>

      <Carousel
        opts={{ align: "start", loop: true }}
        className="w-full px-4 sm:px-12"
      >
        <CarouselContent className="-ml-4">
          {useCases.map(({ title, description, image, Icon }) => (
            <CarouselItem
              key={title}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <article className="group relative overflow-hidden rounded-lg border border-border bg-card aspect-[4/5] cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent transition-opacity duration-500 group-hover:from-primary/85 group-hover:via-primary/30" />

                <div className="relative h-full flex flex-col justify-end p-6 text-background">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-background/15 backdrop-blur-sm border border-background/30 mb-4 transition-transform duration-500 group-hover:scale-110">
                    <Icon size={20} className="text-background" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-background/85 max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:opacity-100 group-hover:mt-1">
                    {description}
                  </p>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 sm:-left-4 bg-background border-border" />
        <CarouselNext className="right-0 sm:-right-4 bg-background border-border" />
      </Carousel>
    </div>
  </section>
);

export default DeploymentSection;
