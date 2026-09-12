import { services } from "@/data/services";
import Reveal from "@/components/ui/reveal";
import ServiceCard from "@/components/services/service-card";

export default function ServicesGrid() {
  return <div className="grid gap-4 lg:grid-cols-12">
    {services.map((service, index) => <Reveal key={service.id} delay={index * 0.05} className={index === 0 ? "lg:col-span-7" : index === 1 ? "lg:col-span-5" : index === 2 ? "lg:col-span-5" : index === 3 ? "lg:col-span-7" : "lg:col-span-12"}><ServiceCard service={service} className={index === 4 ? "min-h-56 bg-primary text-white hover:border-[#A9B9D8] [&_h3]:text-white [&_p]:text-white/70 [&_a]:text-white [&_span]:text-white/60" : ""} /></Reveal>)}
  </div>;
}
