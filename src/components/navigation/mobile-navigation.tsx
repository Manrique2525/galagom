"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/data/site";
import type { NavItem } from "@/types/site";

const menuItems: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Proceso", href: "/#proceso" },
  { label: "Cobertura", href: "/#cobertura" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Contacto", href: "/#cotizar" },
];

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusables = Array.from(drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const closeOnDesktop = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setIsOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("keydown", trapFocus);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("keydown", trapFocus);
      window.removeEventListener("resize", closeOnDesktop);
      trigger?.focus();
    };
  }, [isOpen]);

  return <div className="lg:hidden">
    <button ref={triggerRef} type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] border border-border text-primary transition-colors duration-200 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary" aria-expanded={isOpen} aria-controls="mobile-menu" aria-haspopup="dialog" aria-label={isOpen ? "Cerrar menú" : "Abrir menú"} onClick={() => setIsOpen((open) => !open)}>
      <span aria-hidden="true" className="text-xl leading-none">☰</span>
    </button>
    {isOpen && createPortal(<div ref={drawerRef} role="dialog" aria-modal="true" aria-label="Navegación móvil" className="mobile-drawer fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-white" style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[var(--container-width)] flex-col px-5 sm:px-8">
        <header className="flex items-center justify-between gap-6 py-4">
          <Link className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="/" aria-label="GALAGOM, ir al inicio" onClick={() => setIsOpen(false)}>
            <Image src="/images/brand/galagom-logo-navbar.png" alt="GALAGOM Soluciones Logísticas" width={313} height={210} className="h-16 w-auto object-contain" priority />
          </Link>
          <button ref={closeRef} type="button" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-white text-primary transition-colors duration-200 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary" aria-label="Cerrar menú" onClick={() => setIsOpen(false)}>
            <span aria-hidden="true" className="text-2xl leading-none">×</span>
          </button>
        </header>
        <nav id="mobile-menu" className="mt-2 flex-1" aria-label="Navegación móvil">
          <ul className="flex flex-col">
            {menuItems.map((item) => <li key={item.href}>
              <Link className="group flex items-center justify-between rounded-xl px-3 py-4 text-[22px] font-medium text-primary transition-colors duration-200 hover:bg-surface hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href={item.href} onClick={() => setIsOpen(false)}>{item.label}<span aria-hidden="true" className="text-lg text-text-muted transition-transform duration-200 group-hover:translate-x-0.5">→</span></Link>
            </li>)}
          </ul>
        </nav>
        <footer className="pb-10 pt-10">
          <Link className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary text-base font-bold text-white transition-colors duration-200 hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="/#cotizar" onClick={() => setIsOpen(false)}>Cotizar flete<span aria-hidden="true" className="text-lg transition-transform duration-200 group-hover:translate-x-1">→</span></Link>
          <div className="mt-8 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Llámanos</p>
            <a className="mt-2 inline-block text-sm font-semibold text-primary transition-colors duration-200 hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href={siteConfig.phone.telHref}>{siteConfig.phone.display}</a>
          </div>
        </footer>
      </div>
    </div>, document.body)}
  </div>;
}
