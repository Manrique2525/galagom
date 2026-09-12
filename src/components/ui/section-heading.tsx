type SectionHeadingProps = { eyebrow?: string; heading: string; description?: string; align?: "left" | "center"; level?: 1 | 2 };

export default function SectionHeading({ eyebrow, heading, description, align = "left", level = 2 }: SectionHeadingProps) {
  const Heading = level === 1 ? "h1" : "h2";
  return <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    {eyebrow && <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-secondary">{eyebrow}</p>}
    <Heading className="text-3xl font-extrabold leading-tight tracking-[-0.03em] text-text sm:text-5xl">{heading}</Heading>
    {description && <p className="mt-5 text-base leading-7 text-text-muted sm:text-lg">{description}</p>}
  </div>;
}
