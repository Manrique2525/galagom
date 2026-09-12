"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavItem } from "@/types/site";

export default function MobileNavigation({ items }: { items: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return <div className="lg:hidden">
    <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-border text-primary transition-colors duration-200 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary" aria-expanded={isOpen} aria-controls="mobile-menu" aria-label={isOpen ? "Cerrar menú" : "Abrir menú"} onClick={() => setIsOpen((open) => !open)}>
      <span aria-hidden="true" className="text-xl leading-none">{isOpen ? "×" : "☰"}</span>
    </button>
    {isOpen && <nav id="mobile-menu" className="absolute inset-x-0 top-20 z-40 border-b border-border bg-white px-5 py-5 shadow-[var(--shadow-soft)]" aria-label="Navegación móvil">
      <div className="mx-auto flex max-w-[var(--container-width)] flex-col gap-1">
        {items.map((item) => <Link className="rounded-sm px-3 py-3 text-sm font-semibold text-primary hover:bg-surface hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href={item.href} key={item.href} onClick={() => setIsOpen(false)}>{item.label}</Link>)}
        <Link className="mt-2 rounded-sm bg-primary px-3 py-3 text-center text-sm font-bold text-white hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href="/#cotizar" onClick={() => setIsOpen(false)}>Cotizar flete</Link>
      </div>
    </nav>}
  </div>;
}
