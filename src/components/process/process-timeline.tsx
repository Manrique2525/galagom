"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ProcessStep } from "@/data/process";

export default function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const reducedMotion = useReducedMotion();
  return <div className="relative mt-12 lg:mt-16">
    <div className="absolute bottom-auto left-5 top-5 h-[calc(100%-2.5rem)] w-px bg-primary/15 lg:bottom-0 lg:left-0 lg:top-5 lg:h-px lg:w-full" aria-hidden="true"><motion.div className="h-full origin-top bg-primary-soft lg:h-px lg:origin-left" initial={reducedMotion ? { scaleY: 1, scaleX: 1 } : { scaleY: 0, scaleX: 0 }} whileInView={reducedMotion ? undefined : { scaleY: 1, scaleX: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1, ease: "easeInOut" }} /></div>
    <ol className="relative grid gap-8 lg:grid-cols-5 lg:gap-5">
      {steps.map((step, index) => <motion.li key={step.number} className="grid grid-cols-[2.5rem_1fr] gap-5 lg:block" initial={reducedMotion ? false : { opacity: 0, y: 12 }} whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, delay: index * 0.1 }}>
        <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-white text-xs font-extrabold text-primary">{step.number}</span>
        <div className="pt-1 lg:mt-8 lg:pr-4"><h3 className="text-lg font-extrabold text-text">{step.title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-text-muted">{step.description}</p></div>
      </motion.li>)}
    </ol>
  </div>;
}
