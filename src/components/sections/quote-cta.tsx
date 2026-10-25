import QuoteForm from "@/components/forms/quote-form";
import Container from "@/components/ui/container";

export default function QuoteCta() {
  return (
    <section
      id="cotizar"
      className="relative overflow-hidden bg-primary-dark py-20 text-white sm:py-28"
    >
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(120deg,transparent_48%,rgb(255_255_255_/_0.35)_49%,transparent_50%)] [background-size:48px_48px]" />
      <Container className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-extrabold leading-tight tracking-[-0.04em] sm:text-6xl">
            Cotiza tu operación logística
          </h2>
          <p className="mt-4 text-base leading-7 text-white/70 sm:text-lg">
            Completa el formulario para solicitar una cotización.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl rounded-[var(--radius-lg)] bg-white p-6 text-text shadow-[var(--shadow-soft)] sm:p-10">
          <div className="mb-8 border-b border-border pb-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">
              Cuéntanos tu necesidad
            </p>
            <p className="mt-3 text-sm leading-6 text-text-muted">
              Completa la información esencial de tu solicitud.
            </p>
          </div>
          <QuoteForm />
        </div>
      </Container>
    </section>
  );
}
