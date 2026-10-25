export type CoverageLocation = {
  name: string;
  detail: string;
  position: { lat: number; lng: number };
  headquarters?: boolean;
};

export const coverageLocations: CoverageLocation[] = [
  { name: "Ciudad de México", detail: "Cobertura nacional", position: { lat: 19.4326, lng: -99.1332 } },
  { name: "Guadalajara", detail: "Cobertura nacional", position: { lat: 20.6597, lng: -103.3496 } },
  { name: "Monterrey", detail: "Cobertura nacional", position: { lat: 25.6866, lng: -100.3161 } },
  { name: "Los Cabos", detail: "Cobertura nacional", position: { lat: 22.8905, lng: -109.9167 } },
  { name: "Tijuana", detail: "Cobertura nacional", position: { lat: 32.5149, lng: -117.0382 } },
  { name: "Cancún, Quintana Roo", detail: "Sede principal", position: { lat: 21.1619, lng: -86.8515 }, headquarters: true },
];
