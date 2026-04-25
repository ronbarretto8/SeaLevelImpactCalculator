import { REGIONS, SCENARIOS, ScenarioKey, Region } from "@/data/regions";

export interface AtlasState {
  region: string;        // region.name
  seaLevel: number;      // meters
  scenario: ScenarioKey;
  popDensity: number;    // multiplier
  infraSensitivity: number; // multiplier
}

export interface ImpactResult {
  region: Region;
  scenario: ScenarioKey;
  seaLevel: number;
  areaKm2: number;
  areaPct: number;
  population: number;     // thousands of people displaced
  economic: number;       // USD millions
  riskScore: number;      // 0–100
  riskLabel: "Low" | "Moderate" | "High";
}

export const DEFAULT_STATE: AtlasState = {
  region: "Mumbai Coastline",
  seaLevel: 1.0,
  scenario: "moderate",
  popDensity: 1.0,
  infraSensitivity: 1.0,
};

export function getRegionByName(name: string): Region {
  return REGIONS.find(r => r.name === name) ?? REGIONS[0];
}

export function calculateImpact(state: AtlasState, regionOverride?: Region): ImpactResult {
  const region = regionOverride ?? getRegionByName(state.region);
  const scenarioMultiplier = SCENARIOS[state.scenario].multiplier;

  const areaKm2 = state.seaLevel * 15 * scenarioMultiplier;
  const areaPct = (areaKm2 / region.baseArea) * 100;
  const population = areaKm2 * state.popDensity * 0.5; // thousands
  const economic = population * state.infraSensitivity * 10; // USD millions

  const popRatio = Math.min(population / region.basePopulation, 1);
  const econRatio = Math.min(economic / 500, 1);

  const riskScore = Math.min(
    100,
    (areaPct * 0.4) + (popRatio * 100 * 0.35) + (econRatio * 100 * 0.25)
  );

  let riskLabel: ImpactResult["riskLabel"] = "Low";
  if (riskScore >= 70) riskLabel = "High";
  else if (riskScore >= 30) riskLabel = "Moderate";

  return {
    region,
    scenario: state.scenario,
    seaLevel: state.seaLevel,
    areaKm2,
    areaPct,
    population,
    economic,
    riskScore,
    riskLabel,
  };
}

export function calculateAllRegions(state: AtlasState): ImpactResult[] {
  return REGIONS.map(r => calculateImpact(state, r));
}

export const fmt = {
  km2: (n: number) => n.toFixed(1),
  pct: (n: number) => n.toFixed(1) + "%",
  pop: (n: number) => {
    // n in thousands
    if (n >= 1000) return (n / 1000).toFixed(2) + "M";
    return n.toFixed(1) + "K";
  },
  usd: (n: number) => {
    // n in millions
    if (n >= 1000) return "$" + (n / 1000).toFixed(2) + "B";
    return "$" + n.toFixed(1) + "M";
  },
  m: (n: number) => n.toFixed(2) + " m",
  score: (n: number) => n.toFixed(0),
};

export function recommendations(result: ImpactResult): { title: string; detail: string; priority: "Critical" | "High" | "Strategic" }[] {
  const r = result.riskScore;
  const list: { title: string; detail: string; priority: "Critical" | "High" | "Strategic" }[] = [];
  if (r >= 70) {
    list.push({ priority: "Critical", title: "Phased managed retreat", detail: "Initiate relocation of critical assets from sub-1m elevation zones with 10-year horizon." });
    list.push({ priority: "Critical", title: "Hard coastal defense", detail: "Engineered seawalls + tidal barriers along high-density urban frontage." });
    list.push({ priority: "High",     title: "Mangrove restoration", detail: "Re-establish 30+ km of natural buffers to dissipate surge energy." });
  } else if (r >= 30) {
    list.push({ priority: "High",      title: "Adaptive zoning rules", detail: "Restrict new construction below the projected 2050 inundation line." });
    list.push({ priority: "High",      title: "Stormwater & drainage upgrade", detail: "Increase pumping capacity by 40% and decouple sewer/stormwater systems." });
    list.push({ priority: "Strategic", title: "Living shorelines",      detail: "Hybrid green-grey infrastructure along estuarine boundaries." });
  } else {
    list.push({ priority: "Strategic", title: "Long-term monitoring",   detail: "Deploy tide-gauge + InSAR subsidence network for continuous baseline." });
    list.push({ priority: "Strategic", title: "Ecosystem preservation", detail: "Protect existing wetlands and dunes as natural first defense." });
    list.push({ priority: "Strategic", title: "Community resilience",   detail: "Public early-warning drills and insurance product design." });
  }
  return list;
}