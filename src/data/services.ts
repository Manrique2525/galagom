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
  { id: "islas", index: "01", title: "Fletes Isla Mujeres y Cozumel", description: "Servicio en Quintana Roo, incluyendo Holbox, Isla Mujeres y Cozumel.", icon: "route", image: "/images/temporary/logistics-hero.webp", imageAlt: "Camión de carga frente a un almacén" },
  { id: "reparto", index: "02", title: "Recolección y reparto", description: "Unidades con capacidad a la medida de cada requerimiento.", icon: "delivery", image: "/images/temporary/freight-truck.webp", imageAlt: "Operación de reparto con paquetes y vehículo de carga" },
  { id: "almacenaje", index: "03", title: "Almacenaje", description: "Almacenamos tu carga hasta que esté lista para el reparto.", icon: "warehouse", image: "/images/temporary/warehouse.webp", imageAlt: "Interior de almacén con camión de carga" },
  { id: "carga", index: "04", title: "Carga nacional y local", description: "Coordinación y ejecución del traslado desde el origen hasta el destino final.", icon: "cargo", image: "/images/temporary/services/national-cargo.webp", imageAlt: "Camión de carga en una operación de transporte" },
  { id: "3pl", index: "05", title: "Soluciones 3PL", description: "Almacenamiento, gestión de inventarios, preparación de pedidos, embalaje y transporte hasta el cliente final.", icon: "nodes", image: "/images/temporary/services/fulfillment-warehouse.webp", imageAlt: "Operación de almacén con paquetes y estanterías" },
];
