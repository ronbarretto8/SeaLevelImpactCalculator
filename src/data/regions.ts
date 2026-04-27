export type Region = {
  id: string;
  name: string;
  shortName: string;
  basePopulation: number; // thousands
  baseArea: number; // km2 of low-lying / vulnerable coastal zone
  stormSurge: number; // meters
  lat: number;
  lng: number;
  state: string;
  highlight: string;
};

// Exact dataset values: (basePopulation in thousands, baseArea km2, stormSurge m)
// Mumbai 420 / 20.4 / 0.8, Chennai 310 / 11.0 / 0.9, Kolkata 580 / 15.2 / 1.1, Goa 105 / 1.5 / 0.6,
// Kerala 245 / 8.3 / 0.7, Sundarbans 960 / 4.7 / 1.1, Odisha 380 / 9.1 / 1.0, Gujarat 510 / 7.6 / 0.8
export const REGIONS: Region[] = [
  { id: "mumbai",     name: "Mumbai Coastline",     shortName: "Mumbai",     basePopulation: 420, baseArea: 20.4, stormSurge: 0.8, lat: 19.0760, lng: 72.8777, state: "Maharashtra", highlight: "India's financial capital, dense low-lying reclaimed land." },
  { id: "chennai",    name: "Chennai Coast",        shortName: "Chennai",    basePopulation: 310, baseArea: 11.0, stormSurge: 0.9, lat: 13.0827, lng: 80.2707, state: "Tamil Nadu",   highlight: "Marina belt and IT corridor exposed to surge." },
  { id: "kolkata",    name: "Kolkata Delta",        shortName: "Kolkata",    basePopulation: 580, baseArea: 15.2, stormSurge: 1.1, lat: 21.6805, lng: 87.9563, state: "West Bengal",  highlight: "Hooghly delta — riverine + tidal compounded risk." },
  { id: "goa",        name: "Goa Shoreline",        shortName: "Goa",        basePopulation: 105, baseArea: 1.5,  stormSurge: 0.6, lat: 15.4909, lng: 73.8278, state: "Goa",          highlight: "Tourism-dependent beaches and estuaries." },
  { id: "kerala",     name: "Kerala Backwaters",    shortName: "Kerala",     basePopulation: 245, baseArea: 8.3,  stormSurge: 0.7, lat: 9.9312,  lng: 76.2673, state: "Kerala",       highlight: "Brackish backwaters and Kuttanad below sea level." },
  { id: "sundarbans", name: "Sundarbans",           shortName: "Sundarbans", basePopulation: 960, baseArea: 4.7,  stormSurge: 1.1, lat: 21.9497, lng: 88.9101, state: "West Bengal",  highlight: "World's largest mangrove — biodiversity hotspot." },
  { id: "odisha",     name: "Odisha Coast",         shortName: "Odisha",     basePopulation: 380, baseArea: 9.1,  stormSurge: 1.0, lat: 19.8135, lng: 85.8312, state: "Odisha",       highlight: "Cyclone-prone, repeated landfall corridor." },
  { id: "gujarat",    name: "Gujarat Gulf",         shortName: "Gujarat",    basePopulation: 510, baseArea: 7.6,  stormSurge: 0.8, lat: 21.666, lng: 72.383, state: "Gujarat",      highlight: "Gulf of Khambhat — industrial coastal belt." },
];

export const SCENARIOS = {
  optimistic: { label: "Optimistic", multiplier: 0.7, narrative: "RCP 2.6 — strong mitigation, limited warming." },
  moderate:   { label: "Moderate",   multiplier: 1.0, narrative: "RCP 4.5 — current policy trajectory." },
  severe:     { label: "Severe",     multiplier: 1.4, narrative: "RCP 8.5 — high emissions, accelerated melt." },
} as const;

export type ScenarioKey = keyof typeof SCENARIOS;