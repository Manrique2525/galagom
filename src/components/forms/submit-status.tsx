import Link from "next/link";

type SubmitStatusProps = { status: "idle" | "submitting" | "success" | "error"; message?: string };

export default function SubmitStatus({ status, message }: SubmitStatusProps) {
  if (status === "idle") return null;
  if (status === "submitting") return <p className="text-sm text-text-muted" role="status" aria-live="polite">Preparando la solicitud...</p>;
  if (status === "success") return <div className="rounded-[var(--radius-sm)] border border-primary/20 bg-primary/[0.05] p-4 text-sm leading-6 text-primary" role="status" aria-live="polite"><strong className="block">Recibimos tu solicitud</strong><span className="mt-1 block">Nuestro equipo podrá revisar la información y ponerse en contacto contigo.</span></div>;
  return <p className="rounded-[var(--radius-sm)] border border-primary/20 bg-primary/[0.05] p-4 text-sm leading-6 text-primary" role="alert" aria-live="assertive">{message ?? "No pudimos enviar tu solicitud en este momento."} <Link className="font-bold underline underline-offset-4" href="tel:+529982225373">Llámanos al +52 998 222 5373</Link>.</p>;
}
