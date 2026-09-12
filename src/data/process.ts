export type ProcessStep = { number: string; title: string; description: string };

export const processSteps: ProcessStep[] = [
  { number: "01", title: "Recolección", description: "Recibimos la mercancía en el punto de origen." },
  { number: "02", title: "Almacenaje", description: "Conservamos la carga hasta que esté lista para el reparto." },
  { number: "03", title: "Gestión logística", description: "Coordinamos cada necesidad de la operación." },
  { number: "04", title: "Transporte", description: "Ejecutamos el traslado desde el origen al destino final." },
  { number: "05", title: "Entrega", description: "Acompañamos la mercancía hasta el cliente final." },
];
