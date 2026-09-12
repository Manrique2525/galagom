"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useForm, type FieldPath, type Resolver, type UseFormRegister } from "react-hook-form";
import Button from "@/components/ui/button";
import FieldError from "@/components/forms/field-error";
import SubmitStatus from "@/components/forms/submit-status";
import { quoteSchema, quoteServices, type QuoteFormData } from "@/lib/quote-schema";

const inputClass = "w-full rounded-[var(--radius-sm)] border border-border bg-surface px-4 py-3 text-base text-text outline-none transition-colors placeholder:text-text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20";
const visibleFields = ["name", "phone", "email", "service", "origin", "destination", "date", "description"] as const satisfies readonly FieldPath<QuoteFormData>[];
const draftFields = [...visibleFields];
const QUOTE_DRAFT_KEY = "galagom:cotizar-draft";

function readDraft(): Partial<QuoteFormData> {
  try {
    if (typeof window === "undefined") return {};
    const raw = window.sessionStorage.getItem(QUOTE_DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<QuoteFormData>) : {};
  } catch {
    return {};
  }
}

function writeDraft(values: Partial<QuoteFormData>) {
  try {
    if (typeof window === "undefined") return;
    const clean: Partial<QuoteFormData> = {};
    for (const field of draftFields) {
      const value = values[field];
      if (value !== undefined && value !== "") Object.assign(clean, { [field]: value });
    }
    if (Object.keys(clean).length === 0) window.sessionStorage.removeItem(QUOTE_DRAFT_KEY);
    else window.sessionStorage.setItem(QUOTE_DRAFT_KEY, JSON.stringify(clean));
  } catch {
    /* almacenamiento no disponible */
  }
}

function Field({ id, label, error, register, children }: { id: FieldPath<QuoteFormData>; label: string; error?: string; register: UseFormRegister<QuoteFormData>; children?: ReactNode }) {
  const errorId = `${id}-error`;
  return <div><label className="mb-2 block text-sm font-bold text-text" htmlFor={id}>{label}</label>{children ?? <input id={id} className={inputClass} autoComplete={id === "name" ? "name" : undefined} maxLength={id === "name" ? 100 : undefined} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...register(id)} /> }<FieldError id={errorId} message={error} /></div>;
}

export default function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>();
  const { register, handleSubmit, reset, setError, setFocus, formState: { errors, isSubmitting } } = useForm<QuoteFormData>({ resolver: zodResolver(quoteSchema) as Resolver<QuoteFormData>, mode: "onBlur", defaultValues: { name: "", phone: "", email: "", service: undefined, origin: "", destination: "", date: "", description: "", website: "" } });
  useEffect(() => {
    const stored = readDraft();
    if (Object.keys(stored).length) reset(stored as QuoteFormData);
  }, [reset]);

  const persistField = (field: FieldPath<QuoteFormData>, value: string) => {
    if (field === "website") return;
    const next = { ...readDraft() };
    if (value) Object.assign(next, { [field]: value });
    else delete next[field];
    writeDraft(next);
  };

  const draftRegister: UseFormRegister<QuoteFormData> = (field) =>
    register(field, { onChange: (event) => persistField(field, (event.target as HTMLInputElement).value) });

  const onSubmit = async (data: QuoteFormData) => {
    setStatus("submitting");
    setErrorMessage(undefined);
    try {
      const response = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const payload = await response.json() as { success?: boolean; message?: string; errors?: Record<string, string> };
      if (response.ok && payload.success) {
        try { window.sessionStorage.removeItem(QUOTE_DRAFT_KEY); } catch { /* sin almacenamiento */ }
        reset();
        setStatus("success");
        return;
      }
      if (response.status === 422 && payload.errors) {
        const invalidFields = visibleFields.filter((field) => payload.errors?.[field]);
        invalidFields.forEach((field) => setError(field, { type: "server", message: payload.errors?.[field] }));
        if (invalidFields[0]) setFocus(invalidFields[0]);
      }
      setErrorMessage(payload.message);
      setStatus("error");
    } catch {
      setErrorMessage("No pudimos enviar tu solicitud en este momento.");
      setStatus("error");
    }
  };

  const getError = (field: FieldPath<QuoteFormData>) => errors[field]?.message;
  return <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" {...register("website")} /></div>
    <div className="grid gap-6 sm:grid-cols-2"><Field id="name" label="Nombre" error={getError("name")} register={draftRegister} /><Field id="phone" label="Teléfono" error={getError("phone")} register={draftRegister}><input id="phone" className={inputClass} type="tel" inputMode="tel" autoComplete="tel" maxLength={25} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} {...draftRegister("phone")} /></Field></div>
    <Field id="email" label="Correo electrónico" error={getError("email")} register={draftRegister}><input id="email" className={inputClass} type="email" inputMode="email" autoComplete="email" maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} {...draftRegister("email")} /></Field>
    <div className="grid gap-6 sm:grid-cols-2"><Field id="service" label="Tipo de servicio" error={getError("service")} register={draftRegister}><select id="service" className={inputClass} defaultValue="" aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? "service-error" : undefined} {...draftRegister("service")}><option value="" disabled>Selecciona una opción</option>{quoteServices.map((service) => <option value={service} key={service}>{service}</option>)}</select></Field><Field id="date" label="Fecha estimada del servicio (opcional)" error={getError("date")} register={draftRegister}><input id="date" className={inputClass} type="date" aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "date-error" : undefined} {...draftRegister("date")} /></Field></div>
    <div className="grid gap-6 sm:grid-cols-2"><Field id="origin" label="Origen" error={getError("origin")} register={draftRegister}><input id="origin" className={inputClass} placeholder="Ciudad o ubicación de origen" autoComplete="address-level2" maxLength={150} aria-invalid={Boolean(errors.origin)} aria-describedby={errors.origin ? "origin-error" : undefined} {...draftRegister("origin")} /></Field><Field id="destination" label="Destino" error={getError("destination")} register={draftRegister}><input id="destination" className={inputClass} placeholder="Ciudad o ubicación de destino" autoComplete="address-level2" maxLength={150} aria-invalid={Boolean(errors.destination)} aria-describedby={errors.destination ? "destination-error" : undefined} {...draftRegister("destination")} /></Field></div>
    <Field id="description" label="¿Qué necesitas transportar o almacenar?" error={getError("description")} register={draftRegister}><textarea id="description" className={`${inputClass} min-h-32 resize-y`} placeholder="Describe brevemente tu mercancía, volumen aproximado o cualquier detalle importante." maxLength={1000} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : undefined} {...draftRegister("description")} /></Field>
    <div className="space-y-4 border-t border-border pt-6"><p className="text-sm leading-6 text-text-muted">Al enviar esta solicitud, GALAGOM utilizará tus datos para atender tu solicitud de cotización. Consulta nuestro <Link className="font-bold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href="/privacidad">Aviso de privacidad</Link>.</p><div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center"><Button type="submit" size="large" disabled={isSubmitting}>{isSubmitting ? "Enviando..." : "Solicitar cotización"}<span className="ml-3" aria-hidden="true">↗</span></Button><SubmitStatus status={status} message={errorMessage} /></div></div>
  </form>;
}
