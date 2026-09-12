export type Service = {
  id: string;
  index: string;
  title: string;
  description: string;
  icon: "route" | "delivery" | "warehouse" | "cargo" | "nodes";
};

export const services: Service[] = [
  { id: "islas", index: "01", title: "Fletes Isla Mujeres y Cozumel", description: "Servicio en Quintana Roo, incluyendo Holbox, Isla Mujeres y Cozumel.", icon: "route" },
  { id: "reparto", index: "02", title: "Recolección y reparto", description: "Unidades con capacidad a la medida de cada requerimiento.", icon: "delivery" },
  { id: "almacenaje", index: "03", title: "Almacenaje", description: "Almacenamos tu carga hasta que esté lista para el reparto.", icon: "warehouse" },
  { id: "carga", index: "04", title: "Carga nacional y local", description: "Coordinación y ejecución del traslado desde el origen hasta el destino final.", icon: "cargo" },
  { id: "3pl", index: "05", title: "Soluciones 3PL", description: "Almacenamiento, gestión de inventarios, preparación de pedidos, embalaje y transporte hasta el cliente final.", icon: "nodes" },
];
