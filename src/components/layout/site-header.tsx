import Image from "next/image";
import Link from "next/link";
import MobileNavigation from "@/components/navigation/mobile-navigation";
import { siteConfig } from "@/data/site";

export default function SiteHeader() {
  return <header className="border-b border-border bg-white" id="inicio">
    <div className="mx-auto flex min-h-20 max-w-[var(--container-width)] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
      <Link className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="/" aria-label="GALAGOM, ir al inicio">
        <Image src="https://www.galagom.com/wp-content/uploads/2024/11/logo-galagom-350.png" alt="GALAGOM Soluciones Logísticas" width={112} height={82} className="h-14 w-auto object-contain" priority />
      </Link>
      <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
        {siteConfig.navigation.map((item) => <Link className="text-sm font-semibold text-secondary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href={item.href} key={item.href}>{item.label}</Link>)}
        <Link className="rounded-sm bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="#cotizar">Cotizar flete</Link>
      </nav>
      <MobileNavigation items={siteConfig.navigation} />
    </div>
  </header>;
}
