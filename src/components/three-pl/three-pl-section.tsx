import Container from "@/components/ui/container";
import SectionHeading from "@/components/ui/section-heading";
import ThreePlNetwork from "@/components/three-pl/three-pl-network";

export default function ThreePlSection() {
  return <section id="3pl" className="bg-primary-dark py-20 text-white sm:py-28"><Container><div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-20"><SectionHeading tone="light" eyebrow="Soluciones 3PL" heading="Más que transporte: una operación conectada" description="Integramos diferentes etapas de la cadena logística para ayudarte a gestionar tu operación de principio a fin." /><ThreePlNetwork /></div></Container></section>;
}
