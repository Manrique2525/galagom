import Image from "next/image";
import Button from "@/components/ui/button";
import Container from "@/components/ui/container";
import TypewriterHeading, {
  HERO_HEADLINE,
} from "@/components/ui/typewriter-heading";

function RouteOverlay() {
  return (
    <div
      className="pointer-events-none absolute right-[4%] top-[16%] hidden h-[68%] w-[52%] opacity-70 lg:block"
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 620 520"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M70 420C168 390 190 170 320 230c88 40 102 102 230-136"
          stroke="rgb(255 255 255 / .22)"
          strokeWidth="1"
          strokeDasharray="5 10"
        />
        <path
          d="M70 420C168 390 190 170 320 230c88 40 102 102 230-136"
          stroke="#A9B9D8"
          strokeWidth="2"
          strokeDasharray="1 16"
          strokeLinecap="round"
        />
        <circle cx="70" cy="420" r="8" fill="white" />
        <circle cx="70" cy="420" r="22" stroke="#A9B9D8" strokeOpacity=".4" />
        <circle cx="320" cy="230" r="6" fill="#A9B9D8" />
        <circle cx="550" cy="94" r="9" fill="white" />
        <circle cx="550" cy="94" r="24" stroke="#A9B9D8" strokeOpacity=".4" />
      </svg>
      <span className="absolute bottom-1 left-[8%] text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
        Origen
      </span>
      <span className="absolute right-[1%] top-[1%] text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
        Destino
      </span>
      <span className="absolute bottom-[7%] right-[7%] rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
        En movimiento
      </span>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="hero-section"
      className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-primary-dark text-white"
    >
      <Image
        src="/images/lading/5.jpeg"
        alt=""
        fill
        sizes="100vw"
        aria-hidden
        data-landing="bg"
        className="object-cover opacity-40 blur-[2px]"
      />
      <div className="absolute inset-0 -z-0">
        <Image
          src="/images/lading/5.jpeg"
          alt="Operación de transporte y logística"
          fill
          priority
          sizes="100vw"
          data-landing="main"
          className="object-contain object-center"
        />
      </div>
      <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary-dark via-primary-dark/85 to-primary-dark/30" />
      <div className="absolute inset-0 -z-0 bg-gradient-to-t from-primary-dark via-transparent to-primary-dark/30" />
      <div className="hero-grid absolute inset-0 -z-0 opacity-35" />
      <div className="absolute -bottom-60 left-1/3 -z-0 h-[34rem] w-[34rem] rounded-full bg-primary-soft/30 blur-3xl" />
      <RouteOverlay />
      <Container className="relative z-10 flex min-h-[calc(100svh-5rem)] flex-col justify-end pb-10 pt-20 sm:pb-14">
        <div className="max-w-4xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.24em] text-[#C1CDE0]">
            Soluciones logísticas GALAGOM
          </p>
          <h1
            aria-label={HERO_HEADLINE}
            className="max-w-4xl text-[clamp(3rem,6.5vw,5rem)] font-bold leading-[1.02] tracking-[-0.04em]"
          >
            <TypewriterHeading />
          </h1>
          <p
            className="hero-reveal mt-7 max-w-[40rem] text-base leading-[1.7] text-white/80 sm:text-[17px]"
            style={{ animationDelay: "0.55s" }}
          >
            En{" "}
            <span className="font-semibold">SOLUCIONES LOGÍSTICAS GALAGOM</span>{" "}
            somos una empresa especializada y profesional en el ramo del
            transporte, con presencia en{" "}
            <span className="font-semibold">Quintana Roo</span> desde el año{" "}
            <span className="font-semibold">2007</span>. Contamos con la
            experiencia y el compromiso que nos permiten ser la solución líder e
            integral del transporte para todo tipo de necesidades, guiados
            siempre por nuestros valores de{" "}
            <span className="font-semibold">integridad</span> y{" "}
            <span className="font-semibold">honradez</span>.
          </p>
          <p
            className="hero-reveal mt-4 max-w-[40rem] text-sm font-semibold uppercase tracking-[0.16em] text-[#C1CDE0]"
            style={{ animationDelay: "0.7s" }}
          >
            Brindamos soluciones de transporte y logística con cobertura
            nacional en la República Mexicana, adaptadas a las necesidades de
            cada operación.
          </p>
          <div
            className="hero-reveal mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.85s" }}
          >
            <Button
              href="/#cotizar"
              size="large"
              className="!bg-white !text-primary shadow-lg hover:-translate-y-0.5 hover:shadow-xl"
            >
              Cotizar un flete{" "}
              <span
                className="ml-3 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                ↗
              </span>
            </Button>
          </div>
        </div>
        <div
          className="hero-reveal mt-14 grid grid-cols-1 gap-3 border-t border-white/20 pt-6 sm:grid-cols-2 lg:grid-cols-4"
          style={{ animationDelay: "1s" }}
        >
          <a
            href="#logistica"
            className="group flex flex-col gap-2 rounded-[var(--radius-md)] border border-white/25 bg-white/10 px-5 py-4 transition-all duration-200 hover:-translate-y-1 hover:bg-white/15 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="text-base font-extrabold tracking-tight sm:text-lg">
              Logística
            </span>
            <span className="text-xs leading-5 text-white/80">
              Coordinación y organización de tu operación logística
            </span>
          </a>
          <a
            href="#almacenaje"
            className="group flex flex-col gap-2 rounded-[var(--radius-md)] border border-white/25 bg-white/10 px-5 py-4 transition-all duration-200 hover:-translate-y-1 hover:bg-white/15 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="text-base font-extrabold tracking-tight sm:text-lg">
              Almacenaje
            </span>
            <span className="text-xs leading-5 text-white/80">
              Espacio y gestión de inventarios según tus necesidades
            </span>
          </a>
          <a
            href="#distribucion"
            className="group flex flex-col gap-2 rounded-[var(--radius-md)] border border-white/25 bg-white/10 px-5 py-4 transition-all duration-200 hover:-translate-y-1 hover:bg-white/15 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="text-base font-extrabold tracking-tight sm:text-lg">
              Distribución
            </span>
            <span className="text-xs leading-5 text-white/80">
              Coordinación del movimiento de tu mercancía hasta su destino
            </span>
          </a>
          <a
            href="#soluciones-3pl"
            className="group flex flex-col gap-2 rounded-[var(--radius-md)] border border-white/25 bg-white/10 px-5 py-4 transition-all duration-200 hover:-translate-y-1 hover:bg-white/15 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="text-base font-extrabold tracking-tight sm:text-lg">
              Soluciones 3PL
            </span>
            <span className="text-xs leading-5 text-white/80">
              Servicios logísticos integrados para tu operación
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}
