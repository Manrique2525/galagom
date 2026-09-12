"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type UseFormRegister } from "react-hook-form";
import type { ReactNode } from "react";
import Button from "@/components/ui/button";
import FieldError from "@/components/forms/field-error";
import SubmitStatus from "@/components/forms/submit-status";
import { quoteSchema, quoteServices, type QuoteFormData } from "@/lib/quote-schema";
import { quoteSubmissionService } from "@/lib/quote-service";

const inputClass = "w-full rounded-[var(--radius-sm)] border border-border bg-surface px-4 py-3 text-base text-text outline-none transition-colors placeholder:text-text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ id, label, error, register, children }: { id: keyof QuoteFormData; label: string; error?: string; register: UseFormRegister<QuoteFormData>; children?: ReactNode }) {
  const errorId = `${id}-error`;
  return <div><label className="mb-2 block text-sm font-bold text-text" htmlFor={id}>{label}</label>{children ?? <input id={id} className={inputClass} autoComplete={id === "name" ? "name" : undefined} maxLength={id === "name" ? 100 : undefined} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...register(id)} /> }<FieldError id={errorId} message={error} /></div>;
}

export default function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<QuoteFormData>({ resolver: zodResolver(quoteSchema), mode: "onBlur", defaultValues: { name: "", phone: "", email: "", origin: "", destination: "", date: "", description: "" } });

  const onSubmit = async (data: QuoteFormData) => {
    setStatus("submitting");
    try {
      await quoteSubmissionService.submit(data);
    } catch {
      setStatus("error");
    }
  };

  const getError = (field: keyof QuoteFormData) => errors[field]?.message;
  return <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
    <div className="grid gap-6 sm:grid-cols-2">
      <Field id="name" label="Nombre" error={getError("name")} register={register} />
      <Field id="phone" label="Teléfono" error={getError("phone")} register={register}><input id="phone" className={inputClass} type="tel" inputMode="tel" autoComplete="tel" maxLength={25} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} {...register("phone")} /></Field>
    </div>
    <Field id="email" label="Correo electrónico" error={getError("email")} register={register}><input id="email" className={inputClass} type="email" inputMode="email" autoComplete="email" maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} /></Field>
    <div className="grid gap-6 sm:grid-cols-2">
      <Field id="service" label="Tipo de servicio" error={getError("service")} register={register}><select id="service" className={inputClass} defaultValue="" aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? "service-error" : undefined} {...register("service")}><option value="" disabled>Selecciona una opción</option>{quoteServices.map((service) => <option value={service} key={service}>{service}</option>)}</select></Field>
      <Field id="date" label="Fecha estimada del servicio (opcional)" error={getError("date")} register={register}><input id="date" className={inputClass} type="date" aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "date-error" : undefined} {...register("date")} /></Field>
    </div>
    <div className="grid gap-6 sm:grid-cols-2">
      <Field id="origin" label="Origen" error={getError("origin")} register={register}><input id="origin" className={inputClass} placeholder="Ej. Cancún, Quintana Roo" autoComplete="address-level2" maxLength={150} aria-invalid={Boolean(errors.origin)} aria-describedby={errors.origin ? "origin-error" : undefined} {...register("origin")} /></Field>
      <Field id="destination" label="Destino" error={getError("destination")} register={register}><input id="destination" className={inputClass} placeholder="Ej. Cozumel, Quintana Roo" autoComplete="address-level2" maxLength={150} aria-invalid={Boolean(errors.destination)} aria-describedby={errors.destination ? "destination-error" : undefined} {...register("destination")} /></Field>
    </div>
    <Field id="description" label="¿Qué necesitas transportar o almacenar?" error={getError("description")} register={register}><textarea id="description" className={`${inputClass} min-h-32 resize-y`} placeholder="Describe brevemente tu mercancía, volumen aproximado o cualquier detalle importante." maxLength={1000} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : undefined} {...register("description")} /></Field>
    <div className="space-y-4 border-t border-border pt-6"><p className="text-sm leading-6 text-text-muted">Al enviar tus datos, aceptas que GALAGOM los utilice para atender tu solicitud. El aviso de privacidad definitivo requiere validación legal.</p><div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center"><Button type="submit" size="large" disabled={isSubmitting}> {isSubmitting ? "Preparando..." : "Solicitar cotización"} <span className="ml-3" aria-hidden="true">↗</span></Button><SubmitStatus status={status} /></div></div>
  </form>;
}
