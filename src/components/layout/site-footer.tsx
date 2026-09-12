import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/container";
import { siteConfig } from "@/data/site";

export default function SiteFooter() {
  return <footer className="bg-primary-dark py-12 text-white">
    <Container>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Image src="https://www.galagom.com/wp-content/uploads/2024/11/logo-galagom-white.png" alt="GALAGOM Soluciones Logísticas" width={112} height={82} className="h-16 w-auto object-contain object-left" />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">Soluciones de transporte y logística en Cancún y Quintana Roo.</p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-white/60">Contacto</h2>
          <address className="mt-4 not-italic text-sm leading-7 text-white/80"><Link className="hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" href={siteConfig.phoneHref}>{siteConfig.phone}</Link><br />{siteConfig.location}</address>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-white/60">Sitio</h2>
          <Link className="mt-4 inline-block text-sm text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" href="/privacidad">Aviso de privacidad</Link>
        </div>
      </div>
      <div className="mt-12 border-t border-white/15 pt-5 text-xs text-white/50">Derechos Reservados © {new Date().getFullYear()} | GALAGOM Soluciones Logísticas</div>
    </Container>
  </footer>;
}
