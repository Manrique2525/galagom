import Link from "next/link";
import Button from "@/components/ui/button";
import Container from "@/components/ui/container";

export default function NotFound() {
  return <section className="flex min-h-[65svh] items-center bg-surface py-24"><Container><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Error 404</p><h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-[-0.04em] text-text sm:text-6xl">No encontramos esa ruta</h1><p className="mt-5 max-w-lg text-base leading-7 text-text-muted sm:text-lg">La página que buscas no está disponible. Regresa al inicio o cuéntanos qué necesitas mover.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button href="/">Volver al inicio</Button><Link className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-white px-5 text-sm font-bold text-primary transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary" href="/cotizar">Solicitar cotización</Link></div></div></Container></section>;
}
