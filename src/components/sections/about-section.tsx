import Image from "next/image";
import Container from "@/components/ui/container";
import Reveal from "@/components/ui/reveal";

function OperationsGraphic() {
  return <div className="relative min-h-[390px] overflow-hidden rounded-[var(--radius-lg)] bg-primary-dark p-7 text-white sm:min-h-[460px] sm:p-10" aria-hidden="true">
    <Image src="/images/temporary/logistics-worker.webp" alt="Trabajador en una operación de logística" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover opacity-35" />
    <div className="absolute inset-0 bg-primary-dark/75" />
    <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgb(255_255_255_/_0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255_/_0.12)_1px,transparent_1px)] [background-size:38px_38px]" />
    <div className="absolute left-1/2 top-1/2 h-px w-[75%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#A9B9D8] to-transparent" />
    <div className="absolute left-[14%] top-[38%] h-3 w-3 rounded-full bg-white shadow-[0_0_0_9px_rgb(169_185_216_/_0.18)]" />
    <div className="absolute left-[49%] top-[38%] h-3 w-3 rounded-full bg-[#A9B9D8] shadow-[0_0_0_9px_rgb(169_185_216_/_0.18)]" />
    <div className="absolute right-[14%] top-[38%] h-3 w-3 rounded-full bg-white shadow-[0_0_0_9px_rgb(169_185_216_/_0.18)]" />
    <div className="absolute bottom-7 left-7 right-7 flex justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 sm:bottom-10 sm:left-10 sm:right-10"><span>Precisión</span><span>Integridad</span></div>
    <div className="relative flex h-full min-h-[330px] flex-col justify-between"><span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A9B9D8]">GALAGOM / 01</span><div><strong className="block text-7xl font-extrabold tracking-[-0.08em] sm:text-8xl">17<span className="text-[#A9B9D8]">+</span></strong><span className="text-sm text-white/65">años de experiencia</span></div></div>
  </div>;
}

export default function AboutSection() {
  return <section id="nosotros" className="bg-surface py-20 sm:py-28"><Container><div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20"><Reveal><OperationsGraphic /></Reveal><Reveal delay={0.1}><div className="max-w-xl"><p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-secondary">Acerca de GALAGOM</p><h2 className="text-3xl font-extrabold leading-tight tracking-[-0.04em] text-text sm:text-5xl">Tu aliado estratégico en transporte y logística</h2><p className="mt-6 text-base leading-7 text-text-muted sm:text-lg">Trabajamos para que cada entrega sea precisa y mantenga la integridad de tu pedido. Combinamos atención excepcional, comunicación fluida y una operación que se adapta a tus procesos.</p><div className="mt-8 grid gap-5 border-t border-border pt-7 sm:grid-cols-2"><div><h3 className="text-sm font-bold text-text">Servicio personalizado</h3><p className="mt-2 text-sm leading-6 text-text-muted">Soluciones adaptadas a tus necesidades de transporte y logística.</p></div><div><h3 className="text-sm font-bold text-text">Integridad y honradez</h3><p className="mt-2 text-sm leading-6 text-text-muted">Valores que orientan cada etapa del servicio.</p></div></div></div></Reveal></div></Container></section>;
}
