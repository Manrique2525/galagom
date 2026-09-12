export const coverageDestinations = ["Cancún", "Holbox", "Isla Mujeres", "Cozumel"] as const;

export type CoverageDestination = (typeof coverageDestinations)[number];
