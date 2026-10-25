"use client";

import { motion, useReducedMotion } from "motion/react";
import { threePlServices } from "@/data/three-pl";

const POSITIONS = [
  { top: "18%", left: "12%" },
  { top: "18%", left: "88%" },
  { top: "82%", left: "16%" },
  { top: "82%", left: "84%" },
  { top: "6%", left: "50%" },
];

export default function ThreePlNetwork() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="relative">
      <div className="relative mx-auto hidden aspect-[4/3] w-full max-w-[720px] lg:block" aria-label="Diagrama de soluciones 3PL">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 720 540" fill="none" aria-hidden="true" focusable="false">
          {POSITIONS.map((pos, index) => {
            const cx = (parseFloat(pos.left) / 100) * 720;
            const cy = (parseFloat(pos.top) / 100) * 540;
            return <line key={`line-${index}`} x1="360" y1="270" x2={cx} y2={cy} stroke="rgba(169, 185, 216, 0.5)" strokeWidth="1.6" />;
          })}
        </svg>
        <motion.div className="absolute left-1/2 top-1/2 z-10 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#A9B9D8]/60 bg-primary text-xl font-extrabold tracking-[-0.03em] text-white shadow-[0_0_0_20px_rgba(169,185,216,0.08)]" initial={false} whileInView={reducedMotion ? undefined : { scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>3PL</motion.div>
        {threePlServices.map((service, index) => (
          <motion.div key={service} className="absolute z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-primary-dark px-2 text-center text-[11px] font-semibold leading-tight text-white shadow-sm" style={POSITIONS[index]} initial={false} whileInView={reducedMotion ? undefined : { opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.15 + index * 0.08 }}>{service}</motion.div>
        ))}
      </div>
      <div className="relative lg:hidden">
        <div className="absolute bottom-6 left-8 top-24 w-px bg-white/30" aria-hidden="true" />
        <motion.div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-[#A9B9D8]/60 bg-primary text-lg font-extrabold text-white shadow-[0_0_0_16px_rgba(169,185,216,0.08)]" initial={false} whileInView={reducedMotion ? undefined : { opacity: 1 }} viewport={{ once: true }}>3PL</motion.div>
        <div className="mt-12 space-y-4">
          {threePlServices.map((service, index) => (
            <motion.div key={service} className="relative flex items-center gap-4" initial={false} whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.1 + index * 0.06 }}>
              <div className="relative z-10 flex h-18 w-18 shrink-0 items-center justify-center rounded-full border border-white/30 bg-primary-dark text-center text-[10px] font-semibold leading-tight text-white" style={{ width: "72px", height: "72px" }}>{service}</div>
              <div className="flex-1 rounded-[var(--radius-md)] border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/90">{service}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
