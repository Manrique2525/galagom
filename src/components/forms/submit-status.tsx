type SubmitStatusProps = { status: "idle" | "submitting" | "error" };

export default function SubmitStatus({ status }: SubmitStatusProps) {
  if (status === "idle") return null;
  if (status === "submitting") return <p className="text-sm text-text-muted" role="status" aria-live="polite">Preparando la solicitud...</p>;
  return <p className="rounded-[var(--radius-sm)] border border-primary/20 bg-primary/[0.05] p-4 text-sm leading-6 text-primary" role="status" aria-live="polite">El formulario está listo para integración. El envío se habilitará cuando GALAGOM conecte su canal de recepción.</p>;
}
