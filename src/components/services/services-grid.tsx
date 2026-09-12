import { services } from "@/data/services";
import Reveal from "@/components/ui/reveal";
import ServiceCard from "@/components/services/service-card";

export default function ServicesGrid() {
  return <div className="grid gap-4 lg:grid-cols-12">
    {services.map((service, index) => <Reveal key={service.id} delay={index * 0.05} className={index === 0 ? "lg:col-span-7" : index === 1 ? "lg:col-span-5" : index === 2 ? "lg:col-span-5" : index === 3 ? "lg:col-span-7" : "lg:col-span-12"}><ServiceCard service={service} featured={index === 4} /></Reveal>)}
  </div>;
}
