import Container from "@/components/ui/container";

const trustItems = [["17+", "años de experiencia"], ["Quintana Roo", "cobertura"], ["Atención", "personalizada"], ["3PL", "soluciones integrales"]] as const;

export default function TrustStrip() {
  return <section className="border-b border-border bg-white" aria-label="Razones para elegir GALAGOM">
    <Container className="grid divide-y divide-border py-2 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
      {trustItems.map(([value, label]) => <div className="flex items-center gap-4 px-1 py-5 sm:justify-center sm:px-6 lg:first:justify-start lg:last:justify-end" key={label}><span className="text-lg font-extrabold tracking-tight text-primary">{value}</span><span className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">{label}</span></div>)}
    </Container>
  </section>;
}
