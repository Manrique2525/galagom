import type { SiteConfig } from "@/types/site";

export const siteConfig: SiteConfig = {
  name: "GALAGOM - Soluciones Logísticas",
  shortName: "GALAGOM",
  description: "Servicios de transporte y logística en Cancún y Quintana Roo.",
  url: "https://www.galagom.com",
  phone: "+52 998 222 5373",
  phoneHref: "tel:+529982225373",
  location: "Cancún, Quintana Roo, México",
  email: "hola@galagom.com",
  navigation: [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Cobertura", href: "/#cobertura" },
    { label: "Nosotros", href: "/#nosotros" },
    { label: "Contacto", href: "/#contacto" },
  ],
  whatsapp: {
    phone: "529982225373",
    displayPhone: "+52 998 222 5373",
    message: "Hola, me gustaría solicitar información y una cotización sobre los servicios de GALAGOM.",
  },
};
