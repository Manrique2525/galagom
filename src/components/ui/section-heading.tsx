type SectionHeadingProps = { eyebrow?: string; heading: string; description?: string; align?: "left" | "center"; level?: 1 | 2; tone?: "dark" | "light" };

export default function SectionHeading({ eyebrow, heading, description, align = "left", level = 2, tone = "dark" }: SectionHeadingProps) {
  const Heading = level === 1 ? "h1" : "h2";
  const colors = tone === "light" ? "text-white" : "text-text";
  const mutedColors = tone === "light" ? "text-white/70" : "text-text-muted";
  const eyebrowColor = tone === "light" ? "text-[#A9B9D8]" : "text-secondary";
  return <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    {eyebrow && <p className={`mb-4 text-xs font-bold uppercase tracking-[0.2em] ${eyebrowColor}`}>{eyebrow}</p>}
    <Heading className={`text-3xl font-extrabold leading-tight tracking-[-0.03em] ${colors} sm:text-5xl`}>{heading}</Heading>
    {description && <p className={`mt-5 text-base leading-7 sm:text-lg ${mutedColors}`}>{description}</p>}
  </div>;
}
