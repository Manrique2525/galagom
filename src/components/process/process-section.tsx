import Container from "@/components/ui/container";
import ProcessTimeline from "@/components/process/process-timeline";
import RouteDecor from "@/components/ui/route-decor";
import { processSteps } from "@/data/process";

export default function ProcessSection() {
  return <section id="proceso" className="bg-white py-[var(--section-space-mobile)] sm:py-[var(--section-space-desktop)]"><Container><div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24"><div className="self-start lg:sticky lg:top-28"><p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-secondary">El recorrido de tu carga</p><h2 className="max-w-lg text-4xl font-extrabold leading-tight tracking-[-0.04em] text-text sm:text-6xl">Tu carga, de origen a destino</h2><p className="mt-6 max-w-md text-base leading-7 text-text-muted">Cada operación puede requerir etapas distintas. En GALAGOM coordinamos las actividades logísticas necesarias según las características de cada envío, manteniendo una comunicación clara y atención personalizada durante el proceso.</p><RouteDecor className="mt-10 text-primary-soft" /><p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-secondary">Origen <span className="mx-2 text-primary-soft">→</span> Destino</p></div><ProcessTimeline steps={processSteps} /></div></Container></section>;
}
