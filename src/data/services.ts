export type Service = {
  id: string;
  index: string;
  title: string;
  description: string;
  icon: "route" | "delivery" | "warehouse" | "cargo" | "nodes";
  image?: string;
  imageAlt?: string;
};

export const services: Service[] = [
  { id: "islas", index: "01", title: "Fletes Isla Mujeres y Cozumel", description: "Servicio de carga y fletes hacia Isla Mujeres, Cozumel y Holbox, además de cobertura logística en Quintana Roo.", icon: "route", image: "/images/lading/1.jpeg", imageAlt: "Servicio de transporte de carga" },
  { id: "reparto", index: "02", title: "Recolección y reparto", description: "Unidades con capacidad a la medida de cada requerimiento.", icon: "delivery", image: "/images/lading/2.jpeg", imageAlt: "Operación de recolección y reparto" },
  { id: "almacenaje", index: "03", title: "Almacenaje", description: "Almacenamos tu carga hasta que esté lista para el reparto.", icon: "warehouse", image: "/images/lading/3.jpeg", imageAlt: "Operación de almacenaje" },
  { id: "carga", index: "04", title: "Carga nacional y local", description: "Coordinación y ejecución del traslado desde el origen hasta el destino final.", icon: "cargo", image: "/images/lading/4.jpeg", imageAlt: "Transporte de carga nacional y local" },
  { id: "3pl", index: "05", title: "Soluciones 3PL", description: "Almacenamiento, gestión de inventarios, preparación de pedidos, embalaje y transporte hasta el cliente final.", icon: "nodes", image: "/images/lading/6.jpeg", imageAlt: "Operación logística 3PL" },
];
