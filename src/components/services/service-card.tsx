import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/data/services";

function ServiceIcon({ icon }: Pick<Service, "icon">) {
  const paths: Record<Service["icon"], string> = {
    route: "M4 17h16M4 12h9m-9-5h16M18 9l3 3-3 3",
    delivery: "M3 7h11v10H3zM14 10h4l3 3v4h-7zM7 20a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm12 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z",
    warehouse: "M3 10 12 4l9 6v10H3V10Zm5 10v-6h8v6M8 10h.01M12 10h.01M16 10h.01",
    cargo: "M5 7h14v12H5zM8 7V4h8v3M8 12h8M8 16h5",
    nodes: "M7 7h10v10H7zM12 4v3m0 10v3M4 12h3m10 0h3",
  };
  return <svg aria-hidden="true" focusable="false" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={paths[icon]} /></svg>;
}

export default function ServiceCard({ service, featured = false, dark = false, side = false }: { service: Service; featured?: boolean; dark?: boolean; side?: boolean }) {
  const immersive = featured || dark;
  const text = immersive ? "text-white" : "text-text";
  const muted = immersive ? "text-white/75" : "text-text-muted";
  const index = immersive ? "text-white/65" : "text-secondary";
  const link = immersive ? "!text-white" : "text-primary";
  return <article className={`group relative isolate flex min-h-[400px] flex-col justify-between overflow-hidden rounded-[var(--card-radius)] border p-6 transition-all duration-[var(--motion-base)] hover:border-primary-soft hover:shadow-[var(--shadow-soft)] sm:p-8 ${featured ? "lg:min-h-full" : ""} ${immersive ? "border-primary bg-primary-dark" : "border-border bg-white"}`}>
    {service.image && immersive && <Image src={service.image} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" aria-hidden data-landing="bg" className="-z-10 object-cover opacity-40 blur-[2px]" />}
    {service.image && immersive && <div className="absolute inset-0 -z-10"><Image src={service.image} alt={service.imageAlt ?? ""} fill sizes="(min-width: 1024px) 60vw, 100vw" data-landing="main" className="object-contain object-center opacity-90" /></div>}
    {service.image && immersive && <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary-dark via-primary-dark/55 to-primary-dark/15" />}
    {service.image && !immersive && <div className={`relative -mx-6 -mt-6 mb-7 h-52 overflow-hidden bg-[#EDEFF3] sm:-mx-8 sm:-mt-8 sm:mb-8 ${side ? "lg:absolute lg:inset-y-0 lg:right-0 lg:mb-0 lg:mt-0 lg:mx-0 lg:h-full lg:w-[55%]" : ""}`}><Image src={service.image} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" aria-hidden data-landing="bg" className="object-cover opacity-30 blur-[2px]" /><Image src={service.image} alt={service.imageAlt ?? ""} fill sizes="(min-width: 1024px) 45vw, 100vw" data-landing="main" className="object-contain object-center" /><div className={`absolute inset-0 ${side ? "bg-gradient-to-r from-white via-white/10 to-transparent lg:from-white lg:via-white/20" : "bg-primary-dark/20"}`} /></div>}
    {!immersive && !service.image && <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/[0.04] transition-transform duration-500 group-hover:scale-125" />}
    <div className="relative flex items-start justify-between"><span className={`text-xs font-bold tracking-[0.18em] ${index}`}>{service.index}</span><span className={immersive ? "text-white/75" : "text-primary-soft"}><ServiceIcon icon={service.icon} /></span></div>
    <div className={`relative ${immersive ? "mt-auto max-w-xl" : `mt-8 ${side ? "lg:max-w-[42%]" : ""}`}`}><h3 className={`max-w-lg text-2xl font-extrabold leading-tight tracking-[-0.035em] ${text}`}>{service.title}</h3><p className={`mt-3 max-w-lg text-sm leading-6 ${muted}`}>{service.description}</p></div>
    <Link className={`relative mt-7 inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${link}`} href="/#cotizar">Solicitar servicio <span className="transition-transform duration-[var(--motion-fast)] group-hover:translate-x-1" aria-hidden="true">→</span></Link>
  </article>;
}
