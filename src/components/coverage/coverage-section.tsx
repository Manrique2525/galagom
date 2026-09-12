import Container from "@/components/ui/container";
import SectionHeading from "@/components/ui/section-heading";
import Reveal from "@/components/ui/reveal";
import CoverageMap from "@/components/coverage/coverage-map";
import { coverageDestinations } from "@/data/coverage";

export default function CoverageSection() {
  return <section id="cobertura" className="bg-primary-dark py-20 text-white sm:py-28"><Container><div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><Reveal><SectionHeading tone="light" eyebrow="Nuestra cobertura" heading="Movemos tu carga en Quintana Roo" description="Contamos con servicio en todo el estado de Quintana Roo, incluyendo destinos como Holbox, Isla Mujeres y Cozumel." /><div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/15 pt-6 sm:grid-cols-4 lg:grid-cols-2"><p className="col-span-2 text-xs font-bold uppercase tracking-[0.2em] text-white/45">Destinos mencionados</p>{coverageDestinations.map((destination) => <div className="flex items-center gap-3 text-sm font-semibold text-white/80" key={destination}><span className="h-1.5 w-1.5 rounded-full bg-[#A9B9D8]" />{destination}</div>)}</div></Reveal><Reveal delay={0.1}><div className="rounded-[var(--radius-lg)] border border-white/15 bg-white/[0.04] p-4 sm:p-8"><CoverageMap /></div></Reveal></div></Container></section>;
}
