"use client";

import { motion, useReducedMotion } from "motion/react";
import { threePlServices } from "@/data/three-pl";

export default function ThreePlNetwork() {
  const reducedMotion = useReducedMotion();
  return <div className="relative mt-12 lg:mt-0"><div className="absolute bottom-10 left-1/2 top-10 w-px -translate-x-1/2 bg-white/20 lg:bottom-auto lg:left-0 lg:right-0 lg:top-1/2 lg:h-px lg:w-auto lg:translate-x-0" aria-hidden="true"><motion.div className="h-full w-full origin-top bg-[#A9B9D8] lg:origin-left" initial={false} whileInView={reducedMotion ? undefined : { scaleY: 1, scaleX: 1 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.9, ease: "easeInOut" }} /></div><div className="relative grid gap-4 lg:grid-cols-5 lg:gap-5">{threePlServices.map((service, index) => <motion.div key={service} className="flex items-center gap-5 lg:block lg:text-center" initial={false} whileInView={reducedMotion ? undefined : { opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.4, delay: index * 0.09 }}><span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/35 bg-primary-dark text-[10px] font-bold uppercase tracking-[0.12em] text-[#A9B9D8] lg:mx-auto">{index === 0 ? "3PL" : `0${index}`}</span><span className="text-sm font-semibold text-white/75 lg:mt-5 lg:block">{service}</span></motion.div>)}</div></div>;
}
