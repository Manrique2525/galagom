export type CoverageLocation = {
  name: string;
  position: { lat: number; lng: number };
  primary?: boolean;
};

export const coverageLocations: CoverageLocation[] = [
  { name: "Cancún", position: { lat: 21.16056, lng: -86.8475 }, primary: true },
  { name: "Holbox", position: { lat: 21.53778, lng: -87.22 } },
  { name: "Isla Mujeres", position: { lat: 21.233, lng: -86.733 } },
  { name: "Cozumel", position: { lat: 20.42, lng: -86.92 } },
];

export const coverageDestinations = coverageLocations.map(({ name }) => name);

export type CoverageDestination = (typeof coverageLocations)[number]["name"];
