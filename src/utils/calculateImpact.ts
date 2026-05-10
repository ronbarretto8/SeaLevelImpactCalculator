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

const REGION_STATS: Record<string, { elevation: number, density: number, area: number, gdp: number }> = {
  mumbai: { elevation: 2, density: 20000, area: 150, gdp: 500 },
  chennai: { elevation: 3, density: 15000, area: 120, gdp: 300 },
  kolkata: { elevation: 1.5, density: 24000, area: 180, gdp: 280 },
  goa: { elevation: 4, density: 3000, area: 80, gdp: 150 },
  kerala: { elevation: 3, density: 8000, area: 140, gdp: 200 },
  sundarbans: { elevation: 1, density: 5000, area: 250, gdp: 50 },
  odisha: { elevation: 2.5, density: 7000, area: 160, gdp: 120 },
  gujarat: { elevation: 3.5, density: 6000, area: 130, gdp: 180 }
};

export function calculateImpact(state: AtlasState, regionOverride?: Region): ImpactResult {
  const region = regionOverride ?? getRegionByName(state.region);
  const scenarioMultiplier = SCENARIOS[state.scenario].multiplier;
  const stats = REGION_STATS[region.id] || REGION_STATS.mumbai;

  const seaLevelRise = state.seaLevel * scenarioMultiplier;
  
  // Formulas as requested
  const areaKm2 = stats.area * (seaLevelRise / stats.elevation);
  const population = (areaKm2 * stats.density * state.popDensity) / 1000; // in thousands
  const economic = areaKm2 * stats.gdp * state.infraSensitivity; // in millions

  // Compute fixed worst-case maximums for absolute normalization
  const absoluteMaxSeaLevel = 3.0 * 1.5; // 4.5 meters
  const absoluteMaxArea = Math.max(...REGIONS.map(r => {
    const s = REGION_STATS[r.id] || REGION_STATS.mumbai;
    return s.area * (absoluteMaxSeaLevel / s.elevation);
  }));
  const absoluteMaxPop = Math.max(...REGIONS.map(r => {
    const s = REGION_STATS[r.id] || REGION_STATS.mumbai;
    const area = s.area * (absoluteMaxSeaLevel / s.elevation);
    return (area * s.density * 2.0) / 1000;
  }));
  const absoluteMaxEcon = Math.max(...REGIONS.map(r => {
    const s = REGION_STATS[r.id] || REGION_STATS.mumbai;
    const area = s.area * (absoluteMaxSeaLevel / s.elevation);
    return area * s.gdp * 2.0;
  }));
  const absoluteMaxStorm = 1.5;
  const absoluteMaxEnv = Math.max(...REGIONS.map(r => {
    const s = REGION_STATS[r.id] || REGION_STATS.mumbai;
    return 1 / (s.elevation + 0.1);
  }));


  // Weighted components (percentages sum to 100)
  const weights = {
    seaLevel: 0.30,
    pop: 0.20,
    infra: 0.20,
    storm: 0.15,
    econ: 0.10,
    env: 0.05,
  };

  const slrFactor = seaLevelRise / absoluteMaxSeaLevel;

  const seaLevelScore = slrFactor * weights.seaLevel * 100;
  const popScore = (population / absoluteMaxPop) * weights.pop * 100;
  const infraScore = (state.infraSensitivity / 2.0) * slrFactor * weights.infra * 100; // scale by SLR
  const stormScore = (scenarioMultiplier / absoluteMaxStorm) * slrFactor * weights.storm * 100; // scale by SLR
  const econScore = (economic / absoluteMaxEcon) * weights.econ * 100;
  const envScore = ((1 / (stats.elevation + 0.1)) / absoluteMaxEnv) * slrFactor * weights.env * 100; // scale by SLR

  const rawScore = seaLevelScore + popScore + infraScore + stormScore + econScore + envScore;
  const riskScore = Math.min(100, Math.max(0, Math.round(rawScore)));



  const areaPct = (areaKm2 / region.baseArea) * 100;

  // Determine risk label based on new thresholds
  let riskLabel: ImpactResult["riskLabel"] = "Low";
  if (riskScore >= 81) riskLabel = "Extreme";
  else if (riskScore >= 61) riskLabel = "Severe";
  else if (riskScore >= 41) riskLabel = "Significant";
  else if (riskScore >= 21) riskLabel = "Moderate";
  else riskLabel = "Minimal";

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