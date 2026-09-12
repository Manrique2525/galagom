import Image from "next/image";
import Link from "next/link";
import MobileNavigation from "@/components/navigation/mobile-navigation";
import { siteConfig } from "@/data/site";

export default function SiteHeader() {
  return <header className="sticky top-0 z-50 border-b border-border bg-white/[0.96] text-primary shadow-sm backdrop-blur-md" id="inicio">
    <div className="mx-auto flex min-h-[84px] max-w-[var(--container-width)] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
      <Link className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="/" aria-label="GALAGOM, ir al inicio">
        <Image src="/images/brand/galagom-logo-navbar.png" alt="GALAGOM Soluciones Logísticas" width={313} height={210} className="h-[76px] w-auto object-contain" priority />
      </Link>
      <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
        {siteConfig.navigation.filter((item) => item.label !== "Contacto").map((item) => <Link className="relative py-2 text-sm font-semibold text-primary transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-[width] after:duration-200 hover:text-secondary hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href={item.href} key={item.href}>{item.label}</Link>)}
        <Link className="relative py-2 text-sm font-semibold text-primary transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-[width] after:duration-200 hover:text-secondary hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="/#cotizar">Contacto</Link>
        <Link className="rounded-sm bg-primary px-5 py-3 text-sm font-bold !text-white transition-all duration-200 hover:-translate-y-px hover:bg-primary-dark hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="/#cotizar">Cotizar flete</Link>
      </nav>
      <MobileNavigation />
    </div>
  </header>;
}
