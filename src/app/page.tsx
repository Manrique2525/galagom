import type { Metadata } from "next";
import AboutSection from "@/components/sections/about-section";
import Hero from "@/components/sections/hero";
import ProcessSection from "@/components/process/process-section";
import CoverageSection from "@/components/coverage/coverage-section";
import ServicesGrid from "@/components/services/services-grid";
import ThreePlSection from "@/components/three-pl/three-pl-section";
import QuoteCta from "@/components/sections/quote-cta";
import Container from "@/components/ui/container";
import SectionHeading from "@/components/ui/section-heading";
import SiteStructuredData from "@/components/seo/site-structured-data";

export const metadata: Metadata = {
  title: "Transporte y Logística en Cancún",
  description: "Soluciones de transporte, almacenaje, reparto y logística 3PL en Cancún y Quintana Roo. Más de 17 años de experiencia.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <><SiteStructuredData />
    <Hero />
    <section id="servicios" className="bg-surface py-[var(--section-space-mobile)] sm:py-[var(--section-space-desktop)]"><Container><SectionHeading level={2} eyebrow="Nuestros servicios" heading="Soluciones para mover tu operación" description="Desde la recolección hasta el destino final, coordinamos servicios de transporte, almacenaje y distribución de acuerdo con tus necesidades." /><div className="mt-12 sm:mt-16"><ServicesGrid /></div></Container></section>
    <ProcessSection />
    <CoverageSection />
    <AboutSection />
    <ThreePlSection />
    <QuoteCta />
  </>;
}
