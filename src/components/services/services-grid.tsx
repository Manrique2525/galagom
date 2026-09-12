import { services } from "@/data/services";
import Reveal from "@/components/ui/reveal";
import ServiceCard from "@/components/services/service-card";

const layout = ["lg:col-span-7 lg:row-span-2", "lg:col-span-5", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

export default function ServicesGrid() {
  return <div className="grid gap-5 lg:grid-cols-12 lg:auto-rows-[minmax(400px,max-content)]">{services.map((service, index) => <Reveal key={service.id} delay={index * 0.05} className={layout[index]}><ServiceCard service={service} featured={index === 0} dark={index === 4} side={index === 3} /></Reveal>)}</div>;
}
