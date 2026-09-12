import type { Metadata } from "next";
import AboutSection from "@/components/sections/about-section";
import FinalCta from "@/components/sections/final-cta";
import Hero from "@/components/sections/hero";
import TrustStrip from "@/components/sections/trust-strip";
import ServicesGrid from "@/components/services/services-grid";
import Container from "@/components/ui/container";
import SectionHeading from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Transporte y Logística en Cancún",
  description: "Soluciones de transporte, almacenaje, reparto y logística 3PL en Cancún y Quintana Roo. Más de 17 años de experiencia.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <>
    <Hero />
    <TrustStrip />
    <section id="servicios" className="bg-white py-20 sm:py-28"><Container><SectionHeading level={2} eyebrow="Nuestros servicios" heading="Soluciones logísticas para cada etapa de tu operación" description="Desde la recolección hasta el destino final, coordinamos servicios de transporte, almacenaje y distribución de acuerdo con tus necesidades." /><div className="mt-12 sm:mt-16"><ServicesGrid /></div></Container></section>
    <AboutSection />
    <FinalCta />
  </>;
}
