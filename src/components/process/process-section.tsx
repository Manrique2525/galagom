import Container from "@/components/ui/container";
import SectionHeading from "@/components/ui/section-heading";
import ProcessTimeline from "@/components/process/process-timeline";
import { processSteps } from "@/data/process";

export default function ProcessSection() {
  return <section id="proceso" className="bg-white py-20 sm:py-28"><Container><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><SectionHeading eyebrow="El recorrido de tu carga" heading="Tu carga, de origen a destino" description="GALAGOM puede participar en diferentes etapas del proceso logístico, coordinando el movimiento de tu mercancía con claridad y atención personalizada." /><span className="hidden pb-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary lg:block">Origen <span className="mx-2 text-primary-soft">→</span> Destino</span></div><ProcessTimeline steps={processSteps} /></Container></section>;
}
