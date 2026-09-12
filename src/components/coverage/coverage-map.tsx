"use client";

import { motion, useReducedMotion } from "motion/react";

const routes = ["M180 130 C 245 105, 260 76, 326 66", "M180 130 C 242 144, 300 151, 360 142", "M180 130 C 250 190, 318 221, 395 234"];
const nodes = [[180, 130], [326, 66], [360, 142], [395, 234]] as const;

export default function CoverageMap() {
  const reducedMotion = useReducedMotion();
  return <svg className="h-auto w-full" viewBox="0 0 500 300" fill="none" role="img" aria-label="Rutas abstractas desde Cancún hacia Holbox, Isla Mujeres y Cozumel" focusable="false">
    <path d="M144 38C185 19 259 20 318 45C380 70 445 104 451 163C457 221 407 265 337 278C264 291 188 271 132 236C76 201 32 154 54 103C70 67 103 48 144 38Z" fill="rgb(255 255 255 / .04)" stroke="rgb(169 185 216 / .42)" strokeWidth="1.5" />
    <path d="M121 62C185 45 278 54 346 86C403 113 424 164 397 208C369 254 291 258 221 236C150 214 92 177 88 128C85 98 98 75 121 62Z" stroke="rgb(255 255 255 / .1)" strokeDasharray="3 7" />
    {routes.map((route) => <motion.path key={route} d={route} stroke="#A9B9D8" strokeWidth="1.5" strokeDasharray="5 7" initial={false} whileInView={reducedMotion ? undefined : { pathLength: 1, opacity: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.9, ease: "easeInOut" }} />)}
    {nodes.map(([x, y], index) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r={index === 0 ? 8 : 5} fill={index === 0 ? "#FFFFFF" : "#A9B9D8"} /><circle cx={x} cy={y} r={index === 0 ? 17 : 12} stroke="#A9B9D8" strokeOpacity=".3" /></g>)}
    <text x="154" y="160" fill="white" fontSize="11" fontWeight="700">Cancún</text><text x="337" y="59" fill="rgb(255 255 255 / .7)" fontSize="10">Holbox</text><text x="370" y="139" fill="rgb(255 255 255 / .7)" fontSize="10">Isla Mujeres</text><text x="405" y="250" fill="rgb(255 255 255 / .7)" fontSize="10">Cozumel</text>
  </svg>;
}
