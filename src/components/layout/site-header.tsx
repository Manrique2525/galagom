"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MobileNavigation from "@/components/navigation/mobile-navigation";
import { siteConfig } from "@/data/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(pathname !== "/");

  useEffect(() => {
    if (pathname !== "/") return;
    const hero = document.getElementById("hero-section");
    if (!hero) return;
    const syncScroll = () => setIsScrolled(window.scrollY > 24);
    const observer = new IntersectionObserver(([entry]) => setIsScrolled(!entry.isIntersecting), { threshold: 0.05 });
    observer.observe(hero);
    syncScroll();
    window.addEventListener("scroll", syncScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", syncScroll); };
  }, [pathname]);

  return <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-[var(--motion-base)] ${isScrolled ? "border-b border-border bg-white/95 text-primary shadow-sm backdrop-blur" : "bg-transparent text-white"}`} id="inicio">
    <div className="mx-auto flex min-h-20 max-w-[var(--container-width)] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
      <Link className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="/" aria-label="GALAGOM, ir al inicio">
        <Image src={isScrolled ? "https://www.galagom.com/wp-content/uploads/2024/11/logo-galagom-350.png" : "https://www.galagom.com/wp-content/uploads/2024/11/logo-galagom-white.png"} alt="GALAGOM Soluciones Logísticas" width={112} height={82} className="h-14 w-auto object-contain" priority />
      </Link>
      <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
        {siteConfig.navigation.map((item) => <Link className={`text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${isScrolled ? "text-secondary hover:text-primary" : "text-white/80 hover:text-white"}`} href={item.href} key={item.href}>{item.label}</Link>)}
        <Link className="rounded-sm bg-primary px-5 py-3 text-sm font-bold !text-white transition-colors hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="/cotizar">Cotizar flete</Link>
      </nav>
      <MobileNavigation items={siteConfig.navigation} isScrolled={isScrolled} />
    </div>
  </header>;
}
