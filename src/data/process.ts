export type ProcessStep = { number: string; title: string; description: string };

export const processSteps: ProcessStep[] = [
  { number: "01", title: "Recolección", description: "Coordinamos la recepción de la mercancía en el punto de origen acordado y organizamos su salida con las indicaciones necesarias para iniciar el envío de manera ordenada." },
  { number: "02", title: "Almacenaje", description: "Cuando la operación lo requiere, resguardamos la mercancía durante el periodo acordado y la mantenemos preparada para continuar hacia la siguiente etapa del proceso logístico." },
  { number: "03", title: "Gestión logística", description: "Coordinamos las actividades que necesita cada operación, dando seguimiento a los requerimientos del servicio y manteniendo comunicación para facilitar la organización entre el origen y el destino." },
  { number: "04", title: "Transporte", description: "Coordinamos el traslado de la mercancía desde el origen hasta el destino establecido, considerando las características de la carga y las necesidades específicas de cada envío." },
  { number: "05", title: "Entrega", description: "Coordinamos la etapa final del recorrido hasta el destinatario, siguiendo las indicaciones acordadas para completar la entrega de manera ordenada." },
];
