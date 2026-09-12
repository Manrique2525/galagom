import Image from "next/image";
import Button from "@/components/ui/button";
import Container from "@/components/ui/container";

function RouteGraphic() {
  return <div className="hero-route relative h-full min-h-[290px] w-full overflow-hidden rounded-[var(--radius-lg)] border border-white/15 bg-white/[0.04] p-5 sm:min-h-[370px] sm:p-8" aria-hidden="true">
    <Image src="/images/temporary/logistics-hero.webp" alt="Camión de carga frente a un almacén" fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover opacity-45" />
    <div className="absolute inset-0 bg-primary-dark/65" />
    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgb(255_255_255_/_0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255_/_0.12)_1px,transparent_1px)] [background-size:42px_42px]" />
    <svg className="relative h-full min-h-[250px] w-full" viewBox="0 0 520 360" fill="none" preserveAspectRatio="xMidYMid meet" focusable="false">
      <path d="M52 276C126 244 126 112 238 142C335 168 341 255 466 80" stroke="rgb(255 255 255 / .25)" strokeWidth="1" strokeDasharray="5 8" />
      <path d="M52 276C126 244 126 112 238 142C335 168 341 255 466 80" stroke="#A9B9D8" strokeWidth="2" strokeDasharray="1 13" strokeLinecap="round" />
      <circle cx="52" cy="276" r="8" fill="#fff" /><circle cx="52" cy="276" r="18" stroke="#A9B9D8" strokeOpacity=".35" />
      <circle cx="238" cy="142" r="6" fill="#A9B9D8" /><circle cx="466" cy="80" r="8" fill="#fff" /><circle cx="466" cy="80" r="18" stroke="#A9B9D8" strokeOpacity=".35" />
    </svg>
    <span className="absolute bottom-5 left-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 sm:bottom-8 sm:left-8">Origen</span>
    <span className="absolute right-5 top-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 sm:right-8 sm:top-8">Destino</span>
    <span className="absolute bottom-5 right-5 rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60 sm:bottom-8 sm:right-8">En movimiento</span>
  </div>;
}

export default function Hero() {
  return <section id="hero-section" className="relative isolate min-h-[80svh] overflow-hidden bg-primary-dark pt-32 text-white sm:pt-40">
    <div className="hero-grid absolute inset-0 -z-10 opacity-40" />
    <div className="absolute -right-40 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-primary-soft/30 blur-3xl" />
    <div className="absolute -bottom-56 left-1/3 -z-10 h-[28rem] w-[28rem] rounded-full bg-primary/60 blur-3xl" />
    <Container className="relative flex min-h-[calc(80svh-5rem)] flex-col justify-center pb-16 sm:pb-20">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)] lg:gap-20">
        <div className="max-w-2xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.24em] text-[#A9B9D8]">Transporte y logística en Cancún</p>
          <h1 className="max-w-xl text-4xl font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-[clamp(3.5rem,5.5vw,5rem)]">Logística que mueve tu negocio</h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/75 sm:text-lg">Soluciones de transporte, distribución y almacenaje en Cancún y Quintana Roo, respaldadas por más de 17 años de experiencia.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/#cotizar" size="large">Cotizar un flete <span className="ml-3" aria-hidden="true">↗</span></Button>
            <Button href="#servicios" size="large" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Conocer servicios <span className="ml-3" aria-hidden="true">↓</span></Button>
          </div>
          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-5 border-t border-white/15 pt-6">
            <div><strong className="block text-2xl font-extrabold tracking-tight">17+</strong><span className="text-xs text-white/55">Años de experiencia</span></div>
            <div><strong className="block text-2xl font-extrabold tracking-tight">Quintana Roo</strong><span className="text-xs text-white/55">Cobertura</span></div>
            <div><strong className="block text-2xl font-extrabold tracking-tight">3PL</strong><span className="text-xs text-white/55">Soluciones integrales</span></div>
          </div>
        </div>
        <RouteGraphic />
      </div>
    </Container>
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
  </section>;
}
