import Button from "@/components/ui/button";
import Container from "@/components/ui/container";
import SectionHeading from "@/components/ui/section-heading";

const foundationItems = [
  ["01", "Sistema visual", "Tokens corporativos y escalas consistentes."],
  ["02", "Accesibilidad", "Landmarks, focus visible y navegación por teclado."],
  ["03", "Arquitectura", "Server Components por defecto y datos centralizados."],
] as const;

export default function Home() {
  return <section className="border-b border-border bg-white py-24 sm:py-32">
    <Container>
      <div className="mx-auto max-w-3xl">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-secondary">Foundation / Fase 1</p>
        <SectionHeading heading="La base técnica de GALAGOM está lista para crecer." description="Esta pantalla temporal valida la estructura visual, tipografía, navegación, botones y comportamiento responsive antes de construir la experiencia comercial." />
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="#servicios">Ver estructura</Button>
          <Button href="#contacto" variant="secondary">Contactar</Button>
        </div>
      </div>
      <div className="mt-20 grid gap-4 border-t border-border pt-8 sm:grid-cols-3" aria-label="Elementos de Foundation">
        {foundationItems.map(([number, title, description]) => <article key={number} className="rounded-lg border border-border bg-surface p-5">
          <span className="text-sm font-bold text-secondary">{number}</span>
          <h2 className="mt-7 text-lg font-bold text-text">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>
        </article>)}
      </div>
    </Container>
  </section>;
}
