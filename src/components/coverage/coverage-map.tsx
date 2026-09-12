"use client";

import { motion, useReducedMotion } from "motion/react";

const routes = [
  "M292 145 C 274 123, 247 105, 224 87",
  "M292 145 C 323 143, 343 145, 368 153",
  "M292 145 C 333 184, 378 220, 422 272",
];

const destinations = [
  { name: "Cancún", x: 292, y: 145, labelX: 307, labelY: 149, primary: true },
  { name: "Holbox", x: 224, y: 87, labelX: 239, labelY: 83, primary: false },
  { name: "Isla Mujeres", x: 368, y: 153, labelX: 383, labelY: 157, primary: false },
  { name: "Cozumel", x: 422, y: 272, labelX: 437, labelY: 276, primary: false },
] as const;

function MapPin({ x, y, labelX, labelY, name, primary, index, reducedMotion }: (typeof destinations)[number] & { index: number; reducedMotion: boolean }) {
  return <motion.g initial={false} whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.35, delay: index * 0.1 }}>
    <path d={`M${x} ${y}c-9-10-13-15-13-23a13 13 0 1 1 26 0c0 8-4 13-13 23Z`} fill="#DC2626" stroke="#B91C1C" strokeWidth="1.5" />
    <circle cx={x} cy={y - 23} r={primary ? 4.5 : 4} fill="white" />
    <text x={labelX} y={labelY} fill="#203050" fontSize={primary ? "14" : "13"} fontWeight={primary ? "700" : "600"}>{name}</text>
  </motion.g>;
}

export default function CoverageMap() {
  const reducedMotion = useReducedMotion();
  return <svg className="h-auto w-full" viewBox="0 0 560 360" fill="none" aria-hidden="true" focusable="false">
    <rect width="560" height="360" rx="18" fill="#EAF3F7" />
    <path d="M0 70C88 42 155 55 221 42S368 21 560 61M0 225c101-38 176-22 268-47s184-35 292-8M20 328c97-28 168-17 259-39s189-8 281 13" stroke="#D4E7EE" strokeWidth="2" />
    <path d="M180 37c32-9 68-3 95 13 35 21 54 45 62 76 7 28 9 44 33 66 22 20 48 39 62 70 12 26 16 48 9 72-57 21-127 17-193 4-58-12-105-34-134-67-31-35-37-84-24-129 13-46 47-89 90-105Z" fill="#F7F5EA" stroke="#D4D8D2" strokeWidth="2" />
    <path d="M224 45c-21 37-31 67-25 96 6 29 25 47 24 78-1 38-26 61-20 91M268 39c-10 41-10 70 8 99 17 27 44 35 49 69 5 35-10 62-4 92M321 54c-4 30 6 52 27 75 20 21 42 31 50 60 9 30 0 57 16 81" stroke="#E1E2D9" strokeWidth="1.5" />
    <path d="M184 135c45 8 88 8 125-3 36-11 60-7 96 16M176 205c56-20 106-23 153-7 44 15 70 14 103 2M210 266c43-12 82-12 120 3 31 12 56 12 88 3" stroke="#D9DCD6" strokeWidth="2" strokeLinecap="round" />
    <path d="M209 106c19 12 42 21 62 25M340 180c19 13 34 29 43 50M244 290c21 7 40 10 61 8" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <path d="M272 109C254 126 239 140 221 154M302 125c20 11 37 23 53 39M323 175c31 23 55 48 73 82" stroke="#B8C9CF" strokeWidth="1.5" strokeDasharray="4 7" />
    {routes.map((route) => <motion.path key={route} d={route} stroke="#30466F" strokeWidth="2" strokeDasharray="6 7" strokeLinecap="round" initial={false} whileInView={reducedMotion ? undefined : { pathLength: 1, opacity: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.85, ease: "easeInOut" }} />)}
    {destinations.map((destination, index) => <MapPin {...destination} index={index} reducedMotion={Boolean(reducedMotion)} key={destination.name} />)}
    <text x="34" y="326" fill="#73868D" fontSize="11" fontWeight="700" letterSpacing="2">QUINTANA ROO</text>
    <text x="456" y="326" fill="#9AAEB5" fontSize="10" textAnchor="end">RUTAS GALAGOM</text>
  </svg>;
}
