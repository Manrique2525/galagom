export type CoverageLocation = {
  name: string;
  detail: string;
  position: { lat: number; lng: number };
  primary?: boolean;
};

export const coverageLocations: CoverageLocation[] = [
  { name: "Tijuana", detail: "Cobertura nacional", position: { lat: 32.5149, lng: -117.0382 } },
  { name: "Cancún, Quintana Roo", detail: "Presencia GALAGOM", position: { lat: 21.1619, lng: -86.8515 }, primary: true },
];