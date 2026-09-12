import { z } from "zod";

export const quoteServices = [
  "Fletes Isla Mujeres y Cozumel",
  "Recolección y Reparto",
  "Almacenaje",
  "Carga nacional y local",
  "Soluciones 3PL",
  "Otro / Necesito asesoría",
] as const;

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre.").max(100, "El nombre es demasiado largo."),
  phone: z.string().trim().min(7, "Ingresa un teléfono de contacto.").max(25, "Revisa el teléfono ingresado.").regex(/^[\d\s+().-]+$/, "Ingresa un teléfono válido."),
  email: z.string().trim().email("Ingresa un correo electrónico válido."),
  service: z.enum(quoteServices, { error: "Selecciona el servicio que necesitas." }),
  origin: z.string().trim().min(2, "Indica el origen de la carga.").max(150, "El origen es demasiado largo."),
  destination: z.string().trim().min(2, "Indica el destino de la carga.").max(150, "El destino es demasiado largo."),
  date: z.string().optional(),
  description: z.string().trim().min(10, "Describe brevemente tu necesidad.").max(1000, "La descripción es demasiado larga."),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
