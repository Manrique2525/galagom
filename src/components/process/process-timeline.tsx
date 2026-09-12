"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ProcessStep } from "@/data/process";

export default function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const reducedMotion = useReducedMotion();
  return <div className="relative lg:pl-10"><div className="absolute bottom-6 left-5 top-6 w-px bg-primary/15" aria-hidden="true"><motion.div className="h-full origin-top bg-primary-soft" initial={false} whileInView={reducedMotion ? undefined : { scaleY: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease: "easeInOut" }} /></div><ol className="relative space-y-7 sm:space-y-8">{steps.map((step, index) => <motion.li key={step.number} className="grid grid-cols-[2.5rem_1fr] gap-5" initial={false} whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, delay: index * 0.08 }}><span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-white text-xs font-extrabold text-primary">{step.number}</span><div className="border-b border-border pb-7 pt-1 last:border-0"><div className="flex items-baseline justify-between gap-4"><h3 className="text-xl font-extrabold tracking-[-0.025em] text-text">{step.title}</h3><span className="hidden text-xs font-bold uppercase tracking-[0.16em] text-secondary sm:block">Etapa {step.number}</span></div><p className="mt-2 max-w-md text-sm leading-6 text-text-muted">{step.description}</p></div></motion.li>)}</ol></div>;
}
