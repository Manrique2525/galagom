import Container from "@/components/ui/container";
import ProcessTimeline from "@/components/process/process-timeline";
import RouteDecor from "@/components/ui/route-decor";
import { processSteps } from "@/data/process";

export default function ProcessSection() {
  return (
    <section
      id="proceso"
      className="bg-white py-[var(--section-space-mobile)] sm:py-[var(--section-space-desktop)]"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
          <div className="self-start lg:sticky lg:top-28">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              ¿QUÉ OFRECEMOS?
            </p>
            <h2 className="max-w-lg text-4xl font-extrabold leading-tight tracking-[-0.04em] text-text sm:text-6xl">
              Soluciones logísticas para cada etapa de tu operación
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-text-muted">
              En GALAGOM ayudamos a las empresas a organizar, almacenar y
              distribuir su mercancía mediante soluciones logísticas adaptadas a
              las necesidades de cada operación. Integramos la coordinación
              logística, el almacenaje, la gestión de inventarios, la
              distribución y los servicios 3PL para facilitar el movimiento de
              los productos desde su recepción hasta su destino. Nuestro enfoque
              consiste en comprender los requerimientos de cada cliente y
              coordinar los servicios necesarios de acuerdo con el tipo de
              mercancía, los volúmenes y las necesidades de su negocio.
            </p>
            <RouteDecor className="mt-10 text-primary-soft" />
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              Origen <span className="mx-2 text-primary-soft">→</span> Destino
            </p>
          </div>
          <div>
     
            <ProcessTimeline steps={processSteps} />
          </div>
        </div>
      </Container>
    </section>
  );
}
