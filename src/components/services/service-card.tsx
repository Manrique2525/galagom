import Link from "next/link";
import Image from "next/image";
import type { Service } from "@/data/services";

function ServiceIcon({ icon }: Pick<Service, "icon">) {
  const paths: Record<Service["icon"], string> = { route: "M4 17h16M4 12h9m-9-5h16M18 9l3 3-3 3", delivery: "M3 7h11v10H3zM14 10h4l3 3v4h-7zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", warehouse: "M3 10 12 4l9 6v10H3V10Zm5 10v-6h8v6M8 10h.01M12 10h.01M16 10h.01", cargo: "M5 7h14v12H5zM8 7V4h8v3M8 12h8M8 16h5", nodes: "M7 7h10v10H7zM12 4v3m0 10v3M4 12h3m10 0h3" };
  return <svg aria-hidden="true" focusable="false" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={paths[icon]} /></svg>;
}

export default function ServiceCard({ service, featured = false }: { service: Service; featured?: boolean }) {
  const text = featured ? "text-white" : "text-text";
  const muted = featured ? "text-white/70" : "text-text-muted";
  const index = featured ? "text-white/60" : "text-secondary";
  const link = featured ? "text-white" : "text-primary";
  return <article className={`group relative flex min-h-64 flex-col justify-between overflow-hidden rounded-[var(--radius-md)] border p-6 transition-all duration-[var(--motion-base)] hover:-translate-y-1 hover:border-primary-soft hover:shadow-[var(--shadow-soft)] sm:p-8 ${featured ? "border-primary bg-primary" : "border-border bg-white"}`}>
    {service.image && <div className="relative -mx-6 -mt-6 mb-6 h-28 overflow-hidden sm:-mx-8 sm:-mt-8 sm:mb-8"><Image src={service.image} alt={service.imageAlt ?? ""} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover transition-transform duration-[var(--motion-base)] group-hover:scale-[1.03]" /><div className="absolute inset-0 bg-primary-dark/35" /></div>}
    <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full transition-transform duration-[var(--motion-base)] group-hover:scale-150 ${featured ? "bg-white/[0.08]" : "bg-primary/[0.035]"}`} />
    <div className="relative flex items-start justify-between"><span className={`text-xs font-bold tracking-[0.18em] ${index}`}>{service.index}</span><span className={featured ? "text-white/70" : "text-primary-soft"}><ServiceIcon icon={service.icon} /></span></div>
    <div className="relative mt-12"><h3 className={`max-w-xs text-xl font-extrabold leading-tight tracking-[-0.025em] ${text}`}>{service.title}</h3><p className={`mt-3 max-w-sm text-sm leading-6 ${muted}`}>{service.description}</p></div>
    <Link className={`relative mt-7 inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${link}`} href="/cotizar">Solicitar servicio <span className="transition-transform duration-[var(--motion-fast)] group-hover:translate-x-1" aria-hidden="true">→</span></Link>
  </article>;
}
