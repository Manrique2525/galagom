import Image from "next/image";
import Container from "@/components/ui/container";
import SectionHeading from "@/components/ui/section-heading";
import ThreePlNetwork from "@/components/three-pl/three-pl-network";

export default function ThreePlSection() {
  return <section id="3pl" className="relative isolate overflow-hidden bg-primary-dark py-[var(--section-space-mobile)] text-white sm:py-[var(--section-space-desktop)]"><Image src="/images/lading/6.jpeg" alt="" fill sizes="100vw" aria-hidden data-landing="bg" className="-z-10 object-cover opacity-20" /><div className="absolute inset-0 -z-10 bg-primary-dark/85" /><Container><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-20"><SectionHeading tone="light" eyebrow="Soluciones 3PL" heading="Una operación logística conectada" description="Integramos almacenamiento, gestión de inventarios, preparación de pedidos, embalaje y transporte hasta el cliente final." /><ThreePlNetwork /></div></Container></section>;
}
