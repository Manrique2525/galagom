import type { Metadata } from "next";
import Link from "next/link";
import QuoteForm from "@/components/forms/quote-form";
import Container from "@/components/ui/container";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Cotizar Flete en Cancún",
  description: "Solicita información sobre transporte, almacenaje y logística en Cancún y Quintana Roo.",
  alternates: { canonical: "/cotizar" },
};

export default function QuotePage() {
  return <>
    <section className="bg-primary-dark pb-16 pt-36 text-white sm:pb-20 sm:pt-44"><Container><p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#A9B9D8]">Cotización</p><h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.045em] sm:text-6xl">Cuéntanos qué necesitas mover</h1><p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">Comparte los detalles de tu operación. GALAGOM revisará tu solicitud de transporte o logística y podrá contactarte para conocer cómo ayudarte.</p></Container></section>
    <section className="bg-white py-16 sm:py-24"><Container><div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-20"><div className="rounded-[var(--radius-lg)] border border-border bg-white p-6 shadow-[var(--shadow-soft)] sm:p-10"><div className="mb-9 border-b border-border pb-6"><h2 className="text-2xl font-extrabold tracking-[-0.025em] text-text">Información de tu solicitud</h2><p className="mt-2 text-sm leading-6 text-text-muted">Completa los campos para compartir lo esencial de tu necesidad.</p></div><QuoteForm /></div><aside className="h-fit border-t border-border pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Contacto directo</p><h2 className="mt-5 text-2xl font-extrabold tracking-[-0.025em] text-text">Hablemos de tu operación</h2><p className="mt-4 text-sm leading-6 text-text-muted">También puedes comunicarte directamente con GALAGOM.</p><dl className="mt-7 space-y-5 text-sm"><div><dt className="font-bold text-text">Teléfono</dt><dd className="mt-1"><Link className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href={siteConfig.phoneHref}>{siteConfig.phone}</Link></dd></div><div><dt className="font-bold text-text">Ubicación</dt><dd className="mt-1 text-text-muted">{siteConfig.location}</dd></div></dl></aside></div></Container></section>
  </>;
}
