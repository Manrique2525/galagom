export type CoverageLocation = {
  name: string;
  detail: string;
  position: { lat: number; lng: number };
};

export const coverageLocations: CoverageLocation[] = [
  { name: "Ciudad de México", detail: "Cobertura nacional", position: { lat: 19.4326, lng: -99.1332 } },
  { name: "Guadalajara", detail: "Cobertura nacional", position: { lat: 20.6597, lng: -103.3496 } },
  { name: "Monterrey", detail: "Cobertura nacional", position: { lat: 25.6866, lng: -100.3161 } },
  { name: "Los Cabos", detail: "Cobertura nacional", position: { lat: 22.8905, lng: -109.9167 } },
];
