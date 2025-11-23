console.log("NEW VERSION LOADED - Data file selector enabled");

// Standardization weights
const ESP2013 = { R0_14: 0.156, R15_64: 0.654, R65_74: 0.080, R75_84: 0.066, R85p: 0.044 };
const WHO = { R0_14: 0.174, R15_64: 0.650, R65_74: 0.090, R75_84: 0.060, R85p: 0.026 };

// Country name mapping
const countryNames = {
  'AUS': 'Australia',
  'AUT': 'Austria', 
  'BEL': 'Belgium',
  'BGR': 'Bulgaria',
  'CAN': 'Canada',
  'CHE': 'Switzerland',
  'CHL': 'Chile',
  'CZE': 'Czech Republic',
  'DEUTNP': 'Germany',
  'DNK': 'Denmark',
  'ESP': 'Spain',
  'EST': 'Estonia',
  'FIN': 'Finland',
  'FRATNP': 'France',
  'GBRTENW': 'England & Wales',
  'GBR_NIR': 'Northern Ireland',
  'GBR_SCO': 'Scotland',
  'GRC': 'Greece',
  'HRV': 'Croatia',
  'HUN': 'Hungary',
  'ISL': 'Iceland',
  'ISR': 'Israel',
  'ITA': 'Italy',
  'LTU': 'Lithuania',
  'LUX': 'Luxembourg',
  'LVA': 'Latvia',
  'NLD': 'Netherlands',
  'NOR': 'Norway',
  'NZL_NP': 'New Zealand',
  'POL': 'Poland',
  'PRT': 'Portugal',
  'SVK': 'Slovakia',
  'SVN': 'Slovenia',
  'SWE': 'Sweden',
  'TWN': 'Taiwan',
  'USA': 'United States'
};

// GDP (PPP) per Capita data for 2019 - in international dollars
// Source: World Bank, IMF estimates
const gdpPPP2019 = {
  'AUS': 56770,
  'AUT': 55478,
  'BEL': 48238,
  'BGR': 24140,
  'CAN': 48922,
  'CHE': 68737,
  'CHL': 25344,
  'CZE': 38070,
  'DEUTNP': 57797,
  'DNK': 60293,
  'ESP': 40980,
  'EST': 35763,
  'FIN': 50358,
  'FRATNP': 45492,
  'GBRTENW': 50029,
  'GBR_NIR': 26844,
  'GBR_SCO': 37089,
  'GRC': 32511,
  'HRV': 30588,
  'HUN': 33777,
  'ISL': 55805,
  'ISR': 42882,
  'ITA': 42177,
  'LTU': 40523,
  'LUX': 118993,
  'LVA': 31664,
  'NLD': 55706,
  'NOR': 75495,
  'NZL_NP': 44927,
  'POL': 34524,
  'PRT': 35139,
  'SVK': 35145,
  'SVN': 38568,
  'SWE': 55494,
  'TWN': 59503,
  'USA': 65340
};

// GDP (Nominal) per Capita for 2019 - in US dollars
// NOTE: This will be replaced by data loaded from merged_data_2019.csv
const gdpPerCapita2019 = {};

// Data structures for factors from merged_data_2019.csv
// These will be populated when CSV is loaded
const gdpNominal2019 = {}; // GDP (nominal per capita) from CSV
const healthExpenditure2019 = {}; // Health Expenditure (%GDP)
const gini2019 = {}; // Inequality (GINI)
const poverty2019 = {}; // Poverty (% living below line)

// Population data for 2019 (in millions) - used for calculating lives saved
// Source: World Bank, UN estimates
const population2019 = {
  'AUS': 25.4,
  'AUT': 8.9,
  'BEL': 11.5,
  'BGR': 7.0,
  'CAN': 37.6,
  'CHE': 8.6,
  'CHL': 19.0,
  'CZE': 10.7,
  'DEUTNP': 83.2,
  'DNK': 5.8,
  'ESP': 47.0,
  'EST': 1.3,
  'FIN': 5.5,
  'FRATNP': 67.0,
  'GBRTENW': 56.3,
  'GBR_NIR': 1.9,
  'GBR_SCO': 5.5,
  'GRC': 10.7,
  'HRV': 4.1,
  'HUN': 9.8,
  'ISL': 0.4,
  'ISR': 9.1,
  'ITA': 60.2,
  'LTU': 2.8,
  'LUX': 0.6,
  'LVA': 1.9,
  'NLD': 17.3,
  'NOR': 5.4,
  'NZL_NP': 4.9,
  'POL': 38.0,
  'PRT': 10.3,
  'SVK': 5.5,
  'SVN': 2.1,
  'SWE': 10.3,
  'TWN': 23.6,
  'USA': 328.2
};

// Cluster mapping
const countryClusters = {
  // Cluster 1: DNK, FIN, NOR, NZL_NP, AUS, ISL, TWN
  'DNK': 'Cluster 1',
  'FIN': 'Cluster 1',
  'NOR': 'Cluster 1',
  'NZL_NP': 'Cluster 1',
  'AUS': 'Cluster 1',
  'ISL': 'Cluster 1',
  'TWN': 'Cluster 1',
  
  // Cluster 2: PRT, ISR, GBRTENW, GBR_NIR, GBR_SCO, LUX, BEL, DEUTNP, NLD, CHE, FRATNP, SWE, CAN, ESP, GRC, ITA
  'PRT': 'Cluster 2',
  'ISR': 'Cluster 2',
  'GBRTENW': 'Cluster 2',
  'GBR_NIR': 'Cluster 2',
  'GBR_SCO': 'Cluster 2',
  'LUX': 'Cluster 2',
  'BEL': 'Cluster 2',
  'DEUTNP': 'Cluster 2',
  'NLD': 'Cluster 2',
  'CHE': 'Cluster 2',
  'FRATNP': 'Cluster 2',
  'SWE': 'Cluster 2',
  'CAN': 'Cluster 2',
  'ESP': 'Cluster 2',
  'GRC': 'Cluster 2',
  'ITA': 'Cluster 2',
  
  // Cluster 3: HUN, CHL, CZE, HRV, USA, EST, SVN, AUT
  'HUN': 'Cluster 3',
  'CHL': 'Cluster 3',
  'CZE': 'Cluster 3',
  'HRV': 'Cluster 3',
  'USA': 'Cluster 3',
  'EST': 'Cluster 3',
  'SVN': 'Cluster 3',
  'AUT': 'Cluster 3',
  
  // Cluster 4: LVA, BGR, POL, LTU, SVK
  'LVA': 'Cluster 4',
  'BGR': 'Cluster 4',
  'POL': 'Cluster 4',
  'LTU': 'Cluster 4',
  'SVK': 'Cluster 4'
};

// Global state
const state = {
  dataByCountrySex: new Map(), // key: `${country}|${sex}` -> array of rows
  countries: new Set(),
  sexes: new Set(["b", "m", "f"]),
  currentStandard: "esp2013",
  // Dedicated permanent plot state
  dedicatedPermanentTraces: [], // Store traces for dedicated permanent plot
  dedicatedPermanentTraceMetadata: [], // Store metadata for dedicated permanent plot
  // Filter state
  currentFilter: 'All', // Current active filter
  visibleTraces: new Set(), // Set of visible trace indices
  selectedClusters: new Set(['Cluster 1','Cluster 2','Cluster 3','Cluster 4']),
  manualSelectedCountries: new Set(), // set of country codes added via +
  // Policy data
  policyDataByCountry: new Map(), // key: countryCode -> Map<policyVariable, array of {date, value}>
  availablePolicyVariables: [], // List of available policy variables
  policyVariableDescriptions: new Map(), // key: policyVariable -> description string
};

// Map our country codes to OxCGRT country codes (most are the same, but some differ)
const oxCGRTCountryCodeMap = {
  'AUS': 'AUS',
  'AUT': 'AUT',
  'BEL': 'BEL',
  'BGR': 'BGR',
  'CAN': 'CAN',
  'CHE': 'CHE',
  'CHL': 'CHL',
  'CZE': 'CZE',
  'DEUTNP': 'DEU', // Germany
  'DNK': 'DNK',
  'ESP': 'ESP',
  'EST': 'EST',
  'FIN': 'FIN',
  'FRATNP': 'FRA', // France
  'GBRTENW': 'GBR', // England & Wales -> use GBR
  'GBR_NIR': 'GBR', // Northern Ireland -> use GBR
  'GBR_SCO': 'GBR', // Scotland -> use GBR
  'GRC': 'GRC',
  'HRV': 'HRV',
  'HUN': 'HUN',
  'ISL': 'ISL',
  'ISR': 'ISR',
  'ITA': 'ITA',
  'LTU': 'LTU',
  'LUX': 'LUX',
  'LVA': 'LVA',
  'NLD': 'NLD',
  'NOR': 'NOR',
  'NZL_NP': 'NZL', // New Zealand
  'POL': 'POL',
  'PRT': 'PRT',
  'SVK': 'SVK',
  'SVN': 'SVN',
  'SWE': 'SWE',
  'TWN': 'TWN',
  'USA': 'USA'
};

// Utilities
function weekKey(week) {
  const w = String(week).padStart(2, "0");
  return `W${w}`;
}

function isoWeekToDate(year, week) {
  // Convert ISO year & week to approximate date: Monday of that ISO week
  const simple = new Date(Date.UTC(year, 0, 4)); // ISO week 1 has Jan 4th
  const dayOfWeek = simple.getUTCDay() || 7; // Mon=1..Sun=7
  const mondayOfWeek1 = new Date(simple);
  mondayOfWeek1.setUTCDate(simple.getUTCDate() - dayOfWeek + 1);
  const date = new Date(mondayOfWeek1);
  date.setUTCDate(mondayOfWeek1.getUTCDate() + (week - 1) * 7);
  return date; // UTC date
}

function parseYearWeek(yyw) {
  // Format: YYYY-Www
  const m = /^(\d{4})-W(\d{2})$/.exec(yyw.trim());
  if (!m) return null;
  return { year: Number(m[1]), week: Number(m[2]) };
}

function computeASMR100k(row, standard = 'esp2013') {
  const weights = standard === 'who' ? WHO : ESP2013;
  const value = (
    (Number(row.R0_14) || 0) * weights.R0_14 +
    (Number(row.R15_64) || 0) * weights.R15_64 +
    (Number(row.R65_74) || 0) * weights.R65_74 +
    (Number(row.R75_84) || 0) * weights.R75_84 +
    (Number(row.R85p)  || 0) * weights.R85p
  ) * 100000; // per 100k
  return value;
}

function tidyRows(rows, standard = 'esp2013') {
  return rows.map(r => {
    const year = Number(r.Year);
    const week = Number(r.Week);
    const wk = weekKey(week);
    const date = isoWeekToDate(year, week);
    const asmr = computeASMR100k(r, standard);
    return { ...r, Year: year, Week: week, week_key: wk, date, ASMR100k: asmr };
  }).sort((a,b) => a.Year === b.Year ? a.Week - b.Week : a.Year - b.Year);
}

// Load reproduction data from specified file
async function loadReproductionDataText(filename = "QPR-RSMEmin.txt") {
  // Add cache-busting to ensure we get fresh data
  const cacheBuster = `?t=${Date.now()}`;
  const paths = [
    `./data/${filename}${cacheBuster}`, // expected when deployed under docs/
    `../data/${filename}${cacheBuster}`, // local dev from project root
    `${filename}${cacheBuster}` // last resort (root)
  ];
  for (const p of paths) {
    try {
      const res = await fetch(p, { cache: 'no-store' });
      if (res.ok) {
        const text = await res.text();
        console.log(`Successfully loaded ${filename}, size: ${text.length} chars`);
        return text;
      }
    } catch (e) { 
      console.warn(`Failed to load from ${p}:`, e);
      /* try next */ 
    }
  }
  throw new Error(`Unable to load ${filename} from known paths.`);
}

function parseCSV(text) {
  // Lightweight CSV parser (no quoted commas in HMD wide format expected)
  const allLines = text.split(/\r?\n/);
  console.log("Total lines in CSV:", allLines.length);
  
  // find header: first non-empty, non-comment line
  let headerLineIndex = -1;
  for (let i=0;i<allLines.length;i++) {
    const t = allLines[i].trim();
    if (!t) continue;
    if (t.startsWith("#")) continue; // skip metadata/comment lines
    headerLineIndex = i; break;
  }
  
  console.log("Header line index:", headerLineIndex);
  if (headerLineIndex === -1) return [];
  
  const header = allLines[headerLineIndex].split(",").map(s => s.trim());
  console.log("Header:", header);
  
  const ignore = new Set(["Split", "SplitSex", "Forecast"]);
  const rows = [];
  for (let i=headerLineIndex+1;i<allLines.length;i++) {
    const line = allLines[i];
    if (!line || !line.trim() || line.trim().startsWith("#")) continue;
    const cols = line.split(",");
    if (cols.length !== header.length) continue;
    const obj = {};
    for (let j=0;j<header.length;j++) {
      const key = header[j];
      if (ignore.has(key)) continue;
      const val = cols[j];
      obj[key] = val === "" ? null : val;
    }
    rows.push(obj);
  }
  
  console.log("Parsed rows:", rows.length);
  return rows;
}

function splitByCountrySex(rows) {
  const byKey = new Map();
  for (const r of rows) {
    const country = r.CountryCode;
    const sex = (r.Sex || "b").toLowerCase();
    const key = `${country}|${sex}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(r);
  }
  return byKey;
}

function getWindow(rows, fromYW, toYW) {
  return rows.filter(r => {
    const k = r.Year * 100 + r.Week;
    return k >= (fromYW.year*100 + fromYW.week) && k <= (toYW.year*100 + toYW.week);
  });
}

// Interpolate missing R* inside baseline window only (linear on ASMR for simplicity)
function interpolateInsideWindow(rows) {
  const arr = rows.slice();
  // Using ASMR100k already computed; fill short internal gaps <= 3 weeks
  let i = 0;
  while (i < arr.length) {
    if (arr[i].ASMR100k != null && !isNaN(arr[i].ASMR100k)) { i++; continue; }
    let j = i;
    while (j < arr.length && (arr[j].ASMR100k == null || isNaN(arr[j].ASMR100k))) j++;
    const gapLen = j - i;
    const left = i-1 >=0 ? arr[i-1] : null;
    const right = j < arr.length ? arr[j] : null;
    if (gapLen > 0 && gapLen <= 3 && left && right && isFinite(left.ASMR100k) && isFinite(right.ASMR100k)) {
      for (let g=0; g<gapLen; g++) {
        const t = (g+1)/(gapLen+1);
        arr[i+g].ASMR100k = left.ASMR100k*(1-t) + right.ASMR100k*t;
        arr[i+g].__interpolated = true;
      }
    }
    i = j;
  }
  return arr;
}

// Baselines
function seasonalBaseline(allRows, fromYW, toYW) {
  const window = getWindow(allRows, fromYW, toYW);
  const windowInterp = interpolateInsideWindow(window);
  const byWeek = new Map();
  for (const r of windowInterp) {
    const wk = r.week_key;
    if (!byWeek.has(wk)) byWeek.set(wk, []);
    if (isFinite(r.ASMR100k)) byWeek.get(wk).push(r.ASMR100k);
  }
  const means = new Map();
  for (const [wk, arr] of byWeek) {
    if (wk === "W53" && arr.length < 2) continue; // conservative handling
    const m = arr.reduce((a,b)=>a+b,0)/arr.length;
    means.set(wk, m);
  }
  return allRows.map(r => means.get(r.week_key) ?? null);
}

function flatBaseline(allRows, fromYW, toYW) {
  const window = interpolateInsideWindow(getWindow(allRows, fromYW, toYW));
  const values = window.map(r => r.ASMR100k).filter(v => isFinite(v));
  const mean = values.length ? values.reduce((a,b)=>a+b,0)/values.length : null;
  return allRows.map(() => mean);
}

function linearBaseline(allRows, fromYW, toYW) {
  const window = interpolateInsideWindow(getWindow(allRows, fromYW, toYW));
  const xs = [], ys = [];
  for (const r of window) {
    if (!isFinite(r.ASMR100k)) continue;
    const x = r.Year*100 + r.Week; // monotonic index
    xs.push(x); ys.push(r.ASMR100k);
  }
  if (xs.length < 2) return allRows.map(() => null);
  const n = xs.length;
  const sumX = xs.reduce((a,b)=>a+b,0);
  const sumY = ys.reduce((a,b)=>a+b,0);
  const sumXX = xs.reduce((a,b)=>a+b*b,0);
  const sumXY = xs.reduce((a,xi,i)=>a + xi*ys[i],0);
  const denom = n*sumXX - sumX*sumX;
  if (denom === 0) return allRows.map(() => null);
  const slope = (n*sumXY - sumX*sumY)/denom;
  const intercept = (sumY - slope*sumX)/n;
  return allRows.map(r => intercept + slope*(r.Year*100 + r.Week));
}

function rollingBaseline(allRows, fromYW, toYW) {
  // Rolling mean within baseline window; use 5-week centered window as default
  const window = interpolateInsideWindow(getWindow(allRows, fromYW, toYW));
  const indexSet = new Set(window.map(r => r.Year*100 + r.Week));
  const byIndex = new Map(window.map(r => [r.Year*100 + r.Week, r.ASMR100k]));
  const k = 2; // half window
  function meanAround(idx) {
    const vals = [];
    for (let d=-k; d<=k; d++) {
      const j = idx + d;
      if (indexSet.has(j)) {
        const v = byIndex.get(j);
        if (isFinite(v)) vals.push(v);
      }
    }
    if (vals.length === 0) return null;
    return vals.reduce((a,b)=>a+b,0)/vals.length;
  }
  const baselineByIndex = new Map();
  for (const idx of indexSet) baselineByIndex.set(idx, meanAround(idx));
  return allRows.map(r => baselineByIndex.get(r.Year*100 + r.Week) ?? null);
}

function glmPoissonBaseline(allRows, fromYW, toYW) {
  console.log("GLM Poisson called with window:", fromYW, "to", toYW);
  const window = interpolateInsideWindow(getWindow(allRows, fromYW, toYW));
  console.log("GLM Poisson window size:", window.length);
  
  const xs = [], ys = [];
  for (const r of window) {
    if (!isFinite(r.ASMR100k) || r.ASMR100k <= 0) continue;
    const x = r.Year*100 + r.Week; // monotonic index
    xs.push(x); ys.push(r.ASMR100k);
  }
  console.log("GLM Poisson data points:", xs.length);
  
  if (xs.length < 3) {
    console.log("GLM Poisson: Not enough data points", xs.length);
    return allRows.map(() => null);
  }
  
  // Simplified approach: use log-linear regression
  const n = xs.length;
  const sumX = xs.reduce((a,b) => a+b, 0);
  const sumY = ys.map(y => Math.log(y)).reduce((a,b) => a+b, 0);
  const sumXX = xs.reduce((a,b) => a+b*b, 0);
  const sumXY = xs.reduce((a,xi,i) => a + xi*Math.log(ys[i]), 0);
  
  const det = n*sumXX - sumX*sumX;
  if (Math.abs(det) < 1e-10) {
    console.log("GLM Poisson: Singular matrix");
    return allRows.map(() => null);
  }
  
  const b = (n*sumXY - sumX*sumY)/det;
  const a = (sumY - b*sumX)/n;
  
  console.log("GLM Poisson coefficients: a =", a, "b =", b);
  
  const result = allRows.map(r => {
    const val = Math.exp(a + b * (r.Year*100 + r.Week));
    return isFinite(val) && val > 0 ? val : null;
  });
  
  console.log("GLM Poisson result:", result.filter(v => v !== null).length, "valid values");
  return result;
}

function quasiPoissonBaseline(allRows, fromYW, toYW) {
  console.log("Quasi Poisson called with window:", fromYW, "to", toYW);
  const window = interpolateInsideWindow(getWindow(allRows, fromYW, toYW));
  console.log("Quasi Poisson window size:", window.length);
  
  const xs = [], ys = [];
  for (const r of window) {
    if (!isFinite(r.ASMR100k) || r.ASMR100k <= 0) continue;
    const x = r.Year*100 + r.Week; // monotonic index
    xs.push(x); ys.push(r.ASMR100k);
  }
  console.log("Quasi Poisson data points:", xs.length);
  
  if (xs.length < 3) {
    console.log("Quasi Poisson: Not enough data points", xs.length);
    return allRows.map(() => null);
  }
  
  // First fit a standard Poisson regression (log-linear)
  const n = xs.length;
  const sumX = xs.reduce((a,b) => a+b, 0);
  const sumY = ys.map(y => Math.log(y)).reduce((a,b) => a+b, 0);
  const sumXX = xs.reduce((a,b) => a+b*b, 0);
  const sumXY = xs.reduce((a,xi,i) => a + xi*Math.log(ys[i]), 0);
  
  const det = n*sumXX - sumX*sumX;
  if (Math.abs(det) < 1e-10) {
    console.log("Quasi Poisson: Singular matrix");
    return allRows.map(() => null);
  }
  
  const b = (n*sumXY - sumX*sumY)/det;
  const a = (sumY - b*sumX)/n;
  
  console.log("Quasi Poisson initial coefficients: a =", a, "b =", b);
  
  // Calculate fitted values and residuals
  const fitted = ys.map((y, i) => Math.exp(a + b * xs[i]));
  const residuals = ys.map((y, i) => y - fitted[i]);
  
  // Calculate dispersion parameter (Pearson chi-squared statistic)
  const pearsonResiduals = residuals.map((res, i) => res / Math.sqrt(fitted[i]));
  const dispersion = pearsonResiduals.reduce((sum, res) => sum + res * res, 0) / (n - 2);
  
  console.log("Quasi Poisson dispersion parameter:", dispersion);
  
  // For quasi Poisson, we use the same coefficients but acknowledge overdispersion
  // The variance is now dispersion * mean instead of just mean
  const result = allRows.map(r => {
    const val = Math.exp(a + b * (r.Year*100 + r.Week));
    return isFinite(val) && val > 0 ? val : null;
  });
  
  console.log("Quasi Poisson result:", result.filter(v => v !== null).length, "valid values, dispersion:", dispersion);
  return result;
}

function computeBaseline(type, rows, fromYW, toYW) {
  switch (type) {
    case "seasonal": return seasonalBaseline(rows, fromYW, toYW);
    case "flat": return flatBaseline(rows, fromYW, toYW);
    case "linear": return linearBaseline(rows, fromYW, toYW);
    case "rolling": return rollingBaseline(rows, fromYW, toYW);
    case "glm": return glmPoissonBaseline(rows, fromYW, toYW);
    case "quasi_poisson": return quasiPoissonBaseline(rows, fromYW, toYW);
    default: return seasonalBaseline(rows, fromYW, toYW);
  }
}

function aggregateData(xData, yData, aggregation) {
  if (aggregation === 'weekly') {
    return { x: xData, y: yData };
  }
  
  const aggregated = [];
  const chunkSize = aggregation === 'quarterly' ? 13 : 
                   aggregation === '6monthly' ? 26 : 
                   aggregation === 'annual' ? 52 : 1;
  
  for (let i = 0; i < xData.length; i += chunkSize) {
    const chunkX = xData.slice(i, i + chunkSize);
    const chunkY = yData.slice(i, i + chunkSize);
    
    if (chunkX.length === 0) continue;
    
    // For cumulative data, use the last date and last value of the chunk (not average)
    const lastIndex = chunkX.length - 1;
    const x = chunkX[lastIndex];
    
    // For cumulative excess, take the last value (not average) - it's already cumulative
    const validY = chunkY.filter(y => y !== null && isFinite(y));
    const y = validY.length > 0 ? validY[validY.length - 1] : null;
    
    aggregated.push({ x, y });
  }
  
  return {
    x: aggregated.map(d => d.x),
    y: aggregated.map(d => d.y)
  };
}

// Dedicated permanent plot functions
function renderDedicatedPermanentChart(el) {
  console.log(`Rendering chart with ${state.dedicatedPermanentTraces.length} traces`);
  if (state.dedicatedPermanentTraces.length === 0) {
    console.log("No traces to render, showing empty chart");
    Plotly.react(el, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Date" }, yaxis: { title: "Cum. excess (ASMR per 100k)" },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  const aggregation = document.getElementById("permanentPlotAggregation")?.value || 'weekly';
  
  // Determine active cluster set; if none selected and no manual, show all
  const activeClusters = state.selectedClusters;
  const hasActive = activeClusters && activeClusters.size > 0;
  const hasManual = state.manualSelectedCountries && state.manualSelectedCountries.size > 0;
  
  // Filter traces based on active clusters OR manual additions
  let filteredTraces = state.dedicatedPermanentTraces.filter((trace, index) => {
    const metadata = state.dedicatedPermanentTraceMetadata[index];
    if (!hasActive && !hasManual) return false; // show blank if nothing selected
    const inCluster = hasActive ? activeClusters.has(countryClusters[metadata.country]) : false;
    const inManual = hasManual ? state.manualSelectedCountries.has(metadata.country) : false;
    return inCluster || inManual;
  });
  
  const aggregatedTraces = filteredTraces.map(trace => {
    const aggregated = aggregateData(trace.x, trace.y, aggregation);
    return {
      ...trace,
      x: aggregated.x,
      y: aggregated.y,
      name: trace.name
    };
  });
  
  console.log("Rendering traces:", aggregatedTraces.length);
  if (aggregatedTraces.length > 0) {
    console.log("First trace sample:", aggregatedTraces[0]);
    console.log("First trace x length:", aggregatedTraces[0].x.length);
    console.log("First trace y sample:", aggregatedTraces[0].y.slice(0, 10));
  }
  
  Plotly.react(el, aggregatedTraces, {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { title: "Date" }, yaxis: { title: "Cum. excess (ASMR per 100k)" },
    margin: { t: 20, r: 10, b: 40, l: 50 },
  }, { responsive: true, displayModeBar: false }).then(() => {
    console.log("Chart rendered successfully");
    el.on('plotly_click', (data) => {
      const filteredIndex = data.points[0].curveNumber;
      // Map back to original index by trace name
      const clickedName = aggregatedTraces[filteredIndex]?.name;
      const originalIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === clickedName);
      if (originalIndex >= 0) {
        showDedicatedTraceDetails(originalIndex);
      }
    });
  });
  
  // Update summary table
  updateSummaryTable(filteredTraces);
  
  // Update scatterplot
  renderScatterplot(filteredTraces);
  
  // Render policy explanatory power chart based on filtered traces
  renderPolicyExplanatoryPowerChart(filteredTraces);
  
  // Render residual explanatory power chart
  renderResidualExplanatoryPowerChart(filteredTraces);
}

// Global state for table sorting
let currentSortColumn = null;
let currentSortDirection = 'asc';

function updateSummaryTable(filteredTraces) {
  const container = document.getElementById('summaryTable');
  if (!container) return;
  
  if (filteredTraces.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  // Year start dates
  const yearStarts = [
    new Date('2021-01-01T00:00:00Z'),
    new Date('2022-01-01T00:00:00Z'),
    new Date('2023-01-01T00:00:00Z'),
    new Date('2024-01-01T00:00:00Z'),
    new Date('2025-01-01T00:00:00Z')
  ];
  
  // Process data for each trace
  const tableData = filteredTraces.map((trace) => {
    const values = yearStarts.map(yearStart => {
      let closestValue = null;
      let minDiff = Infinity;
      
      trace.x.forEach((date, idx) => {
        if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
          const diff = Math.abs(date - yearStart);
          if (diff < minDiff && date <= yearStart) {
            minDiff = diff;
            closestValue = trace.y[idx];
          }
        }
      });
      
      return closestValue;
    });
    
    return {
      name: trace.name,
      values: values
    };
  });
  
  // Sort data if needed
  let sortedData = [...tableData];
  if (currentSortColumn !== null) {
    sortedData.sort((a, b) => {
      const aVal = a.values[currentSortColumn];
      const bVal = b.values[currentSortColumn];
      
      // Handle null values
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return currentSortDirection === 'asc' ? 1 : -1;
      if (bVal === null) return currentSortDirection === 'asc' ? -1 : 1;
      
      const comparison = aVal - bVal;
      return currentSortDirection === 'asc' ? comparison : -comparison;
    });
  }
  
  // Create table
  let html = '<table class="summary-table"><thead><tr>';
  html += '<th>#</th>';
  html += '<th>Country</th>';
  html += '<th class="sortable" data-year="0">2020 <span class="sort-indicator"></span></th>';
  html += '<th class="sortable" data-year="1">2021 <span class="sort-indicator"></span></th>';
  html += '<th class="sortable" data-year="2">2022 <span class="sort-indicator"></span></th>';
  html += '<th class="sortable" data-year="3">2023 <span class="sort-indicator"></span></th>';
  html += '<th class="sortable" data-year="4">2024 <span class="sort-indicator"></span></th>';
  html += '</tr></thead><tbody>';
  
  sortedData.forEach((row, index) => {
    html += `<tr><td>${index + 1}</td><td>${row.name}</td>`;
    
    row.values.forEach(value => {
      if (value !== null) {
        html += `<td>${value.toFixed(0)}</td>`;
      } else {
        html += `<td>—</td>`;
      }
    });
    
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
  
  // Apply scrollable styles if in basic mode
  if (document.body.classList.contains('basic-mode')) {
    container.style.maxHeight = '200px';
    container.style.overflowY = 'auto';
    container.style.overflowX = 'auto';
  }
  
  // Add click handlers for sorting
  const sortableHeaders = container.querySelectorAll('.sortable');
  sortableHeaders.forEach((header, index) => {
    header.addEventListener('click', () => {
      if (currentSortColumn === index) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        currentSortColumn = index;
        currentSortDirection = 'asc';
      }
      
      // Update sort indicators
      sortableHeaders.forEach(h => {
        const indicator = h.querySelector('.sort-indicator');
        indicator.textContent = '';
      });
      
      const currentIndicator = header.querySelector('.sort-indicator');
      currentIndicator.textContent = currentSortDirection === 'asc' ? ' ↑' : ' ↓';
      
      // Re-render table
      updateSummaryTable(filteredTraces);
      
      // Re-render scatterplot with new year selection
      renderScatterplot(filteredTraces);
      
      // Render policy explanatory power chart based on filtered traces
      renderPolicyExplanatoryPowerChart(filteredTraces);
    });
  });
}

// Calculate average ASMR for a country for given year range
function calculateAverageASMR(rows, yearRange) {
  let years = [];
  
  if (yearRange.includes('-')) {
    // Range like "2018-2019"
    const [startYear, endYear] = yearRange.split('-').map(Number);
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
  } else {
    // Single year like "2019"
    years.push(Number(yearRange));
  }
  
  const filteredRows = rows.filter(r => years.includes(r.Year) && isFinite(r.ASMR100k));
  if (filteredRows.length === 0) return null;
  
  const sum = filteredRows.reduce((acc, r) => acc + r.ASMR100k, 0);
  return sum / filteredRows.length;
}

// Get X-axis value based on selection (ASMR, GDP, GINI, POVERTY, or HEALTH EXPENDITURE)
function getXAxisValue(country, rows, xAxisType) {
  if (xAxisType === 'gdp') {
    const val = gdpNominal2019[country] || null;
    if (val === null && country) {
      console.log(`No GDP data for country: ${country}`);
    }
    return val;
  } else if (xAxisType === 'gini') {
    const val = gini2019[country] || null;
    if (val === null && country) {
      console.log(`No GINI data for country: ${country}`);
    }
    return val;
  } else if (xAxisType === 'poverty') {
    const val = poverty2019[country] || null;
    if (val === null && country) {
      console.log(`No Poverty data for country: ${country}`);
    }
    return val;
  } else if (xAxisType === 'health_expenditure') {
    const val = healthExpenditure2019[country] || null;
    if (val === null && country) {
      console.log(`No Health Expenditure data for country: ${country}`);
    }
    return val;
  } else {
    // Default to ASMR (year range like "2019" or "2018-2019")
    return calculateAverageASMR(rows, xAxisType);
  }
}

// Fit polynomial trend line (curved) and calculate R²
function fitPolynomialTrend(xData, yData, degree = 2, allowNegative = false) {
  // Filter out invalid points
  const validPoints = [];
  for (let i = 0; i < xData.length; i++) {
    const validX = isFinite(xData[i]) && (allowNegative || xData[i] > 0);
    const validY = isFinite(yData[i]) && (allowNegative || yData[i] > 0);
    if (validX && validY) {
      validPoints.push({ x: xData[i], y: yData[i] });
    }
  }
  
  if (validPoints.length < degree + 1) return null;
  
  // Simple polynomial regression using least squares
  const n = validPoints.length;
  const xs = validPoints.map(p => p.x);
  const ys = validPoints.map(p => p.y);
  
  // Build coefficient matrix for polynomial regression
  const X = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j <= degree; j++) {
      row.push(Math.pow(xs[i], j));
    }
    X.push(row);
  }
  
  // Solve using normal equations: (X^T * X) * coeffs = X^T * Y
  const XT = [];
  for (let j = 0; j <= degree; j++) {
    const row = [];
    for (let i = 0; i < n; i++) {
      row.push(X[i][j]);
    }
    XT.push(row);
  }
  
  // XTX = X^T * X
  const XTX = [];
  for (let i = 0; i <= degree; i++) {
    const row = [];
    for (let j = 0; j <= degree; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += XT[i][k] * X[k][j];
      }
      row.push(sum);
    }
    XTX.push(row);
  }
  
  // XTY = X^T * Y
  const XTY = [];
  for (let i = 0; i <= degree; i++) {
    let sum = 0;
    for (let k = 0; k < n; k++) {
      sum += XT[i][k] * ys[k];
    }
    XTY.push(sum);
  }
  
  // Solve linear system using Gaussian elimination (simplified)
  const coeffs = solveLinearSystem(XTX, XTY);
  if (!coeffs) return null;
  
  // Calculate R²
  const yMean = ys.reduce((a, b) => a + b, 0) / n;
  let ssRes = 0; // Sum of squares of residuals
  let ssTot = 0; // Total sum of squares
  
  for (let i = 0; i < n; i++) {
    // Predicted value
    let yPred = 0;
    for (let j = 0; j <= degree; j++) {
      yPred += coeffs[j] * Math.pow(xs[i], j);
    }
    
    ssRes += Math.pow(ys[i] - yPred, 2);
    ssTot += Math.pow(ys[i] - yMean, 2);
  }
  
  const rSquared = 1 - (ssRes / ssTot);
  
  // Calculate F-statistic and p-value for the regression
  const p = degree + 1; // number of parameters
  const df1 = p - 1; // degrees of freedom for regression (excluding intercept)
  const df2 = n - p; // degrees of freedom for residuals
  let pValue = null;
  
  if (df2 > 0 && ssTot > 0) {
    const ssReg = ssTot - ssRes; // Sum of squares for regression
    // Ensure ssReg is non-negative (can be negative due to numerical errors)
    const ssRegSafe = Math.max(0, ssReg);
    const msReg = ssRegSafe / df1; // Mean square for regression
    const msRes = ssRes / df2; // Mean square for residuals
    
    if (msRes > 0 && isFinite(msReg) && isFinite(msRes)) {
      const fStat = msReg / msRes;
      if (isFinite(fStat) && fStat > 0) {
      pValue = calculatePValueFromF(fStat, df1, df2);
      }
    }
  }
  
  // Generate smooth curve points
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const numPoints = 100;
  const trendX = [];
  const trendY = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + (xMax - xMin) * i / numPoints;
    let y = 0;
    for (let j = 0; j <= degree; j++) {
      y += coeffs[j] * Math.pow(x, j);
    }
    // Only filter for non-finite values; allow negative if allowNegative is true
    if (isFinite(y) && (allowNegative || y > 0)) {
      trendX.push(x);
      trendY.push(y);
    }
  }
  
  return { x: trendX, y: trendY, rSquared: rSquared, pValue: pValue, coefficients: coeffs };
}

// Calculate p-value from F-statistic using approximation
// Uses the F-distribution CDF approximation
function calculatePValueFromF(fStat, df1, df2) {
  if (!isFinite(fStat) || fStat <= 0 || df1 <= 0 || df2 <= 0) return null;
  
  // Use the relationship: F-distribution is related to beta distribution
  // F(df1, df2) = (df2/df1) * (beta/(1-beta)) where beta ~ Beta(df1/2, df2/2)
  // The p-value is 1 - CDF(F)
  
  // Convert F to beta distribution parameter
  // x = df2 / (df2 + df1 * fStat)
  // When F is very large, x approaches 0
  // When F is very small, x approaches 1
  const x = df2 / (df2 + df1 * fStat);
  
  // Handle edge cases where x is very close to 0 or 1
  if (x <= 0 || !isFinite(x)) {
    // If x is 0 or negative, F is very large, p-value should be very small
    // But we should still calculate it properly rather than returning 0
    // Use a very small x value instead
    const xSafe = Math.max(1e-20, x);
    const a = df1 / 2;
    const b = df2 / 2;
    const betaCDF = incompleteBetaFunction(xSafe, a, b);
    if (betaCDF === null || !isFinite(betaCDF)) {
      // For extremely large F, return a small but non-zero p-value
      return Math.max(1e-10, 1 / (1 + fStat));
    }
    return Math.max(0, 1 - betaCDF);
  }
  
  if (x >= 1 || !isFinite(x)) {
    // If x is 1 or greater, F is very small, p-value should be close to 1
    return 1;
  }
  
  // Calculate incomplete beta function I_x(a, b) using continued fraction approximation
  // This gives us the CDF of the beta distribution
  const a = df1 / 2;
  const b = df2 / 2;
  
  const betaCDF = incompleteBetaFunction(x, a, b);
  
  // Check if betaCDF is valid
  if (betaCDF === null || !isFinite(betaCDF)) {
    // Fallback: if F is very large, p-value should be very small
    // Use a rough approximation for very large F
    if (fStat > 100) return 0.0001;
    return null;
  }
  
  // p-value = 1 - CDF (for F-test we test if the regression is significant)
  let pValue = 1 - betaCDF;
  
  // Ensure p-value is in valid range and handle numerical precision issues
  if (pValue < 0) pValue = 0;
  if (pValue > 1) pValue = 1;
  
  // Return the calculated p-value
  // Note: If the p-value is extremely small (< 1e-10), it might be due to numerical precision
  // but we'll return it as-is since very small p-values are valid for highly significant results
  return pValue;
}

// Calculate incomplete beta function I_x(a, b) using continued fraction
function incompleteBetaFunction(x, a, b) {
  if (x < 0 || x > 1) return null;
  if (x === 0) return 0;
  if (x === 1) return 1;
  
  // Use symmetry: I_x(a, b) = 1 - I_(1-x)(b, a)
  if (x > 0.5) {
    return 1 - incompleteBetaFunction(1 - x, b, a);
  }
  
  // For very small x, use series expansion to avoid numerical issues
  // I_x(a, b) ≈ (x^a / (a * B(a, b))) * [1 + a*(1-x)/(a+1) + ...]
  if (x < 1e-10) {
    const beta = betaFunction(a, b);
    if (beta <= 0) return null;
    // Use first term of series: I_x(a, b) ≈ (x^a) / (a * B(a, b))
    const firstTerm = Math.pow(x, a) / (a * beta);
    // This is a very rough approximation, but for very small x it should be close
    return Math.min(1, firstTerm);
  }
  
  // Use continued fraction representation
  // I_x(a, b) = (x^a * (1-x)^b) / (a * B(a, b)) * [1 + sum of continued fraction terms]
  
  const beta = betaFunction(a, b);
  if (beta <= 0 || !isFinite(beta)) return null;
  
  // Compute using continued fraction (Lentz's method)
  const xPowA = Math.pow(x, a);
  const oneMinusXPowB = Math.pow(1 - x, b);
  
  // Check for numerical issues
  if (!isFinite(xPowA) || !isFinite(oneMinusXPowB) || xPowA === 0) {
    // If x^a is too small, return a small value
    if (xPowA === 0 || !isFinite(xPowA)) {
      return 0;
    }
    return null;
  }
  
  const factor = xPowA * oneMinusXPowB / (a * beta);
  
  if (!isFinite(factor) || factor === 0) {
    return 0;
  }
  
  // Continued fraction approximation
  let result = 1;
  let c = 1;
  let d = 1 - (a + b) * x / (a + 1);
  
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;
  
  for (let m = 1; m <= 100; m++) {
    const m2 = 2 * m;
    const aa = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    h *= d * c;
    const aa2 = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
    d = 1 + aa2 * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa2 / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-10) break;
  }
  
  return factor * h;
}

// Calculate Beta function B(a, b) = Gamma(a) * Gamma(b) / Gamma(a + b)
function betaFunction(a, b) {
  return gammaFunction(a) * gammaFunction(b) / gammaFunction(a + b);
}

// Calculate incomplete gamma function P(a, x) = gamma(a, x) / Gamma(a)
// Using series expansion for small x and continued fraction for large x
function incompleteGammaFunction(a, x) {
  if (x < 0 || a <= 0) return null;
  if (x === 0) return 0;
  
  // For small x, use series expansion
  if (x < a + 1) {
    let sum = 1;
    let term = 1;
    for (let n = 1; n < 100; n++) {
      term *= x / (a + n - 1);
      sum += term;
      if (term < 1e-15) break;
    }
    return Math.pow(x, a) * Math.exp(-x) * sum / gammaFunction(a);
  } else {
    // For large x, use continued fraction
    // P(a, x) = 1 - (x^a * exp(-x) / Gamma(a)) * continued fraction
    let b = x + 1 - a;
    let c = 1 / 1e-30;
    let d = 1 / b;
    let h = d;
    for (let i = 1; i < 100; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = b + an / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 1e-10) break;
    }
    return 1 - Math.pow(x, a) * Math.exp(-x) * h / gammaFunction(a);
  }
}

// Calculate chi-square CDF: P(chi-square(k) <= x)
function chiSquareCDF(x, k) {
  if (x < 0 || k <= 0) return 0;
  
  // For chi-square(1), use the relationship: chi-square(1) = (standard normal)^2
  // P(chi-square(1) <= x) = 2 * Φ(√x) - 1, where Φ is the standard normal CDF
  if (k === 1) {
    if (x === 0) return 0;
    const sqrtX = Math.sqrt(x);
    // Standard normal CDF approximation
    function normalCDF(z) {
      const a1 =  0.254829592;
      const a2 = -0.284496736;
      const a3 =  1.421413741;
      const a4 = -1.453152027;
      const a5 =  1.061405429;
      const p  =  0.3275911;
      
      const sign = z < 0 ? -1 : 1;
      z = Math.abs(z) / Math.sqrt(2.0);
      
      const t = 1.0 / (1.0 + p * z);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
      
      return 0.5 * (1.0 + sign * y);
    }
    return 2 * normalCDF(sqrtX) - 1;
  }
  
  // For other degrees of freedom, use incomplete gamma function
  // chi-square(k) = Gamma(k/2, x/2) / Gamma(k/2)
  return incompleteGammaFunction(k / 2, x / 2);
}

// Calculate Breusch-Pagan test for heteroscedasticity
// Tests if residuals have constant variance (homoscedasticity)
// Returns { statistic, pValue }
function breuschPaganTest(xValues, yValues) {
  const n = xValues.length;
  if (n < 3) return { statistic: null, pValue: null };
  
  // Step 1: Fit regression y = a + b*x
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;
  
  let numerator = 0;
  let xSumSq = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean;
    const yDiff = yValues[i] - yMean;
    numerator += xDiff * yDiff;
    xSumSq += xDiff * xDiff;
  }
  
  if (xSumSq === 0) return { statistic: null, pValue: null };
  
  const b = numerator / xSumSq;
  const a = yMean - b * xMean;
  
  // Step 2: Calculate residuals
  const residuals = [];
  for (let i = 0; i < n; i++) {
    const predicted = a + b * xValues[i];
    residuals.push(yValues[i] - predicted);
  }
  
  // Step 3: Calculate mean of squared residuals
  const meanSquaredResidual = residuals.reduce((sum, e) => sum + e * e, 0) / n;
  
  if (meanSquaredResidual === 0) return { statistic: null, pValue: null };
  
  // Step 4: Square the residuals and normalize
  const squaredResiduals = residuals.map(e => e * e / meanSquaredResidual);
  
  // Step 5: Regress squared residuals on x
  const squaredMean = squaredResiduals.reduce((sum, r) => sum + r, 0) / n;
  
  let num = 0;
  let den = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean;
    const rDiff = squaredResiduals[i] - squaredMean;
    num += xDiff * rDiff;
    den += xDiff * xDiff;
  }
  
  if (den === 0) return { statistic: null, pValue: null };
  
  const slope = num / den;
  const intercept = squaredMean - slope * xMean;
  
  // Step 6: Calculate R² of auxiliary regression
  let ssRes = 0;
  let ssTot = 0;
  
  for (let i = 0; i < n; i++) {
    const predicted = intercept + slope * xValues[i];
    const residual = squaredResiduals[i] - predicted;
    ssRes += residual * residual;
    const totDiff = squaredResiduals[i] - squaredMean;
    ssTot += totDiff * totDiff;
  }
  
  const r2 = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;
  
  // Step 7: Test statistic is n * R², follows chi-square(1) under H0
  const statistic = n * r2;
  
  // Step 8: Calculate p-value from chi-square(1) distribution
  const pValue = 1 - chiSquareCDF(statistic, 1);
  
  return {
    statistic: statistic,
    pValue: pValue
  };
}

// Calculate White's test for heteroscedasticity
// Tests if residuals have constant variance (homoscedasticity)
// More general than Breusch-Pagan - includes squared terms
// Returns { statistic, pValue }
function whiteTest(xValues, yValues) {
  const n = xValues.length;
  if (n < 4) return { statistic: null, pValue: null }; // Need at least 4 points for White's test
  
  // Step 1: Fit regression y = a + b*x
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;
  
  let numerator = 0;
  let xSumSq = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean;
    const yDiff = yValues[i] - yMean;
    numerator += xDiff * yDiff;
    xSumSq += xDiff * xDiff;
  }
  
  if (xSumSq === 0) return { statistic: null, pValue: null };
  
  const b = numerator / xSumSq;
  const a = yMean - b * xMean;
  
  // Step 2: Calculate residuals
  const residuals = [];
  for (let i = 0; i < n; i++) {
    const predicted = a + b * xValues[i];
    residuals.push(yValues[i] - predicted);
  }
  
  // Step 3: Square the residuals
  const squaredResiduals = residuals.map(e => e * e);
  
  // Step 4: Regress squared residuals on x and x²
  // For White's test, we regress e² on [1, x, x²]
  // This is a multiple regression with 3 parameters (intercept, x, x²)
  
  // Create design matrix: [1, x, x²]
  const X = [];
  for (let i = 0; i < n; i++) {
    X.push([1, xValues[i], xValues[i] * xValues[i]]);
  }
  
  // Fit multiple regression: squaredResiduals = c0 + c1*x + c2*x²
  // Using normal equations: (X'X)β = X'y
  // Build X'X matrix (3x3)
  let XTX = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let XTy = [0, 0, 0];
  
  for (let i = 0; i < n; i++) {
    const xi = X[i];
    const yi = squaredResiduals[i];
    
    // X'X
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        XTX[j][k] += xi[j] * xi[k];
      }
    }
    
    // X'y
    for (let j = 0; j < 3; j++) {
      XTy[j] += xi[j] * yi;
    }
  }
  
  // Solve (X'X)β = X'y using Gaussian elimination
  // Simple 3x3 matrix inversion
  const det = XTX[0][0] * (XTX[1][1] * XTX[2][2] - XTX[1][2] * XTX[2][1]) -
              XTX[0][1] * (XTX[1][0] * XTX[2][2] - XTX[1][2] * XTX[2][0]) +
              XTX[0][2] * (XTX[1][0] * XTX[2][1] - XTX[1][1] * XTX[2][0]);
  
  if (Math.abs(det) < 1e-10) return { statistic: null, pValue: null };
  
  // Calculate inverse of XTX
  const invXTX = [
    [
      (XTX[1][1] * XTX[2][2] - XTX[1][2] * XTX[2][1]) / det,
      (XTX[0][2] * XTX[2][1] - XTX[0][1] * XTX[2][2]) / det,
      (XTX[0][1] * XTX[1][2] - XTX[0][2] * XTX[1][1]) / det
    ],
    [
      (XTX[1][2] * XTX[2][0] - XTX[1][0] * XTX[2][2]) / det,
      (XTX[0][0] * XTX[2][2] - XTX[0][2] * XTX[2][0]) / det,
      (XTX[0][2] * XTX[1][0] - XTX[0][0] * XTX[1][2]) / det
    ],
    [
      (XTX[1][0] * XTX[2][1] - XTX[1][1] * XTX[2][0]) / det,
      (XTX[0][1] * XTX[2][0] - XTX[0][0] * XTX[2][1]) / det,
      (XTX[0][0] * XTX[1][1] - XTX[0][1] * XTX[1][0]) / det
    ]
  ];
  
  // Calculate coefficients: β = (X'X)^(-1) X'y
  const coeffs = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      coeffs[i] += invXTX[i][j] * XTy[j];
    }
  }
  
  // Step 5: Calculate R² of auxiliary regression
  const yMeanSq = squaredResiduals.reduce((sum, y) => sum + y, 0) / n;
  
  let ssRes = 0;
  let ssTot = 0;
  
  for (let i = 0; i < n; i++) {
    const predicted = coeffs[0] + coeffs[1] * xValues[i] + coeffs[2] * xValues[i] * xValues[i];
    const residual = squaredResiduals[i] - predicted;
    ssRes += residual * residual;
    const totDiff = squaredResiduals[i] - yMeanSq;
    ssTot += totDiff * totDiff;
  }
  
  const r2 = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;
  
  // Step 6: Test statistic is n * R², follows chi-square(2) under H0
  // (2 degrees of freedom because we have x and x² as regressors, excluding intercept)
  const statistic = n * r2;
  
  // Step 7: Calculate p-value from chi-square(2) distribution
  const pValue = 1 - chiSquareCDF(statistic, 2);
  
  return {
    statistic: statistic,
    pValue: pValue
  };
}

// Calculate Cook's distance for each point and count outliers
// Returns the number of points with Cook's distance > 4/n
// Cook's distance measures the influence of each data point on the regression
function countCookDistanceOutliers(xValues, yValues) {
  const n = xValues.length;
  if (n < 3) return 0;
  
  // Fit regression y = a + b*x
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;
  
  let numerator = 0;
  let xSumSq = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean;
    const yDiff = yValues[i] - yMean;
    numerator += xDiff * yDiff;
    xSumSq += xDiff * xDiff;
  }
  
  if (xSumSq === 0) return 0;
  
  const b = numerator / xSumSq;
  const a = yMean - b * xMean;
  
  // Calculate residuals and MSE
  const residuals = [];
  let sumSquaredResiduals = 0;
  
  for (let i = 0; i < n; i++) {
    const predicted = a + b * xValues[i];
    const residual = yValues[i] - predicted;
    residuals.push(residual);
    sumSquaredResiduals += residual * residual;
  }
  
  // MSE = sum of squared residuals / (n - k) where k = 2 (intercept and slope)
  const mse = sumSquaredResiduals / (n - 2);
  if (mse === 0) return 0;
  
  // Calculate Cook's distance for each point
  // D_i = (r_i^2 / (k * MSE)) * (h_i / (1 - h_i)^2)
  // where h_i is the leverage: h_i = 1/n + (x_i - x_mean)^2 / sum((x_j - x_mean)^2)
  const k = 2; // number of parameters (intercept and slope)
  // Use 1 as threshold (common for small samples; 4/n can be too strict)
  const threshold = 1.0;
  let outlierCount = 0;
  
  for (let i = 0; i < n; i++) {
    // Calculate leverage
    const xDiff = xValues[i] - xMean;
    const leverage = (1 / n) + (xDiff * xDiff) / xSumSq;
    
    // Calculate Cook's distance
    const residualSq = residuals[i] * residuals[i];
    const cooksDistance = (residualSq / (k * mse)) * (leverage / ((1 - leverage) * (1 - leverage)));
    
    // Count if exceeds threshold
    if (cooksDistance > threshold) {
      outlierCount++;
    }
  }
  
  return outlierCount;
}

// Calculate p-value using robust standard errors (White's heteroscedasticity-consistent estimator)
// For polynomial regression, tests overall significance using Wald test
function calculateRobustPValue(xValues, yValues, coefficients, residuals) {
  const n = xValues.length;
  const k = coefficients.length; // number of parameters (intercept + polynomial terms)
  
  if (n < k + 1 || residuals.length !== n) return null;
  
  // Build design matrix X: [1, x, x², ...]
  const X = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < k; j++) {
      row.push(Math.pow(xValues[i], j));
    }
    X.push(row);
  }
  
  // Calculate X'X
  const XTX = [];
  for (let i = 0; i < k; i++) {
    XTX[i] = [];
    for (let j = 0; j < k; j++) {
      let sum = 0;
      for (let m = 0; m < n; m++) {
        sum += X[m][i] * X[m][j];
      }
      XTX[i][j] = sum;
    }
  }
  
  // Calculate (X'X)^(-1)
  let invXTX = null;
  if (k === 3) {
    // 3x3 matrix inversion for degree 2 polynomial
    const det = XTX[0][0] * (XTX[1][1] * XTX[2][2] - XTX[1][2] * XTX[2][1]) -
                XTX[0][1] * (XTX[1][0] * XTX[2][2] - XTX[1][2] * XTX[2][0]) +
                XTX[0][2] * (XTX[1][0] * XTX[2][1] - XTX[1][1] * XTX[2][0]);
    
    // Use a more lenient threshold for near-singular matrices
    if (!isFinite(det) || Math.abs(det) < 1e-12) return null;
    
    invXTX = [
      [
        (XTX[1][1] * XTX[2][2] - XTX[1][2] * XTX[2][1]) / det,
        (XTX[0][2] * XTX[2][1] - XTX[0][1] * XTX[2][2]) / det,
        (XTX[0][1] * XTX[1][2] - XTX[0][2] * XTX[1][1]) / det
      ],
      [
        (XTX[1][2] * XTX[2][0] - XTX[1][0] * XTX[2][2]) / det,
        (XTX[0][0] * XTX[2][2] - XTX[0][2] * XTX[2][0]) / det,
        (XTX[0][2] * XTX[1][0] - XTX[0][0] * XTX[1][2]) / det
      ],
      [
        (XTX[1][0] * XTX[2][1] - XTX[1][1] * XTX[2][0]) / det,
        (XTX[0][1] * XTX[2][0] - XTX[0][0] * XTX[2][1]) / det,
        (XTX[0][0] * XTX[1][1] - XTX[0][1] * XTX[1][0]) / det
      ]
    ];
  } else {
    // For other sizes, use solveLinearSystem (if available) or return null
    return null;
  }
  
  if (!invXTX) return null;
  
  // Calculate X'ΩX where Ω is diagonal matrix of squared residuals
  // Ω[i][i] = residuals[i]^2
  const XTOmegaX = [];
  for (let i = 0; i < k; i++) {
    XTOmegaX[i] = [];
    for (let j = 0; j < k; j++) {
      let sum = 0;
      for (let m = 0; m < n; m++) {
        sum += X[m][i] * X[m][j] * residuals[m] * residuals[m];
      }
      XTOmegaX[i][j] = sum;
    }
  }
  
  // Calculate robust variance-covariance matrix: (X'X)^(-1) X'ΩX (X'X)^(-1)
  // First: temp = X'ΩX * (X'X)^(-1)
  const temp = [];
  for (let i = 0; i < k; i++) {
    temp[i] = [];
    for (let j = 0; j < k; j++) {
      let sum = 0;
      for (let m = 0; m < k; m++) {
        sum += XTOmegaX[i][m] * invXTX[m][j];
      }
      temp[i][j] = sum;
    }
  }
  
  // Then: V_robust = (X'X)^(-1) * temp
  const Vrobust = [];
  for (let i = 0; i < k; i++) {
    Vrobust[i] = [];
    for (let j = 0; j < k; j++) {
      let sum = 0;
      for (let m = 0; m < k; m++) {
        sum += invXTX[i][m] * temp[m][j];
      }
      Vrobust[i][j] = sum;
      // Check for invalid values
      if (!isFinite(Vrobust[i][j])) {
        return null;
      }
    }
  }
  
  // For overall significance, test non-intercept coefficients using Wald test
  // Extract non-intercept coefficients and their variance-covariance submatrix
  const betaNonIntercept = coefficients.slice(1); // Exclude intercept
  const VNonIntercept = [];
  for (let i = 1; i < k; i++) {
    VNonIntercept[i - 1] = [];
    for (let j = 1; j < k; j++) {
      VNonIntercept[i - 1][j - 1] = Vrobust[i][j];
    }
  }
  
  // Calculate Wald statistic: W = β' V^(-1) β
  // First, invert VNonIntercept (for k-1 = 2, it's a 2x2 matrix)
  const dfNonIntercept = k - 1;
  if (dfNonIntercept === 2) {
    const detV = VNonIntercept[0][0] * VNonIntercept[1][1] - VNonIntercept[0][1] * VNonIntercept[1][0];
    
    // Use a more lenient threshold and check for finite values
    if (!isFinite(detV) || Math.abs(detV) < 1e-12) {
      // Try alternative: use diagonal elements only (simplified robust SE)
      // This is a fallback when the full variance-covariance matrix is singular
      let waldStat = 0;
      for (let i = 0; i < dfNonIntercept; i++) {
        if (VNonIntercept[i][i] > 1e-12 && isFinite(VNonIntercept[i][i])) {
          waldStat += (betaNonIntercept[i] * betaNonIntercept[i]) / VNonIntercept[i][i];
        }
      }
      if (!isFinite(waldStat) || waldStat < 0) return null;
      const pValue = 1 - chiSquareCDF(waldStat, dfNonIntercept);
      return Math.max(0, Math.min(1, pValue));
    }
    
    const invV = [
      [VNonIntercept[1][1] / detV, -VNonIntercept[0][1] / detV],
      [-VNonIntercept[1][0] / detV, VNonIntercept[0][0] / detV]
    ];
    
    // Check if inverse matrix has finite values
    if (!invV.every(row => row.every(val => isFinite(val)))) return null;
    
    // Calculate Wald statistic: β' V^(-1) β
    let waldStat = 0;
    for (let i = 0; i < dfNonIntercept; i++) {
      for (let j = 0; j < dfNonIntercept; j++) {
        waldStat += betaNonIntercept[i] * invV[i][j] * betaNonIntercept[j];
      }
    }
    
    if (!isFinite(waldStat) || waldStat < 0) return null;
    
    // Wald statistic follows chi-square(dfNonIntercept) under H0
    const pValue = 1 - chiSquareCDF(waldStat, dfNonIntercept);
    return Math.max(0, Math.min(1, pValue));
  }
  
  return null;
}

// Breusch-Pagan test for polynomial regression
// Takes xValues and residuals from polynomial regression
function breuschPaganTestPolynomial(xValues, residuals) {
  const n = xValues.length;
  if (n < 3) return { statistic: null, pValue: null };
  
  // Step 1: Calculate mean of squared residuals
  const meanSquaredResidual = residuals.reduce((sum, e) => sum + e * e, 0) / n;
  if (meanSquaredResidual === 0) return { statistic: null, pValue: null };
  
  // Step 2: Square the residuals and normalize
  const squaredResiduals = residuals.map(e => e * e / meanSquaredResidual);
  
  // Step 3: Regress squared residuals on x
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const squaredMean = squaredResiduals.reduce((sum, r) => sum + r, 0) / n;
  
  let num = 0;
  let den = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean;
    const rDiff = squaredResiduals[i] - squaredMean;
    num += xDiff * rDiff;
    den += xDiff * xDiff;
  }
  
  if (den === 0) return { statistic: null, pValue: null };
  
  const slope = num / den;
  const intercept = squaredMean - slope * xMean;
  
  // Step 4: Calculate R² of auxiliary regression
  let ssRes = 0;
  let ssTot = 0;
  
  for (let i = 0; i < n; i++) {
    const predicted = intercept + slope * xValues[i];
    const residual = squaredResiduals[i] - predicted;
    ssRes += residual * residual;
    const totDiff = squaredResiduals[i] - squaredMean;
    ssTot += totDiff * totDiff;
  }
  
  const r2 = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;
  
  // Step 5: Test statistic is n * R², follows chi-square(1) under H0
  const statistic = n * r2;
  
  // Step 6: Calculate p-value from chi-square(1) distribution
  const pValue = 1 - chiSquareCDF(statistic, 1);
  
  return {
    statistic: statistic,
    pValue: pValue
  };
}

// White's test for polynomial regression
// Takes xValues and residuals from polynomial regression
function whiteTestPolynomial(xValues, residuals) {
  const n = xValues.length;
  if (n < 4) return { statistic: null, pValue: null };
  
  // Step 1: Square the residuals
  const squaredResiduals = residuals.map(e => e * e);
  
  // Step 2: Regress squared residuals on x and x²
  // Create design matrix: [1, x, x²]
  const X = [];
  for (let i = 0; i < n; i++) {
    X.push([1, xValues[i], xValues[i] * xValues[i]]);
  }
  
  // Fit multiple regression: squaredResiduals = c0 + c1*x + c2*x²
  // Using normal equations: (X'X)β = X'y
  // Build X'X matrix (3x3)
  let XTX = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let XTy = [0, 0, 0];
  
  for (let i = 0; i < n; i++) {
    const xi = X[i];
    const yi = squaredResiduals[i];
    
    // X'X
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        XTX[j][k] += xi[j] * xi[k];
      }
    }
    
    // X'y
    for (let j = 0; j < 3; j++) {
      XTy[j] += xi[j] * yi;
    }
  }
  
  // Solve (X'X)β = X'y using Gaussian elimination
  // Simple 3x3 matrix inversion
  const det = XTX[0][0] * (XTX[1][1] * XTX[2][2] - XTX[1][2] * XTX[2][1]) -
              XTX[0][1] * (XTX[1][0] * XTX[2][2] - XTX[1][2] * XTX[2][0]) +
              XTX[0][2] * (XTX[1][0] * XTX[2][1] - XTX[1][1] * XTX[2][0]);
  
  // Use a more lenient threshold and check for finite values
  if (!isFinite(det) || Math.abs(det) < 1e-12) return { statistic: null, pValue: null };
  
  // Calculate inverse of XTX
  const invXTX = [
    [
      (XTX[1][1] * XTX[2][2] - XTX[1][2] * XTX[2][1]) / det,
      (XTX[0][2] * XTX[2][1] - XTX[0][1] * XTX[2][2]) / det,
      (XTX[0][1] * XTX[1][2] - XTX[0][2] * XTX[1][1]) / det
    ],
    [
      (XTX[1][2] * XTX[2][0] - XTX[1][0] * XTX[2][2]) / det,
      (XTX[0][0] * XTX[2][2] - XTX[0][2] * XTX[2][0]) / det,
      (XTX[0][2] * XTX[1][0] - XTX[0][0] * XTX[1][2]) / det
    ],
    [
      (XTX[1][0] * XTX[2][1] - XTX[1][1] * XTX[2][0]) / det,
      (XTX[0][1] * XTX[2][0] - XTX[0][0] * XTX[2][1]) / det,
      (XTX[0][0] * XTX[1][1] - XTX[0][1] * XTX[1][0]) / det
    ]
  ];
  
  // Check if inverse matrix has finite values
  if (!invXTX.every(row => row.every(val => isFinite(val)))) {
    return { statistic: null, pValue: null };
  }
  
  // Calculate coefficients: β = (X'X)^(-1) X'y
  const coeffs = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      coeffs[i] += invXTX[i][j] * XTy[j];
    }
  }
  
  // Check if coefficients are finite
  if (!coeffs.every(c => isFinite(c))) {
    return { statistic: null, pValue: null };
  }
  
  // Step 3: Calculate R² of auxiliary regression
  const yMeanSq = squaredResiduals.reduce((sum, y) => sum + y, 0) / n;
  
  let ssRes = 0;
  let ssTot = 0;
  
  for (let i = 0; i < n; i++) {
    const predicted = coeffs[0] + coeffs[1] * xValues[i] + coeffs[2] * xValues[i] * xValues[i];
    const residual = squaredResiduals[i] - predicted;
    ssRes += residual * residual;
    const totDiff = squaredResiduals[i] - yMeanSq;
    ssTot += totDiff * totDiff;
  }
  
  const r2 = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;
  
  // Step 4: Test statistic is n * R², follows chi-square(2) under H0
  const statistic = n * r2;
  
  // Step 5: Calculate p-value from chi-square(2) distribution
  // Check if statistic is valid
  if (!isFinite(statistic) || statistic < 0) {
    return { statistic: null, pValue: null };
  }
  
  const pValue = 1 - chiSquareCDF(statistic, 2);
  
  // Ensure p-value is valid
  if (!isFinite(pValue)) {
    return { statistic: statistic, pValue: null };
  }
  
  return {
    statistic: statistic,
    pValue: Math.max(0, Math.min(1, pValue))
  };
}

// Calculate Cook's distance for polynomial regression
// Takes xValues, yValues, and polynomial coefficients
function countCookDistanceOutliersPolynomial(xValues, yValues, coefficients) {
  const n = xValues.length;
  if (n < 3 || !coefficients || coefficients.length < 2) return 0;
  
  const k = coefficients.length; // number of parameters (intercept, x, x², ...)
  
  // Calculate residuals and MSE
  const residuals = [];
  let sumSquaredResiduals = 0;
  
  for (let i = 0; i < n; i++) {
    let predicted = 0;
    for (let j = 0; j < coefficients.length; j++) {
      predicted += coefficients[j] * Math.pow(xValues[i], j);
    }
    const residual = yValues[i] - predicted;
    residuals.push(residual);
    sumSquaredResiduals += residual * residual;
  }
  
  // MSE = sum of squared residuals / (n - k)
  const mse = sumSquaredResiduals / (n - k);
  if (mse === 0) return 0;
  
  // Build design matrix X for leverage calculation
  const X = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < k; j++) {
      row.push(Math.pow(xValues[i], j));
    }
    X.push(row);
  }
  
  // Calculate X'X
  const XTX = [];
  for (let i = 0; i < k; i++) {
    XTX[i] = [];
    for (let j = 0; j < k; j++) {
      let sum = 0;
      for (let m = 0; m < n; m++) {
        sum += X[m][i] * X[m][j];
      }
      XTX[i][j] = sum;
    }
  }
  
  // For Cook's distance, we need the leverage h_i = X_i (X'X)^(-1) X_i'
  // Calculate using the diagonal of the hat matrix H = X(X'X)^(-1)X'
  
  // First, calculate (X'X)^(-1) using Gaussian elimination for kxk matrix
  // Simple matrix inversion for small k (k=3 for degree 2 polynomial)
  let invXTX;
  if (k === 3) {
    // 3x3 matrix inversion
    const det = XTX[0][0] * (XTX[1][1] * XTX[2][2] - XTX[1][2] * XTX[2][1]) -
                XTX[0][1] * (XTX[1][0] * XTX[2][2] - XTX[1][2] * XTX[2][0]) +
                XTX[0][2] * (XTX[1][0] * XTX[2][1] - XTX[1][1] * XTX[2][0]);
    
    if (Math.abs(det) < 1e-10) {
      // Singular matrix, use simplified approach
      const threshold = 4 / n;
      let outlierCount = 0;
      for (let i = 0; i < n; i++) {
        const residualSq = residuals[i] * residuals[i];
        const cooksDistance = residualSq / (k * mse);
        if (cooksDistance > threshold) {
          outlierCount++;
        }
      }
      return outlierCount;
    }
    
    invXTX = [
      [
        (XTX[1][1] * XTX[2][2] - XTX[1][2] * XTX[2][1]) / det,
        (XTX[0][2] * XTX[2][1] - XTX[0][1] * XTX[2][2]) / det,
        (XTX[0][1] * XTX[1][2] - XTX[0][2] * XTX[1][1]) / det
      ],
      [
        (XTX[1][2] * XTX[2][0] - XTX[1][0] * XTX[2][2]) / det,
        (XTX[0][0] * XTX[2][2] - XTX[0][2] * XTX[2][0]) / det,
        (XTX[0][2] * XTX[1][0] - XTX[0][0] * XTX[1][2]) / det
      ],
      [
        (XTX[1][0] * XTX[2][1] - XTX[1][1] * XTX[2][0]) / det,
        (XTX[0][1] * XTX[2][0] - XTX[0][0] * XTX[2][1]) / det,
        (XTX[0][0] * XTX[1][1] - XTX[0][1] * XTX[1][0]) / det
      ]
    ];
  } else {
    // For other k values, use simplified approach
    const threshold = 4 / n;
    let outlierCount = 0;
    for (let i = 0; i < n; i++) {
      const residualSq = residuals[i] * residuals[i];
      const cooksDistance = residualSq / (k * mse);
      if (cooksDistance > threshold) {
        outlierCount++;
      }
    }
    return outlierCount;
  }
  
  // Calculate leverage h_i = X_i (X'X)^(-1) X_i' for each point
  const threshold = 4 / n; // Standard threshold: 4/n
  let outlierCount = 0;
  
  for (let i = 0; i < n; i++) {
    // Calculate leverage: h_i = X_i (X'X)^(-1) X_i'
    // X_i is the i-th row of X
    const Xi = X[i];
    
    // Calculate (X'X)^(-1) * X_i'
    const invXTX_Xi = [];
    for (let j = 0; j < k; j++) {
      let sum = 0;
      for (let m = 0; m < k; m++) {
        sum += invXTX[j][m] * Xi[m];
      }
      invXTX_Xi[j] = sum;
    }
    
    // Calculate h_i = X_i * invXTX_Xi
    let leverage = 0;
    for (let j = 0; j < k; j++) {
      leverage += Xi[j] * invXTX_Xi[j];
    }
    
    // Ensure leverage is in valid range [0, 1]
    leverage = Math.max(0, Math.min(1, leverage));
    
    // Calculate Cook's distance
    const residualSq = residuals[i] * residuals[i];
    const cooksDistance = (residualSq / (k * mse)) * (leverage / ((1 - leverage) * (1 - leverage) + 1e-10));
    
    // Count if exceeds threshold
    if (cooksDistance > threshold) {
      outlierCount++;
    }
  }
  
  return outlierCount;
}

// Calculate Gamma function using Stirling's approximation with Lanczos correction
function gammaFunction(z) {
  if (z < 0.5) {
    // Use reflection formula: Gamma(z) * Gamma(1-z) = PI / sin(PI*z)
    return Math.PI / (Math.sin(Math.PI * z) * gammaFunction(1 - z));
  }
  
  z -= 1;
  
  // Lanczos approximation coefficients
  const g = 7;
  const p = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];
  
  let x = p[0];
  for (let i = 1; i < p.length; i++) {
    x += p[i] / (z + i);
  }
  
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

// Calculate predicted value from polynomial coefficients
function predictValue(x, coeffs) {
  let y = 0;
  for (let j = 0; j < coeffs.length; j++) {
    y += coeffs[j] * Math.pow(x, j);
  }
  return y;
}

// Simple Gaussian elimination solver
function solveLinearSystem(A, b) {
  const n = A.length;
  const augmented = A.map((row, i) => [...row, b[i]]);
  
  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
    
    // Make all rows below this one 0 in current column
    for (let k = i + 1; k < n; k++) {
      if (augmented[i][i] === 0) return null;
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j <= n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }
  
  // Back substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = augmented[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= augmented[i][j] * x[j];
    }
    if (augmented[i][i] === 0) return null;
    x[i] /= augmented[i][i];
  }
  
  return x;
}

// Helper function to get excess value (cumulative or isolated) for a given year
// yearValue: string like "2025" or "2025-isolated"
// trace: trace object with x (dates) and y (values) arrays
// Returns: { excess: number, year: number, isIsolated: boolean } or null if not found
function getExcessValue(yearValue, trace) {
  if (!trace || !trace.x || !trace.y) return null;
  
  // Parse year and determine if isolated
  // Note: The year label represents the data year, but we need to look up data
  // at (year + 1)-01-01 to get cumulative data up to that point
  // e.g., "2020" label means data from 01.2020-12.2020, which is at 2021-01-01
  const isIsolated = yearValue.includes('-isolated');
  const year = parseInt(yearValue.replace('-isolated', ''));
  const lookupYear = year + 1; // Add 1 to look up the correct data point
  const yearStart = new Date(`${lookupYear}-01-01T00:00:00Z`);
  
  // Get cumulative excess for the selected year
  let cumulativeExcess = null;
  let minDiff = Infinity;
  
  trace.x.forEach((date, idx) => {
    if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
      const diff = Math.abs(date - yearStart);
      if (diff < minDiff && date <= yearStart) {
        minDiff = diff;
        cumulativeExcess = trace.y[idx];
      }
    }
  });
  
  // Also check if we need to find the closest value after the year start
  if (cumulativeExcess === null || minDiff > 365 * 24 * 60 * 60 * 1000) {
    trace.x.forEach((date, idx) => {
      if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
        const diff = Math.abs(date - yearStart);
        if (diff < minDiff) {
          minDiff = diff;
          cumulativeExcess = trace.y[idx];
        }
      }
    });
  }
  
  if (cumulativeExcess === null || !isFinite(cumulativeExcess)) {
    return null;
  }
  
  // If isolated, subtract the previous year's cumulative excess
  if (isIsolated) {
    // For 2020, isolated is the same as cumulative (no previous year)
    if (year === 2020) {
      return {
        excess: cumulativeExcess,
        year: year,
        isIsolated: true
      };
    }
    
    // For years after 2020, subtract previous year's cumulative
    const prevYear = year - 1;
    const prevLookupYear = prevYear + 1;
    const prevYearStart = new Date(`${prevLookupYear}-01-01T00:00:00Z`);
    let prevCumulativeExcess = null;
    let prevMinDiff = Infinity;
    
    trace.x.forEach((date, idx) => {
      if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
        const diff = Math.abs(date - prevYearStart);
        if (diff < prevMinDiff && date <= prevYearStart) {
          prevMinDiff = diff;
          prevCumulativeExcess = trace.y[idx];
        }
      }
    });
    
    if (prevCumulativeExcess === null || prevMinDiff > 365 * 24 * 60 * 60 * 1000) {
      trace.x.forEach((date, idx) => {
        if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
          const diff = Math.abs(date - prevYearStart);
          if (diff < prevMinDiff) {
            prevMinDiff = diff;
            prevCumulativeExcess = trace.y[idx];
          }
        }
      });
    }
    
    if (prevCumulativeExcess !== null && isFinite(prevCumulativeExcess)) {
      return {
        excess: cumulativeExcess - prevCumulativeExcess,
        year: year,
        isIsolated: true
      };
    }
    // If previous year not found, return null for isolated year
    return null;
  }
  
  return {
    excess: cumulativeExcess,
    year: year,
    isIsolated: false
  };
}

// Render scatterplot comparing ASMR vs cumulative excess for selected year
function renderScatterplot(filteredTraces) {
  const container = document.getElementById('scatterplotChart');
  if (!container) return;
  
  // Get selected X axis type (default to 2019 ASMR)
  const asmrYearRangeSelect = document.getElementById('asmrYearRange');
  const xAxisType = asmrYearRangeSelect ? asmrYearRangeSelect.value : '2019';
  
  // Get log axis settings
  const logXAxis = document.getElementById('logXAxis')?.checked ?? true;
  const logYAxis = document.getElementById('logYAxis')?.checked ?? true;
  
  // Get selected year from dropdown (independent of table sorting)
  const scatterplotYearSelect = document.getElementById('scatterplotYearSelect');
  const yearValue = scatterplotYearSelect ? scatterplotYearSelect.value : '2025';
  const isIsolated = yearValue.includes('-isolated');
  const selectedYear = parseInt(yearValue.replace('-isolated', ''));
  const selectedYearIndex = selectedYear - 2021; // 2021=0, 2022=1, etc.
  const selectedYearStart = new Date(`${selectedYear}-01-01T00:00:00Z`);
  
  // Format X-axis label based on selection
  let xAxisLabel;
  if (xAxisType === 'gdp') {
    xAxisLabel = 'GDP (Nominal) per Capita (USD)';
  } else if (xAxisType === 'gini') {
    xAxisLabel = 'Inequality (GINI)';
  } else if (xAxisType === 'poverty') {
    xAxisLabel = 'Poverty (% living below line)';
  } else if (xAxisType === 'health_expenditure') {
    xAxisLabel = 'Health Expenditure (%GDP)';
  } else {
    xAxisLabel = xAxisType.includes('-') ? `Avg ${xAxisType} ASMR (per 100k)` : `${xAxisType} Avg ASMR (per 100k)`;
  }
  
  // Format Y-axis label based on cumulative vs isolated
  const yAxisLabel = isIsolated 
    ? `${selectedYear} Excess (ASMR per 100k)` 
    : `${selectedYear} Cumulative Excess (ASMR per 100k)`;
  
  if (filteredTraces.length === 0) {
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { 
        title: xAxisLabel,
        type: logXAxis ? 'log' : 'linear'
      }, 
      yaxis: { 
        title: yAxisLabel,
        type: logYAxis ? 'log' : 'linear'
      },
      margin: { t: 20, r: 10, b: 50, l: 70 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Prepare scatterplot data
  const scatterData = [];
  
  filteredTraces.forEach((trace) => {
    // Find the corresponding metadata to get original rows
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.originalRows) return;
    
    // Get X-axis value based on selection
    const xValue = getXAxisValue(metadata.country, metadata.originalRows, xAxisType);
    if (xValue === null || !isFinite(xValue)) return;
    
    // Get excess value (cumulative or isolated) using helper function
    const excessResult = getExcessValue(yearValue, trace);
    if (excessResult && excessResult.excess !== null && isFinite(excessResult.excess)) {
      scatterData.push({
        x: xValue,
        y: excessResult.excess,
        name: trace.name,
        country: metadata.country
      });
    }
  });
  
  if (scatterData.length === 0) {
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { 
        title: xAxisLabel,
        type: logXAxis ? 'log' : 'linear'
      }, 
      yaxis: { 
        title: yAxisLabel,
        type: logYAxis ? 'log' : 'linear'
      },
      margin: { t: 20, r: 10, b: 50, l: 70 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  const xData = scatterData.map(d => d.x);
  const yData = scatterData.map(d => d.y);
  
  // Format hover label based on cumulative vs isolated
  const hoverLabel = isIsolated 
    ? `${selectedYear} Excess` 
    : `${selectedYear} Cum. Excess`;
  
  // Create scatter plot trace
  const trace = {
    x: xData,
    y: yData,
    mode: 'markers',
    type: 'scatter',
    showlegend: false,
    text: scatterData.map(d => d.name),
    marker: {
      size: 10,
      color: 'rgba(96, 165, 250, 0.7)',
      line: { width: 1.5, color: 'rgba(96, 165, 250, 1)' }
    },
    hovertemplate: '<b>%{text}</b><br>' +
                   `${xAxisLabel}: %{x:.1f}<br>` +
                   `${hoverLabel}: %{y:.1f}<extra></extra>`
  };
  
  // Fit trend line (polynomial curve)
  const trendLine = fitPolynomialTrend(xData, yData, 2);
  const traces = [trace];
  
  // Trend line color
  const trendColor = 'rgba(255, 100, 100, 0.8)';
  
  if (trendLine) {
    traces.push({
      x: trendLine.x,
      y: trendLine.y,
      mode: 'lines',
      type: 'scatter',
      showlegend: false,
      line: {
        color: trendColor,
        width: 2,
        dash: 'solid'
      },
      hovertemplate: 'Trend Line<extra></extra>'
    });
  }
  
  // Prepare annotations for R²
  const annotations = [];
  if (trendLine && isFinite(trendLine.rSquared)) {
    // Calculate position - Plotly uses data coordinates regardless of log/linear
    const xMin = Math.min(...xData);
    const xMax = Math.max(...xData);
    const yMin = Math.min(...yData);
    const yMax = Math.max(...yData);
    
    let xPos, yPos;
    
    if (logXAxis) {
      // For log scale, position in log space but convert back to data coordinates
      const logXMin = Math.log10(xMin);
      const logXMax = Math.log10(xMax);
      const logXRange = logXMax - logXMin;
      xPos = Math.pow(10, logXMin + logXRange * 0.05);
    } else {
      // For linear scale
      const xRange = xMax - xMin;
      xPos = xMin + xRange * 0.05;
    }
    
    if (logYAxis) {
      // For log scale, position in log space but convert back to data coordinates
      const logYMin = Math.log10(yMin);
      const logYMax = Math.log10(yMax);
      const logYRange = logYMax - logYMin;
      yPos = Math.pow(10, logYMax - logYRange * 0.05);
    } else {
      // For linear scale
      const yRange = yMax - yMin;
      yPos = yMax - yRange * 0.05;
    }
    
    // Use paper coordinates (relative to plot area) instead of data coordinates
    // This ensures the annotation is always visible regardless of scale type
    let annotationText = `R² = ${trendLine.rSquared.toFixed(3)}`;
    if (trendLine.pValue !== null && isFinite(trendLine.pValue)) {
      // Format p-value: show scientific notation if very small
      let pValText;
      if (trendLine.pValue < 0.001) {
        pValText = trendLine.pValue.toExponential(2);
      } else {
        pValText = trendLine.pValue.toFixed(3);
      }
      annotationText += `<br>p = ${pValText}`;
    }
    
    annotations.push({
      text: annotationText,
      showarrow: false,
      font: {
        color: trendColor,
        size: 14
      },
      xref: 'paper',
      yref: 'paper',
      x: 0.05,
      y: 0.95,
      xanchor: 'left',
      yanchor: 'top'
    });
  }
  
  Plotly.react(container, traces, {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: xAxisLabel,
      type: logXAxis ? 'log' : 'linear'
    }, 
    yaxis: { 
      title: yAxisLabel,
      type: logYAxis ? 'log' : 'linear'
    },
    margin: { t: 20, r: 10, b: 50, l: 70 },
    showlegend: false,
    annotations: annotations
  }, { responsive: true, displayModeBar: true });
  
  // Update residuals table
  updateResidualsTable(scatterData, trendLine, xAxisLabel);
  
  // Update residuals scatterplot (always render with selected factors)
  // Note: This will use the year from the dropdown, not the table sorting
  const residualYearSelect = document.getElementById('residualYearSelect');
  const residualYearValue = residualYearSelect ? residualYearSelect.value : '2025';
  renderResidualsScatterplot(filteredTraces, residualYearValue);
  
  // Always render ASMR vs GDP scatterplot (hidden)
  // renderASMRGDPScatterplot(filteredTraces);
  
  // Also render ASMR vs GDP table (hidden)
  // renderASMRGDPTable(filteredTraces);
  
  // Render table showing X-axis values from scatterplot (hidden)
  // renderScatterplotXAxisTable(filteredTraces);
  
  // Render composite index scatterplot (with year selection)
  renderCompositeIndexScatterplot(filteredTraces);
  
  // Render summary table with R² and p-values for all factors
  renderRegressionSummaryTable(filteredTraces);
}

// Get display name for baseline file
function getBaselineDisplayName(filename) {
  if (!filename) return '';
  
  if (filename === 'QPR-RSMEmin.txt') {
    return '2025 RMSE Minimised Baselines';
  }
  
  // Pattern: YYYY1YYYY2qpr.txt -> YYYY1-YYYY2 Static Baselines
  const match = filename.match(/(\d{4})(\d{4})qpr\.txt/);
  if (match) {
    const startYear = match[1];
    const endYear = match[2];
    return `${startYear}-${endYear} Static Baselines`;
  }
  
  return filename;
}

// Render summary table with R² and p-values for all factors
function renderRegressionSummaryTable(filteredTraces) {
  const container = document.getElementById('regressionSummaryTable');
  if (!container) return;
  
  // Get current baseline file selection
  const dataFileSelect = document.getElementById('dataFileSelect');
  const currentBaselineFile = dataFileSelect ? dataFileSelect.value : '';
  const baselineDisplayName = getBaselineDisplayName(currentBaselineFile);
  
  // Determine which year column to use (based on table sorting)
  // Note: selectedYearIndex maps to labels 2020-2024, but data lookup uses 2021-2025
  const selectedYearIndex = currentSortColumn !== null ? currentSortColumn : 4;
  const selectedYear = 2020 + selectedYearIndex; // Label year (2020-2024)
  
  const yearStarts = [
    new Date('2021-01-01T00:00:00Z'),
    new Date('2022-01-01T00:00:00Z'),
    new Date('2023-01-01T00:00:00Z'),
    new Date('2024-01-01T00:00:00Z'),
    new Date('2025-01-01T00:00:00Z')
  ];
  const selectedYearStart = yearStarts[selectedYearIndex];
  
  // Factors to analyze
  const factors = [
    { key: '2019', label: '2019 ASMR' },
    { key: 'gdp', label: 'GDP (Nominal) per Capita' },
    { key: 'gini', label: 'Inequality (GINI)' },
    { key: 'poverty', label: 'Poverty (% living below line)' },
    { key: 'health_expenditure', label: 'Health Expenditure (%GDP)' }
  ];
  
  const results = [];
  
  // Calculate for each factor
  factors.forEach(factor => {
    // Build scatterplot data for this factor
    const scatterData = [];
    
    filteredTraces.forEach((trace) => {
      const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
      if (traceIndex < 0) return;
      
      const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
      if (!metadata || !metadata.originalRows) return;
      
      // Get X-axis value based on factor
      const xValue = getXAxisValue(metadata.country, metadata.originalRows, factor.key);
      if (xValue === null || !isFinite(xValue)) return;
      
      // Get cumulative excess for the selected year
      let cumulativeExcess = null;
      let minDiff = Infinity;
      
      trace.x.forEach((date, idx) => {
        if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
          const diff = Math.abs(date - selectedYearStart);
          if (diff < minDiff && date <= selectedYearStart) {
            minDiff = diff;
            cumulativeExcess = trace.y[idx];
          }
        }
      });
      
      if (cumulativeExcess === null || minDiff > 365 * 24 * 60 * 60 * 1000) {
        trace.x.forEach((date, idx) => {
          if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
            const diff = Math.abs(date - selectedYearStart);
            if (diff < minDiff) {
              minDiff = diff;
              cumulativeExcess = trace.y[idx];
            }
          }
        });
      }
      
      if (cumulativeExcess !== null && isFinite(cumulativeExcess)) {
        scatterData.push({
          x: xValue,
          y: cumulativeExcess
        });
      }
    });
    
    if (scatterData.length >= 3) {
      const xData = scatterData.map(d => d.x);
      const yData = scatterData.map(d => d.y);
      
      // Fit trend line (polynomial curve)
      const trendLine = fitPolynomialTrend(xData, yData, 2);
      
      if (trendLine && isFinite(trendLine.rSquared)) {
        results.push({
          factor: factor.label,
          rSquared: trendLine.rSquared,
          pValue: trendLine.pValue
        });
      } else {
        results.push({
          factor: factor.label,
          rSquared: null,
          pValue: null
        });
      }
    } else {
      results.push({
        factor: factor.label,
        rSquared: null,
        pValue: null
      });
    }
  });
  
  // Calculate for Composite Index for each year (2025, 2024, 2023, 2022, 2021)
  const years = [
    { year: 2025, index: 4 },
    { year: 2024, index: 3 },
    { year: 2023, index: 2 },
    { year: 2022, index: 1 },
    { year: 2021, index: 0 }
  ];
  
  years.forEach(({ year, index }) => {
    const yearStart = yearStarts[index];
  const compositeData = [];
    
  filteredTraces.forEach((trace) => {
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.originalRows) return;
    
    // Get 2019 ASMR
    const avgASMR = calculateAverageASMR(metadata.originalRows, '2019');
    if (avgASMR === null || !isFinite(avgASMR)) return;
    
    // Get all factors
    const gdp = gdpNominal2019[metadata.country];
    const gini = gini2019[metadata.country];
    const poverty = poverty2019[metadata.country];
    const healthExp = healthExpenditure2019[metadata.country];
    
      // Get cumulative excess for this year (use same logic as individual factors)
    let cumulativeExcess = null;
    let minDiff = Infinity;
    
    trace.x.forEach((date, idx) => {
      if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
          const diff = Math.abs(date - yearStart);
          if (diff < minDiff && date <= yearStart) {
          minDiff = diff;
          cumulativeExcess = trace.y[idx];
        }
      }
    });
    
    if (cumulativeExcess === null || minDiff > 365 * 24 * 60 * 60 * 1000) {
      trace.x.forEach((date, idx) => {
        if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
            const diff = Math.abs(date - yearStart);
          if (diff < minDiff) {
            minDiff = diff;
            cumulativeExcess = trace.y[idx];
          }
        }
      });
    }
    
    if (cumulativeExcess !== null && isFinite(cumulativeExcess)) {
      compositeData.push({
        asmr: avgASMR,
        gdp: gdp,
        gini: gini,
        poverty: poverty,
        healthExp: healthExp,
        excess: cumulativeExcess
      });
    }
  });
  
  if (compositeData.length >= 6) {
    const asmrData = compositeData.map(d => d.asmr);
    const gdpData = compositeData.map(d => d.gdp);
    const giniData = compositeData.map(d => d.gini);
    const povertyData = compositeData.map(d => d.poverty);
    const healthExpData = compositeData.map(d => d.healthExp);
    const excessData = compositeData.map(d => d.excess);
    
    const regression = fitMultipleRegression5(
      asmrData, gdpData, giniData, povertyData, healthExpData, excessData
    );
    
    if (regression) {
      // Create composite indices and fit trend
      const compositeIndices = compositeData.map(d => 
        regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp)
      );
      
      const trendLine = fitPolynomialTrend(compositeIndices, excessData, 1);
      
      if (trendLine && isFinite(trendLine.rSquared)) {
        results.push({
            factor: `Composite Index vs ${year} CE`,
          rSquared: trendLine.rSquared,
          pValue: trendLine.pValue
        });
      } else {
        results.push({
            factor: `Composite Index vs ${year} CE`,
          rSquared: null,
          pValue: null
        });
      }
    } else {
      results.push({
          factor: `Composite Index vs ${year} CE`,
        rSquared: null,
        pValue: null
      });
    }
  } else {
    results.push({
        factor: `Composite Index vs ${year} CE`,
      rSquared: null,
      pValue: null
    });
  }
  });
  
  // Build HTML table
  let html = '';
  if (baselineDisplayName) {
    html += `<p style="margin-bottom: 10px; color: var(--muted); font-style: italic;">Baseline: ${baselineDisplayName}</p>`;
  }
  html += '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
  html += '<thead><tr>';
  html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid var(--text);">Factor</th>';
  html += `<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--text);">R²</th>`;
  html += `<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--text);">p-value</th>`;
  html += '</tr></thead><tbody>';
  
  results.forEach(result => {
    html += '<tr>';
    html += `<td style="padding: 8px; border-bottom: 1px solid var(--border);">${result.factor}</td>`;
    
    if (result.rSquared !== null && isFinite(result.rSquared)) {
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${result.rSquared.toFixed(3)}</td>`;
    } else {
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
    }
    
    if (result.pValue !== null && isFinite(result.pValue)) {
      let pValText;
      if (result.pValue < 0.001) {
        pValText = result.pValue.toExponential(2);
      } else {
        pValText = result.pValue.toFixed(3);
      }
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${pValText}</td>`;
    } else {
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
    }
    
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

// Populate country comparison selectors
function populateCountryComparisonSelectors() {
  const select1 = document.getElementById('compareCountry1');
  const select2 = document.getElementById('compareCountry2');
  
  if (!select1 || !select2) return;
  
  // Get list of available countries from traces
  const availableCountries = new Set();
  state.dedicatedPermanentTraces.forEach((trace, index) => {
    const metadata = state.dedicatedPermanentTraceMetadata[index];
    if (metadata && metadata.country) {
      availableCountries.add(metadata.country);
    }
  });
  
  // Sort by country name
  const sortedCountries = Array.from(availableCountries).sort((a, b) => {
    const nameA = countryNames[a] || a;
    const nameB = countryNames[b] || b;
    return nameA.localeCompare(nameB);
  });
  
  // Clear and populate selectors
  select1.innerHTML = '<option value="">Select country...</option>';
  select2.innerHTML = '<option value="">Select country...</option>';
  
  sortedCountries.forEach(countryCode => {
    const countryName = countryNames[countryCode] || countryCode;
    const option1 = document.createElement('option');
    option1.value = countryCode;
    option1.textContent = countryName;
    select1.appendChild(option1);
    
    const option2 = document.createElement('option');
    option2.value = countryCode;
    option2.textContent = countryName;
    select2.appendChild(option2);
  });
}

// Render country comparison chart
function renderCountryComparisonChart() {
  const container = document.getElementById('countryComparisonChart');
  if (!container) return;
  
  const select1 = document.getElementById('compareCountry1');
  const select2 = document.getElementById('compareCountry2');
  
  if (!select1 || !select2) return;
  
  const country1Code = select1.value;
  const country2Code = select2.value;
  
  if (!country1Code || !country2Code) {
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Date" }, yaxis: { title: "Cum. excess (ASMR per 100k)" },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    
    // Clear counterfactual validity
    const validityContainer = document.getElementById('counterfactualValidity');
    if (validityContainer) {
      validityContainer.textContent = '—';
      validityContainer.title = '';
    }
    
    // Clear table
    const tableContainer = document.getElementById('countryComparisonTable');
    if (tableContainer) {
      tableContainer.innerHTML = '';
    }
    
    // Clear policy chart
    const policyChartContainer = document.getElementById('policyComparisonChart');
    const policySelect = document.getElementById('policyVariableSelect');
    const selectedPolicy = policySelect ? policySelect.value : 'C1M_School closing';
    if (policyChartContainer) {
      Plotly.purge(policyChartContainer);
      Plotly.react(policyChartContainer, [], {
        paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: { title: "Date" }, yaxis: { title: selectedPolicy },
        margin: { t: 20, r: 10, b: 40, l: 50 },
      }, { responsive: true, displayModeBar: false });
    }
    
    // Clear area ratio table
    const areaRatioTable = document.getElementById('policyAreaRatioTable');
    if (areaRatioTable) {
      areaRatioTable.innerHTML = '';
    }
    
    return;
  }
  
  // Find traces for both countries (prefer 'b' for both sexes)
  let trace1Index = -1;
  let trace2Index = -1;
  
  // First pass: look for 'b' (both sexes)
  state.dedicatedPermanentTraces.forEach((trace, idx) => {
    const metadata = state.dedicatedPermanentTraceMetadata[idx];
    if (metadata && metadata.country === country1Code && metadata.sex === 'b') {
      trace1Index = idx;
    }
    if (metadata && metadata.country === country2Code && metadata.sex === 'b') {
      trace2Index = idx;
    }
  });
  
  // Fallback: if no 'b' found, use any sex
  if (trace1Index < 0) {
    trace1Index = state.dedicatedPermanentTraces.findIndex((trace, idx) => {
      const metadata = state.dedicatedPermanentTraceMetadata[idx];
      return metadata && metadata.country === country1Code;
    });
  }
  
  if (trace2Index < 0) {
    trace2Index = state.dedicatedPermanentTraces.findIndex((trace, idx) => {
      const metadata = state.dedicatedPermanentTraceMetadata[idx];
      return metadata && metadata.country === country2Code;
    });
  }
  
  if (trace1Index < 0 || trace2Index < 0) {
    console.warn("Could not find traces for comparison");
    // Clear counterfactual validity
    const validityContainer = document.getElementById('counterfactualValidity');
    if (validityContainer) {
      validityContainer.textContent = '—';
      validityContainer.title = '';
    }
    return;
  }
  
  const trace1 = state.dedicatedPermanentTraces[trace1Index];
  const trace2 = state.dedicatedPermanentTraces[trace2Index];
  const metadata1 = state.dedicatedPermanentTraceMetadata[trace1Index];
  const metadata2 = state.dedicatedPermanentTraceMetadata[trace2Index];
  
  // Debug: log metadata to see what we have
  console.log("Metadata1:", metadata1);
  console.log("Metadata2:", metadata2);
  console.log("Metadata1 originalRows:", metadata1?.originalRows?.length);
  console.log("Metadata2 originalRows:", metadata2?.originalRows?.length);
  
  // Check if originalRows have Year property
  if (metadata1?.originalRows?.length > 0) {
    console.log("Sample metadata1 row:", metadata1.originalRows[0]);
    console.log("Has Year property:", 'Year' in (metadata1.originalRows[0] || {}));
  }
  if (metadata2?.originalRows?.length > 0) {
    console.log("Sample metadata2 row:", metadata2.originalRows[0]);
    console.log("Has Year property:", 'Year' in (metadata2.originalRows[0] || {}));
  }
  
  const country1Name = countryNames[country1Code] || country1Code;
  const country2Name = countryNames[country2Code] || country2Code;
  
  // Get aggregation setting
  const aggregation = document.getElementById("permanentPlotAggregation")?.value || 'weekly';
  
  // Aggregate both traces
  const aggregated1 = aggregateData(trace1.x, trace1.y, aggregation);
  const aggregated2 = aggregateData(trace2.x, trace2.y, aggregation);
  
  // Find common time points for comparison
  const commonDates = [];
  const values1 = [];
  const values2 = [];
  const differences = [];
  const livesSaved = [];
  
  // Create a map of trace2 values by date
  const trace2Map = new Map();
  aggregated2.x.forEach((date, idx) => {
    if (aggregated2.y[idx] !== null && isFinite(aggregated2.y[idx])) {
      trace2Map.set(date, aggregated2.y[idx]);
    }
  });
  
  aggregated1.x.forEach((date, idx) => {
    if (aggregated1.y[idx] !== null && isFinite(aggregated1.y[idx])) {
      const val2 = trace2Map.get(date);
      if (val2 !== undefined && isFinite(val2)) {
        commonDates.push(date);
        values1.push(aggregated1.y[idx]);
        values2.push(val2);
        
        // Calculate difference (country1 - country2)
        // Positive means country1 has higher excess, negative means country2 has higher excess
        const diff = aggregated1.y[idx] - val2;
        differences.push(diff);
        
        // Calculate lives saved at each point
        // Lives saved = (ASMR difference per 100k) * (population in millions) * 10
        // (multiply by 10 to convert millions to 100k units)
        const pop1 = population2019[country1Code] || 0;
        const pop2 = population2019[country2Code] || 0;
        
        // Lives saved = how many lives would be saved if the country with higher excess
        // had the lower excess rate. Use the population of the country with higher excess.
        const absDiff = Math.abs(diff);
        const popToUse = diff > 0 ? pop1 : pop2; // Use pop of country with higher excess
        const lives = absDiff * popToUse * 10; // 10 = millions to 100k conversion
        livesSaved.push(lives);
      }
    }
  });
  
  // Create traces for the two countries
  const traces = [
    {
      x: aggregated1.x,
      y: aggregated1.y,
      type: 'scatter',
      mode: 'lines',
      name: country1Name,
      line: { color: '#1f77b4', width: 2 }
    },
    {
      x: aggregated2.x,
      y: aggregated2.y,
      type: 'scatter',
      mode: 'lines',
      name: country2Name,
      line: { color: '#ff7f0e', width: 2 }
    }
  ];
  
  // Add annotations for differences at each year
  const annotations = [];
  const yearMarkers = [2021, 2022, 2023, 2024, 2025];
  
  yearMarkers.forEach(year => {
    const yearStart = new Date(`${year}-01-01T00:00:00Z`);
    
    // Find closest data point to this year
    let closestIdx = -1;
    let minDiff = Infinity;
    
    commonDates.forEach((date, idx) => {
      const diff = Math.abs(date - yearStart);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    
    if (closestIdx >= 0 && minDiff < 365 * 24 * 60 * 60 * 1000) {
      const date = commonDates[closestIdx];
      const val1 = values1[closestIdx];
      const val2 = values2[closestIdx];
      const diff = differences[closestIdx];
      const lives = livesSaved[closestIdx];
      
      // Calculate position for annotation (midpoint between the two curves)
      const yPos = (val1 + val2) / 2;
      
      // Format lives saved text
      let livesText = '';
      if (lives >= 1000) {
        livesText = `${(lives / 1000).toFixed(1)}k lives`;
      } else {
        livesText = `${Math.round(lives)} lives`;
      }
      
      // Determine which country "saved" lives (lower excess means lives saved)
      const diffText = diff > 0 
        ? `${country2Name} saved\n${livesText}`
        : `${country1Name} saved\n${livesText}`;
      
      annotations.push({
        x: date,
        y: yPos,
        text: diffText,
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 1,
        arrowcolor: '#666',
        ax: 0,
        ay: -30,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        bordercolor: '#666',
        borderwidth: 1,
        font: { size: 10, color: '#333' }
      });
    }
  });
  
  const layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { title: "Date" },
    yaxis: { title: "Cum. excess (ASMR per 100k)" },
    margin: { t: 20, r: 10, b: 40, l: 50 },
    annotations: annotations,
    legend: { x: 0.02, y: 0.98, bgcolor: 'rgba(255, 255, 255, 0.8)' }
  };
  
  Plotly.react(container, traces, layout, { responsive: true, displayModeBar: false });
  
  // Update counterfactual validity
  updateCounterfactualValidity(metadata1, metadata2, country1Name, country2Name);
  
  // Render comparison table
  renderCountryComparisonTable(trace1, trace2, aggregated1, aggregated2, country1Name, country2Name, country1Code, country2Code);
  
  // Render policy comparison chart
  renderPolicyComparisonChart(country1Code, country2Code, country1Name, country2Name);
  
  // Clear policy area ratio table (will be calculated on button click)
  const areaRatioTable = document.getElementById('policyAreaRatioTable');
  if (areaRatioTable) {
    areaRatioTable.innerHTML = '';
  }
}

// Calculate quartiles PER COUNTRY for all country pair differences based on selected metric
// For each country, rank its differences with all other countries and assign quartiles
function calculateQuartiles(validityType) {
  const countryValues = new Map();
  
  // First, collect all country values
  if (validityType === '2024-svi') {
    // Calculate 2024 SVI for all countries
    const regression = calculateFixedRegression(2024);
    if (!regression || !regression.predict) return null;
    
    state.dedicatedPermanentTraces.forEach((trace, traceIndex) => {
      const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
      if (!metadata || !metadata.originalRows) return;
      
      const asmr = calculateAverageASMR(metadata.originalRows, '2019');
      if (asmr === null || !isFinite(asmr)) return;
      
      const gdp = gdpNominal2019[metadata.country];
      const gini = gini2019[metadata.country];
      const poverty = poverty2019[metadata.country];
      const healthExp = healthExpenditure2019[metadata.country];
      
      const svi = regression.predict(asmr, gdp, gini, poverty, healthExp);
      if (svi !== null && isFinite(svi)) {
        countryValues.set(metadata.country, svi);
      }
    });
  } else {
    // Calculate 2019 ASMR for all countries
    state.dedicatedPermanentTraces.forEach((trace, traceIndex) => {
      const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
      if (!metadata || !metadata.originalRows) return;
      
      const asmr = calculateAverageASMR(metadata.originalRows, '2019');
      if (asmr !== null && isFinite(asmr)) {
        countryValues.set(metadata.country, asmr);
      }
    });
  }
  
  if (countryValues.size === 0) return null;
  
  // Calculate quartiles PER COUNTRY
  // For each country, collect all its differences with other countries, sort, and assign quartiles
  const quartilesByCountry = new Map();
  const countryArray = Array.from(countryValues.keys());
  
  countryArray.forEach(country => {
    const differences = [];
    const countryValue = countryValues.get(country);
    
    // Collect all differences for this country with all other countries
    countryArray.forEach(otherCountry => {
      if (country !== otherCountry) {
        const otherValue = countryValues.get(otherCountry);
        const diff = Math.abs(countryValue - otherValue);
        differences.push(diff);
      }
    });
    
    if (differences.length === 0) return;
    
    // Sort differences (lower difference = more similar = better = green)
    differences.sort((a, b) => a - b);
    
    // Calculate quartile boundaries based on rank to ensure even distribution
    const n = differences.length;
    const q1Idx = Math.floor(n * 0.25);
    const q2Idx = Math.floor(n * 0.5);
    const q3Idx = Math.floor(n * 0.75);
    
    // Store sorted differences for binary search lookup
    quartilesByCountry.set(country, {
      sortedDifferences: differences,
      q1Idx: q1Idx,
      q2Idx: q2Idx,
      q3Idx: q3Idx,
      n: n
    });
  });
  
  console.log(`Quartiles calculated per country: ${quartilesByCountry.size} countries`);
  
  return {
    quartilesByCountry: quartilesByCountry, // Map: country -> quartile data
    countryValues: countryValues
  };
}

// Get quartile for a value using per-country quartile data
function getQuartile(value, quartileData) {
  // Use sortedDifferences with pre-calculated quartile indices
  if (quartileData.sortedDifferences) {
    const sortedDiffs = quartileData.sortedDifferences;
    const n = quartileData.n || sortedDiffs.length;
    // Use pre-calculated indices if available, otherwise calculate
    const q1Idx = quartileData.q1Idx !== undefined ? quartileData.q1Idx : Math.floor(n * 0.25);
    const q2Idx = quartileData.q2Idx !== undefined ? quartileData.q2Idx : Math.floor(n * 0.5);
    const q3Idx = quartileData.q3Idx !== undefined ? quartileData.q3Idx : Math.floor(n * 0.75);
    
    // Use binary search to find the range of positions where this value appears
    // Use a small tolerance for floating point comparison
    const tolerance = 1e-10;
    
    // First, find the first position where value appears (with tolerance)
    let left = 0;
    let right = n;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (sortedDiffs[mid] < value - tolerance) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    const firstIdx = left;
    
    // Then find the first position > value (with tolerance)
    left = firstIdx;
    right = n;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (sortedDiffs[mid] <= value + tolerance) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    const lastIdx = left - 1;
    
    // Use the median position of all occurrences to determine quartile
    // This ensures that if duplicates span boundaries, we use a representative position
    if (firstIdx <= lastIdx) {
      const medianPos = Math.floor((firstIdx + lastIdx) / 2);
      
      if (medianPos < q1Idx) {
        return 1;
      } else if (medianPos < q2Idx) {
        return 2;
      } else if (medianPos < q3Idx) {
        return 3;
      } else {
        return 4;
      }
    }
    
    // If value not found, use insertion point
    const rank = firstIdx;
    if (rank < q1Idx) {
      return 1;
    } else if (rank < q2Idx) {
      return 2;
    } else if (rank < q3Idx) {
      return 3;
    } else {
      return 4;
    }
  }
  
  // Fallback: try exact match in valueToQuartile map (for backward compatibility)
  if (quartileData.valueToQuartile) {
    const quartile = quartileData.valueToQuartile.get(value);
    if (quartile !== undefined) {
      return quartile;
    }
  }
  
  // Final fallback to threshold-based assignment
  const quartiles = quartileData.quartiles || quartileData;
  if (value < quartiles.q1) return 1;
  if (value < quartiles.q2) return 2;
  if (value < quartiles.q3) return 3;
  return 4;
}

// Get color for quartile
function getQuartileColor(quartile) {
  switch(quartile) {
    case 1: return '#2ca02c'; // Green (top quartile - best)
    case 2: return '#ffd700'; // Yellow (2nd quartile)
    case 3: return '#ff7f0e'; // Orange (3rd quartile)
    case 4: return '#d62728'; // Red (4th quartile - worst)
    default: return '#333';
  }
}

// Update counterfactual validity display
function updateCounterfactualValidity(metadata1, metadata2, country1Name, country2Name) {
  const container = document.getElementById('counterfactualValidity');
  if (!container) {
    console.warn("counterfactualValidity container not found");
    return;
  }
  
  // Get the type selector
  const typeSelect = document.getElementById('counterfactualValidityType');
  const validityType = typeSelect ? typeSelect.value : '2019-asmr';
  
  if (!metadata1 || !metadata2) {
    console.warn("Missing metadata:", { metadata1: !!metadata1, metadata2: !!metadata2 });
    container.textContent = '—';
    container.title = '';
    container.style.color = '';
    return;
  }
  
  if (!metadata1.originalRows || !metadata2.originalRows) {
    console.warn("Missing originalRows:", { 
      metadata1Rows: !!metadata1.originalRows, 
      metadata2Rows: !!metadata2.originalRows 
    });
    container.textContent = '—';
    container.title = '';
    container.style.color = '';
    return;
  }
  
  // Calculate quartiles for all countries
  const quartileData = calculateQuartiles(validityType);
  
  let value1, value2, diff, sign, displayText, tooltipText, quartile1, quartile2;
  
  if (validityType === '2024-svi') {
    // Calculate 2024 Structural Vulnerability Index for both countries
    const regression = calculateFixedRegression(2024);
    
    if (!regression || !regression.predict) {
      console.warn("Failed to get 2024 regression for SVI calculation");
      container.textContent = '—';
      container.title = '';
      container.style.color = '';
      return;
    }
    
    // Get factors for country 1
    const asmr1 = calculateAverageASMR(metadata1.originalRows, '2019');
    const gdp1 = gdpNominal2019[metadata1.country];
    const gini1 = gini2019[metadata1.country];
    const poverty1 = poverty2019[metadata1.country];
    const healthExp1 = healthExpenditure2019[metadata1.country];
    
    // Get factors for country 2
    const asmr2 = calculateAverageASMR(metadata2.originalRows, '2019');
    const gdp2 = gdpNominal2019[metadata2.country];
    const gini2 = gini2019[metadata2.country];
    const poverty2 = poverty2019[metadata2.country];
    const healthExp2 = healthExpenditure2019[metadata2.country];
    
    // Check if we have all required factors
    if (asmr1 === null || asmr2 === null || !isFinite(asmr1) || !isFinite(asmr2)) {
      console.warn("Invalid ASMR values for SVI:", { asmr1, asmr2 });
      container.textContent = '—';
      container.title = '';
      container.style.color = '';
      return;
    }
    
    // Calculate SVI for both countries
    value1 = regression.predict(asmr1, gdp1, gini1, poverty1, healthExp1);
    value2 = regression.predict(asmr2, gdp2, gini2, poverty2, healthExp2);
    
    if (value1 === null || value2 === null || !isFinite(value1) || !isFinite(value2)) {
      console.warn("Invalid SVI values:", { value1, value2 });
      container.textContent = '—';
      container.title = '';
      container.style.color = '';
      return;
    }
    
    // Calculate difference
    diff = value1 - value2;
    sign = diff > 0 ? '+' : '';
    displayText = `${sign}${diff.toFixed(1)} SVI`;
    tooltipText = `${country1Name} 2024 SVI: ${value1.toFixed(1)} | ${country2Name} 2024 SVI: ${value2.toFixed(1)}`;
  } else {
    // Calculate 2019 ASMR for both countries
    value1 = calculateAverageASMR(metadata1.originalRows, '2019');
    value2 = calculateAverageASMR(metadata2.originalRows, '2019');
    
    console.log("2019 ASMR values:", { value1, value2 });
    
    if (value1 === null || value2 === null || !isFinite(value1) || !isFinite(value2)) {
      console.warn("Invalid ASMR values:", { value1, value2 });
      container.textContent = '—';
      container.title = '';
      container.style.color = '';
      return;
    }
    
    // Calculate difference
    diff = value1 - value2;
    sign = diff > 0 ? '+' : '';
    displayText = `${sign}${diff.toFixed(1)} ASMR per 100k`;
    tooltipText = `${country1Name} 2019 ASMR: ${value1.toFixed(1)} | ${country2Name} 2019 ASMR: ${value2.toFixed(1)}`;
  }
  
  // Determine quartiles and color based on the absolute difference
  // Use country1's quartile data to rank this comparison
  // The sign of the difference doesn't matter - only the absolute value is used for ranking
  let color = '#333'; // Default color
  if (quartileData && quartileData.quartilesByCountry && metadata1 && metadata1.country) {
    // Get quartile data for country1 (the first country)
    const country1QuartileData = quartileData.quartilesByCountry.get(metadata1.country);
    
    if (country1QuartileData) {
      // Use absolute value of difference (sign doesn't matter for counterfactual validity)
      const absDiff = Math.abs(diff);
      
      // Get quartile of this absolute difference using country1's quartile data
      // Lower difference = more similar = better = green
      const diffQuartile = getQuartile(absDiff, country1QuartileData);
      color = getQuartileColor(diffQuartile);
      
      // Add quartile info to tooltip
      tooltipText += ` | Difference quartile: ${diffQuartile} (${absDiff.toFixed(1)} absolute difference, ranked from ${country1Name}'s perspective)`;
    }
  }
  
  // Format display
  container.textContent = displayText;
  container.title = tooltipText;
  container.style.color = color;
}

// Render country comparison table with values at different years
function renderCountryComparisonTable(trace1, trace2, aggregated1, aggregated2, country1Name, country2Name, country1Code, country2Code) {
  const container = document.getElementById('countryComparisonTable');
  if (!container) return;
  
  const select1 = document.getElementById('compareCountry1');
  const select2 = document.getElementById('compareCountry2');
  
  if (!select1 || !select2 || !select1.value || !select2.value) {
    container.innerHTML = '';
    return;
  }
  
  // Get population data
  const pop1 = population2019[country1Code] || 0;
  const pop2 = population2019[country2Code] || 0;
  
  // Helper function to get value at a specific date from aggregated data
  // Prefers the last value on or before the target date, but will take closest if nothing before
  function getValueAtDate(aggregated, targetDate) {
    let closestIdx = -1;
    let minDiff = Infinity;
    let bestBeforeIdx = -1;
    let minDiffBefore = Infinity;
    
    aggregated.x.forEach((date, idx) => {
      if (aggregated.y[idx] !== null && isFinite(aggregated.y[idx])) {
        const diff = Math.abs(date - targetDate);
        const isBefore = date <= targetDate;
        
        // Track closest overall
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
        
        // Track closest on or before target date
        if (isBefore && diff < minDiffBefore) {
          minDiffBefore = diff;
          bestBeforeIdx = idx;
        }
      }
    });
    
    // Prefer value on or before target date, but fall back to closest if within reasonable range
    const finalIdx = bestBeforeIdx >= 0 ? bestBeforeIdx : closestIdx;
    
    if (finalIdx >= 0 && minDiff < 90 * 24 * 60 * 60 * 1000) { // Within 90 days
      return aggregated.y[finalIdx];
    }
    return null;
  }
  
  // Build combined data points for area calculation
  // Create a map of all dates from both traces
  const allDates = new Set();
  aggregated1.x.forEach(date => allDates.add(date));
  aggregated2.x.forEach(date => allDates.add(date));
  const sortedDates = Array.from(allDates).sort((a, b) => a - b);
  
  // Calculate life years saved (area between curves) up to each year
  const yearMarkers = [2021, 2022, 2023, 2024, 2025];
  const yearData = [];
  
  yearMarkers.forEach(year => {
    const yearStart = new Date(`${year}-01-01T00:00:00Z`);
    
    // Get values at this year from the aggregated data
    const val1 = getValueAtDate(aggregated1, yearStart);
    const val2 = getValueAtDate(aggregated2, yearStart);
    
    // Calculate difference
    let diff = null;
    let absDiff = null;
    let lives = null;
    
    if (val1 !== null && val2 !== null) {
      diff = val1 - val2;
      absDiff = Math.abs(diff);
      // Always use country 1's population
      const livesValue = absDiff * pop1 * 10; // 10 = millions to 100k conversion
      // If difference is positive (country1 worse), lives saved should be negative
      lives = diff > 0 ? -livesValue : livesValue;
    }
    
    // Calculate area between curves up to this year
    // Find all data points up to this year
    const pointsUpToYear = [];
    sortedDates.forEach(date => {
      if (date <= yearStart) {
        const v1 = getValueAtDate(aggregated1, date);
        const v2 = getValueAtDate(aggregated2, date);
        if (v1 !== null && v2 !== null) {
          pointsUpToYear.push({
            date: date,
            val1: v1,
            val2: v2,
            diff: v1 - v2
          });
        }
      }
    });
    
    // Calculate area between curves using trapezoidal rule
    // Track signed areas to handle crossovers properly
    // Positive diff (country1 worse) = negative contribution
    // Negative diff (country1 better) = positive contribution
    let lifeYearsSaved = 0;
    if (pointsUpToYear.length > 1) {
      for (let i = 1; i < pointsUpToYear.length; i++) {
        const prev = pointsUpToYear[i - 1];
        const curr = pointsUpToYear[i];
        
        // Time difference in years
        const timeDiffYears = (curr.date - prev.date) / (365.25 * 24 * 60 * 60 * 1000);
        
        // Check if the lines cross in this interval
        const prevSign = prev.diff >= 0 ? 1 : -1;
        const currSign = curr.diff >= 0 ? 1 : -1;
        const signsMatch = prevSign === currSign;
        
        if (signsMatch) {
          // No crossover in this interval - use signed average
          const avgDiff = (prev.diff + curr.diff) / 2;
          // Negative diff (country1 better) adds positive area
          // Positive diff (country1 worse) adds negative area
          lifeYearsSaved += avgDiff * timeDiffYears;
        } else {
          // Lines cross in this interval - need to split the calculation
          // Find the crossover point (where diff = 0)
          // Linear interpolation: diff = prev.diff + t * (curr.diff - prev.diff) = 0
          // t = -prev.diff / (curr.diff - prev.diff)
          const t = -prev.diff / (curr.diff - prev.diff);
          const crossoverTime = prev.date.getTime() + t * (curr.date.getTime() - prev.date.getTime());
          const crossoverDate = new Date(crossoverTime);
          
          // Calculate area before crossover (with prev sign)
          const timeBeforeCrossover = (crossoverDate - prev.date) / (365.25 * 24 * 60 * 60 * 1000);
          const avgDiffBefore = prev.diff / 2; // At crossover, diff = 0, so average is prev.diff/2
          lifeYearsSaved += avgDiffBefore * timeBeforeCrossover;
          
          // Calculate area after crossover (with curr sign)
          const timeAfterCrossover = (curr.date - crossoverDate) / (365.25 * 24 * 60 * 60 * 1000);
          const avgDiffAfter = curr.diff / 2; // At crossover, diff = 0, so average is curr.diff/2
          lifeYearsSaved += avgDiffAfter * timeAfterCrossover;
        }
      }
    }
    
    // Calculate life years in lives (ASMR-years * population)
    const lifeYearsInLives = lifeYearsSaved * pop1 * 10; // 10 = millions to 100k conversion
    
    yearData.push({
      year: year,
      country1Value: val1,
      country2Value: val2,
      difference: diff,
      livesSaved: lives,
      lifeYearsSaved: lifeYearsSaved,
      lifeYearsInLives: lifeYearsInLives
    });
  });
  
  // Get QALY multiplier
  const qalyMultiplierInput = document.getElementById('qalyMultiplier');
  const qalyMultiplier = qalyMultiplierInput ? parseFloat(qalyMultiplierInput.value) || 1 : 1;
  
  // Get per capita values for normalized cost difference calculation
  const perCapitaVariable = 'IMF 2021 (derived) - USD Spend per Capita';
  const oxCode1 = oxCGRTCountryCodeMap[country1Code] || country1Code;
  const oxCode2 = oxCGRTCountryCodeMap[country2Code] || country2Code;
  
  let perCapita1 = null;
  let perCapita2 = null;
  
  const country1PolicyData = state.policyDataByCountry.get(oxCode1);
  const country2PolicyData = state.policyDataByCountry.get(oxCode2);
  
  if (country1PolicyData) {
    const perCapitaData1 = country1PolicyData.get(perCapitaVariable);
    if (perCapitaData1 && perCapitaData1.length > 0) {
      // Get the first value (they're all the same since it's static data)
      perCapita1 = perCapitaData1[0].value;
    }
  }
  
  if (country2PolicyData) {
    const perCapitaData2 = country2PolicyData.get(perCapitaVariable);
    if (perCapitaData2 && perCapitaData2.length > 0) {
      // Get the first value (they're all the same since it's static data)
      perCapita2 = perCapitaData2[0].value;
    }
  }
  
  // Calculate normalized cost difference for each year
  yearData.forEach(row => {
    if (perCapita1 !== null && perCapita2 !== null && pop1 > 0) {
      // Normalized cost difference = (per capita difference) * population of country 1
      // Population is in millions, so multiply by 1e6 to get actual population
      const perCapitaDiff = perCapita1 - perCapita2;
      row.normalizedCostDiff = perCapitaDiff * pop1 * 1e6; // Result in USD
    } else {
      row.normalizedCostDiff = null;
    }
  });
  
  // Build HTML table
  let html = '<table class="summary-table" style="width: 100%; border-collapse: collapse; margin-top: 20px;">';
  html += '<thead><tr>';
  html += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid var(--border);">Year</th>';
  html += `<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--border);">${country1Name}<br><span style="font-size: 0.85em; font-weight: normal;">(ASMR per 100k)</span></th>`;
  html += `<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--border);">${country2Name}<br><span style="font-size: 0.85em; font-weight: normal;">(ASMR per 100k)</span></th>`;
  html += '<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--border);">Difference<br><span style="font-size: 0.85em; font-weight: normal;">(ASMR per 100k)</span></th>';
  html += `<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--border);">${country1Name} Lives Saved</th>`;
  html += '<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--border);">ASMR-years</th>';
  html += `<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--border);">${country1Name} Life Years</th>`;
  html += `<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--border);">QALY<br><span style="font-size: 0.85em; font-weight: normal;">(multiplier: ${qalyMultiplier.toFixed(2)})</span></th>`;
  html += '<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--border);">Cost per QALY</th>';
  html += '</tr></thead><tbody>';
  
  // Calculate population-adjusted cost difference (constant for all years)
  const popAdjustedCostDiff = perCapita1 !== null && perCapita2 !== null && pop1 > 0 ? 
    (perCapita1 - perCapita2) * pop1 * 1e6 : null;
  
  yearData.forEach(row => {
    html += '<tr>';
    html += `<td style="padding: 8px; border-bottom: 1px solid var(--border);">${row.year}</td>`;
    
    // Country 1 value
    if (row.country1Value !== null) {
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${row.country1Value.toFixed(1)}</td>`;
    } else {
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
    }
    
    // Country 2 value
    if (row.country2Value !== null) {
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${row.country2Value.toFixed(1)}</td>`;
    } else {
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
    }
    
    // Difference (with minus sign where appropriate)
    if (row.difference !== null) {
      const diffColor = row.difference > 0 ? 'color: #d62728;' : 'color: #2ca02c;';
      const sign = row.difference > 0 ? '+' : '';
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); ${diffColor}">${sign}${row.difference.toFixed(1)}</td>`;
    } else {
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
    }
    
    // Lives saved (with sign based on difference)
    if (row.livesSaved !== null) {
      const absLives = Math.abs(row.livesSaved);
      const sign = row.livesSaved >= 0 ? '+' : '-';
      const livesText = absLives >= 1000 
        ? `${sign}${(absLives / 1000).toFixed(1)}k`
        : `${sign}${Math.round(absLives)}`;
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${livesText}</td>`;
    } else {
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
    }
    
    // ASMR-years (with sign based on actual area between curves, reversed)
    if (row.lifeYearsSaved !== null && row.lifeYearsSaved !== undefined) {
      const absAsmr = Math.abs(row.lifeYearsSaved);
      const asmrSign = row.lifeYearsSaved >= 0 ? '-' : '+';
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${asmrSign}${absAsmr.toFixed(1)}</td>`;
    } else {
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
    }
    
    // Life years in lives (with sign based on actual area between curves, reversed)
    if (row.lifeYearsInLives !== null && row.lifeYearsInLives !== undefined) {
      const absLifeYears = Math.abs(row.lifeYearsInLives);
      const lifeYearsSign = row.lifeYearsInLives >= 0 ? '-' : '+';
      const lifeYearsText = absLifeYears >= 1000 
        ? `${lifeYearsSign}${(absLifeYears / 1000).toFixed(1)}k`
        : `${lifeYearsSign}${Math.round(absLifeYears)}`;
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${lifeYearsText}</td>`;
    } else {
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
    }
    
    // QALY (Life Years * QALY multiplier, with same sign as Life Years)
    let qalyValue = null;
    if (row.lifeYearsInLives !== null && row.difference !== null) {
      qalyValue = row.lifeYearsInLives * qalyMultiplier;
      const absQaly = Math.abs(qalyValue);
      const qalySign = row.lifeYearsInLives >= 0 ? '-' : '+';
      const qalyText = absQaly >= 1000 
        ? `${qalySign}${(absQaly / 1000).toFixed(1)}k`
        : `${qalySign}${Math.round(absQaly)}`;
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${qalyText}</td>`;
    } else {
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
    }
    
    // Cost per QALY (Population-adjusted cost difference / QALY)
    if (popAdjustedCostDiff !== null && qalyValue !== null && qalyValue !== 0 && isFinite(qalyValue)) {
      const costPerQaly = -popAdjustedCostDiff / qalyValue;
        const absCostPerQaly = Math.abs(costPerQaly);
        const costPerQalySign = costPerQaly >= 0 ? '+' : '-';
        let costPerQalyText;
        if (absCostPerQaly >= 1e6) {
          costPerQalyText = `${costPerQalySign}$${(absCostPerQaly / 1e6).toFixed(1)}M`;
        } else if (absCostPerQaly >= 1e3) {
          costPerQalyText = `${costPerQalySign}$${(absCostPerQaly / 1e3).toFixed(1)}k`;
        } else {
          costPerQalyText = `${costPerQalySign}$${Math.round(absCostPerQaly)}`;
        }
        html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${costPerQalyText}</td>`;
    } else {
      html += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
    }
    
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  
  // Create separate financial info table
  // Get GDP per capita for both countries
  const gdpPerCap1 = gdpNominal2019[country1Code] || null;
  const gdpPerCap2 = gdpNominal2019[country2Code] || null;
  
  // Calculate financial metrics for each country
  // Cost (Billions USD) = perCapita * population / 1e9
  // Cost (% GDP) = (perCapita / GDP per capita) * 100
  // Additional Cost per capita = perCapita1 - perCapita2
  
  // Calculate costs for country 1
  const costTotal1 = perCapita1 !== null && pop1 > 0 ? perCapita1 * pop1 * 1e6 : null; // Total in USD
  const costBillions1 = costTotal1 !== null ? costTotal1 / 1e9 : null;
  const costPercentGDP1 = perCapita1 !== null && gdpPerCap1 !== null && gdpPerCap1 > 0 ? 
    (perCapita1 / gdpPerCap1) * 100 : null;
  
  // Calculate costs for country 2
  const costTotal2 = perCapita2 !== null && pop2 > 0 ? perCapita2 * pop2 * 1e6 : null; // Total in USD
  const costBillions2 = costTotal2 !== null ? costTotal2 / 1e9 : null;
  const costPercentGDP2 = perCapita2 !== null && gdpPerCap2 !== null && gdpPerCap2 > 0 ? 
    (perCapita2 / gdpPerCap2) * 100 : null;
  
  // Additional cost per capita (difference)
  const additionalCostPerCapita1 = perCapita1 !== null && perCapita2 !== null ? 
    perCapita1 - perCapita2 : null;
  const additionalCostPerCapita2 = perCapita1 !== null && perCapita2 !== null ? 
    perCapita2 - perCapita1 : null;
  
  // Population-normalised cost difference (additional cost per capita * population)
  const popNormalisedCostDiff1 = additionalCostPerCapita1 !== null && pop1 > 0 ? 
    additionalCostPerCapita1 * pop1 * 1e6 : null; // Convert millions to actual population
  const popNormalisedCostDiff2 = additionalCostPerCapita2 !== null && pop2 > 0 ? 
    additionalCostPerCapita2 * pop2 * 1e6 : null; // Convert millions to actual population
  
  let financialHtml = '<table class="summary-table" style="width: 100%; border-collapse: collapse; margin-top: 20px;">';
  financialHtml += '<thead><tr>';
  financialHtml += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid var(--border);">Country</th>';
  financialHtml += '<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--border);">Cost (USD)</th>';
  financialHtml += '<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--border);">Cost per Capita</th>';
  financialHtml += '<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--border);">Cost (% GDP)</th>';
  financialHtml += '<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--border);">Difference in Cost per Capita</th>';
  financialHtml += '<th style="padding: 8px; text-align: right; border-bottom: 2px solid var(--border);">Population-adjusted Cost Difference</th>';
  financialHtml += '</tr></thead><tbody>';
  
  // Country 1 row
  financialHtml += '<tr>';
  financialHtml += `<td style="padding: 8px; border-bottom: 1px solid var(--border);">${country1Name}</td>`;
  
  // Cost (USD)
  if (costTotal1 !== null) {
    const absCost = Math.abs(costTotal1);
    let costText;
    if (absCost >= 1e9) {
      costText = `$${(absCost / 1e9).toFixed(2)}B`;
    } else if (absCost >= 1e6) {
      costText = `$${(absCost / 1e6).toFixed(1)}M`;
    } else if (absCost >= 1e3) {
      costText = `$${(absCost / 1e3).toFixed(1)}k`;
    } else {
      costText = `$${Math.round(absCost)}`;
    }
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${costText}</td>`;
  } else {
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
  }
  
  // Cost (per capita)
  if (perCapita1 !== null) {
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">$${perCapita1.toFixed(2)}</td>`;
  } else {
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
  }
  
  // Cost (% GDP)
  if (costPercentGDP1 !== null) {
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${costPercentGDP1.toFixed(2)}%</td>`;
  } else {
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
  }
  
  // Additional Cost per capita
  if (additionalCostPerCapita1 !== null) {
    const sign = additionalCostPerCapita1 >= 0 ? '+' : '-';
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${sign}$${Math.abs(additionalCostPerCapita1).toFixed(2)}</td>`;
  } else {
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
  }
  
  // Population-normalised cost difference
  if (popNormalisedCostDiff1 !== null) {
    const absCost = Math.abs(popNormalisedCostDiff1);
    const sign = popNormalisedCostDiff1 >= 0 ? '+' : '-';
    let costText;
    if (absCost >= 1e9) {
      costText = `${sign}$${(absCost / 1e9).toFixed(2)}B`;
    } else if (absCost >= 1e6) {
      costText = `${sign}$${(absCost / 1e6).toFixed(1)}M`;
    } else if (absCost >= 1e3) {
      costText = `${sign}$${(absCost / 1e3).toFixed(1)}k`;
    } else {
      costText = `${sign}$${Math.round(absCost)}`;
    }
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${costText}</td>`;
  } else {
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
  }
  
  financialHtml += '</tr>';
  
  // Country 2 row
  financialHtml += '<tr>';
  financialHtml += `<td style="padding: 8px; border-bottom: 1px solid var(--border);">${country2Name}</td>`;
  
  // Cost (USD)
  if (costTotal2 !== null) {
    const absCost = Math.abs(costTotal2);
    let costText;
    if (absCost >= 1e9) {
      costText = `$${(absCost / 1e9).toFixed(2)}B`;
    } else if (absCost >= 1e6) {
      costText = `$${(absCost / 1e6).toFixed(1)}M`;
    } else if (absCost >= 1e3) {
      costText = `$${(absCost / 1e3).toFixed(1)}k`;
    } else {
      costText = `$${Math.round(absCost)}`;
    }
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${costText}</td>`;
  } else {
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
  }
  
  // Cost (per capita)
  if (perCapita2 !== null) {
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">$${perCapita2.toFixed(2)}</td>`;
  } else {
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
  }
  
  // Cost (% GDP)
  if (costPercentGDP2 !== null) {
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${costPercentGDP2.toFixed(2)}%</td>`;
  } else {
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
  }
  
  // Additional Cost per capita
  if (additionalCostPerCapita2 !== null) {
    const sign = additionalCostPerCapita2 >= 0 ? '+' : '-';
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${sign}$${Math.abs(additionalCostPerCapita2).toFixed(2)}</td>`;
  } else {
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
  }
  
  // Population-normalised cost difference
  if (popNormalisedCostDiff2 !== null) {
    const absCost = Math.abs(popNormalisedCostDiff2);
    const sign = popNormalisedCostDiff2 >= 0 ? '+' : '-';
    let costText;
    if (absCost >= 1e9) {
      costText = `${sign}$${(absCost / 1e9).toFixed(2)}B`;
    } else if (absCost >= 1e6) {
      costText = `${sign}$${(absCost / 1e6).toFixed(1)}M`;
    } else if (absCost >= 1e3) {
      costText = `${sign}$${(absCost / 1e3).toFixed(1)}k`;
    } else {
      costText = `${sign}$${Math.round(absCost)}`;
    }
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border);">${costText}</td>`;
  } else {
    financialHtml += `<td style="padding: 8px; text-align: right; border-bottom: 1px solid var(--border); color: var(--muted);">—</td>`;
  }
  
  financialHtml += '</tr>';
  financialHtml += '</tbody></table>';
  
  container.innerHTML = financialHtml + html;
}

// Render policy comparison chart
function renderPolicyComparisonChart(country1Code, country2Code, country1Name, country2Name) {
  const container = document.getElementById('policyComparisonChart');
  if (!container) return;
  
  // Get selected policy variable
  const policySelect = document.getElementById('policyVariableSelect');
  const selectedPolicy = policySelect ? policySelect.value : 'C1M_School closing';
  
  if (!country1Code || !country2Code) {
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Date" }, yaxis: { title: selectedPolicy },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Map country codes to OxCGRT codes
  const oxCode1 = oxCGRTCountryCodeMap[country1Code] || country1Code;
  const oxCode2 = oxCGRTCountryCodeMap[country2Code] || country2Code;
  
  // Get policy data for both countries
  const country1Data = state.policyDataByCountry.get(oxCode1);
  const country2Data = state.policyDataByCountry.get(oxCode2);
  
  if (!country1Data || !country2Data) {
    console.warn(`Policy data not found for ${country1Code} (${oxCode1}) or ${country2Code} (${oxCode2})`);
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Date" }, yaxis: { title: selectedPolicy },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Get data for the selected policy variable
  const data1 = country1Data.get(selectedPolicy);
  const data2 = country2Data.get(selectedPolicy);
  
  if (!data1 || !data2 || data1.length === 0 || data2.length === 0) {
    console.warn(`Policy data for ${selectedPolicy} not found for ${country1Code} (${oxCode1}) or ${country2Code} (${oxCode2})`);
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Date" }, yaxis: { title: selectedPolicy },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Extract dates and values
  const dates1 = data1.map(d => d.date);
  const values1 = data1.map(d => d.value);
  const dates2 = data2.map(d => d.date);
  const values2 = data2.map(d => d.value);
  
  // Helper function to get value at a specific date (with interpolation)
  function getValueAtDate(data, targetDate) {
    // Find closest dates before and after
    let beforeIdx = -1;
    let afterIdx = -1;
    let beforeDate = null;
    let afterDate = null;
    
    for (let i = 0; i < data.length; i++) {
      const date = data[i].date;
      if (date <= targetDate) {
        if (beforeIdx < 0 || date > beforeDate) {
          beforeIdx = i;
          beforeDate = date;
        }
      }
      if (date >= targetDate) {
        if (afterIdx < 0 || date < afterDate) {
          afterIdx = i;
          afterDate = date;
        }
      }
    }
    
    // If exact match
    if (beforeIdx >= 0 && data[beforeIdx].date.getTime() === targetDate.getTime()) {
      return data[beforeIdx].value;
    }
    if (afterIdx >= 0 && data[afterIdx].date.getTime() === targetDate.getTime()) {
      return data[afterIdx].value;
    }
    
    // Interpolate if we have both before and after
    if (beforeIdx >= 0 && afterIdx >= 0 && beforeDate && afterDate) {
      const beforeValue = data[beforeIdx].value;
      const afterValue = data[afterIdx].value;
      const timeDiff = afterDate.getTime() - beforeDate.getTime();
      if (timeDiff > 0) {
        const t = (targetDate.getTime() - beforeDate.getTime()) / timeDiff;
        return beforeValue + (afterValue - beforeValue) * t;
      }
      return beforeValue;
    }
    
    // Return closest value
    if (beforeIdx >= 0) return data[beforeIdx].value;
    if (afterIdx >= 0) return data[afterIdx].value;
    return null;
  }
  
  // Find date range that covers both datasets
  const allDates = [...dates1, ...dates2];
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  
  // Create filled area data (overlapping area - minimum value at each point)
  // Sample at daily intervals
  const filledDates = [];
  const filledY = []; // Minimum value (overlap)
  
  const currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    const val1 = getValueAtDate(data1, currentDate);
    const val2 = getValueAtDate(data2, currentDate);
    
    if (val1 !== null && val2 !== null && isFinite(val1) && isFinite(val2)) {
      filledDates.push(new Date(currentDate));
      // Overlap is the minimum value (what they both share)
      filledY.push(Math.min(val1, val2));
    }
    
    // Move to next day
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  
  // Create filled area trace (shaded region showing overlap from 0 to minimum)
  const filledAreaTrace = {
    x: filledDates,
    y: filledY,
    type: 'scatter',
    mode: 'lines',
    fill: 'tozeroy',
    fillcolor: 'rgba(128, 128, 128, 0.2)',
    line: { color: 'transparent' },
    showlegend: false,
    hoverinfo: 'skip'
  };
  
  // Create traces
  const traces = [
    filledAreaTrace,
    {
      x: dates1,
      y: values1,
      type: 'scatter',
      mode: 'lines',
      name: country1Name,
      line: { color: '#1f77b4', width: 2 }
    },
    {
      x: dates2,
      y: values2,
      type: 'scatter',
      mode: 'lines',
      name: country2Name,
      line: { color: '#ff7f0e', width: 2 }
    }
  ];
  
  const layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { title: "Date" },
    yaxis: { title: selectedPolicy },
    margin: { t: 20, r: 10, b: 40, l: 50 },
    legend: { x: 0.02, y: 0.98, bgcolor: 'rgba(255, 255, 255, 0.8)' }
  };
  
  Plotly.react(container, traces, layout, { responsive: true, displayModeBar: false });
}

// Calculate shared and unshared areas for a policy variable
function calculatePolicyAreas(data1, data2) {
  if (!data1 || !data2 || data1.length === 0 || data2.length === 0) {
    return { sharedArea: 0, unsharedArea: 0, ratio: null };
  }
  
  // Helper function to get value at a specific date (with interpolation)
  function getValueAtDate(data, targetDate) {
    let beforeIdx = -1;
    let afterIdx = -1;
    let beforeDate = null;
    let afterDate = null;
    
    for (let i = 0; i < data.length; i++) {
      const date = data[i].date;
      if (date <= targetDate) {
        if (beforeIdx < 0 || date > beforeDate) {
          beforeIdx = i;
          beforeDate = date;
        }
      }
      if (date >= targetDate) {
        if (afterIdx < 0 || date < afterDate) {
          afterIdx = i;
          afterDate = date;
        }
      }
    }
    
    if (beforeIdx >= 0 && data[beforeIdx].date.getTime() === targetDate.getTime()) {
      return data[beforeIdx].value;
    }
    if (afterIdx >= 0 && data[afterIdx].date.getTime() === targetDate.getTime()) {
      return data[afterIdx].value;
    }
    
    if (beforeIdx >= 0 && afterIdx >= 0 && beforeDate && afterDate) {
      const beforeValue = data[beforeIdx].value;
      const afterValue = data[afterIdx].value;
      const timeDiff = afterDate.getTime() - beforeDate.getTime();
      if (timeDiff > 0) {
        const t = (targetDate.getTime() - beforeDate.getTime()) / timeDiff;
        return beforeValue + (afterValue - beforeValue) * t;
      }
      return beforeValue;
    }
    
    if (beforeIdx >= 0) return data[beforeIdx].value;
    if (afterIdx >= 0) return data[afterIdx].value;
    return null;
  }
  
  // Find date range
  const allDates = [...data1.map(d => d.date), ...data2.map(d => d.date)];
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  
  // Sample at daily intervals and calculate areas
  let sharedArea = 0;
  let unsharedArea = 0;
  let prevDate = null;
  let prevMin = null;
  let prevMax = null;
  
  const currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    const val1 = getValueAtDate(data1, currentDate);
    const val2 = getValueAtDate(data2, currentDate);
    
    if (val1 !== null && val2 !== null && isFinite(val1) && isFinite(val2)) {
      const minVal = Math.min(val1, val2);
      const maxVal = Math.max(val1, val2);
      
      // Calculate area for this day (trapezoidal rule)
      if (prevDate !== null && prevMin !== null && prevMax !== null) {
        const dayMs = currentDate.getTime() - prevDate.getTime();
        const days = dayMs / (1000 * 60 * 60 * 24);
        
        // Shared area: area from 0 to min value
        const sharedAreaSegment = days * (prevMin + minVal) / 2;
        sharedArea += sharedAreaSegment;
        
        // Unshared area: area between min and max
        const unsharedAreaSegment = days * ((prevMax - prevMin) + (maxVal - minVal)) / 2;
        unsharedArea += unsharedAreaSegment;
      }
      
      prevDate = new Date(currentDate);
      prevMin = minVal;
      prevMax = maxVal;
    }
    
    // Move to next day
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  
  const ratio = unsharedArea > 0 ? sharedArea / unsharedArea : (sharedArea > 0 ? Infinity : null);
  
  return { sharedArea, unsharedArea, ratio };
}

// Render table showing shared/unshared area ratios for all policy variables
function renderPolicyAreaRatioTable(country1Code, country2Code, country1Name, country2Name) {
  const container = document.getElementById('policyAreaRatioTable');
  if (!container) return;
  
  if (!country1Code || !country2Code) {
    container.innerHTML = '';
    return;
  }
  
  // Show loading indicator
  container.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text); opacity: 0.7;">' +
    '<div style="display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255, 255, 255, 0.3); border-top-color: var(--text); border-radius: 50%; animation: spin 1s linear infinite;"></div>' +
    '<div style="margin-top: 10px;">Calculating area ratios...</div>' +
    '</div>';
  
  // Add CSS animation if not already present
  if (!document.getElementById('spinnerAnimation')) {
    const style = document.createElement('style');
    style.id = 'spinnerAnimation';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }
  
  // Run calculation asynchronously to avoid blocking
  setTimeout(() => {
    try {
      // Map country codes to OxCGRT codes
      const oxCode1 = oxCGRTCountryCodeMap[country1Code] || country1Code;
      const oxCode2 = oxCGRTCountryCodeMap[country2Code] || country2Code;
      
      // Get policy data for both countries
      const country1Data = state.policyDataByCountry.get(oxCode1);
      const country2Data = state.policyDataByCountry.get(oxCode2);
      
      if (!country1Data || !country2Data) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text); opacity: 0.7;">No policy data available</div>';
        return;
      }
      
      // Get all available policy variables
      const allPolicyVars = state.availablePolicyVariables || [];
      
      // Calculate ratios for each variable
      const ratios = [];
      allPolicyVars.forEach(policyVar => {
        const data1 = country1Data.get(policyVar);
        const data2 = country2Data.get(policyVar);
        
        if (data1 && data2 && data1.length > 0 && data2.length > 0) {
          const areas = calculatePolicyAreas(data1, data2);
          if (areas.ratio !== null) {
            ratios.push({
              variable: policyVar,
              sharedArea: areas.sharedArea,
              unsharedArea: areas.unsharedArea,
              ratio: areas.ratio
            });
          }
        }
      });
      
      // Sort by ratio (descending)
      ratios.sort((a, b) => {
        if (a.ratio === Infinity) return -1;
        if (b.ratio === Infinity) return 1;
        return b.ratio - a.ratio;
      });
      
      // Build table HTML
      let html = '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
      html += '<thead><tr style="border-bottom: 2px solid var(--text);">';
      html += '<th style="text-align: left; padding: 8px;">Policy Variable</th>';
      html += '<th style="text-align: right; padding: 8px;">Shared Area</th>';
      html += '<th style="text-align: right; padding: 8px;">Unshared Area</th>';
      html += '<th style="text-align: right; padding: 8px;">Ratio (Shared/Unshared)</th>';
      html += '</tr></thead><tbody>';
      
      if (ratios.length === 0) {
        html += '<tr><td colspan="4" style="text-align: center; padding: 8px; color: var(--text); opacity: 0.7;">No data available</td></tr>';
      } else {
        ratios.forEach(item => {
          html += '<tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">';
          html += `<td style="padding: 8px;">${item.variable}</td>`;
          html += `<td style="text-align: right; padding: 8px;">${item.sharedArea.toFixed(2)}</td>`;
          html += `<td style="text-align: right; padding: 8px;">${item.unsharedArea.toFixed(2)}</td>`;
          if (item.ratio === Infinity) {
            html += '<td style="text-align: right; padding: 8px;">∞</td>';
          } else {
            html += `<td style="text-align: right; padding: 8px;">${item.ratio.toFixed(3)}</td>`;
          }
          html += '</tr>';
        });
      }
      
      html += '</tbody></table>';
      container.innerHTML = html;
    } catch (error) {
      console.error('Error calculating policy area ratios:', error);
      container.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text); opacity: 0.7;">Error calculating ratios. Please try again.</div>';
    }
  }, 0); // Use setTimeout to make it async and non-blocking
}

// Populate explanatory power variable selector
function populateExplanatoryPowerVariableSelect() {
  const select = document.getElementById('explanatoryPowerVariableSelect');
  if (!select) {
    console.warn('explanatoryPowerVariableSelect element not found');
    return;
  }
  
  const allPolicyVars = state.availablePolicyVariables || [];
  console.log('populateExplanatoryPowerVariableSelect called with', allPolicyVars.length, 'variables');
  console.log('First 5 variables:', allPolicyVars.slice(0, 5));
  
  // Clear existing options
  select.innerHTML = '<option value="">Select variable...</option>';
  
  const defaultVariable = 'C1M_School closing';
  allPolicyVars.forEach((policyVar, index) => {
    const option = document.createElement('option');
    option.value = policyVar;
    option.textContent = policyVar;
    // Select C1M_School closing by default, or first variable if not available
    if (policyVar === defaultVariable || (index === 0 && !allPolicyVars.includes(defaultVariable))) {
      option.selected = true;
    }
    select.appendChild(option);
  });
  
  console.log('Populated', select.options.length, 'options in explanatoryPowerVariableSelect');
  
  // Trigger chart update if a variable is selected
  if (allPolicyVars.length > 0) {
    const event = new Event('change');
    select.dispatchEvent(event);
  }
}

// Populate residual explanatory power variable selector
function populateResidualExplanatoryPowerVariableSelect(policyVariables) {
  const select = document.getElementById('residualExplanatoryPowerVariableSelect');
  if (!select) return;
  
  // Clear existing options
  select.innerHTML = '<option value="">Select variable...</option>';
  
  const defaultVariable = 'C1M_School closing';
  policyVariables.forEach((policyVar, index) => {
    const option = document.createElement('option');
    option.value = policyVar;
    option.textContent = policyVar;
    // Select C1M_School closing by default, or first variable if not available
    if (policyVar === defaultVariable || (index === 0 && !policyVariables.includes(defaultVariable))) {
      option.selected = true;
    }
    select.appendChild(option);
  });
  
  // Trigger chart update if a variable is selected
  if (policyVariables.length > 0) {
    const event = new Event('change');
    select.dispatchEvent(event);
  }
}

// Render scatterplot showing explanatory power of selected policy variable
// excludeInfluentialPoints: if true, exclude influential points from regression calculation
function renderPolicyExplanatoryPowerChart(filteredTraces, excludeInfluentialPoints = false) {
  const container = document.getElementById('policyExplanatoryPowerChart');
  if (!container) return;
  
  // Get selected policy variable
  const select = document.getElementById('explanatoryPowerVariableSelect');
  const selectedPolicy = select ? select.value : '';
  
  // Get selected policy year (for x-axis)
  const policyYearSelect = document.getElementById('explanatoryPowerPolicyYearSelect');
  const selectedPolicyYear = policyYearSelect ? policyYearSelect.value : '2021';
  
  // Get selected year and type (for y-axis)
  const yearSelect = document.getElementById('explanatoryPowerYearSelect');
  const typeSelect = document.getElementById('explanatoryPowerTypeSelect');
  const selectedYear = yearSelect ? yearSelect.value : '2025';
  const selectedType = typeSelect ? typeSelect.value : 'cumulative';
  
  if (!selectedPolicy) {
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Average Policy Value (2020-2021)" }, 
      yaxis: { title: `${selectedType === 'isolated' ? 'Isolated' : 'Cumulative'} Excess Mortality (${selectedYear})` },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Build year value string (e.g., "2025" or "2025-isolated")
  const yearValue = selectedType === 'isolated' ? `${selectedYear}-isolated` : selectedYear;
  
  // Get excess mortality for selected year and type for filtered countries only
  const countryExcess = new Map(); // countryCode -> excess value
  
  // Use filteredTraces if provided, otherwise use all traces
  const tracesToUse = filteredTraces || state.dedicatedPermanentTraces;
  
  tracesToUse.forEach((trace) => {
    // Find the corresponding metadata
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.country) return;
    
    // Get excess for selected year and type
    const excessResult = getExcessValue(yearValue, trace);
    if (excessResult && excessResult.excess !== null && isFinite(excessResult.excess)) {
      countryExcess.set(metadata.country, excessResult.excess);
    }
  });
  
  if (countryExcess.size === 0) {
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Average Policy Value (2020-2021)" }, 
      yaxis: { title: `${selectedType === 'isolated' ? 'Isolated' : 'Cumulative'} Excess Mortality (${selectedYear})` },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Collect data points: (average policy value 2020-2021, excess mortality for selected year)
  const dataPoints = [];
  
  countryExcess.forEach((excess, countryCode) => {
    // Map country code to OxCGRT code
    const oxCode = oxCGRTCountryCodeMap[countryCode] || countryCode;
    const countryData = state.policyDataByCountry.get(oxCode);
    if (!countryData) return;
    
    const policyData = countryData.get(selectedPolicy);
    if (!policyData || policyData.length === 0) return;
    
      // Calculate policy value based on selected year
      let policyValue = null;
      
      if (selectedPolicyYear === '2020-2021') {
        // Average of 2020 and 2021
        const year2020Start = new Date('2020-01-01T00:00:00Z');
        const year2021End = new Date('2021-12-31T23:59:59Z');
        
        const values2020_2021 = [];
        policyData.forEach(d => {
          if (d.date >= year2020Start && d.date <= year2021End) {
            if (d.value !== null && isFinite(d.value)) {
              values2020_2021.push(d.value);
            }
          }
        });
        
        if (values2020_2021.length > 0) {
          policyValue = values2020_2021.reduce((sum, v) => sum + v, 0) / values2020_2021.length;
        }
      } else {
        // Single year (2020 or 2021)
        const selectedYearNum = parseInt(selectedPolicyYear);
        const yearStart = new Date(`${selectedYearNum}-01-01T00:00:00Z`);
        const yearEnd = new Date(`${selectedYearNum}-12-31T23:59:59Z`);
        
        const values = [];
        policyData.forEach(d => {
          if (d.date >= yearStart && d.date <= yearEnd) {
            if (d.value !== null && isFinite(d.value)) {
              values.push(d.value);
            }
          }
        });
        
        if (values.length > 0) {
          policyValue = values.reduce((sum, v) => sum + v, 0) / values.length;
        }
      }
      
      if (policyValue !== null) {
        const countryName = countryNames[countryCode] || countryCode;
        dataPoints.push({
          x: policyValue,
          y: excess,
          country: countryCode,
          countryName: countryName
        });
      }
  });
  
  if (dataPoints.length === 0) {
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Average Policy Value (2020-2021)" }, yaxis: { title: "Cumulative Excess Mortality (2025)" },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // First, identify influential points using all data
  const allXValues = dataPoints.map(d => d.x);
  const allYValues = dataPoints.map(d => d.y);
  
  const initialTrendLine = fitPolynomialTrend(allXValues, allYValues, 2, true);
  if (!initialTrendLine || !isFinite(initialTrendLine.rSquared)) {
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: `${selectedPolicyYear === '2020-2021' ? 'Average' : selectedPolicyYear} ${selectedPolicy}` }, 
      yaxis: { title: `${selectedType === 'isolated' ? 'Isolated' : 'Cumulative'} Excess Mortality (${selectedYear})` },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    // Hide button if no valid regression
    const hideBtn = document.getElementById('hideInfluentialPointsBtn');
    if (hideBtn) hideBtn.style.display = 'none';
    return;
  }
  
  // Calculate influential points using all data
  const initialCoefficients = initialTrendLine.coefficients;
  const initialResiduals = [];
  for (let i = 0; i < allXValues.length; i++) {
    let predicted = 0;
    for (let j = 0; j < initialCoefficients.length; j++) {
      predicted += initialCoefficients[j] * Math.pow(allXValues[i], j);
    }
    initialResiduals.push(allYValues[i] - predicted);
  }
  
  const outlierIndices = [];
  const cookOutliers = countCookDistanceOutliersPolynomial(allXValues, allYValues, initialCoefficients);
  
  // Calculate outlier indices
  const n = allXValues.length;
  const xMean = allXValues.reduce((sum, x) => sum + x, 0) / n;
  let xSumSq = 0;
  for (let i = 0; i < n; i++) {
    const xDiff = allXValues[i] - xMean;
    xSumSq += xDiff * xDiff;
  }
  
  // Build design matrix X for leverage calculation
  const X = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < initialCoefficients.length; j++) {
      row.push(Math.pow(allXValues[i], j));
    }
    X.push(row);
  }
  
  // Calculate X'X
  const XTX = [];
  for (let i = 0; i < initialCoefficients.length; i++) {
    XTX[i] = [];
    for (let j = 0; j < initialCoefficients.length; j++) {
      let sum = 0;
      for (let m = 0; m < n; m++) {
        sum += X[m][i] * X[m][j];
      }
      XTX[i][j] = sum;
    }
  }
  
  // Calculate (X'X)^(-1) for k=3 (degree 2 polynomial)
  const k = initialCoefficients.length;
  if (k === 3) {
    const det = XTX[0][0] * (XTX[1][1] * XTX[2][2] - XTX[1][2] * XTX[2][1]) -
                XTX[0][1] * (XTX[1][0] * XTX[2][2] - XTX[1][2] * XTX[2][0]) +
                XTX[0][2] * (XTX[1][0] * XTX[2][1] - XTX[1][1] * XTX[2][0]);
    
    if (Math.abs(det) >= 1e-10) {
      const invXTX = [
        [
          (XTX[1][1] * XTX[2][2] - XTX[1][2] * XTX[2][1]) / det,
          (XTX[0][2] * XTX[2][1] - XTX[0][1] * XTX[2][2]) / det,
          (XTX[0][1] * XTX[1][2] - XTX[0][2] * XTX[1][1]) / det
        ],
        [
          (XTX[1][2] * XTX[2][0] - XTX[1][0] * XTX[2][2]) / det,
          (XTX[0][0] * XTX[2][2] - XTX[0][2] * XTX[2][0]) / det,
          (XTX[0][2] * XTX[1][0] - XTX[0][0] * XTX[1][2]) / det
        ],
        [
          (XTX[1][0] * XTX[2][1] - XTX[1][1] * XTX[2][0]) / det,
          (XTX[0][1] * XTX[2][0] - XTX[0][0] * XTX[2][1]) / det,
          (XTX[0][0] * XTX[1][1] - XTX[0][1] * XTX[1][0]) / det
        ]
      ];
      
      let sumSquaredResiduals = 0;
      for (let i = 0; i < n; i++) {
        sumSquaredResiduals += initialResiduals[i] * initialResiduals[i];
      }
      const mse = sumSquaredResiduals / (n - k);
      const threshold = 4 / n;
      
      if (mse > 0) {
        for (let i = 0; i < dataPoints.length; i++) {
          const Xi = X[i];
          
          // Calculate (X'X)^(-1) * X_i'
          const invXTX_Xi = [];
          for (let j = 0; j < k; j++) {
            let sum = 0;
            for (let m = 0; m < k; m++) {
              sum += invXTX[j][m] * Xi[m];
            }
            invXTX_Xi[j] = sum;
          }
          
          // Calculate h_i = X_i * invXTX_Xi
          let leverage = 0;
          for (let j = 0; j < k; j++) {
            leverage += Xi[j] * invXTX_Xi[j];
          }
          leverage = Math.max(0, Math.min(1, leverage));
          
          const residualSq = initialResiduals[i] * initialResiduals[i];
          const cooksDistance = (residualSq / (k * mse)) * (leverage / ((1 - leverage) * (1 - leverage) + 1e-10));
          
          if (cooksDistance > threshold) {
            outlierIndices.push(i);
          }
        }
      }
    }
  }
  
  // Show/hide button based on whether there are influential points
  const hideBtn = document.getElementById('hideInfluentialPointsBtn');
  if (hideBtn) {
    if (outlierIndices.length > 0) {
      hideBtn.style.display = 'inline-block';
      hideBtn.textContent = excludeInfluentialPoints ? 'Show Influential Points' : 'Hide Influential Points';
    } else {
      hideBtn.style.display = 'none';
    }
  }
  
  // Filter data points if excluding influential points
  let filteredDataPoints = dataPoints;
  if (excludeInfluentialPoints && outlierIndices.length > 0) {
    filteredDataPoints = dataPoints.filter((point, index) => !outlierIndices.includes(index));
  }
  
  // Recalculate regression with filtered data
  const xValues = filteredDataPoints.map(d => d.x);
  const yValues = filteredDataPoints.map(d => d.y);
  
  const trendLine = fitPolynomialTrend(xValues, yValues, 2, true);
  if (!trendLine || !isFinite(trendLine.rSquared)) {
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: `${selectedPolicyYear === '2020-2021' ? 'Average' : selectedPolicyYear} ${selectedPolicy}` }, 
      yaxis: { title: `${selectedType === 'isolated' ? 'Isolated' : 'Cumulative'} Excess Mortality (${selectedYear})` },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  const r2 = trendLine.rSquared;
  const pValue = trendLine.pValue;
  const coefficients = trendLine.coefficients;
  
  // Calculate residuals from polynomial regression (using filtered data)
  const residuals = [];
  for (let i = 0; i < xValues.length; i++) {
    let predicted = 0;
    for (let j = 0; j < coefficients.length; j++) {
      predicted += coefficients[j] * Math.pow(xValues[i], j);
    }
    residuals.push(yValues[i] - predicted);
  }
  
  // Calculate White's test for heteroscedasticity (using polynomial residuals from filtered data)
  let whiteTestResult = { pValue: null };
  try {
    whiteTestResult = whiteTestPolynomial(xValues, residuals);
  } catch (e) {
    console.warn('White test failed:', e);
  }
  
  // Calculate robust p-value (using filtered data)
  let robustPValue = null;
  try {
    robustPValue = calculateRobustPValue(xValues, yValues, coefficients, residuals);
  } catch (e) {
    console.warn('Robust SE calculation failed:', e);
  }
  
  // Split ALL data points into outliers and non-outliers (for display)
  // But use filtered data for regression
  const outlierPoints = [];
  const normalPoints = [];
  
  dataPoints.forEach((point, index) => {
    if (outlierIndices.includes(index)) {
      outlierPoints.push(point);
    } else {
      normalPoints.push(point);
    }
  });
  
  // Use polynomial trend line points from fitPolynomialTrend
  const regressionX = trendLine.x;
  const regressionY = trendLine.y;
  
  // Create scatterplot trace for normal points
  const scatterTrace = {
    x: normalPoints.map(d => d.x),
    y: normalPoints.map(d => d.y),
    mode: 'markers+text',
    type: 'scatter',
    name: 'Countries',
    showlegend: false,
    text: normalPoints.map(d => d.countryName),
    textposition: 'top center',
    textfont: { size: 10 },
    marker: {
      size: 8,
      color: '#1f77b4',
      opacity: 0.7
    },
    hovertemplate: '<b>%{text}</b><br>Policy Value: %{x:.2f}<br>Excess Mortality: %{y:.2f}<extra></extra>',
    customdata: normalPoints.map(d => d.countryName)
  };
  
  // Create scatterplot trace for outliers (always show them, but maybe with different opacity if excluded)
  const outlierTrace = outlierPoints.length > 0 ? {
    x: outlierPoints.map(d => d.x),
    y: outlierPoints.map(d => d.y),
    mode: 'markers+text',
    type: 'scatter',
    name: `Influential Points (Cook's D > 4/n)`,
    text: outlierPoints.map(d => d.countryName),
    textposition: 'top center',
    textfont: { size: 10, color: '#d62728' },
    marker: {
      size: 12,
      color: '#d62728',
      opacity: excludeInfluentialPoints ? 0.3 : 0.9,
      symbol: 'diamond',
      line: { width: 2, color: '#ffffff' }
    },
    hovertemplate: '<b>%{text}</b> (Influential Point)<br>Policy Value: %{x:.2f}<br>Excess Mortality: %{y:.2f}<extra></extra>',
    customdata: outlierPoints.map(d => d.countryName)
  } : null;
  
  // Create regression line trace (simplified name for plot)
  const regressionTrace = {
    x: regressionX,
    y: regressionY,
    mode: 'lines',
    type: 'scatter',
    name: 'Regression',
    showlegend: false,
    line: {
      color: '#ff7f0e',
      width: 2,
      dash: 'dash'
    },
    hovertemplate: 'R² = %{customdata[0]:.3f}, p = %{customdata[1]}<extra></extra>',
    customdata: [[r2, pValue !== null ? (pValue < 0.001 ? '<0.001' : pValue.toFixed(3)) : 'N/A']]
  };
  
  // Update outlier trace to not show in legend
  if (outlierTrace) {
    outlierTrace.showlegend = false;
  }
  scatterTrace.showlegend = false;
  
  const traces = [scatterTrace];
  if (outlierTrace) {
    traces.push(outlierTrace);
  }
  traces.push(regressionTrace);
  
  // Populate separate legend element above the plot
  const legendContainer = document.getElementById('policyExplanatoryPowerLegend');
  if (legendContainer) {
    let legendHTML = '<div style="display: flex; flex-wrap: wrap; gap: 15px; align-items: center;">';
    
    // Countries
    legendHTML += '<span><span style="display: inline-block; width: 12px; height: 12px; background-color: #1f77b4; border-radius: 50%; margin-right: 5px;"></span>Countries</span>';
    
    // Influential Points
    if (outlierPoints.length > 0) {
      legendHTML += `<span><span style="display: inline-block; width: 12px; height: 12px; background-color: #d62728; border: 2px solid #ffffff; transform: rotate(45deg); margin-right: 5px;"></span>Influential Points (Cook's D > ${(4/allXValues.length).toFixed(3)})</span>`;
    }
    
    // Statistics
    legendHTML += `<span><strong>R² = ${r2.toFixed(3)}</strong></span>`;
    if (pValue !== null) {
      legendHTML += `<span>p = ${pValue < 0.001 ? '<0.001' : pValue.toFixed(3)}</span>`;
    }
    if (robustPValue !== null && isFinite(robustPValue)) {
      legendHTML += `<span>p (Robust SE) = ${robustPValue < 0.001 ? '<0.001' : robustPValue.toFixed(3)}</span>`;
    }
    if (whiteTestResult.pValue !== null && isFinite(whiteTestResult.pValue)) {
      legendHTML += `<span>White p = ${whiteTestResult.pValue < 0.001 ? '<0.001' : whiteTestResult.pValue.toFixed(3)}</span>`;
    }
    legendHTML += `<span>n = ${xValues.length}`;
    if (excludeInfluentialPoints && outlierIndices.length > 0) {
      legendHTML += ` (${outlierIndices.length} influential points excluded)`;
    } else if (!excludeInfluentialPoints && outlierIndices.length > 0) {
      legendHTML += `, Influential Points: ${outlierIndices.length}`;
    }
    legendHTML += '</span>';
    
    legendHTML += '</div>';
    legendContainer.innerHTML = legendHTML;
  }
  
  const layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: `${selectedPolicyYear === '2020-2021' ? 'Average' : selectedPolicyYear} ${selectedPolicy}`
    },
    yaxis: { 
      title: `${selectedType === 'isolated' ? 'Isolated' : 'Cumulative'} Excess Mortality (${selectedYear})`
    },
    margin: { t: 20, r: 10, b: 40, l: 60 },
    showlegend: false,
    hovermode: 'closest'
  };
  
  Plotly.react(container, traces, layout, { responsive: true, displayModeBar: false });
  
  // Render table of statistically significant variables
  renderPolicyExplanatoryPowerTable(filteredTraces, selectedYear, selectedType, selectedPolicyYear);
}

// Calculate R² and p-value for a policy variable against excess mortality
function calculatePolicyVariableStats(policyVar, policyYear, excessYear, excessType, filteredTraces) {
  // Build year value string
  const yearValue = excessType === 'isolated' ? `${excessYear}-isolated` : excessYear;
  
  // Get excess mortality for filtered countries
  const countryExcess = new Map();
  const tracesToUse = filteredTraces || state.dedicatedPermanentTraces;
  
  tracesToUse.forEach((trace) => {
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.country) return;
    
    const excessResult = getExcessValue(yearValue, trace);
    if (excessResult && excessResult.excess !== null && isFinite(excessResult.excess)) {
      countryExcess.set(metadata.country, excessResult.excess);
    }
  });
  
  if (countryExcess.size < 3) {
    return null; // Need at least 3 points
  }
  
  // Collect data points
  const dataPoints = [];
  
  countryExcess.forEach((excess, countryCode) => {
    const oxCode = oxCGRTCountryCodeMap[countryCode] || countryCode;
    const countryData = state.policyDataByCountry.get(oxCode);
    if (!countryData) return;
    
    const policyData = countryData.get(policyVar);
    if (!policyData || policyData.length === 0) return;
    
    // Calculate policy value based on selected year
    let policyValue = null;
    
    if (policyYear === '2020-2021') {
      const year2020Start = new Date('2020-01-01T00:00:00Z');
      const year2021End = new Date('2021-12-31T23:59:59Z');
      
      const values = [];
      policyData.forEach(d => {
        if (d.date >= year2020Start && d.date <= year2021End) {
          if (d.value !== null && isFinite(d.value)) {
            values.push(d.value);
          }
        }
      });
      
      if (values.length > 0) {
        policyValue = values.reduce((sum, v) => sum + v, 0) / values.length;
      }
    } else {
      const selectedYearNum = parseInt(policyYear);
      const yearStart = new Date(`${selectedYearNum}-01-01T00:00:00Z`);
      const yearEnd = new Date(`${selectedYearNum}-12-31T23:59:59Z`);
      
      const values = [];
      policyData.forEach(d => {
        if (d.date >= yearStart && d.date <= yearEnd) {
          if (d.value !== null && isFinite(d.value)) {
            values.push(d.value);
          }
        }
      });
      
      if (values.length > 0) {
        policyValue = values.reduce((sum, v) => sum + v, 0) / values.length;
      }
    }
    
    if (policyValue !== null) {
      dataPoints.push({ x: policyValue, y: excess });
    }
  });
  
  if (dataPoints.length < 3) {
    return null;
  }
  
  // Use polynomial regression (degree 2) like structural factors
  const xValues = dataPoints.map(d => d.x);
  const yValues = dataPoints.map(d => d.y);
  
  const trendLine = fitPolynomialTrend(xValues, yValues, 2, true); // degree 2, allowNegative = true
  if (!trendLine || !isFinite(trendLine.rSquared)) {
    return null;
  }
  
  const r2 = trendLine.rSquared;
  const pValue = trendLine.pValue;
  const n = dataPoints.length;
  const coefficients = trendLine.coefficients;
  
  // Calculate residuals from polynomial regression for tests
  const residuals = [];
  for (let i = 0; i < n; i++) {
    let predicted = 0;
    for (let j = 0; j < coefficients.length; j++) {
      predicted += coefficients[j] * Math.pow(xValues[i], j);
    }
    residuals.push(yValues[i] - predicted);
  }
  
  // Calculate Breusch-Pagan test for heteroscedasticity (using polynomial residuals)
  const bpTest = breuschPaganTestPolynomial(xValues, residuals);
  
  // Calculate White's test for heteroscedasticity (using polynomial residuals)
  let whiteTestResult = { pValue: null };
  try {
    whiteTestResult = whiteTestPolynomial(xValues, residuals);
  } catch (e) {
    console.warn('White test failed:', e);
  }
  
  // Calculate number of Cook's distance outliers (using polynomial regression)
  const cookOutliers = countCookDistanceOutliersPolynomial(xValues, yValues, coefficients);
  
  // Calculate p-value using robust standard errors
  let robustPValue = null;
  try {
    robustPValue = calculateRobustPValue(xValues, yValues, coefficients, residuals);
  } catch (e) {
    console.warn('Robust SE calculation failed:', e);
  }
  
  return {
    variable: policyVar,
    r2: r2,
    pValue: pValue,
    robustPValue: robustPValue,
    bpPValue: bpTest.pValue,
    whitePValue: whiteTestResult.pValue,
    cookOutliers: cookOutliers,
    n: n,
    coefficients: coefficients // Store for chart rendering
  };
}

// Render table of statistically significant policy variables
function renderPolicyExplanatoryPowerTable(filteredTraces, selectedYear, selectedType, selectedPolicyYear) {
  const container = document.getElementById('policyExplanatoryPowerTable');
  if (!container) return;
  
  const allPolicyVars = state.availablePolicyVariables || [];
  if (allPolicyVars.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  // Calculate stats for all variables
  const stats = [];
  allPolicyVars.forEach(policyVar => {
    const result = calculatePolicyVariableStats(policyVar, selectedPolicyYear, selectedYear, selectedType, filteredTraces);
    if (result && result.pValue !== null && result.pValue < 0.05) {
      stats.push(result);
    }
  });
  
  // Sort by R² (descending)
  stats.sort((a, b) => b.r2 - a.r2);
  
  // Build subtitle
  const policyYearLabel = selectedPolicyYear === '2020-2021' ? '2020-2021 Average' : selectedPolicyYear;
  const typeLabel = selectedType === 'isolated' ? 'Isolated' : 'Cumulative';
  const subtitle = `${policyYearLabel} Policy vs ${selectedYear} Excess Mortality (${typeLabel})`;
  
  // Build table HTML
  let html = '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
  html += '<thead>';
  html += `<tr style="border-bottom: 1px solid var(--text);"><th colspan="7" style="text-align: left; padding: 8px;">${subtitle}</th></tr>`;
  html += '<tr style="border-bottom: 2px solid var(--text);">';
  html += '<th style="text-align: left; padding: 8px;">Policy Variable</th>';
  html += '<th style="text-align: right; padding: 8px;">R²</th>';
  html += '<th style="text-align: right; padding: 8px;">p-value</th>';
  html += '<th style="text-align: right; padding: 8px; white-space: nowrap;">p-value<br>(Robust SE)</th>';
  html += '<th style="text-align: right; padding: 8px; white-space: nowrap;">White<br>p-value</th>';
  html += '<th style="text-align: right; padding: 8px; white-space: nowrap;">Influential<br>Points</th>';
  html += '<th style="text-align: right; padding: 8px;">n</th>';
  html += '</tr></thead><tbody>';
  
  if (stats.length === 0) {
    html += '<tr><td colspan="7" style="text-align: center; padding: 8px; color: var(--text); opacity: 0.7;">No statistically significant variables (p < 0.05)</td></tr>';
  } else {
    stats.forEach(item => {
      html += '<tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">';
      html += `<td style="padding: 8px;">${item.variable}</td>`;
      html += `<td style="text-align: right; padding: 8px;">${item.r2.toFixed(4)}</td>`;
      if (item.pValue < 0.001) {
        html += '<td style="text-align: right; padding: 8px;">&lt;0.001</td>';
      } else {
        html += `<td style="text-align: right; padding: 8px;">${item.pValue.toFixed(4)}</td>`;
      }
      if (item.robustPValue === null || !isFinite(item.robustPValue)) {
        html += '<td style="text-align: right; padding: 8px;">—</td>';
      } else if (item.robustPValue < 0.001) {
        html += '<td style="text-align: right; padding: 8px;">&lt;0.001</td>';
      } else {
        html += `<td style="text-align: right; padding: 8px;">${item.robustPValue.toFixed(4)}</td>`;
      }
      if (item.whitePValue === null || !isFinite(item.whitePValue)) {
        html += '<td style="text-align: right; padding: 8px;">—</td>';
      } else if (item.whitePValue < 0.001) {
        html += '<td style="text-align: right; padding: 8px;">&lt;0.001</td>';
      } else {
        html += `<td style="text-align: right; padding: 8px;">${item.whitePValue.toFixed(4)}</td>`;
      }
      html += `<td style="text-align: right; padding: 8px;">${item.cookOutliers !== undefined ? item.cookOutliers : 0}</td>`;
      html += `<td style="text-align: right; padding: 8px;">${item.n}</td>`;
      html += '</tr>';
    });
  }
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

// Calculate R² and p-value for a policy variable against SVI residuals
function calculateResidualPolicyVariableStats(policyVar, policyYear, excessYear, excessType, filteredTraces) {
  // Build year value string
  const yearValue = excessType === 'isolated' ? `${excessYear}-isolated` : excessYear;
  
  // Get regression for calculating SVI predictions
  const regression = calculateFixedRegression(parseInt(excessYear));
  if (!regression || !regression.predict) {
    return null;
  }
  
  // Get residuals for filtered countries
  const countryResiduals = new Map();
  const tracesToUse = filteredTraces || state.dedicatedPermanentTraces;
  
  tracesToUse.forEach((trace) => {
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.country || !metadata.originalRows) return;
    
    const excessResult = getExcessValue(yearValue, trace);
    if (!excessResult || excessResult.excess === null || !isFinite(excessResult.excess)) return;
    
    const asmr = calculateAverageASMR(metadata.originalRows, '2019');
    if (asmr === null || !isFinite(asmr)) return;
    
    const gdp = gdpNominal2019[metadata.country];
    const gini = gini2019[metadata.country];
    const poverty = poverty2019[metadata.country];
    const healthExp = healthExpenditure2019[metadata.country];
    
    const predicted = regression.predict(asmr, gdp, gini, poverty, healthExp);
    if (predicted === null || !isFinite(predicted)) return;
    
    const residual = excessResult.excess - predicted;
    countryResiduals.set(metadata.country, residual);
  });
  
  if (countryResiduals.size < 3) {
    return null;
  }
  
  // Collect data points
  const dataPoints = [];
  
  countryResiduals.forEach((residual, countryCode) => {
    const oxCode = oxCGRTCountryCodeMap[countryCode] || countryCode;
    const countryData = state.policyDataByCountry.get(oxCode);
    if (!countryData) return;
    
    const policyData = countryData.get(policyVar);
    if (!policyData || policyData.length === 0) return;
    
    // Calculate policy value based on selected year
    let policyValue = null;
    
    if (policyYear === '2020-2021') {
      const year2020Start = new Date('2020-01-01T00:00:00Z');
      const year2021End = new Date('2021-12-31T23:59:59Z');
      
      const values = [];
      policyData.forEach(d => {
        if (d.date >= year2020Start && d.date <= year2021End) {
          if (d.value !== null && isFinite(d.value)) {
            values.push(d.value);
          }
        }
      });
      
      if (values.length > 0) {
        policyValue = values.reduce((sum, v) => sum + v, 0) / values.length;
      }
    } else {
      const selectedYearNum = parseInt(policyYear);
      const yearStart = new Date(`${selectedYearNum}-01-01T00:00:00Z`);
      const yearEnd = new Date(`${selectedYearNum}-12-31T23:59:59Z`);
      
      const values = [];
      policyData.forEach(d => {
        if (d.date >= yearStart && d.date <= yearEnd) {
          if (d.value !== null && isFinite(d.value)) {
            values.push(d.value);
          }
        }
      });
      
      if (values.length > 0) {
        policyValue = values.reduce((sum, v) => sum + v, 0) / values.length;
      }
    }
    
    if (policyValue !== null) {
      dataPoints.push({ x: policyValue, y: residual });
    }
  });
  
  if (dataPoints.length < 3) {
    return null;
  }
  
  // Use polynomial regression (degree 2) like structural factors
  const xValues = dataPoints.map(d => d.x);
  const yValues = dataPoints.map(d => d.y);
  
  const trendLine = fitPolynomialTrend(xValues, yValues, 2, true); // degree 2, allowNegative = true
  if (!trendLine || !isFinite(trendLine.rSquared)) {
    return null;
  }
  
  const r2 = trendLine.rSquared;
  const pValue = trendLine.pValue;
  const n = dataPoints.length;
  const coefficients = trendLine.coefficients;
  
  // Calculate residuals from polynomial regression for tests
  const residuals = [];
  for (let i = 0; i < n; i++) {
    let predicted = 0;
    for (let j = 0; j < coefficients.length; j++) {
      predicted += coefficients[j] * Math.pow(xValues[i], j);
    }
    residuals.push(yValues[i] - predicted);
  }
  
  // Calculate Breusch-Pagan test for heteroscedasticity (using polynomial residuals)
  const bpTest = breuschPaganTestPolynomial(xValues, residuals);
  
  // Calculate White's test for heteroscedasticity (using polynomial residuals)
  let whiteTestResult = { pValue: null };
  try {
    whiteTestResult = whiteTestPolynomial(xValues, residuals);
  } catch (e) {
    console.warn('White test failed:', e);
  }
  
  // Calculate number of Cook's distance outliers (using polynomial regression)
  const cookOutliers = countCookDistanceOutliersPolynomial(xValues, yValues, coefficients);
  
  // Calculate p-value using robust standard errors
  let robustPValue = null;
  try {
    robustPValue = calculateRobustPValue(xValues, yValues, coefficients, residuals);
  } catch (e) {
    console.warn('Robust SE calculation failed:', e);
  }
  
  return {
    variable: policyVar,
    r2: r2,
    pValue: pValue,
    robustPValue: robustPValue,
    bpPValue: bpTest.pValue,
    whitePValue: whiteTestResult.pValue,
    cookOutliers: cookOutliers,
    n: n,
    coefficients: coefficients // Store for chart rendering
  };
}

// Render table of statistically significant policy variables for residuals
function renderResidualExplanatoryPowerTable(filteredTraces, selectedYear, selectedType, selectedPolicyYear) {
  const container = document.getElementById('residualExplanatoryPowerTable');
  if (!container) return;
  
  const allPolicyVars = state.availablePolicyVariables || [];
  if (allPolicyVars.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  // Calculate stats for all variables
  const stats = [];
  allPolicyVars.forEach(policyVar => {
    const result = calculateResidualPolicyVariableStats(policyVar, selectedPolicyYear, selectedYear, selectedType, filteredTraces);
    if (result && result.pValue !== null && result.pValue < 0.05) {
      stats.push(result);
    }
  });
  
  // Sort by R² (descending)
  stats.sort((a, b) => b.r2 - a.r2);
  
  // Build subtitle
  const policyYearLabel = selectedPolicyYear === '2020-2021' ? '2020-2021 Average' : selectedPolicyYear;
  const typeLabel = selectedType === 'isolated' ? 'Isolated' : 'Cumulative';
  const subtitle = `${policyYearLabel} Policy vs ${selectedYear} SVI Residuals (${typeLabel})`;
  
  // Build table HTML
  let html = '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
  html += '<thead>';
  html += `<tr style="border-bottom: 1px solid var(--text);"><th colspan="7" style="text-align: left; padding: 8px;">${subtitle}</th></tr>`;
  html += '<tr style="border-bottom: 2px solid var(--text);">';
  html += '<th style="text-align: left; padding: 8px;">Policy Variable</th>';
  html += '<th style="text-align: right; padding: 8px;">R²</th>';
  html += '<th style="text-align: right; padding: 8px;">p-value</th>';
  html += '<th style="text-align: right; padding: 8px; white-space: nowrap;">p-value<br>(Robust SE)</th>';
  html += '<th style="text-align: right; padding: 8px; white-space: nowrap;">White<br>p-value</th>';
  html += '<th style="text-align: right; padding: 8px; white-space: nowrap;">Influential<br>Points</th>';
  html += '<th style="text-align: right; padding: 8px;">n</th>';
  html += '</tr></thead><tbody>';
  
  if (stats.length === 0) {
    html += '<tr><td colspan="7" style="text-align: center; padding: 8px; color: var(--text); opacity: 0.7;">No statistically significant variables (p < 0.05)</td></tr>';
  } else {
    stats.forEach(item => {
      html += '<tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">';
      html += `<td style="padding: 8px;">${item.variable}</td>`;
      html += `<td style="text-align: right; padding: 8px;">${item.r2.toFixed(4)}</td>`;
      if (item.pValue < 0.001) {
        html += '<td style="text-align: right; padding: 8px;">&lt;0.001</td>';
      } else {
        html += `<td style="text-align: right; padding: 8px;">${item.pValue.toFixed(4)}</td>`;
      }
      if (item.robustPValue === null || !isFinite(item.robustPValue)) {
        html += '<td style="text-align: right; padding: 8px;">—</td>';
      } else if (item.robustPValue < 0.001) {
        html += '<td style="text-align: right; padding: 8px;">&lt;0.001</td>';
      } else {
        html += `<td style="text-align: right; padding: 8px;">${item.robustPValue.toFixed(4)}</td>`;
      }
      if (item.whitePValue === null || !isFinite(item.whitePValue)) {
        html += '<td style="text-align: right; padding: 8px;">—</td>';
      } else if (item.whitePValue < 0.001) {
        html += '<td style="text-align: right; padding: 8px;">&lt;0.001</td>';
      } else {
        html += `<td style="text-align: right; padding: 8px;">${item.whitePValue.toFixed(4)}</td>`;
      }
      html += `<td style="text-align: right; padding: 8px;">${item.cookOutliers !== undefined ? item.cookOutliers : 0}</td>`;
      html += `<td style="text-align: right; padding: 8px;">${item.n}</td>`;
      html += '</tr>';
    });
  }
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

// Render scatterplot showing relationship between policy variable and SVI residuals
// excludeInfluentialPoints: if true, exclude influential points from regression calculation
function renderResidualExplanatoryPowerChart(filteredTraces, excludeInfluentialPoints = false) {
  const container = document.getElementById('residualExplanatoryPowerChart');
  if (!container) return;
  
  // Get selected policy variable
  const select = document.getElementById('residualExplanatoryPowerVariableSelect');
  const selectedPolicy = select ? select.value : '';
  
  // Get selected policy year (for x-axis)
  const policyYearSelect = document.getElementById('residualExplanatoryPowerPolicyYearSelect');
  const selectedPolicyYear = policyYearSelect ? policyYearSelect.value : '2021';
  
  // Get selected year and type (for y-axis)
  const yearSelect = document.getElementById('residualExplanatoryPowerYearSelect');
  const typeSelect = document.getElementById('residualExplanatoryPowerTypeSelect');
  const selectedYear = yearSelect ? yearSelect.value : '2025';
  const selectedType = typeSelect ? typeSelect.value : 'cumulative';
  
  if (!selectedPolicy) {
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Policy Variable" }, 
      yaxis: { title: `Residuals from SVI (${selectedType === 'isolated' ? 'Isolated' : 'Cumulative'} ${selectedYear})` },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Build year value string (e.g., "2025" or "2025-isolated")
  const yearValue = selectedType === 'isolated' ? `${selectedYear}-isolated` : selectedYear;
  
  // Get regression for calculating SVI predictions
  // Use fixed regression for the selected year
  const regression = calculateFixedRegression(parseInt(selectedYear));
  if (!regression || !regression.predict) {
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Policy Variable" }, 
      yaxis: { title: `Residuals from SVI (${selectedType === 'isolated' ? 'Isolated' : 'Cumulative'} ${selectedYear})` },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Get excess mortality and calculate residuals for filtered countries
  const countryResiduals = new Map(); // countryCode -> { excess, residual, metadata }
  
  // Use filteredTraces if provided, otherwise use all traces
  const tracesToUse = filteredTraces || state.dedicatedPermanentTraces;
  
  tracesToUse.forEach((trace) => {
    // Find the corresponding metadata
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.country || !metadata.originalRows) return;
    
    // Get excess for selected year and type
    const excessResult = getExcessValue(yearValue, trace);
    if (!excessResult || excessResult.excess === null || !isFinite(excessResult.excess)) return;
    
    // Get factors for SVI calculation
    const asmr = calculateAverageASMR(metadata.originalRows, '2019');
    if (asmr === null || !isFinite(asmr)) return;
    
    const gdp = gdpNominal2019[metadata.country];
    const gini = gini2019[metadata.country];
    const poverty = poverty2019[metadata.country];
    const healthExp = healthExpenditure2019[metadata.country];
    
    // Calculate predicted excess from SVI regression
    const predicted = regression.predict(asmr, gdp, gini, poverty, healthExp);
    if (predicted === null || !isFinite(predicted)) return;
    
    // Calculate residual: actual - predicted
    const residual = excessResult.excess - predicted;
    
    countryResiduals.set(metadata.country, {
      excess: excessResult.excess,
      residual: residual,
      metadata: metadata
    });
  });
  
  if (countryResiduals.size === 0) {
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Policy Variable" }, 
      yaxis: { title: `Residuals from SVI (${selectedType === 'isolated' ? 'Isolated' : 'Cumulative'} ${selectedYear})` },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Collect data points: (policy value, residual)
  const dataPoints = [];
  
  countryResiduals.forEach((data, countryCode) => {
    // Map country code to OxCGRT code
    const oxCode = oxCGRTCountryCodeMap[countryCode] || countryCode;
    const countryData = state.policyDataByCountry.get(oxCode);
    if (!countryData) return;
    
    const policyData = countryData.get(selectedPolicy);
    if (!policyData || policyData.length === 0) return;
    
    // Calculate policy value based on selected year
    let policyValue = null;
    
    if (selectedPolicyYear === 'NA') {
      // For IMF 2021 variables (NA year), use the first available value
      // IMF data is static, so all entries should have the same value
      if (policyData.length > 0) {
        const firstValue = policyData.find(d => d.value !== null && isFinite(d.value));
        if (firstValue) {
          policyValue = firstValue.value;
        }
      }
    } else if (selectedPolicyYear === '2020-2021') {
      // Average of 2020 and 2021
      const year2020Start = new Date('2020-01-01T00:00:00Z');
      const year2021End = new Date('2021-12-31T23:59:59Z');
      
      const values2020_2021 = [];
      policyData.forEach(d => {
        if (d.date >= year2020Start && d.date <= year2021End) {
          if (d.value !== null && isFinite(d.value)) {
            values2020_2021.push(d.value);
          }
        }
      });
      
      if (values2020_2021.length > 0) {
        policyValue = values2020_2021.reduce((sum, v) => sum + v, 0) / values2020_2021.length;
      }
    } else {
      // Single year (2020 or 2021)
      const selectedYearNum = parseInt(selectedPolicyYear);
      const yearStart = new Date(`${selectedYearNum}-01-01T00:00:00Z`);
      const yearEnd = new Date(`${selectedYearNum}-12-31T23:59:59Z`);
      
      const values = [];
      policyData.forEach(d => {
        if (d.date >= yearStart && d.date <= yearEnd) {
          if (d.value !== null && isFinite(d.value)) {
            values.push(d.value);
          }
        }
      });
      
      if (values.length > 0) {
        policyValue = values.reduce((sum, v) => sum + v, 0) / values.length;
      }
    }
    
    if (policyValue !== null) {
      const countryName = countryNames[countryCode] || countryCode;
      dataPoints.push({
        x: policyValue,
        y: data.residual,
        country: countryCode,
        countryName: countryName
      });
    }
  });
  
  if (dataPoints.length === 0) {
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Policy Variable" }, 
      yaxis: { title: `Residuals from SVI (${selectedType === 'isolated' ? 'Isolated' : 'Cumulative'} ${selectedYear})` },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // First, identify influential points using all data
  const allXValues = dataPoints.map(d => d.x);
  const allYValues = dataPoints.map(d => d.y);
  
  const initialTrendLine = fitPolynomialTrend(allXValues, allYValues, 2, true);
  if (!initialTrendLine || !isFinite(initialTrendLine.rSquared)) {
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: `${selectedPolicyYear === '2020-2021' ? 'Average' : selectedPolicyYear} ${selectedPolicy}` }, 
      yaxis: { title: `Residuals from SVI (${selectedType === 'isolated' ? 'Isolated' : 'Cumulative'} ${selectedYear})` },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    // Hide button if no valid regression
    const hideBtn = document.getElementById('hideInfluentialPointsResidualBtn');
    if (hideBtn) hideBtn.style.display = 'none';
    return;
  }
  
  // Calculate influential points using all data
  const initialCoefficients = initialTrendLine.coefficients;
  const initialResiduals = [];
  for (let i = 0; i < allXValues.length; i++) {
    let predicted = 0;
    for (let j = 0; j < initialCoefficients.length; j++) {
      predicted += initialCoefficients[j] * Math.pow(allXValues[i], j);
    }
    initialResiduals.push(allYValues[i] - predicted);
  }
  
  const outlierIndices = [];
  const cookOutliers = countCookDistanceOutliersPolynomial(allXValues, allYValues, initialCoefficients);
  
  // Calculate outlier indices
  const n = allXValues.length;
  const xMean = allXValues.reduce((sum, x) => sum + x, 0) / n;
  let xSumSq = 0;
  for (let i = 0; i < n; i++) {
    const xDiff = allXValues[i] - xMean;
    xSumSq += xDiff * xDiff;
  }
  
  // Build design matrix X for leverage calculation
  const X = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < initialCoefficients.length; j++) {
      row.push(Math.pow(allXValues[i], j));
    }
    X.push(row);
  }
  
  // Calculate X'X
  const XTX = [];
  for (let i = 0; i < initialCoefficients.length; i++) {
    XTX[i] = [];
    for (let j = 0; j < initialCoefficients.length; j++) {
      let sum = 0;
      for (let m = 0; m < n; m++) {
        sum += X[m][i] * X[m][j];
      }
      XTX[i][j] = sum;
    }
  }
  
  // Calculate (X'X)^(-1) for k=3 (degree 2 polynomial)
  const k = initialCoefficients.length;
  if (k === 3) {
    const det = XTX[0][0] * (XTX[1][1] * XTX[2][2] - XTX[1][2] * XTX[2][1]) -
                XTX[0][1] * (XTX[1][0] * XTX[2][2] - XTX[1][2] * XTX[2][0]) +
                XTX[0][2] * (XTX[1][0] * XTX[2][1] - XTX[1][1] * XTX[2][0]);
    
    if (Math.abs(det) >= 1e-10) {
      const invXTX = [
        [
          (XTX[1][1] * XTX[2][2] - XTX[1][2] * XTX[2][1]) / det,
          (XTX[0][2] * XTX[2][1] - XTX[0][1] * XTX[2][2]) / det,
          (XTX[0][1] * XTX[1][2] - XTX[0][2] * XTX[1][1]) / det
        ],
        [
          (XTX[1][2] * XTX[2][0] - XTX[1][0] * XTX[2][2]) / det,
          (XTX[0][0] * XTX[2][2] - XTX[0][2] * XTX[2][0]) / det,
          (XTX[0][2] * XTX[1][0] - XTX[0][0] * XTX[1][2]) / det
        ],
        [
          (XTX[1][0] * XTX[2][1] - XTX[1][1] * XTX[2][0]) / det,
          (XTX[0][1] * XTX[2][0] - XTX[0][0] * XTX[2][1]) / det,
          (XTX[0][0] * XTX[1][1] - XTX[0][1] * XTX[1][0]) / det
        ]
      ];
      
      let sumSquaredResiduals = 0;
      for (let i = 0; i < n; i++) {
        sumSquaredResiduals += initialResiduals[i] * initialResiduals[i];
      }
      const mse = sumSquaredResiduals / (n - k);
      const threshold = 4 / n;
      
      if (mse > 0) {
        for (let i = 0; i < dataPoints.length; i++) {
          const Xi = X[i];
          
          // Calculate (X'X)^(-1) * X_i'
          const invXTX_Xi = [];
          for (let j = 0; j < k; j++) {
            let sum = 0;
            for (let m = 0; m < k; m++) {
              sum += invXTX[j][m] * Xi[m];
            }
            invXTX_Xi[j] = sum;
          }
          
          // Calculate h_i = X_i * invXTX_Xi
          let leverage = 0;
          for (let j = 0; j < k; j++) {
            leverage += Xi[j] * invXTX_Xi[j];
          }
          leverage = Math.max(0, Math.min(1, leverage));
          
          const residualSq = initialResiduals[i] * initialResiduals[i];
          const cooksDistance = (residualSq / (k * mse)) * (leverage / ((1 - leverage) * (1 - leverage) + 1e-10));
          
          if (cooksDistance > threshold) {
            outlierIndices.push(i);
          }
        }
      }
    }
  }
  
  // Show/hide button based on whether there are influential points
  const hideBtn = document.getElementById('hideInfluentialPointsResidualBtn');
  if (hideBtn) {
    if (outlierIndices.length > 0) {
      hideBtn.style.display = 'inline-block';
      hideBtn.textContent = excludeInfluentialPoints ? 'Show Influential Points' : 'Hide Influential Points';
    } else {
      hideBtn.style.display = 'none';
    }
  }
  
  // Filter data points if excluding influential points
  let filteredDataPoints = dataPoints;
  if (excludeInfluentialPoints && outlierIndices.length > 0) {
    filteredDataPoints = dataPoints.filter((point, index) => !outlierIndices.includes(index));
  }
  
  // Recalculate regression with filtered data
  const xValues = filteredDataPoints.map(d => d.x);
  const yValues = filteredDataPoints.map(d => d.y);
  
  const trendLine = fitPolynomialTrend(xValues, yValues, 2, true);
  if (!trendLine || !isFinite(trendLine.rSquared)) {
    Plotly.purge(container);
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: `${selectedPolicyYear === '2020-2021' ? 'Average' : selectedPolicyYear} ${selectedPolicy}` }, 
      yaxis: { title: `Residuals from SVI (${selectedType === 'isolated' ? 'Isolated' : 'Cumulative'} ${selectedYear})` },
      margin: { t: 20, r: 10, b: 40, l: 50 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  const r2 = trendLine.rSquared;
  const pValue = trendLine.pValue;
  const coefficients = trendLine.coefficients;
  
  // Calculate residuals from polynomial regression (using filtered data)
  const residuals = [];
  for (let i = 0; i < xValues.length; i++) {
    let predicted = 0;
    for (let j = 0; j < coefficients.length; j++) {
      predicted += coefficients[j] * Math.pow(xValues[i], j);
    }
    residuals.push(yValues[i] - predicted);
  }
  
  // Calculate White's test for heteroscedasticity (using polynomial residuals from filtered data)
  let whiteTestResult = { pValue: null };
  try {
    whiteTestResult = whiteTestPolynomial(xValues, residuals);
  } catch (e) {
    console.warn('White test failed:', e);
  }
  
  // Calculate robust p-value (using filtered data)
  let robustPValue = null;
  try {
    robustPValue = calculateRobustPValue(xValues, yValues, coefficients, residuals);
  } catch (e) {
    console.warn('Robust SE calculation failed:', e);
  }
  
  // Split ALL data points into outliers and non-outliers (for display)
  // But use filtered data for regression
  const outlierPoints = [];
  const normalPoints = [];
  
  dataPoints.forEach((point, index) => {
    if (outlierIndices.includes(index)) {
      outlierPoints.push(point);
    } else {
      normalPoints.push(point);
    }
  });
  
  // Use polynomial trend line points from fitPolynomialTrend
  const regressionX = trendLine.x;
  const regressionY = trendLine.y;
  
  // Create scatterplot trace for normal points
  const scatterTrace = {
    x: normalPoints.map(d => d.x),
    y: normalPoints.map(d => d.y),
    mode: 'markers+text',
    type: 'scatter',
    name: 'Countries',
    showlegend: false,
    text: normalPoints.map(d => d.countryName),
    textposition: 'top center',
    textfont: { size: 10 },
    marker: {
      size: 8,
      color: '#1f77b4',
      opacity: 0.7
    },
    hovertemplate: '<b>%{text}</b><br>Policy Value: %{x:.2f}<br>Residual: %{y:.2f}<extra></extra>',
    customdata: normalPoints.map(d => d.countryName)
  };
  
  // Create scatterplot trace for outliers (always show them, but maybe with different opacity if excluded)
  const outlierTrace = outlierPoints.length > 0 ? {
    x: outlierPoints.map(d => d.x),
    y: outlierPoints.map(d => d.y),
    mode: 'markers+text',
    type: 'scatter',
    name: `Influential Points (Cook's D > 4/n)`,
    text: outlierPoints.map(d => d.countryName),
    textposition: 'top center',
    textfont: { size: 10, color: '#d62728' },
    marker: {
      size: 12,
      color: '#d62728',
      opacity: excludeInfluentialPoints ? 0.3 : 0.9,
      symbol: 'diamond',
      line: { width: 2, color: '#ffffff' }
    },
    hovertemplate: '<b>%{text}</b> (Influential Point)<br>Policy Value: %{x:.2f}<br>Residual: %{y:.2f}<extra></extra>',
    customdata: outlierPoints.map(d => d.countryName)
  } : null;
  
  // Create regression line trace (simplified name for plot)
  const regressionTrace = {
    x: regressionX,
    y: regressionY,
    mode: 'lines',
    type: 'scatter',
    name: 'Regression',
    showlegend: false,
    line: {
      color: '#ff7f0e',
      width: 2,
      dash: 'dash'
    },
    hovertemplate: 'R² = %{customdata[0]:.3f}, p = %{customdata[1]}<extra></extra>',
    customdata: [[r2, pValue !== null ? (pValue < 0.001 ? '<0.001' : pValue.toFixed(3)) : 'N/A']]
  };
  
  // Update outlier trace to not show in legend
  if (outlierTrace) {
    outlierTrace.showlegend = false;
  }
  
  // Calculate xMin and xRange for zero line
  const xMin = Math.min(...allXValues);
  const xMax = Math.max(...allXValues);
  const xRange = xMax - xMin;
  
  // Add horizontal line at y=0
  const zeroLine = {
    x: [xMin - xRange * 0.1, xMax + xRange * 0.1],
    y: [0, 0],
    mode: 'lines',
    type: 'scatter',
    showlegend: false,
    line: {
      color: 'rgba(128, 128, 128, 0.5)',
      width: 1,
      dash: 'dot'
    },
    hovertemplate: 'Zero Line<extra></extra>'
  };
  
  const traces = [scatterTrace];
  if (outlierTrace) {
    traces.push(outlierTrace);
  }
  traces.push(regressionTrace, zeroLine);
  
  // Populate separate legend element above the plot
  const legendContainer = document.getElementById('residualExplanatoryPowerLegend');
  if (legendContainer) {
    let legendHTML = '<div style="display: flex; flex-wrap: wrap; gap: 15px; align-items: center;">';
    
    // Countries
    legendHTML += '<span><span style="display: inline-block; width: 12px; height: 12px; background-color: #1f77b4; border-radius: 50%; margin-right: 5px;"></span>Countries</span>';
    
    // Influential Points
    if (outlierPoints.length > 0) {
      legendHTML += `<span><span style="display: inline-block; width: 12px; height: 12px; background-color: #d62728; border: 2px solid #ffffff; transform: rotate(45deg); margin-right: 5px;"></span>Influential Points (Cook's D > ${(4/allXValues.length).toFixed(3)})</span>`;
    }
    
    // Statistics
    legendHTML += `<span><strong>R² = ${r2.toFixed(3)}</strong></span>`;
    if (pValue !== null) {
      legendHTML += `<span>p = ${pValue < 0.001 ? '<0.001' : pValue.toFixed(3)}</span>`;
    }
    if (robustPValue !== null && isFinite(robustPValue)) {
      legendHTML += `<span>p (Robust SE) = ${robustPValue < 0.001 ? '<0.001' : robustPValue.toFixed(3)}</span>`;
    }
    if (whiteTestResult.pValue !== null && isFinite(whiteTestResult.pValue)) {
      legendHTML += `<span>White p = ${whiteTestResult.pValue < 0.001 ? '<0.001' : whiteTestResult.pValue.toFixed(3)}</span>`;
    }
    legendHTML += `<span>n = ${xValues.length}`;
    if (excludeInfluentialPoints && outlierIndices.length > 0) {
      legendHTML += ` (${outlierIndices.length} influential points excluded)`;
    } else if (!excludeInfluentialPoints && outlierIndices.length > 0) {
      legendHTML += `, Influential Points: ${outlierIndices.length}`;
    }
    legendHTML += '</span>';
    
    legendHTML += '</div>';
    legendContainer.innerHTML = legendHTML;
  }
  
  const layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: `${selectedPolicyYear === '2020-2021' ? 'Average' : selectedPolicyYear} ${selectedPolicy}`
    },
    yaxis: { 
      title: `Residuals from SVI (${selectedType === 'isolated' ? 'Isolated' : 'Cumulative'} ${selectedYear})`
    },
    margin: { t: 20, r: 10, b: 40, l: 60 },
    showlegend: false,
    hovermode: 'closest'
  };
  
  Plotly.react(container, traces, layout, { responsive: true, displayModeBar: false });
  
  // Render table of statistically significant variables
  renderResidualExplanatoryPowerTable(filteredTraces, selectedYear, selectedType, selectedPolicyYear);
}

// Render simple table showing 2019 ASMR values
function renderScatterplotXAxisTable(filteredTraces) {
  const container = document.getElementById('scatterplotXAxisTable');
  if (!container) {
    console.error("scatterplotXAxisTable container not found!");
    return;
  }
  
  console.log("renderScatterplotXAxisTable called with", filteredTraces?.length || 0, "traces");
  
  // Build table data - just 2019 ASMR for visible countries
  const tableData = [];
  
  if (!filteredTraces || filteredTraces.length === 0) {
    container.innerHTML = '<p style="color: var(--muted);">No countries selected</p>';
    return;
  }
  
  filteredTraces.forEach((trace) => {
    // Find the corresponding metadata to get original rows
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) {
      console.log("Trace not found:", trace.name);
      return;
    }
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata) {
      console.log("No metadata for:", trace.name);
      return;
    }
    
    if (!metadata.originalRows) {
      console.log("No originalRows for:", trace.name);
      return;
    }
    
    // Get 2019 ASMR
    const avgASMR = calculateAverageASMR(metadata.originalRows, '2019');
    if (avgASMR === null || !isFinite(avgASMR)) {
      console.log("No valid 2019 ASMR for:", trace.name);
      return;
    }
    
    tableData.push({
      name: trace.name,
      asmr: avgASMR
    });
  });
  
  console.log("Table data collected:", tableData.length, "countries");
  
  if (tableData.length === 0) {
    container.innerHTML = '<p style="color: var(--muted);">No 2019 ASMR data available</p>';
    return;
  }
  
  // Sort by ASMR
  tableData.sort((a, b) => a.asmr - b.asmr);
  
  // Generate table HTML
  let html = '<table class="summary-table"><thead><tr>';
  html += '<th>#</th>';
  html += '<th>Country</th>';
  html += '<th>2019 ASMR (per 100k)</th>';
  html += '</tr></thead><tbody>';
  
  tableData.forEach((row, index) => {
    html += `<tr>`;
    html += `<td>${index + 1}</td>`;
    html += `<td>${row.name}</td>`;
    html += `<td>${row.asmr.toFixed(1)}</td>`;
    html += `</tr>`;
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
  console.log("Table rendered with", tableData.length, "rows");
}

// Render table of 2019 ASMR vs GDP (Nominal) per Capita
function renderASMRGDPTable(filteredTraces) {
  console.log("=== renderASMRGDPTable CALLED ===");
  
  // Find or create table container
  let container = document.getElementById('asmrGdpTable');
  if (!container) {
    // Create container if it doesn't exist
    const chartContainer = document.getElementById('asmrGdpScatterplotChart');
    if (chartContainer && chartContainer.parentElement) {
      container = document.createElement('div');
      container.id = 'asmrGdpTable';
      chartContainer.parentElement.insertBefore(container, chartContainer);
    } else {
      console.error("Cannot find chart container to insert table");
      return;
    }
  }
  
  // Get list of countries that have traces
  const traceCountries = new Set();
  for (const metadata of state.dedicatedPermanentTraceMetadata) {
    if (metadata && metadata.country) {
      traceCountries.add(metadata.country);
    }
  }
  
  console.log("Trace countries:", Array.from(traceCountries));
  
  // Build table data
  const tableData = [];
  const processedCountries = new Set();
  
  // Iterate through all available country-sex combinations
  for (const [key, rows] of state.dataByCountrySex.entries()) {
    const [countryCode, sex] = key.split('|');
    
    // Only process countries that have traces
    if (!traceCountries.has(countryCode)) {
      continue;
    }
    
    // Prefer 'b' (both sexes), skip if we already have this country
    if (processedCountries.has(countryCode)) {
      if (sex === 'b') {
        // Replace with 'b' data if we have a non-'b' entry
        const existingIndex = tableData.findIndex(d => d.country === countryCode && d.sex !== 'b');
        if (existingIndex >= 0) {
          tableData.splice(existingIndex, 1);
          processedCountries.delete(countryCode);
        } else {
          continue; // Already have 'b' data
        }
      } else {
        continue; // Already have this country
      }
    }
    
    // Get 2019 ASMR
    const avgASMR = calculateAverageASMR(rows, '2019');
    if (avgASMR === null || !isFinite(avgASMR)) {
      continue;
    }
    
    // Get GDP nominal per capita
    const gdpNominal = gdpPerCapita2019[countryCode];
    if (!gdpNominal || !isFinite(gdpNominal)) {
      continue;
    }
    
    const countryName = countryNames[countryCode] || countryCode;
    tableData.push({
      country: countryCode,
      name: countryName,
      asmr: avgASMR,
      gdp: gdpNominal,
      sex: sex
    });
    
    processedCountries.add(countryCode);
  }
  
  // Sort by ASMR
  tableData.sort((a, b) => a.asmr - b.asmr);
  
  console.log(`ASMR-GDP table: ${tableData.length} countries`);
  
  // Generate table HTML
  let html = '<table class="summary-table"><thead><tr>';
  html += '<th>#</th>';
  html += '<th>Country</th>';
  html += '<th>2019 ASMR (per 100k)</th>';
  html += '<th>GDP (Nominal) per Capita (USD)</th>';
  html += '</tr></thead><tbody>';
  
  tableData.forEach((row, index) => {
    html += `<tr>`;
    html += `<td>${index + 1}</td>`;
    html += `<td>${row.name}</td>`;
    html += `<td>${row.asmr.toFixed(1)}</td>`;
    html += `<td>${row.gdp.toLocaleString()}</td>`;
    html += `</tr>`;
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
  
  console.log("✅ ASMR-GDP table rendered successfully");
}

// Render scatterplot of 2019 ASMR vs GDP (Nominal) per Capita
function renderASMRGDPScatterplot(filteredTraces) {
  console.log("=== renderASMRGDPScatterplot CALLED ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("filteredTraces parameter:", filteredTraces?.length || 0);
  
  const container = document.getElementById('asmrGdpScatterplotChart');
  if (!container) {
    console.error("❌ ASMR-GDP container NOT FOUND!");
    console.error("Document ready state:", document.readyState);
    console.error("All elements with 'chart' class:", document.querySelectorAll('.chart').length);
    console.error("Elements with 'asmr' in id:", Array.from(document.querySelectorAll('[id*="asmr"]')).map(e => e.id));
    return;
  }
  
  console.log("✅ ASMR-GDP container FOUND");
  console.log("Container:", container);
  console.log("Container ID:", container.id);
  console.log("dataByCountrySex size:", state.dataByCountrySex.size);
  console.log("Available countries:", Array.from(state.countries));
  
  // Build scatterplot data directly from state.dataByCountrySex
  // This ensures we use the full dataset, not filtered rows
  const scatterData = [];
  const processedCountries = new Set();
  
  // First, get list of all countries we have traces for (to filter which countries to show)
  const traceCountries = new Set();
  for (const metadata of state.dedicatedPermanentTraceMetadata) {
    if (metadata && metadata.country) {
      traceCountries.add(metadata.country);
    }
  }
  
  console.log("Trace countries:", Array.from(traceCountries));
  console.log("Processing", state.dataByCountrySex.size, "country-sex combinations");
  
  let processedCount = 0;
  let skippedCount = 0;
  let addedCount = 0;
  
  // Iterate through all available country-sex combinations
  for (const [key, rows] of state.dataByCountrySex.entries()) {
    processedCount++;
    const [countryCode, sex] = key.split('|');
    
    // Only process countries that have traces
    if (!traceCountries.has(countryCode)) {
      skippedCount++;
      if (processedCount <= 5) {
        console.log(`  Skipping ${countryCode} (${sex}) - not in trace countries`);
      }
      continue;
    }
    
    // Prefer 'b' (both sexes), skip if we already have this country
    if (processedCountries.has(countryCode)) {
      if (sex === 'b') {
        // Replace with 'b' data if we have a non-'b' entry
        const existingIndex = scatterData.findIndex(d => d.country === countryCode && d.sex !== 'b');
        if (existingIndex >= 0) {
          scatterData.splice(existingIndex, 1);
          processedCountries.delete(countryCode);
        } else {
          continue; // Already have 'b' data
        }
      } else {
        continue; // Already have this country
      }
    }
    
    // Get 2019 ASMR
    const avgASMR = calculateAverageASMR(rows, '2019');
    if (avgASMR === null || !isFinite(avgASMR)) {
      console.log(`  ❌ No valid 2019 ASMR for ${countryCode} (${sex}), got:`, avgASMR);
      const rows2019 = rows.filter(r => r.Year === 2019);
      const rowsWithASMR = rows2019.filter(r => isFinite(r.ASMR100k));
      console.log(`     Total rows: ${rows.length}, 2019 rows: ${rows2019.length}, 2019 with ASMR: ${rowsWithASMR.length}`);
      if (rows2019.length > 0 && rowsWithASMR.length === 0) {
        console.log(`     Sample 2019 row ASMR100k:`, rows2019[0]?.ASMR100k, "has property:", 'ASMR100k' in (rows2019[0] || {}));
      }
      skippedCount++;
      continue;
    }
    
    // Get GDP nominal per capita
    const gdpNominal = gdpPerCapita2019[countryCode];
    if (!gdpNominal || !isFinite(gdpNominal)) {
      console.log(`  ❌ No valid GDP for ${countryCode}, got:`, gdpNominal, "GDP data exists:", countryCode in gdpPerCapita2019);
      skippedCount++;
      continue;
    }
    
    const countryName = countryNames[countryCode] || countryCode;
    scatterData.push({
      x: avgASMR,
      y: gdpNominal,
      name: countryName,
      country: countryCode,
      sex: sex
    });
    
    processedCountries.add(countryCode);
    addedCount++;
    console.log(`  ✅ Added ${countryCode} (${sex}): ASMR=${avgASMR.toFixed(2)}, GDP=${gdpNominal}`);
  }
  
  console.log(`=== DATA COLLECTION SUMMARY ===`);
  console.log(`Processed: ${processedCount}, Skipped: ${skippedCount}, Added: ${addedCount}`);
  console.log(`ASMR-GDP scatterplot: ${scatterData.length} data points`);
  
  if (scatterData.length === 0) {
    console.warn("No data points for ASMR-GDP scatterplot - showing empty chart");
    console.warn("Metadata available:", state.dedicatedPermanentTraceMetadata.length);
    console.warn("Sample metadata:", state.dedicatedPermanentTraceMetadata.slice(0, 3).map(m => ({
      country: m?.country,
      sex: m?.sex,
      hasOriginalRows: !!m?.originalRows,
      rowCount: m?.originalRows?.length,
      sampleYears: m?.originalRows?.slice(0, 10).map(r => r?.Year).filter(Boolean)
    })));
    
    // Still show the chart with axes even if no data
    console.log("=== RENDERING EMPTY CHART (NO DATA) ===");
    console.log("Container element:", container);
    console.log("Container dimensions:", {
      width: container.offsetWidth,
      height: container.offsetHeight,
      display: window.getComputedStyle(container).display,
      visibility: window.getComputedStyle(container).visibility
    });
    console.log("Plotly library:", typeof Plotly !== 'undefined' ? 'loaded' : 'MISSING');
    
    try {
      Plotly.react(container, [], {
        paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: { 
          title: "2019 ASMR (per 100k)",
          type: 'linear',
          range: [0, 1000] // Set a default range so axes show
        }, 
        yaxis: { 
          title: "GDP (Nominal) per Capita (USD)",
          type: 'linear',
          range: [0, 150000] // Set a default range so axes show
        },
        margin: { t: 20, r: 10, b: 50, l: 70 },
      }, { responsive: true, displayModeBar: false }).then(() => {
        console.log("✅ Empty chart rendered successfully");
        console.log("Container after render - dimensions:", {
          width: container.offsetWidth,
          height: container.offsetHeight
        });
      }).catch(err => {
        console.error("❌ Error rendering empty ASMR-GDP chart:", err);
        console.error("Error stack:", err.stack);
      });
    } catch (err) {
      console.error("❌ Exception rendering empty chart:", err);
      console.error("Exception stack:", err.stack);
    }
    return;
  }
  
  const xData = scatterData.map(d => d.x);
  const yData = scatterData.map(d => d.y);
  
  console.log("X data sample:", xData.slice(0, 5));
  console.log("Y data sample:", yData.slice(0, 5));
  console.log("X range:", Math.min(...xData), "to", Math.max(...xData));
  console.log("Y range:", Math.min(...yData), "to", Math.max(...yData));
  
  // Create scatter plot trace
  const trace = {
    x: xData,
    y: yData,
    mode: 'markers',
    type: 'scatter',
    showlegend: false,
    text: scatterData.map(d => d.name),
    marker: {
      size: 10,
      color: 'rgba(96, 165, 250, 0.7)',
      line: { width: 1.5, color: 'rgba(96, 165, 250, 1)' }
    },
    hovertemplate: '<b>%{text}</b><br>' +
                   '2019 ASMR: %{x:.1f}<br>' +
                   'GDP (Nominal) per Capita: %{y:,.0f}<extra></extra>'
  };
  
  // Fit trend line (polynomial curve)
  const trendLine = fitPolynomialTrend(xData, yData, 2);
  const traces = [trace];
  
  // Trend line color
  const trendColor = 'rgba(255, 100, 100, 0.8)';
  
  if (trendLine) {
    traces.push({
      x: trendLine.x,
      y: trendLine.y,
      mode: 'lines',
      type: 'scatter',
      showlegend: false,
      line: {
        color: trendColor,
        width: 2,
        dash: 'solid'
      },
      hovertemplate: 'Trend Line<extra></extra>'
    });
  }
  
  // Prepare annotations for R²
  const annotations = [];
  if (trendLine && isFinite(trendLine.rSquared)) {
    annotations.push({
      text: `R² = ${trendLine.rSquared.toFixed(3)}`,
      showarrow: false,
      font: {
        color: trendColor,
        size: 14
      },
      xref: 'paper',
      yref: 'paper',
      x: 0.05,
      y: 0.95,
      xanchor: 'left',
      yanchor: 'top'
    });
  }
  
  console.log("=== RENDERING CHART ===");
  console.log("Container element:", container);
  console.log("Container dimensions:", {
    width: container.offsetWidth,
    height: container.offsetHeight,
    display: window.getComputedStyle(container).display,
    visibility: window.getComputedStyle(container).visibility
  });
  console.log("Trace data:", trace);
  console.log("X data:", xData);
  console.log("Y data:", yData);
  console.log("Trend line R²:", trendLine?.rSquared);
  console.log("Plotly library:", typeof Plotly !== 'undefined' ? 'loaded' : 'MISSING');
  
  console.log("Rendering ASMR-GDP scatterplot with", xData.length, "points");
  
  try {
    Plotly.react(container, traces, {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { 
        title: "2019 ASMR (per 100k)",
        type: 'linear'
      }, 
      yaxis: { 
        title: "GDP (Nominal) per Capita (USD)",
        type: 'linear'
      },
      margin: { t: 20, r: 10, b: 50, l: 70 },
      showlegend: false,
      annotations: annotations
    }, { responsive: true, displayModeBar: true }).then(() => {
      console.log("✅ ASMR-GDP scatterplot rendered successfully with", xData.length, "points");
      console.log("Container after render - dimensions:", {
        width: container.offsetWidth,
        height: container.offsetHeight
      });
      // Check if Plotly actually rendered something
      const plotlyContainer = container.querySelector('.js-plotly-plot');
      console.log("Plotly plot element:", plotlyContainer ? 'found' : 'NOT FOUND');
      if (plotlyContainer) {
        console.log("Plotly plot dimensions:", {
          width: plotlyContainer.offsetWidth,
          height: plotlyContainer.offsetHeight
        });
      }
    }).catch(err => {
      console.error("❌ Error rendering ASMR-GDP scatterplot:", err);
      console.error("Error stack:", err.stack);
    });
  } catch (err) {
    console.error("❌ Exception while calling Plotly.react:", err);
    console.error("Exception stack:", err.stack);
  }
}

// Fit multiple linear regression with 5 predictors: y = b0 + b1*x1 + b2*x2 + b3*x3 + b4*x4 + b5*x5
function fitMultipleRegression5(x1Data, x2Data, x3Data, x4Data, x5Data, yData) {
  const n = x1Data.length;
  if (n < 6) return null; // Need at least 6 points for 5 predictors + intercept
  
  // Filter valid points (allow null/undefined for some factors, but need at least ASMR)
  const validPoints = [];
  for (let i = 0; i < n; i++) {
    // ASMR (x1) is required, others can be null/undefined
    if (isFinite(x1Data[i]) && isFinite(yData[i])) {
      // Use 0 or mean imputation for missing values in other factors
      const x2 = (x2Data[i] !== null && x2Data[i] !== undefined && isFinite(x2Data[i])) ? x2Data[i] : 0;
      const x3 = (x3Data[i] !== null && x3Data[i] !== undefined && isFinite(x3Data[i])) ? x3Data[i] : 0;
      const x4 = (x4Data[i] !== null && x4Data[i] !== undefined && isFinite(x4Data[i])) ? x4Data[i] : 0;
      const x5 = (x5Data[i] !== null && x5Data[i] !== undefined && isFinite(x5Data[i])) ? x5Data[i] : 0;
      
      validPoints.push({
        x1: x1Data[i],
        x2: x2,
        x3: x3,
        x4: x4,
        x5: x5,
        y: yData[i]
      });
    }
  }
  
  if (validPoints.length < 6) return null;
  
  // Build design matrix X = [1, x1, x2, x3, x4, x5]
  const X = validPoints.map(p => [1, p.x1, p.x2, p.x3, p.x4, p.x5]);
  const Y = validPoints.map(p => p.y);
  
  // Compute X^T (transpose)
  const XT = [[], [], [], [], [], []];
  for (let i = 0; i < validPoints.length; i++) {
    XT[0].push(1);
    XT[1].push(validPoints[i].x1);
    XT[2].push(validPoints[i].x2);
    XT[3].push(validPoints[i].x3);
    XT[4].push(validPoints[i].x4);
    XT[5].push(validPoints[i].x5);
  }
  
  // Compute XTX = X^T * X (6x6 matrix)
  const XTX = [[0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0]];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      for (let k = 0; k < validPoints.length; k++) {
        XTX[i][j] += XT[i][k] * X[k][j];
      }
    }
  }
  
  // Compute XTY = X^T * Y
  const XTY = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 6; i++) {
    for (let k = 0; k < validPoints.length; k++) {
      XTY[i] += XT[i][k] * Y[k];
    }
  }
  
  // Solve for coefficients
  const coeffs = solveLinearSystem(XTX, XTY);
  if (!coeffs) return null;
  
  // Calculate R²
  const yMean = Y.reduce((a, b) => a + b, 0) / Y.length;
  let ssRes = 0;
  let ssTot = 0;
  
  for (let i = 0; i < validPoints.length; i++) {
    const predicted = coeffs[0] + coeffs[1] * validPoints[i].x1 + 
                     coeffs[2] * validPoints[i].x2 + 
                     coeffs[3] * validPoints[i].x3 + 
                     coeffs[4] * validPoints[i].x4 + 
                     coeffs[5] * validPoints[i].x5;
    ssRes += Math.pow(Y[i] - predicted, 2);
    ssTot += Math.pow(Y[i] - yMean, 2);
  }
  
  const rSquared = 1 - (ssRes / ssTot);
  
  return {
    coefficients: coeffs, // [b0, b1, b2, b3, b4, b5]
    rSquared: rSquared,
    predict: (x1, x2, x3, x4, x5) => {
      const x2_val = (x2 !== null && x2 !== undefined && isFinite(x2)) ? x2 : 0;
      const x3_val = (x3 !== null && x3 !== undefined && isFinite(x3)) ? x3 : 0;
      const x4_val = (x4 !== null && x4 !== undefined && isFinite(x4)) ? x4 : 0;
      const x5_val = (x5 !== null && x5 !== undefined && isFinite(x5)) ? x5 : 0;
      return coeffs[0] + coeffs[1] * x1 + coeffs[2] * x2_val + 
             coeffs[3] * x3_val + coeffs[4] * x4_val + coeffs[5] * x5_val;
    }
  };
}

// Fit multiple linear regression: y = b0 + b1*x1 + b2*x2
function fitMultipleRegression(x1Data, x2Data, yData) {
  const n = x1Data.length;
  if (n < 3) return null;
  
  // Filter valid points
  const validPoints = [];
  for (let i = 0; i < n; i++) {
    if (isFinite(x1Data[i]) && isFinite(x2Data[i]) && isFinite(yData[i])) {
      validPoints.push({
        x1: x1Data[i],
        x2: x2Data[i],
        y: yData[i]
      });
    }
  }
  
  if (validPoints.length < 3) return null;
  
  // Build design matrix X = [1, x1, x2]
  const X = validPoints.map(p => [1, p.x1, p.x2]);
  const Y = validPoints.map(p => p.y);
  
  // Compute X^T * X
  const XT = [[], [], []];
  for (let i = 0; i < validPoints.length; i++) {
    XT[0].push(1);
    XT[1].push(validPoints[i].x1);
    XT[2].push(validPoints[i].x2);
  }
  
  const XTX = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < validPoints.length; k++) {
        XTX[i][j] += XT[i][k] * X[k][j];
      }
    }
  }
  
  // Compute X^T * Y
  const XTY = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < validPoints.length; k++) {
      XTY[i] += XT[i][k] * Y[k];
    }
  }
  
  // Solve for coefficients
  const coeffs = solveLinearSystem(XTX, XTY);
  if (!coeffs) return null;
  
  // Calculate R²
  const yMean = Y.reduce((a, b) => a + b, 0) / Y.length;
  let ssRes = 0;
  let ssTot = 0;
  
  for (let i = 0; i < validPoints.length; i++) {
    const yPred = coeffs[0] + coeffs[1] * validPoints[i].x1 + coeffs[2] * validPoints[i].x2;
    ssRes += Math.pow(validPoints[i].y - yPred, 2);
    ssTot += Math.pow(validPoints[i].y - yMean, 2);
  }
  
  const rSquared = 1 - (ssRes / ssTot);
  
  return {
    coefficients: coeffs, // [b0, b1, b2]
    rSquared: rSquared,
    predict: (x1, x2) => coeffs[0] + coeffs[1] * x1 + coeffs[2] * x2
  };
}

// Cache for fixed regressions (calculated from all countries)
const fixedRegressionsCache = {
  '2025': null,
  '2024': null,
  '2023': null
};

// Calculate fixed regression for a given year using ALL countries
function calculateFixedRegression(year) {
  const cacheKey = String(year);
  if (fixedRegressionsCache[cacheKey]) {
    console.log(`Using cached fixed regression for ${year}`);
    return fixedRegressionsCache[cacheKey];
  }
  
  console.log(`Calculating fixed regression for year ${year} using all countries...`);
  
  if (!state.dedicatedPermanentTraces || state.dedicatedPermanentTraces.length === 0) {
    console.warn("No traces available for fixed regression calculation");
    return null;
  }
  
  const yearValue = `${year}`; // Use cumulative, not isolated
  const scatterData = [];
  
  // Build data from ALL traces (not just filtered)
  state.dedicatedPermanentTraces.forEach((trace, traceIndex) => {
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.originalRows) return;
    
    // Get 2019 ASMR
    const avgASMR = calculateAverageASMR(metadata.originalRows, '2019');
    if (avgASMR === null || !isFinite(avgASMR)) return;
    
    // Get all factors
    const gdp = gdpNominal2019[metadata.country];
    const gini = gini2019[metadata.country];
    const poverty = poverty2019[metadata.country];
    const healthExp = healthExpenditure2019[metadata.country];
    
    // Get excess value using helper function
    const excessResult = getExcessValue(yearValue, trace);
    if (excessResult && excessResult.excess !== null && isFinite(excessResult.excess)) {
      scatterData.push({
        name: trace.name,
        country: metadata.country,
        asmr: avgASMR,
        gdp: gdp,
        gini: gini,
        poverty: poverty,
        healthExp: healthExp,
        excess: excessResult.excess
      });
    }
  });
  
  console.log(`Fixed regression data points collected: ${scatterData.length}`);
  
  if (scatterData.length < 6) {
    console.warn(`Not enough data to calculate fixed regression for ${year} (need 6, got ${scatterData.length})`);
    return null;
  }
  
  // Fit regression using all countries
  const asmrData = scatterData.map(d => d.asmr);
  const gdpData = scatterData.map(d => d.gdp);
  const giniData = scatterData.map(d => d.gini);
  const povertyData = scatterData.map(d => d.poverty);
  const healthExpData = scatterData.map(d => d.healthExp);
  const excessData = scatterData.map(d => d.excess);
  
  const regression = fitMultipleRegression5(
    asmrData, 
    gdpData, 
    giniData, 
    povertyData, 
    healthExpData, 
    excessData
  );
  
  if (regression) {
    fixedRegressionsCache[cacheKey] = regression;
    console.log(`Fixed regression calculated and cached for ${year}:`, regression.coefficients);
    console.log(`R² = ${regression.rSquared.toFixed(4)}`);
  } else {
    console.error(`Failed to fit fixed regression for ${year}`);
  }
  
  return regression;
}

// Render table showing current index weights
function renderCompositeIndexWeightsTable(regression, mode = null) {
  const container = document.getElementById('compositeIndexWeightsTable');
  if (!container) {
    console.error("compositeIndexWeightsTable container not found");
    return;
  }
  
  // Get mode if not provided
  if (mode === null) {
    const modeSelect = document.getElementById('compositeIndexModeSelect');
    mode = modeSelect ? modeSelect.value : 'dynamic';
  }
  
  if (!regression || !regression.coefficients) {
    container.innerHTML = '<p style="color: var(--muted);">No regression data available</p>';
    return;
  }
  
  const coeffs = regression.coefficients;
  const factorNames = [
    'Intercept',
    '2019 ASMR',
    'GDP (Nominal) per Capita',
    'Inequality (GINI)',
    'Poverty (% living below line)',
    'Health Expenditure (%GDP)'
  ];
  
  // Determine mode label
  let modeLabel = 'Dynamic';
  if (mode === '2024-fixed') modeLabel = '2024 Fixed (all countries)';
  else if (mode === '2024-fixed') modeLabel = '2024 Fixed (all countries)';
  else if (mode === '2023-fixed') modeLabel = '2023 Fixed (all countries)';
  
  let html = `<h4 style="margin-bottom: 8px;">Current Index Weights <span style="color: var(--muted); font-size: 0.9em; font-weight: normal;">(${modeLabel})</span></h4>`;
  html += '<table class="summary-table" style="max-width: 600px;">';
  html += '<thead><tr><th>Factor</th><th>Coefficient</th></tr></thead>';
  html += '<tbody>';
  
  for (let i = 0; i < coeffs.length; i++) {
    html += `<tr><td>${factorNames[i]}</td><td>${coeffs[i].toFixed(4)}</td></tr>`;
  }
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

// Render scatterplot of Cumulative Excess vs Composite Index (with year selection)
function renderCompositeIndexScatterplot(filteredTraces) {
  const container = document.getElementById('compositeIndexScatterplotChart');
  if (!container) {
    console.log("compositeIndexScatterplotChart container not found");
    return;
  }
  
  // Get selected year from dropdown
  const yearSelect = document.getElementById('compositeIndexYearSelect');
  const yearValue = yearSelect ? yearSelect.value : '2025';
  const isIsolated = yearValue.includes('-isolated');
  const selectedYear = parseInt(yearValue.replace('-isolated', ''));
  
  // Get index mode from dropdown
  const modeSelect = document.getElementById('compositeIndexModeSelect');
  const mode = modeSelect ? modeSelect.value : 'dynamic';
  
  const scatterData = [];
  
  filteredTraces.forEach((trace) => {
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.originalRows) return;
    
    // Get 2019 ASMR
    const avgASMR = calculateAverageASMR(metadata.originalRows, '2019');
    if (avgASMR === null || !isFinite(avgASMR)) return;
    
    // Get all factors - we'll allow missing values for some factors but need at least ASMR
    const gdp = gdpNominal2019[metadata.country];
    const gini = gini2019[metadata.country];
    const poverty = poverty2019[metadata.country];
    const healthExp = healthExpenditure2019[metadata.country];
    
    // Get excess value (cumulative or isolated) using helper function
    const excessResult = getExcessValue(yearValue, trace);
    if (excessResult && excessResult.excess !== null && isFinite(excessResult.excess)) {
      scatterData.push({
        name: trace.name,
        country: metadata.country,
        asmr: avgASMR,
        gdp: gdp,
        gini: gini,
        poverty: poverty,
        healthExp: healthExp,
        excess: excessResult.excess
      });
    }
  });
  
  // Format Y-axis label based on cumulative vs isolated
  const yAxisLabel = isIsolated 
    ? `${selectedYear} Excess (ASMR per 100k)` 
    : `${selectedYear} Cumulative Excess (ASMR per 100k)`;
  
  // Determine which regression to use based on mode
  let regression;
  
  if (mode === '2024-fixed' || mode === '2023-fixed' || mode === '2022-fixed') {
    // Use fixed regression - extract year from mode (e.g., '2024-fixed' -> 2024)
    const fixedYear = parseInt(mode.replace('-fixed', ''));
    console.log(`Using fixed regression mode for year ${fixedYear}`);
    regression = calculateFixedRegression(fixedYear);
    
    if (!regression) {
      console.error(`Failed to get fixed regression for ${fixedYear}`);
      Plotly.react(container, [], {
        paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: { title: "Structural Vulnerability Index" },
        yaxis: { title: yAxisLabel },
        margin: { t: 20, r: 10, b: 50, l: 70 },
      }, { responsive: true, displayModeBar: false });
      renderCompositeIndexWeightsTable(null);
      return;
    }
    console.log(`Fixed regression loaded for ${fixedYear}:`, regression.coefficients);
  } else {
    console.log('Using dynamic regression mode');
    // Dynamic mode: use current selection to fit regression
    // If we have fewer than 6 points in the filtered data, we need to use all countries
    // to fit the regression model, then plot only the filtered countries
    let allScatterData = [];
    
    if (scatterData.length < 6) {
      // Build data from all traces (not just filtered) to fit the regression
      state.dedicatedPermanentTraces.forEach((trace, traceIndex) => {
        const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
        if (!metadata || !metadata.originalRows) return;
        
        // Get 2019 ASMR
        const avgASMR = calculateAverageASMR(metadata.originalRows, '2019');
        if (avgASMR === null || !isFinite(avgASMR)) return;
        
        // Get all factors
        const gdp = gdpNominal2019[metadata.country];
        const gini = gini2019[metadata.country];
        const poverty = poverty2019[metadata.country];
        const healthExp = healthExpenditure2019[metadata.country];
        
        // Get excess value using helper function
        const excessResult = getExcessValue(yearValue, trace);
        if (excessResult && excessResult.excess !== null && isFinite(excessResult.excess)) {
          allScatterData.push({
            name: trace.name,
            country: metadata.country,
            asmr: avgASMR,
            gdp: gdp,
            gini: gini,
            poverty: poverty,
            healthExp: healthExp,
            excess: excessResult.excess
          });
        }
      });
      
      // If we still don't have enough data even from all countries, show empty chart
      if (allScatterData.length < 6) {
        Plotly.react(container, [], {
          paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
          xaxis: { title: "Structural Vulnerability Index" },
          yaxis: { title: yAxisLabel },
          margin: { t: 20, r: 10, b: 50, l: 70 },
        }, { responsive: true, displayModeBar: false });
        return;
      }
      
      // Fit regression using all countries
      const allAsmrData = allScatterData.map(d => d.asmr);
      const allGdpData = allScatterData.map(d => d.gdp);
      const allGiniData = allScatterData.map(d => d.gini);
      const allPovertyData = allScatterData.map(d => d.poverty);
      const allHealthExpData = allScatterData.map(d => d.healthExp);
      const allExcessData = allScatterData.map(d => d.excess);
      
      regression = fitMultipleRegression5(
        allAsmrData, 
        allGdpData, 
        allGiniData, 
        allPovertyData, 
        allHealthExpData, 
        allExcessData
      );
      
      if (!regression) {
        console.error("Failed to fit regression with all countries");
        Plotly.react(container, [], {
          paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
          xaxis: { title: "Structural Vulnerability Index" },
          yaxis: { title: yAxisLabel },
          margin: { t: 20, r: 10, b: 50, l: 70 },
        }, { responsive: true, displayModeBar: false });
        return;
      }
    } else {
      // We have enough filtered data, use it directly
      // Fit multiple regression with all factors: excess = b0 + b1*ASMR + b2*GDP + b3*GINI + b4*POVERTY + b5*HEALTH_EXP
      const asmrData = scatterData.map(d => d.asmr);
      const gdpData = scatterData.map(d => d.gdp);
      const giniData = scatterData.map(d => d.gini);
      const povertyData = scatterData.map(d => d.poverty);
      const healthExpData = scatterData.map(d => d.healthExp);
      const excessData = scatterData.map(d => d.excess);
      
      regression = fitMultipleRegression5(
        asmrData, 
        gdpData, 
        giniData, 
        povertyData, 
        healthExpData, 
        excessData
      );
      
      if (!regression) {
        console.error("Failed to fit regression");
        Plotly.react(container, [], {
          paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
          xaxis: { title: "Structural Vulnerability Index" },
          yaxis: { title: yAxisLabel },
          margin: { t: 20, r: 10, b: 50, l: 70 },
        }, { responsive: true, displayModeBar: false });
        return;
      }
    }
  }
  
  console.log("Multiple regression coefficients:", regression.coefficients);
  console.log("Multiple regression R²:", regression.rSquared);
  console.log(`Mode: ${mode}, Scatter data points: ${scatterData.length}`);
  
  // Create composite index: predicted value from regression
  const compositeIndices = scatterData.map(d => 
    regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp)
  );
  
  console.log(`Composite indices range: ${Math.min(...compositeIndices).toFixed(2)} to ${Math.max(...compositeIndices).toFixed(2)}`);
  
  const xData = compositeIndices;
  const yData = scatterData.map(d => d.excess);
  
  // Create scatter plot trace
  const trace = {
    x: xData,
    y: yData,
    mode: 'markers',
    type: 'scatter',
    showlegend: false,
    text: scatterData.map(d => d.name),
    marker: {
      size: 10,
      color: 'rgba(96, 165, 250, 0.7)',
      line: { width: 1.5, color: 'rgba(96, 165, 250, 1)' }
    },
    hovertemplate: '<b>%{text}</b><br>' +
                   'Structural Vulnerability Index: %{x:.1f}<br>' +
                   `${isIsolated ? `${selectedYear} Excess` : `${selectedYear} Cumulative Excess`}: %{y:.1f}<extra></extra>`
  };
  
  // Fit trend line for the scatterplot
  const trendLine = fitPolynomialTrend(xData, yData, 1); // Linear trend
  const traces = [trace];
  
  const trendColor = 'rgba(255, 100, 100, 0.8)';
  
  if (trendLine) {
    traces.push({
      x: trendLine.x,
      y: trendLine.y,
      mode: 'lines',
      type: 'scatter',
      showlegend: false,
      line: {
        color: trendColor,
        width: 2,
        dash: 'solid'
      },
      hovertemplate: 'Trend Line<extra></extra>'
    });
  }
  
  // Prepare annotations for R² and p-value
  const annotations = [];
  if (trendLine && isFinite(trendLine.rSquared)) {
    let annotationText = `R² = ${trendLine.rSquared.toFixed(3)}`;
    if (trendLine.pValue !== null && isFinite(trendLine.pValue)) {
      // Format p-value: show scientific notation if very small
      let pValText;
      if (trendLine.pValue < 0.001) {
        pValText = trendLine.pValue.toExponential(2);
      } else {
        pValText = trendLine.pValue.toFixed(3);
      }
      annotationText += `<br>p = ${pValText}`;
    }
    annotations.push({
      text: annotationText,
      showarrow: false,
      font: {
        color: trendColor,
        size: 14
      },
      xref: 'paper',
      yref: 'paper',
      x: 0.05,
      y: 0.95,
      xanchor: 'left',
      yanchor: 'top'
    });
  }
  
  Plotly.react(container, traces, {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: "Structural Vulnerability Index",
      type: 'linear'
    }, 
    yaxis: { 
      title: yAxisLabel,
      type: 'linear'
    },
    margin: { t: 20, r: 10, b: 50, l: 70 },
    showlegend: false,
    annotations: annotations
  }, { responsive: true, displayModeBar: true });
  
  // Also render residual plot
  // Pass the exact same data and trend line from the scatterplot above
  renderCompositeIndexResidualPlot(xData, yData, scatterData, trendLine);
  
  // Render residual evolution over time plot
  const residualTypeSelect = document.getElementById('residualEvolutionTypeSelect');
  const residualType = residualTypeSelect ? residualTypeSelect.value : 'cumulative';
  renderCompositeIndexResidualEvolution(filteredTraces, mode, residualType);
  
  // Render weights table (pass mode so it can display the mode label)
  renderCompositeIndexWeightsTable(regression, mode);
}

// Render residual plot for composite index regression
// xData: predicted values (composite indices) from the scatterplot above
// yData: actual excess values from the scatterplot above
// scatterData: data points array for labels and metadata
// trendLine: the trend line object from the scatterplot above
function renderCompositeIndexResidualPlot(xData, yData, scatterData, trendLine) {
  const container = document.getElementById('compositeIndexResidualChart');
  if (!container || !xData || !yData || !scatterData || scatterData.length === 0 || xData.length !== yData.length) {
    if (container && (!xData || !yData || !scatterData || scatterData.length === 0)) {
      Plotly.react(container, [], {
        paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: { title: "Structural Vulnerability Index (Predicted)" },
        yaxis: { title: "Residual (Actual - Predicted)" },
        margin: { t: 20, r: 10, b: 50, l: 70 },
      }, { responsive: true, displayModeBar: false });
    }
    return;
  }
  
  // Calculate residuals based on the trend line from the scatterplot above
  // xData = composite indices (x-axis values)
  // yData = actual excess values (y-axis values)
  // trendLine.coefficients = polynomial coefficients [c0, c1, ...] where y = c0 + c1*x + c2*x² + ...
  const predictedValues = xData;
  const actualValues = yData;
  
  let residuals;
  if (trendLine && trendLine.coefficients) {
    // Calculate trend line prediction for each x value
    const trendPredictions = xData.map(x => {
      let yPred = 0;
      for (let j = 0; j < trendLine.coefficients.length; j++) {
        yPred += trendLine.coefficients[j] * Math.pow(x, j);
      }
      return yPred;
    });
    // Residual = actual - trend line prediction
    residuals = actualValues.map((actual, i) => actual - trendPredictions[i]);
  } else {
    // Fallback: if no trend line, use composite indices as predictions
    residuals = actualValues.map((actual, i) => actual - predictedValues[i]);
  }
  
  // Create residual plot trace
  const trace = {
    x: predictedValues,
    y: residuals,
    mode: 'markers',
    type: 'scatter',
    showlegend: false,
    text: scatterData.map(d => d.name),
    marker: {
      size: 10,
      color: 'rgba(96, 165, 250, 0.7)',
      line: { width: 1.5, color: 'rgba(96, 165, 250, 1)' }
    },
    hovertemplate: '<b>%{text}</b><br>' +
                   'Predicted: %{x:.1f}<br>' +
                   'Residual: %{y:.1f}<extra></extra>'
  };
  
  // Add horizontal line at y=0
  const zeroLine = {
    x: [Math.min(...predictedValues), Math.max(...predictedValues)],
    y: [0, 0],
    mode: 'lines',
    type: 'scatter',
    showlegend: false,
    line: {
      color: 'rgba(255, 100, 100, 0.6)',
      width: 1,
      dash: 'dash'
    },
    hovertemplate: 'Zero Line<extra></extra>'
  };
  
  Plotly.react(container, [trace, zeroLine], {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: "Structural Vulnerability Index (Predicted)",
      type: 'linear'
    }, 
    yaxis: { 
      title: "Residual (Actual - Predicted)",
      type: 'linear'
    },
    margin: { t: 20, r: 10, b: 50, l: 70 },
    showlegend: false
  }, { responsive: true, displayModeBar: true });
}

// Render residual evolution over time plot
// Shows how residuals for each country change across cumulative years (2021-2025)
// residualType: 'cumulative' or 'isolated'
function renderCompositeIndexResidualEvolution(filteredTraces, mode, residualType = 'cumulative') {
  const container = document.getElementById('compositeIndexResidualEvolutionChart');
  if (!container || !filteredTraces || filteredTraces.length === 0) {
    if (container && (!filteredTraces || filteredTraces.length === 0)) {
      Plotly.react(container, [], {
        paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: { title: "Year" },
        yaxis: { title: "Residual (Actual - Predicted)" },
        margin: { t: 20, r: 10, b: 50, l: 70 },
      }, { responsive: true, displayModeBar: false });
    }
    // Clear variance table when no data
    const varianceContainer = document.getElementById('residualEvolutionVarianceTable');
    if (varianceContainer) {
      varianceContainer.innerHTML = '';
    }
    return;
  }
  
  const years = [2021, 2022, 2023, 2024, 2025];
  const countryResiduals = new Map(); // Map of country name -> array of residuals for each year
  const isIsolated = residualType === 'isolated';
  
  // Initialize data structure for each country
  filteredTraces.forEach(trace => {
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata) return;
    countryResiduals.set(trace.name, {
      name: trace.name,
      country: metadata.country,
      residuals: []
    });
  });
  
  // Calculate residuals for each year
  for (const year of years) {
    const yearValue = isIsolated ? `${year}-isolated` : `${year}`;
    
    // Build scatterData for this year
    const scatterData = [];
    filteredTraces.forEach((trace) => {
      const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
      if (traceIndex < 0) return;
      
      const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
      if (!metadata || !metadata.originalRows) return;
      
      const avgASMR = calculateAverageASMR(metadata.originalRows, '2019');
      if (avgASMR === null || !isFinite(avgASMR)) return;
      
      const gdp = gdpNominal2019[metadata.country];
      const gini = gini2019[metadata.country];
      const poverty = poverty2019[metadata.country];
      const healthExp = healthExpenditure2019[metadata.country];
      
      const excessResult = getExcessValue(yearValue, trace);
      if (excessResult && excessResult.excess !== null && isFinite(excessResult.excess)) {
        scatterData.push({
          name: trace.name,
          country: metadata.country,
          asmr: avgASMR,
          gdp: gdp,
          gini: gini,
          poverty: poverty,
          healthExp: healthExp,
          excess: excessResult.excess
        });
      }
    });
    
    if (scatterData.length < 6) {
      // Need to build from all countries for regression
      const allScatterData = [];
      state.dedicatedPermanentTraces.forEach((trace, traceIndex) => {
        const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
        if (!metadata || !metadata.originalRows) return;
        
        const avgASMR = calculateAverageASMR(metadata.originalRows, '2019');
        if (avgASMR === null || !isFinite(avgASMR)) return;
        
        const gdp = gdpNominal2019[metadata.country];
        const gini = gini2019[metadata.country];
        const poverty = poverty2019[metadata.country];
        const healthExp = healthExpenditure2019[metadata.country];
        
        const excessResult = getExcessValue(yearValue, trace);
        if (excessResult && excessResult.excess !== null && isFinite(excessResult.excess)) {
          allScatterData.push({
            name: trace.name,
            country: metadata.country,
            asmr: avgASMR,
            gdp: gdp,
            gini: gini,
            poverty: poverty,
            healthExp: healthExp,
            excess: excessResult.excess
          });
        }
      });
      
      if (allScatterData.length < 6) {
        // Not enough data for this year, skip
        countryResiduals.forEach((data, name) => {
          data.residuals.push(null);
        });
        continue;
      }
      
      // Fit regression on all countries
      const allAsmrData = allScatterData.map(d => d.asmr);
      const allGdpData = allScatterData.map(d => d.gdp);
      const allGiniData = allScatterData.map(d => d.gini);
      const allPovertyData = allScatterData.map(d => d.poverty);
      const allHealthExpData = allScatterData.map(d => d.healthExp);
      const allExcessData = allScatterData.map(d => d.excess);
      
      const regression = fitMultipleRegression5(
        allAsmrData, 
        allGdpData, 
        allGiniData, 
        allPovertyData, 
        allHealthExpData, 
        allExcessData
      );
      
      if (!regression) {
        countryResiduals.forEach((data, name) => {
          data.residuals.push(null);
        });
        continue;
      }
      
      // Calculate residuals for filtered countries
      scatterData.forEach(d => {
        const compositeIndex = regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp);
        const actual = d.excess;
        // For now, use composite index as prediction (we'll need trend line for proper residuals)
        // But let's use a simple linear fit on the scatterData
        const xData = scatterData.map(sd => regression.predict(sd.asmr, sd.gdp, sd.gini, sd.poverty, sd.healthExp));
        const yData = scatterData.map(sd => sd.excess);
        const trendLine = fitPolynomialTrend(xData, yData, 1);
        
        let residual = null;
        if (trendLine && trendLine.coefficients) {
          let trendPred = 0;
          for (let j = 0; j < trendLine.coefficients.length; j++) {
            trendPred += trendLine.coefficients[j] * Math.pow(compositeIndex, j);
          }
          residual = actual - trendPred;
        } else {
          residual = actual - compositeIndex;
        }
        
        const countryData = countryResiduals.get(d.name);
        if (countryData) {
          countryData.residuals.push(residual);
        }
      });
      
      // Add null for countries not in filtered data
      countryResiduals.forEach((data, name) => {
        if (!scatterData.find(d => d.name === name)) {
          data.residuals.push(null);
        }
      });
    } else {
      // Enough filtered data, fit regression on filtered data
      let regression;
      
      if (mode === '2024-fixed' || mode === '2023-fixed' || mode === '2022-fixed') {
        const fixedYear = parseInt(mode.replace('-fixed', ''));
        regression = calculateFixedRegression(fixedYear);
        if (!regression) {
          countryResiduals.forEach((data, name) => {
            data.residuals.push(null);
          });
          continue;
        }
      } else {
        const asmrData = scatterData.map(d => d.asmr);
        const gdpData = scatterData.map(d => d.gdp);
        const giniData = scatterData.map(d => d.gini);
        const povertyData = scatterData.map(d => d.poverty);
        const healthExpData = scatterData.map(d => d.healthExp);
        const excessData = scatterData.map(d => d.excess);
        
        regression = fitMultipleRegression5(
          asmrData, 
          gdpData, 
          giniData, 
          povertyData, 
          healthExpData, 
          excessData
        );
        
        if (!regression) {
          countryResiduals.forEach((data, name) => {
            data.residuals.push(null);
          });
          continue;
        }
      }
      
      // Calculate composite indices and fit trend line
      const compositeIndices = scatterData.map(d => 
        regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp)
      );
      const actualValues = scatterData.map(d => d.excess);
      const trendLine = fitPolynomialTrend(compositeIndices, actualValues, 1);
      
      // Calculate residuals for each country
      scatterData.forEach((d, idx) => {
        const compositeIndex = compositeIndices[idx];
        const actual = actualValues[idx];
        
        let residual = null;
        if (trendLine && trendLine.coefficients) {
          let trendPred = 0;
          for (let j = 0; j < trendLine.coefficients.length; j++) {
            trendPred += trendLine.coefficients[j] * Math.pow(compositeIndex, j);
          }
          residual = actual - trendPred;
        } else {
          residual = actual - compositeIndex;
        }
        
        const countryData = countryResiduals.get(d.name);
        if (countryData) {
          countryData.residuals.push(residual);
        }
      });
    }
  }
  
  // Create traces for each country
  const traces = [];
  countryResiduals.forEach((countryData, name) => {
    if (countryData.residuals.some(r => r !== null && isFinite(r))) {
      traces.push({
        x: years,
        y: countryData.residuals,
        mode: 'lines+markers',
        type: 'scatter',
        name: name,
        line: {
          width: 1.5
        },
        marker: {
          size: 4
        },
        hovertemplate: `<b>${name}</b><br>` +
                       'Year: %{x}<br>' +
                       'Residual: %{y:.2f}<extra></extra>',
        connectgaps: false
      });
    }
  });
  
  // Add horizontal line at y=0
  const zeroLine = {
    x: [Math.min(...years), Math.max(...years)],
    y: [0, 0],
    mode: 'lines',
    type: 'scatter',
    showlegend: false,
    line: {
      color: 'rgba(255, 100, 100, 0.6)',
      width: 1,
      dash: 'dash'
    },
    hovertemplate: 'Zero Line<extra></extra>'
  };
  
  Plotly.react(container, [...traces, zeroLine], {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: "Year",
      type: 'linear',
      tickmode: 'linear',
      tick0: 2021,
      dtick: 1
    }, 
    yaxis: { 
      title: isIsolated ? "Residual (Isolated Year Excess - Predicted)" : "Residual (Cumulative Excess - Predicted)",
      type: 'linear'
    },
    margin: { t: 20, r: 10, b: 50, l: 70 },
    showlegend: true,
    legend: {
      x: 1.02,
      y: 1,
      xanchor: 'left',
      yanchor: 'top'
    }
  }, { responsive: true, displayModeBar: true });
  
  // Calculate and display variance of residuals for each year
  renderResidualEvolutionVarianceTable(countryResiduals, years);
}

// Calculate and render variance table for residual evolution
function renderResidualEvolutionVarianceTable(countryResiduals, years) {
  const container = document.getElementById('residualEvolutionVarianceTable');
  if (!container) {
    console.error("residualEvolutionVarianceTable container not found");
    return;
  }
  
  // Calculate variance for each year
  const varianceData = [];
  
  for (let yearIndex = 0; yearIndex < years.length; yearIndex++) {
    const year = years[yearIndex];
    // Collect all non-null residuals for this year across all countries
    const residualsForYear = [];
    countryResiduals.forEach((countryData) => {
      const residual = countryData.residuals[yearIndex];
      if (residual !== null && isFinite(residual)) {
        residualsForYear.push(residual);
      }
    });
    
    if (residualsForYear.length > 0) {
      // Calculate mean
      const mean = residualsForYear.reduce((sum, r) => sum + r, 0) / residualsForYear.length;
      // Calculate variance: mean of squared deviations from mean
      const variance = residualsForYear.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / residualsForYear.length;
      varianceData.push({
        year: year,
        variance: variance,
        count: residualsForYear.length
      });
    } else {
      varianceData.push({
        year: year,
        variance: null,
        count: 0
      });
    }
  }
  
  // Render table
  let html = '<h4 style="margin-bottom: 8px;">Variance of Residuals by Year</h4>';
  html += '<table class="summary-table" style="max-width: 400px;">';
  html += '<thead><tr><th>Year</th><th>Variance</th><th>N</th></tr></thead>';
  html += '<tbody>';
  
  varianceData.forEach(data => {
    if (data.variance !== null) {
      html += `<tr><td>${data.year}</td><td>${data.variance.toFixed(4)}</td><td>${data.count}</td></tr>`;
    } else {
      html += `<tr><td>${data.year}</td><td>—</td><td>0</td></tr>`;
    }
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

// Render scatterplot of 2024 Cumulative Excess vs Composite Index
function renderCompositeIndexScatterplot2024(filteredTraces) {
  const container = document.getElementById('compositeIndexScatterplotChart2024');
  if (!container) {
    console.log("compositeIndexScatterplotChart2024 container not found");
    return;
  }
  
  // Get 2024 cumulative excess data (use same logic as summary table)
  const year2024 = new Date('2024-01-01T00:00:00Z');
  const scatterData = [];
  
  filteredTraces.forEach((trace) => {
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.originalRows) return;
    
    // Get 2019 ASMR
    const avgASMR = calculateAverageASMR(metadata.originalRows, '2019');
    if (avgASMR === null || !isFinite(avgASMR)) return;
    
    // Get all factors - we'll allow missing values for some factors but need at least ASMR
    const gdp = gdpNominal2019[metadata.country];
    const gini = gini2019[metadata.country];
    const poverty = poverty2019[metadata.country];
    const healthExp = healthExpenditure2019[metadata.country];
    
    // Get 2024 cumulative excess (use exact same logic as updateSummaryTable)
    let cumulativeExcess = null;
    let minDiff = Infinity;
    
    trace.x.forEach((date, idx) => {
      if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
        const diff = Math.abs(date - year2024);
        if (diff < minDiff && date <= year2024) {
          minDiff = diff;
          cumulativeExcess = trace.y[idx];
        }
      }
    });
    
    // If no value found before 2024-01-01, find the closest value overall
    if (cumulativeExcess === null || minDiff > 365 * 24 * 60 * 60 * 1000) {
      trace.x.forEach((date, idx) => {
        if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
          const diff = Math.abs(date - year2024);
          if (diff < minDiff) {
            minDiff = diff;
            cumulativeExcess = trace.y[idx];
          }
        }
      });
    }
    
    if (cumulativeExcess !== null && isFinite(cumulativeExcess)) {
      scatterData.push({
        name: trace.name,
        country: metadata.country,
        asmr: avgASMR,
        gdp: gdp,
        gini: gini,
        poverty: poverty,
        healthExp: healthExp,
        excess2024: cumulativeExcess
      });
    }
  });
  
  if (scatterData.length < 6) {
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Structural Vulnerability Index" },
      yaxis: { title: "2024 Cumulative Excess (ASMR per 100k)" },
      margin: { t: 20, r: 10, b: 50, l: 70 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Fit multiple regression with all factors: excess2024 = b0 + b1*ASMR + b2*GDP + b3*GINI + b4*POVERTY + b5*HEALTH_EXP
  const asmrData = scatterData.map(d => d.asmr);
  const gdpData = scatterData.map(d => d.gdp);
  const giniData = scatterData.map(d => d.gini);
  const povertyData = scatterData.map(d => d.poverty);
  const healthExpData = scatterData.map(d => d.healthExp);
  const excessData = scatterData.map(d => d.excess2024);
  
  const regression = fitMultipleRegression5(
    asmrData, 
    gdpData, 
    giniData, 
    povertyData, 
    healthExpData, 
    excessData
  );
  
  if (!regression) {
    console.error("Failed to fit regression");
    return;
  }
  
  console.log("Multiple regression coefficients (2024):", regression.coefficients);
  console.log("Multiple regression R² (2024):", regression.rSquared);
  
  // Create composite index: predicted value from regression
  const compositeIndices = scatterData.map(d => 
    regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp)
  );
  
  const xData = compositeIndices;
  const yData = excessData;
  
  // Create scatter plot trace
  const trace = {
    x: xData,
    y: yData,
    mode: 'markers',
    type: 'scatter',
    showlegend: false,
    text: scatterData.map(d => d.name),
    marker: {
      size: 10,
      color: 'rgba(96, 165, 250, 0.7)',
      line: { width: 1.5, color: 'rgba(96, 165, 250, 1)' }
    },
    hovertemplate: '<b>%{text}</b><br>' +
                   'Structural Vulnerability Index: %{x:.1f}<br>' +
                   '2024 Cumulative Excess: %{y:.1f}<extra></extra>'
  };
  
  // Fit trend line for the scatterplot
  const trendLine = fitPolynomialTrend(xData, yData, 1); // Linear trend
  const traces = [trace];
  
  const trendColor = 'rgba(255, 100, 100, 0.8)';
  
  if (trendLine) {
    traces.push({
      x: trendLine.x,
      y: trendLine.y,
      mode: 'lines',
      type: 'scatter',
      showlegend: false,
      line: {
        color: trendColor,
        width: 2,
        dash: 'solid'
      },
      hovertemplate: 'Trend Line<extra></extra>'
    });
  }
  
  // Prepare annotations for R² and p-value
  const annotations = [];
  if (trendLine && isFinite(trendLine.rSquared)) {
    let annotationText = `R² = ${trendLine.rSquared.toFixed(3)}`;
    if (trendLine.pValue !== null && isFinite(trendLine.pValue)) {
      // Format p-value: show scientific notation if very small
      let pValText;
      if (trendLine.pValue < 0.001) {
        pValText = trendLine.pValue.toExponential(2);
      } else {
        pValText = trendLine.pValue.toFixed(3);
      }
      annotationText += `<br>p = ${pValText}`;
    }
    annotations.push({
      text: annotationText,
      showarrow: false,
      font: {
        color: trendColor,
        size: 14
      },
      xref: 'paper',
      yref: 'paper',
      x: 0.05,
      y: 0.95,
      xanchor: 'left',
      yanchor: 'top'
    });
  }
  
  Plotly.react(container, traces, {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: "Structural Vulnerability Index",
      type: 'linear'
    }, 
    yaxis: { 
      title: "2024 Cumulative Excess (ASMR per 100k)",
      type: 'linear'
    },
    margin: { t: 20, r: 10, b: 50, l: 70 },
    showlegend: false,
    annotations: annotations
  }, { responsive: true, displayModeBar: true });
  
  // Also render residual plot
  renderCompositeIndexResidualPlot2024(scatterData, regression);
}

// Render residual plot for composite index regression (2024)
function renderCompositeIndexResidualPlot2024(scatterData, regression) {
  const container = document.getElementById('compositeIndexResidualChart2024');
  if (!container || !regression || !scatterData || scatterData.length === 0) {
    if (container && (!regression || !scatterData || scatterData.length === 0)) {
      Plotly.react(container, [], {
        paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: { title: "Structural Vulnerability Index (Predicted)" },
        yaxis: { title: "Residual (Actual - Predicted)" },
        margin: { t: 20, r: 10, b: 50, l: 70 },
      }, { responsive: true, displayModeBar: false });
    }
    return;
  }
  
  // Calculate predicted values and residuals
  const predictedValues = scatterData.map(d => regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp));
  const actualValues = scatterData.map(d => d.excess2024);
  const residuals = actualValues.map((actual, i) => actual - predictedValues[i]);
  
  // Create residual plot trace
  const trace = {
    x: predictedValues,
    y: residuals,
    mode: 'markers',
    type: 'scatter',
    showlegend: false,
    text: scatterData.map(d => d.name),
    marker: {
      size: 10,
      color: 'rgba(96, 165, 250, 0.7)',
      line: { width: 1.5, color: 'rgba(96, 165, 250, 1)' }
    },
    hovertemplate: '<b>%{text}</b><br>' +
                   'Predicted: %{x:.1f}<br>' +
                   'Residual: %{y:.1f}<extra></extra>'
  };
  
  // Add horizontal line at y=0
  const zeroLine = {
    x: [Math.min(...predictedValues), Math.max(...predictedValues)],
    y: [0, 0],
    mode: 'lines',
    type: 'scatter',
    showlegend: false,
    line: {
      color: 'rgba(255, 100, 100, 0.6)',
      width: 1,
      dash: 'dash'
    },
    hovertemplate: 'Zero Line<extra></extra>'
  };
  
  Plotly.react(container, [trace, zeroLine], {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: "Structural Vulnerability Index (Predicted)",
      type: 'linear'
    }, 
    yaxis: { 
      title: "Residual (Actual - Predicted)",
      type: 'linear'
    },
    margin: { t: 20, r: 10, b: 50, l: 70 },
    showlegend: false
  }, { responsive: true, displayModeBar: true });
}

// Render scatterplot of 2023 Cumulative Excess vs Composite Index
function renderCompositeIndexScatterplot2023(filteredTraces) {
  const container = document.getElementById('compositeIndexScatterplotChart2023');
  if (!container) {
    console.log("compositeIndexScatterplotChart2023 container not found");
    return;
  }
  
  // Get 2023 cumulative excess data (use same logic as summary table)
  const year2023 = new Date('2023-01-01T00:00:00Z');
  const scatterData = [];
  
  filteredTraces.forEach((trace) => {
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.originalRows) return;
    
    // Get 2019 ASMR
    const avgASMR = calculateAverageASMR(metadata.originalRows, '2019');
    if (avgASMR === null || !isFinite(avgASMR)) return;
    
    // Get all factors - we'll allow missing values for some factors but need at least ASMR
    const gdp = gdpNominal2019[metadata.country];
    const gini = gini2019[metadata.country];
    const poverty = poverty2019[metadata.country];
    const healthExp = healthExpenditure2019[metadata.country];
    
    // Get 2023 cumulative excess (use exact same logic as updateSummaryTable)
    let cumulativeExcess = null;
    let minDiff = Infinity;
    
    trace.x.forEach((date, idx) => {
      if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
        const diff = Math.abs(date - year2023);
        if (diff < minDiff && date <= year2023) {
          minDiff = diff;
          cumulativeExcess = trace.y[idx];
        }
      }
    });
    
    // If no value found before 2023-01-01, find the closest value overall
    if (cumulativeExcess === null || minDiff > 365 * 24 * 60 * 60 * 1000) {
      trace.x.forEach((date, idx) => {
        if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
          const diff = Math.abs(date - year2023);
          if (diff < minDiff) {
            minDiff = diff;
            cumulativeExcess = trace.y[idx];
          }
        }
      });
    }
    
    if (cumulativeExcess !== null && isFinite(cumulativeExcess)) {
      scatterData.push({
        name: trace.name,
        country: metadata.country,
        asmr: avgASMR,
        gdp: gdp,
        gini: gini,
        poverty: poverty,
        healthExp: healthExp,
        excess2023: cumulativeExcess
      });
    }
  });
  
  if (scatterData.length < 6) {
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Structural Vulnerability Index" },
      yaxis: { title: "2023 Cumulative Excess (ASMR per 100k)" },
      margin: { t: 20, r: 10, b: 50, l: 70 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Fit multiple regression with all factors: excess2023 = b0 + b1*ASMR + b2*GDP + b3*GINI + b4*POVERTY + b5*HEALTH_EXP
  const asmrData = scatterData.map(d => d.asmr);
  const gdpData = scatterData.map(d => d.gdp);
  const giniData = scatterData.map(d => d.gini);
  const povertyData = scatterData.map(d => d.poverty);
  const healthExpData = scatterData.map(d => d.healthExp);
  const excessData = scatterData.map(d => d.excess2023);
  
  const regression = fitMultipleRegression5(
    asmrData, 
    gdpData, 
    giniData, 
    povertyData, 
    healthExpData, 
    excessData
  );
  
  if (!regression) {
    console.error("Failed to fit regression");
    return;
  }
  
  console.log("Multiple regression coefficients (2023):", regression.coefficients);
  console.log("Multiple regression R² (2023):", regression.rSquared);
  
  // Create composite index: predicted value from regression
  const compositeIndices = scatterData.map(d => 
    regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp)
  );
  
  const xData = compositeIndices;
  const yData = excessData;
  
  // Create scatter plot trace
  const trace = {
    x: xData,
    y: yData,
    mode: 'markers',
    type: 'scatter',
    showlegend: false,
    text: scatterData.map(d => d.name),
    marker: {
      size: 10,
      color: 'rgba(96, 165, 250, 0.7)',
      line: { width: 1.5, color: 'rgba(96, 165, 250, 1)' }
    },
    hovertemplate: '<b>%{text}</b><br>' +
                   'Structural Vulnerability Index: %{x:.1f}<br>' +
                   '2023 Cumulative Excess: %{y:.1f}<extra></extra>'
  };
  
  // Fit trend line for the scatterplot
  const trendLine = fitPolynomialTrend(xData, yData, 1); // Linear trend
  const traces = [trace];
  
  const trendColor = 'rgba(255, 100, 100, 0.8)';
  
  if (trendLine) {
    traces.push({
      x: trendLine.x,
      y: trendLine.y,
      mode: 'lines',
      type: 'scatter',
      showlegend: false,
      line: {
        color: trendColor,
        width: 2,
        dash: 'solid'
      },
      hovertemplate: 'Trend Line<extra></extra>'
    });
  }
  
  // Prepare annotations for R² and p-value
  const annotations = [];
  if (trendLine && isFinite(trendLine.rSquared)) {
    let annotationText = `R² = ${trendLine.rSquared.toFixed(3)}`;
    if (trendLine.pValue !== null && isFinite(trendLine.pValue)) {
      // Format p-value: show scientific notation if very small
      let pValText;
      if (trendLine.pValue < 0.001) {
        pValText = trendLine.pValue.toExponential(2);
      } else {
        pValText = trendLine.pValue.toFixed(3);
      }
      annotationText += `<br>p = ${pValText}`;
    }
    annotations.push({
      text: annotationText,
      showarrow: false,
      font: {
        color: trendColor,
        size: 14
      },
      xref: 'paper',
      yref: 'paper',
      x: 0.05,
      y: 0.95,
      xanchor: 'left',
      yanchor: 'top'
    });
  }
  
  Plotly.react(container, traces, {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: "Structural Vulnerability Index",
      type: 'linear'
    }, 
    yaxis: { 
      title: "2023 Cumulative Excess (ASMR per 100k)",
      type: 'linear'
    },
    margin: { t: 20, r: 10, b: 50, l: 70 },
    showlegend: false,
    annotations: annotations
  }, { responsive: true, displayModeBar: true });
  
  // Also render residual plot
  renderCompositeIndexResidualPlot2023(scatterData, regression);
}

// Render residual plot for composite index regression (2023)
function renderCompositeIndexResidualPlot2023(scatterData, regression) {
  const container = document.getElementById('compositeIndexResidualChart2023');
  if (!container || !regression || !scatterData || scatterData.length === 0) {
    if (container && (!regression || !scatterData || scatterData.length === 0)) {
      Plotly.react(container, [], {
        paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: { title: "Structural Vulnerability Index (Predicted)" },
        yaxis: { title: "Residual (Actual - Predicted)" },
        margin: { t: 20, r: 10, b: 50, l: 70 },
      }, { responsive: true, displayModeBar: false });
    }
    return;
  }
  
  // Calculate predicted values and residuals
  const predictedValues = scatterData.map(d => regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp));
  const actualValues = scatterData.map(d => d.excess2023);
  const residuals = actualValues.map((actual, i) => actual - predictedValues[i]);
  
  // Create residual plot trace
  const trace = {
    x: predictedValues,
    y: residuals,
    mode: 'markers',
    type: 'scatter',
    showlegend: false,
    text: scatterData.map(d => d.name),
    marker: {
      size: 10,
      color: 'rgba(96, 165, 250, 0.7)',
      line: { width: 1.5, color: 'rgba(96, 165, 250, 1)' }
    },
    hovertemplate: '<b>%{text}</b><br>' +
                   'Predicted: %{x:.1f}<br>' +
                   'Residual: %{y:.1f}<extra></extra>'
  };
  
  // Add horizontal line at y=0
  const zeroLine = {
    x: [Math.min(...predictedValues), Math.max(...predictedValues)],
    y: [0, 0],
    mode: 'lines',
    type: 'scatter',
    showlegend: false,
    line: {
      color: 'rgba(255, 100, 100, 0.6)',
      width: 1,
      dash: 'dash'
    },
    hovertemplate: 'Zero Line<extra></extra>'
  };
  
  Plotly.react(container, [trace, zeroLine], {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: "Structural Vulnerability Index (Predicted)",
      type: 'linear'
    }, 
    yaxis: { 
      title: "Residual (Actual - Predicted)",
      type: 'linear'
    },
    margin: { t: 20, r: 10, b: 50, l: 70 },
    showlegend: false
  }, { responsive: true, displayModeBar: true });
}

// Render scatterplot of 2022 Cumulative Excess vs Composite Index
function renderCompositeIndexScatterplot2022(filteredTraces) {
  const container = document.getElementById('compositeIndexScatterplotChart2022');
  if (!container) {
    console.log("compositeIndexScatterplotChart2022 container not found");
    return;
  }
  
  // Get 2022 cumulative excess data (use same logic as summary table)
  const year2022 = new Date('2022-01-01T00:00:00Z');
  const scatterData = [];
  
  filteredTraces.forEach((trace) => {
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.originalRows) return;
    
    // Get 2019 ASMR
    const avgASMR = calculateAverageASMR(metadata.originalRows, '2019');
    if (avgASMR === null || !isFinite(avgASMR)) return;
    
    // Get all factors - we'll allow missing values for some factors but need at least ASMR
    const gdp = gdpNominal2019[metadata.country];
    const gini = gini2019[metadata.country];
    const poverty = poverty2019[metadata.country];
    const healthExp = healthExpenditure2019[metadata.country];
    
    // Get 2022 cumulative excess (use exact same logic as updateSummaryTable)
    let cumulativeExcess = null;
    let minDiff = Infinity;
    
    trace.x.forEach((date, idx) => {
      if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
        const diff = Math.abs(date - year2022);
        if (diff < minDiff && date <= year2022) {
          minDiff = diff;
          cumulativeExcess = trace.y[idx];
        }
      }
    });
    
    // If no value found before 2022-01-01, find the closest value overall
    if (cumulativeExcess === null || minDiff > 365 * 24 * 60 * 60 * 1000) {
      trace.x.forEach((date, idx) => {
        if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
          const diff = Math.abs(date - year2022);
          if (diff < minDiff) {
            minDiff = diff;
            cumulativeExcess = trace.y[idx];
          }
        }
      });
    }
    
    if (cumulativeExcess !== null && isFinite(cumulativeExcess)) {
      scatterData.push({
        name: trace.name,
        country: metadata.country,
        asmr: avgASMR,
        gdp: gdp,
        gini: gini,
        poverty: poverty,
        healthExp: healthExp,
        excess2022: cumulativeExcess
      });
    }
  });
  
  if (scatterData.length < 6) {
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Structural Vulnerability Index" },
      yaxis: { title: "2022 Cumulative Excess (ASMR per 100k)" },
      margin: { t: 20, r: 10, b: 50, l: 70 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Fit multiple regression with all factors: excess2022 = b0 + b1*ASMR + b2*GDP + b3*GINI + b4*POVERTY + b5*HEALTH_EXP
  const asmrData = scatterData.map(d => d.asmr);
  const gdpData = scatterData.map(d => d.gdp);
  const giniData = scatterData.map(d => d.gini);
  const povertyData = scatterData.map(d => d.poverty);
  const healthExpData = scatterData.map(d => d.healthExp);
  const excessData = scatterData.map(d => d.excess2022);
  
  const regression = fitMultipleRegression5(
    asmrData, 
    gdpData, 
    giniData, 
    povertyData, 
    healthExpData, 
    excessData
  );
  
  if (!regression) {
    console.error("Failed to fit regression");
    return;
  }
  
  console.log("Multiple regression coefficients (2022):", regression.coefficients);
  console.log("Multiple regression R² (2022):", regression.rSquared);
  
  // Create composite index: predicted value from regression
  const compositeIndices = scatterData.map(d => 
    regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp)
  );
  
  const xData = compositeIndices;
  const yData = excessData;
  
  // Create scatter plot trace
  const trace = {
    x: xData,
    y: yData,
    mode: 'markers',
    type: 'scatter',
    showlegend: false,
    text: scatterData.map(d => d.name),
    marker: {
      size: 10,
      color: 'rgba(96, 165, 250, 0.7)',
      line: { width: 1.5, color: 'rgba(96, 165, 250, 1)' }
    },
    hovertemplate: '<b>%{text}</b><br>' +
                   'Structural Vulnerability Index: %{x:.1f}<br>' +
                   '2022 Cumulative Excess: %{y:.1f}<extra></extra>'
  };
  
  // Fit trend line for the scatterplot
  const trendLine = fitPolynomialTrend(xData, yData, 1); // Linear trend
  const traces = [trace];
  
  const trendColor = 'rgba(255, 100, 100, 0.8)';
  
  if (trendLine) {
    traces.push({
      x: trendLine.x,
      y: trendLine.y,
      mode: 'lines',
      type: 'scatter',
      showlegend: false,
      line: {
        color: trendColor,
        width: 2,
        dash: 'solid'
      },
      hovertemplate: 'Trend Line<extra></extra>'
    });
  }
  
  // Prepare annotations for R² and p-value
  const annotations = [];
  if (trendLine && isFinite(trendLine.rSquared)) {
    let annotationText = `R² = ${trendLine.rSquared.toFixed(3)}`;
    if (trendLine.pValue !== null && isFinite(trendLine.pValue)) {
      // Format p-value: show scientific notation if very small
      let pValText;
      if (trendLine.pValue < 0.001) {
        pValText = trendLine.pValue.toExponential(2);
      } else {
        pValText = trendLine.pValue.toFixed(3);
      }
      annotationText += `<br>p = ${pValText}`;
    }
    annotations.push({
      text: annotationText,
      showarrow: false,
      font: {
        color: trendColor,
        size: 14
      },
      xref: 'paper',
      yref: 'paper',
      x: 0.05,
      y: 0.95,
      xanchor: 'left',
      yanchor: 'top'
    });
  }
  
  Plotly.react(container, traces, {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: "Structural Vulnerability Index",
      type: 'linear'
    }, 
    yaxis: { 
      title: "2022 Cumulative Excess (ASMR per 100k)",
      type: 'linear'
    },
    margin: { t: 20, r: 10, b: 50, l: 70 },
    showlegend: false,
    annotations: annotations
  }, { responsive: true, displayModeBar: true });
  
  // Also render residual plot
  renderCompositeIndexResidualPlot2022(scatterData, regression);
}

// Render residual plot for composite index regression (2022)
function renderCompositeIndexResidualPlot2022(scatterData, regression) {
  const container = document.getElementById('compositeIndexResidualChart2022');
  if (!container || !regression || !scatterData || scatterData.length === 0) {
    if (container && (!regression || !scatterData || scatterData.length === 0)) {
      Plotly.react(container, [], {
        paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: { title: "Structural Vulnerability Index (Predicted)" },
        yaxis: { title: "Residual (Actual - Predicted)" },
        margin: { t: 20, r: 10, b: 50, l: 70 },
      }, { responsive: true, displayModeBar: false });
    }
    return;
  }
  
  // Calculate predicted values and residuals
  const predictedValues = scatterData.map(d => regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp));
  const actualValues = scatterData.map(d => d.excess2022);
  const residuals = actualValues.map((actual, i) => actual - predictedValues[i]);
  
  // Create residual plot trace
  const trace = {
    x: predictedValues,
    y: residuals,
    mode: 'markers',
    type: 'scatter',
    showlegend: false,
    text: scatterData.map(d => d.name),
    marker: {
      size: 10,
      color: 'rgba(96, 165, 250, 0.7)',
      line: { width: 1.5, color: 'rgba(96, 165, 250, 1)' }
    },
    hovertemplate: '<b>%{text}</b><br>' +
                   'Predicted: %{x:.1f}<br>' +
                   'Residual: %{y:.1f}<extra></extra>'
  };
  
  // Add horizontal line at y=0
  const zeroLine = {
    x: [Math.min(...predictedValues), Math.max(...predictedValues)],
    y: [0, 0],
    mode: 'lines',
    type: 'scatter',
    showlegend: false,
    line: {
      color: 'rgba(255, 100, 100, 0.6)',
      width: 1,
      dash: 'dash'
    },
    hovertemplate: 'Zero Line<extra></extra>'
  };
  
  Plotly.react(container, [trace, zeroLine], {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: "Structural Vulnerability Index (Predicted)",
      type: 'linear'
    }, 
    yaxis: { 
      title: "Residual (Actual - Predicted)",
      type: 'linear'
    },
    margin: { t: 20, r: 10, b: 50, l: 70 },
    showlegend: false
  }, { responsive: true, displayModeBar: true });
}

// Render scatterplot of 2021 Cumulative Excess vs Composite Index
function renderCompositeIndexScatterplot2021(filteredTraces) {
  const container = document.getElementById('compositeIndexScatterplotChart2021');
  if (!container) {
    console.log("compositeIndexScatterplotChart2021 container not found");
    return;
  }
  
  // Get 2021 cumulative excess data (use same logic as summary table)
  const year2021 = new Date('2021-01-01T00:00:00Z');
  const scatterData = [];
  
  filteredTraces.forEach((trace) => {
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.originalRows) return;
    
    // Get 2019 ASMR
    const avgASMR = calculateAverageASMR(metadata.originalRows, '2019');
    if (avgASMR === null || !isFinite(avgASMR)) return;
    
    // Get all factors - we'll allow missing values for some factors but need at least ASMR
    const gdp = gdpNominal2019[metadata.country];
    const gini = gini2019[metadata.country];
    const poverty = poverty2019[metadata.country];
    const healthExp = healthExpenditure2019[metadata.country];
    
    // Get 2021 cumulative excess (use exact same logic as updateSummaryTable)
    let cumulativeExcess = null;
    let minDiff = Infinity;
    
    trace.x.forEach((date, idx) => {
      if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
        const diff = Math.abs(date - year2021);
        if (diff < minDiff && date <= year2021) {
          minDiff = diff;
          cumulativeExcess = trace.y[idx];
        }
      }
    });
    
    // If no value found before 2021-01-01, find the closest value overall
    if (cumulativeExcess === null || minDiff > 365 * 24 * 60 * 60 * 1000) {
      trace.x.forEach((date, idx) => {
        if (trace.y[idx] !== null && isFinite(trace.y[idx])) {
          const diff = Math.abs(date - year2021);
          if (diff < minDiff) {
            minDiff = diff;
            cumulativeExcess = trace.y[idx];
          }
        }
      });
    }
    
    if (cumulativeExcess !== null && isFinite(cumulativeExcess)) {
      scatterData.push({
        name: trace.name,
        country: metadata.country,
        asmr: avgASMR,
        gdp: gdp,
        gini: gini,
        poverty: poverty,
        healthExp: healthExp,
        excess2021: cumulativeExcess
      });
    }
  });
  
  if (scatterData.length < 6) {
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Structural Vulnerability Index" },
      yaxis: { title: "2021 Cumulative Excess (ASMR per 100k)" },
      margin: { t: 20, r: 10, b: 50, l: 70 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Fit multiple regression with all factors: excess2021 = b0 + b1*ASMR + b2*GDP + b3*GINI + b4*POVERTY + b5*HEALTH_EXP
  const asmrData = scatterData.map(d => d.asmr);
  const gdpData = scatterData.map(d => d.gdp);
  const giniData = scatterData.map(d => d.gini);
  const povertyData = scatterData.map(d => d.poverty);
  const healthExpData = scatterData.map(d => d.healthExp);
  const excessData = scatterData.map(d => d.excess2021);
  
  const regression = fitMultipleRegression5(
    asmrData, 
    gdpData, 
    giniData, 
    povertyData, 
    healthExpData, 
    excessData
  );
  
  if (!regression) {
    console.error("Failed to fit regression");
    return;
  }
  
  console.log("Multiple regression coefficients (2021):", regression.coefficients);
  console.log("Multiple regression R² (2021):", regression.rSquared);
  
  // Create composite index: predicted value from regression
  const compositeIndices = scatterData.map(d => 
    regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp)
  );
  
  const xData = compositeIndices;
  const yData = excessData;
  
  // Create scatter plot trace
  const trace = {
    x: xData,
    y: yData,
    mode: 'markers',
    type: 'scatter',
    showlegend: false,
    text: scatterData.map(d => d.name),
    marker: {
      size: 10,
      color: 'rgba(96, 165, 250, 0.7)',
      line: { width: 1.5, color: 'rgba(96, 165, 250, 1)' }
    },
    hovertemplate: '<b>%{text}</b><br>' +
                   'Structural Vulnerability Index: %{x:.1f}<br>' +
                   '2021 Cumulative Excess: %{y:.1f}<extra></extra>'
  };
  
  // Fit trend line for the scatterplot
  const trendLine = fitPolynomialTrend(xData, yData, 1); // Linear trend
  const traces = [trace];
  
  const trendColor = 'rgba(255, 100, 100, 0.8)';
  
  if (trendLine) {
    traces.push({
      x: trendLine.x,
      y: trendLine.y,
      mode: 'lines',
      type: 'scatter',
      showlegend: false,
      line: {
        color: trendColor,
        width: 2,
        dash: 'solid'
      },
      hovertemplate: 'Trend Line<extra></extra>'
    });
  }
  
  // Prepare annotations for R² and p-value
  const annotations = [];
  if (trendLine && isFinite(trendLine.rSquared)) {
    let annotationText = `R² = ${trendLine.rSquared.toFixed(3)}`;
    if (trendLine.pValue !== null && isFinite(trendLine.pValue)) {
      // Format p-value: show scientific notation if very small
      let pValText;
      if (trendLine.pValue < 0.001) {
        pValText = trendLine.pValue.toExponential(2);
      } else {
        pValText = trendLine.pValue.toFixed(3);
      }
      annotationText += `<br>p = ${pValText}`;
    }
    annotations.push({
      text: annotationText,
      showarrow: false,
      font: {
        color: trendColor,
        size: 14
      },
      xref: 'paper',
      yref: 'paper',
      x: 0.05,
      y: 0.95,
      xanchor: 'left',
      yanchor: 'top'
    });
  }
  
  Plotly.react(container, traces, {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: "Structural Vulnerability Index",
      type: 'linear'
    }, 
    yaxis: { 
      title: "2021 Cumulative Excess (ASMR per 100k)",
      type: 'linear'
    },
    margin: { t: 20, r: 10, b: 50, l: 70 },
    showlegend: false,
    annotations: annotations
  }, { responsive: true, displayModeBar: true });
  
  // Also render residual plot
  renderCompositeIndexResidualPlot2021(scatterData, regression);
}

// Render residual plot for composite index regression (2021)
function renderCompositeIndexResidualPlot2021(scatterData, regression) {
  const container = document.getElementById('compositeIndexResidualChart2021');
  if (!container || !regression || !scatterData || scatterData.length === 0) {
    if (container && (!regression || !scatterData || scatterData.length === 0)) {
      Plotly.react(container, [], {
        paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: { title: "Structural Vulnerability Index (Predicted)" },
        yaxis: { title: "Residual (Actual - Predicted)" },
        margin: { t: 20, r: 10, b: 50, l: 70 },
      }, { responsive: true, displayModeBar: false });
    }
    return;
  }
  
  // Calculate predicted values and residuals
  const predictedValues = scatterData.map(d => regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp));
  const actualValues = scatterData.map(d => d.excess2021);
  const residuals = actualValues.map((actual, i) => actual - predictedValues[i]);
  
  // Create residual plot trace
  const trace = {
    x: predictedValues,
    y: residuals,
    mode: 'markers',
    type: 'scatter',
    showlegend: false,
    text: scatterData.map(d => d.name),
    marker: {
      size: 10,
      color: 'rgba(96, 165, 250, 0.7)',
      line: { width: 1.5, color: 'rgba(96, 165, 250, 1)' }
    },
    hovertemplate: '<b>%{text}</b><br>' +
                   'Predicted: %{x:.1f}<br>' +
                   'Residual: %{y:.1f}<extra></extra>'
  };
  
  // Add horizontal line at y=0
  const zeroLine = {
    x: [Math.min(...predictedValues), Math.max(...predictedValues)],
    y: [0, 0],
    mode: 'lines',
    type: 'scatter',
    showlegend: false,
    line: {
      color: 'rgba(255, 100, 100, 0.6)',
      width: 1,
      dash: 'dash'
    },
    hovertemplate: 'Zero Line<extra></extra>'
  };
  
  Plotly.react(container, [trace, zeroLine], {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: "Structural Vulnerability Index (Predicted)",
      type: 'linear'
    }, 
    yaxis: { 
      title: "Residual (Actual - Predicted)",
      type: 'linear'
    },
    margin: { t: 20, r: 10, b: 50, l: 70 },
    showlegend: false
  }, { responsive: true, displayModeBar: true });
}

// Render residuals scatterplot (residual vs residual)
function renderResidualsScatterplot(filteredTraces, yearValue) {
  const container = document.getElementById('residualsScatterplotChart');
  if (!container) return;
  
  // Get selected factors from dropdowns
  const xAxisFactorSelect = document.getElementById('residualXAxisFactor');
  const yAxisFactorSelect = document.getElementById('residualYAxisFactor');
  const xAxisFactor = xAxisFactorSelect ? xAxisFactorSelect.value : '2019';
  const yAxisFactor = yAxisFactorSelect ? yAxisFactorSelect.value : 'gdp';
  
  // Parse year value
  const isIsolated = yearValue.includes('-isolated');
  const selectedYear = parseInt(yearValue.replace('-isolated', ''));
  
  // Get axis labels
  const xAxisLabel = getFactorLabel(xAxisFactor);
  const yAxisLabel = getFactorLabel(yAxisFactor);
  
  // Helper function to get factor label
  function getFactorLabel(factor) {
    if (factor === 'gdp') return 'GDP (Nominal) per Capita';
    if (factor === 'gini') return 'Inequality (GINI)';
    if (factor === 'poverty') return 'Poverty (% living below line)';
    if (factor === 'health_expenditure') return 'Health Expenditure (%GDP)';
    return '2019 ASMR';
  }
  
  // Prepare data for X-axis factor scatterplot
  const xAxisData = [];
  filteredTraces.forEach((trace) => {
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.originalRows) return;
    
    // Get X-axis value based on factor
    const xValue = getXAxisValue(metadata.country, metadata.originalRows, xAxisFactor);
    if (xValue === null || !isFinite(xValue)) return;
    
    // Get excess value (cumulative or isolated) using helper function
    const excessResult = getExcessValue(yearValue, trace);
    if (excessResult && excessResult.excess !== null && isFinite(excessResult.excess)) {
      xAxisData.push({
        x: xValue,
        y: excessResult.excess,
        name: trace.name,
        country: metadata.country
      });
    }
  });
  
  // Prepare data for Y-axis factor scatterplot
  const yAxisData = [];
  filteredTraces.forEach((trace) => {
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.originalRows) return;
    
    // Get Y-axis value based on factor
    const yValue = getXAxisValue(metadata.country, metadata.originalRows, yAxisFactor);
    if (yValue === null || !isFinite(yValue)) return;
    
    // Get excess value (cumulative or isolated) using helper function
    const excessResult = getExcessValue(yearValue, trace);
    if (excessResult && excessResult.excess !== null && isFinite(excessResult.excess)) {
      yAxisData.push({
        x: yValue,
        y: excessResult.excess,
        name: trace.name,
        country: metadata.country
      });
    }
  });
  
  if (xAxisData.length === 0 || yAxisData.length === 0) {
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: `Residual (from ${xAxisLabel} trend)` }, 
      yaxis: { title: `Residual (from ${yAxisLabel} trend)` },
      margin: { t: 20, r: 10, b: 50, l: 70 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Fit trend lines
  const xAxisX = xAxisData.map(d => d.x);
  const xAxisY = xAxisData.map(d => d.y);
  const xAxisTrendLine = fitPolynomialTrend(xAxisX, xAxisY, 2);
  
  const yAxisX = yAxisData.map(d => d.x);
  const yAxisY = yAxisData.map(d => d.y);
  const yAxisTrendLine = fitPolynomialTrend(yAxisX, yAxisY, 2);
  
  if (!xAxisTrendLine || !xAxisTrendLine.coefficients || 
      !yAxisTrendLine || !yAxisTrendLine.coefficients) {
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: `Residual (from ${xAxisLabel} trend)` }, 
      yaxis: { title: `Residual (from ${yAxisLabel} trend)` },
      margin: { t: 20, r: 10, b: 50, l: 70 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  // Calculate residuals for each country
  const residualsData = [];
  
  // Create maps for faster lookup
  const xAxisMap = new Map(xAxisData.map(d => [d.name, d]));
  const yAxisMap = new Map(yAxisData.map(d => [d.name, d]));
  
  // Find countries that appear in both datasets
  const commonCountries = new Set();
  xAxisMap.forEach((_, name) => {
    if (yAxisMap.has(name)) {
      commonCountries.add(name);
    }
  });
  
  commonCountries.forEach(countryName => {
    const xAxisPoint = xAxisMap.get(countryName);
    const yAxisPoint = yAxisMap.get(countryName);
    
    const xAxisPredicted = predictValue(xAxisPoint.x, xAxisTrendLine.coefficients);
    const xAxisResidual = xAxisPoint.y - xAxisPredicted;
    
    const yAxisPredicted = predictValue(yAxisPoint.x, yAxisTrendLine.coefficients);
    const yAxisResidual = yAxisPoint.y - yAxisPredicted;
    
    residualsData.push({
      x: xAxisResidual,
      y: yAxisResidual,
      name: countryName
    });
  });
  
  if (residualsData.length === 0) {
    Plotly.react(container, [], {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: `Residual (from ${xAxisLabel} trend)` }, 
      yaxis: { title: `Residual (from ${yAxisLabel} trend)` },
      margin: { t: 20, r: 10, b: 50, l: 70 },
    }, { responsive: true, displayModeBar: false });
    return;
  }
  
  const xData = residualsData.map(d => d.x);
  const yData = residualsData.map(d => d.y);
  
  // Create scatter plot trace
  const trace = {
    x: xData,
    y: yData,
    mode: 'markers',
    type: 'scatter',
    showlegend: false,
    text: residualsData.map(d => d.name),
    marker: {
      size: 10,
      color: 'rgba(96, 165, 250, 0.7)',
      line: { width: 1.5, color: 'rgba(96, 165, 250, 1)' }
    },
    hovertemplate: '<b>%{text}</b><br>' +
                   `${xAxisLabel} Residual: %{x:.1f}<br>` +
                   `${yAxisLabel} Residual: %{y:.1f}<extra></extra>`
  };
  
  // Fit linear trend line (allow negative values for residuals)
  const residualTrendLine = fitPolynomialTrend(xData, yData, 1, true); // Degree 1 = linear, allowNegative = true
  const traces = [trace];
  
  // Trend line color
  const trendColor = 'rgba(255, 100, 100, 0.8)';
  
  const annotations = [];
  
  if (residualTrendLine && residualTrendLine.coefficients) {
    traces.push({
      x: residualTrendLine.x,
      y: residualTrendLine.y,
      mode: 'lines',
      type: 'scatter',
      showlegend: false,
      line: {
        color: trendColor,
        width: 2,
        dash: 'solid'
      },
      hovertemplate: 'Trend Line<extra></extra>'
    });
    
    // Add R² annotation
    if (isFinite(residualTrendLine.rSquared)) {
      annotations.push({
        text: `R² = ${residualTrendLine.rSquared.toFixed(3)}`,
        showarrow: false,
        font: {
          color: trendColor,
          size: 14
        },
        xref: 'paper',
        yref: 'paper',
        x: 0.05,
        y: 0.95,
        xanchor: 'left',
        yanchor: 'top'
      });
    }
  }
  
  Plotly.react(container, traces, {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { 
      title: `Residual (from ${xAxisLabel} trend)`,
      type: 'linear'
    }, 
    yaxis: { 
      title: `Residual (from ${yAxisLabel} trend)`,
      type: 'linear'
    },
    margin: { t: 20, r: 10, b: 50, l: 70 },
    showlegend: false,
    annotations: annotations
  }, { responsive: true, displayModeBar: true });
}

// Update residuals table
function updateResidualsTable(scatterData, trendLine, xAxisLabel = 'X Axis') {
  const container = document.getElementById('residualsTable');
  if (!container) return;
  
  if (!trendLine || !trendLine.coefficients || scatterData.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  // Calculate residuals for each country
  const residuals = scatterData.map(d => {
    const predicted = predictValue(d.x, trendLine.coefficients);
    const residual = d.y - predicted;
    return {
      name: d.name,
      x: d.x,
      y: d.y,
      predicted: predicted,
      residual: residual
    };
  });
  
  // Sort by residual (descending - largest positive residuals first)
  residuals.sort((a, b) => b.residual - a.residual);
  
  // Create table
  let html = '<table class="summary-table"><thead><tr>';
  html += '<th>#</th>';
  html += '<th>Country</th>';
  html += `<th>${xAxisLabel}</th>`;
  html += '<th>Observed</th>';
  html += '<th>Predicted</th>';
  html += '<th class="sortable">Residual <span class="sort-indicator"></span></th>';
  html += '</tr></thead><tbody>';
  
  residuals.forEach((row, index) => {
    html += `<tr>`;
    html += `<td>${index + 1}</td>`;
    html += `<td>${row.name}</td>`;
    // Format X-axis value based on type
    let xDisplay = row.x.toFixed(1);
    if (xAxisLabel.includes('GDP') || xAxisLabel.includes('per Capita')) {
      xDisplay = row.x.toLocaleString('en-US', { maximumFractionDigits: 0 });
    } else if (xAxisLabel.includes('%')) {
      xDisplay = row.x.toFixed(2);
    } else {
      xDisplay = row.x.toFixed(1);
    }
    html += `<td>${xDisplay}</td>`;
    html += `<td>${row.y.toFixed(1)}</td>`;
    html += `<td>${row.predicted.toFixed(1)}</td>`;
    html += `<td>${row.residual.toFixed(1)}</td>`;
    html += `</tr>`;
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

function showDedicatedTraceDetails(traceIndex) {
  if (traceIndex >= state.dedicatedPermanentTraceMetadata.length) return;
  
  const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
  const detailsDiv = document.getElementById("permanentPlotTraceDetails");
  const traceInfoDiv = document.getElementById("permanentPlotTraceInfo");
  const asmrChartDiv = document.getElementById("permanentPlotASMRChart");
  
  traceInfoDiv.innerHTML = `
    <div class="trace-info">
      <p><strong>Country:</strong> ${metadata.country}</p>
      <p><strong>Sex:</strong> ${metadata.sex}</p>
      <p><strong>Baseline Type:</strong> ${metadata.baselineType}</p>
      <p><strong>Baseline Range:</strong> ${metadata.baselineFrom.year}-W${String(metadata.baselineFrom.week).padStart(2, '0')} to ${metadata.baselineTo.year}-W${String(metadata.baselineTo.week).padStart(2, '0')}</p>
    </div>
  `;
  
  // Use full dataset like the main ASMR vs baseline chart
  const asmr = metadata.originalRows.map(r => r.ASMR100k);
  const dates = metadata.originalRows.map(r => r.date);
  const baseline = metadata.originalBaseline;

  // Recompute seasonal-adjusted baseline for the full series using the same baseline window
  const seasonalBaselineFull = computeBaseline('seasonal', metadata.originalRows, metadata.baselineFrom, metadata.baselineTo);
  const seasonalDeviations = new Map();
  const baselineWindow = getWindow(metadata.originalRows, metadata.baselineFrom, metadata.baselineTo);
  const baselineIndices = new Set(baselineWindow.map(r => metadata.originalRows.indexOf(r)));
  for (let i = 0; i < metadata.originalRows.length; i++) {
    if (!baselineIndices.has(i)) continue;
    const row = metadata.originalRows[i];
    const wk = row.week_key;
    const seasonal = seasonalBaselineFull[i];
    const trend = baseline[i];
    if (isFinite(seasonal) && isFinite(trend) && wk !== "W53") {
      if (!seasonalDeviations.has(wk)) seasonalDeviations.set(wk, []);
      seasonalDeviations.get(wk).push(seasonal - trend);
    }
  }
  const weekDeviations = new Map();
  for (const [wk, arr] of seasonalDeviations) {
    if (arr.length > 0) weekDeviations.set(wk, arr.reduce((a,b)=>a+b,0)/arr.length);
  }
  const seasonalAdjusted = metadata.originalRows.map((r, i) => {
    const trend = baseline[i];
    const wk = r.week_key;
    if (isFinite(trend)) {
      const dev = weekDeviations.get(wk) || (wk === "W53" ? weekDeviations.get("W52") || 0 : 0);
      return trend + dev;
    }
    return trend;
  });

  // Determine baseline label based on baseline type
  let baselineLabel;
  if (metadata.baselineType === 'glm') baselineLabel = 'GLM Baseline';
  else if (metadata.baselineType === 'quasi_poisson') baselineLabel = 'QPR Baseline';
  else baselineLabel = `${metadata.baselineType.charAt(0).toUpperCase() + metadata.baselineType.slice(1)} Baseline`;

  const traces = [
    {
      x: dates,
      y: asmr,
      name: "ASMR (100k)",
      mode: "lines",
      line: { width: 3 }
    },
    {
      x: dates,
      y: baseline,
      name: baselineLabel,
      mode: "lines",
      line: { dash: "dash", width: 2 }
    },
    {
      x: dates,
      y: seasonalAdjusted,
      name: "Seasonal-adjusted baseline",
      mode: "lines",
      line: { dash: "solid", width: 2 }
    }
  ];
  
  Plotly.react(asmrChartDiv, traces, {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { title: "Date" }, yaxis: { title: "ASMR per 100k" },
    margin: { t: 20, r: 10, b: 40, l: 50 },
    title: `ASMR vs Baseline - ${metadata.country} (${metadata.sex})`
  }, { responsive: true, displayModeBar: true });
  
  detailsDiv.style.display = "block";
}


function addToDedicatedPermanentPlot(rows, baseline, startDate, country, sex, baselineFrom, baselineTo, baselineType = 'seasonal') {
  console.log(`Adding trace for ${country} (${sex})`);
  const year2020 = new Date('2020-01-01T00:00:00Z');
  
  const filteredRows = rows.filter(r => r.date >= year2020);
  const filteredBaseline = baseline.filter((_, i) => rows[i].date >= year2020);
  
  console.log(`Filtered rows: ${filteredRows.length}, baseline: ${filteredBaseline.length}`);
  
  const startIdx = filteredRows.findIndex(r => r.date >= startDate);
  let cum = 0;
  const xs = [], ys = [];
  
  for (let i=0;i<filteredRows.length;i++) {
    if (i >= startIdx && isFinite(filteredBaseline[i]) && isFinite(filteredRows[i].ASMR100k)) {
      // ASMR is annualized (per person-year), so divide by 52 to get weekly contribution
      cum += (filteredRows[i].ASMR100k - filteredBaseline[i]) / 52;
    }
    
    xs.push(filteredRows[i].date);
    ys.push(i >= startIdx ? cum : null);
  }
  
  const validYs = ys.filter(y => y !== null && isFinite(y));
  console.log(`Valid Y values: ${validYs.length} out of ${ys.length}`);
  
  const countryName = countryNames[country] || country;
  const trace = {
    x: xs,
    y: ys,
    mode: "lines",
    name: countryName,
    line: { width: 2 }
  };
  
  // Use the same user-selected baseline window for seasonal computation
  const seasonalBaseline = computeBaseline('seasonal', rows, baselineFrom, baselineTo);
  const filteredSeasonalBaseline = seasonalBaseline.filter((_, i) => rows[i].date >= year2020);
  
  const seasonalDeviations = new Map();
  const baselineWindow = getWindow(rows, baselineFrom, baselineTo);
  const baselineIndices = new Set(baselineWindow.map(r => rows.indexOf(r)));
  
  for (let i = 0; i < rows.length; i++) {
    if (!baselineIndices.has(i)) continue;
    
    const row = rows[i];
    const weekKey = row.week_key;
    const seasonal = seasonalBaseline[i];
    const trend = baseline[i];
    
    if (isFinite(seasonal) && isFinite(trend) && weekKey !== "W53") {
      if (!seasonalDeviations.has(weekKey)) seasonalDeviations.set(weekKey, []);
      seasonalDeviations.get(weekKey).push(seasonal - trend);
    }
  }
  
  const weekDeviations = new Map();
  for (const [week, deviations] of seasonalDeviations) {
    if (deviations.length > 0) {
      weekDeviations.set(week, deviations.reduce((a,b) => a+b, 0) / deviations.length);
    }
  }
  
  const seasonalAdjusted = rows.map((r, i) => {
    const trend = baseline[i];
    const weekKey = r.week_key;
    
    if (isFinite(trend)) {
      const seasonalDeviation = weekDeviations.get(weekKey) || 
                               (weekKey === "W53" ? weekDeviations.get("W52") || 0 : 0);
      return trend + seasonalDeviation;
    }
    return trend;
  });
  const filteredSeasonalAdjusted = seasonalAdjusted.filter((_, i) => rows[i].date >= year2020);
  
  const metadata = {
    country,
    sex,
    rows: filteredRows,
    baseline: filteredBaseline,
    seasonalAdjusted: filteredSeasonalAdjusted,
    startDate,
    originalRows: rows,
    originalBaseline: baseline,
    baselineFrom: baselineFrom,
    baselineTo: baselineTo,
    baselineType: baselineType
  };
  
  state.dedicatedPermanentTraces.push(trace);
  state.dedicatedPermanentTraceMetadata.push(metadata);
  
  console.log(`Added trace for ${country} (${sex}), total traces: ${state.dedicatedPermanentTraces.length}`);
}

function calculateRMSE(actual, predicted) {
  const errors = [];
  for (let i = 0; i < actual.length; i++) {
    if (isFinite(actual[i]) && isFinite(predicted[i])) {
      errors.push((actual[i] - predicted[i]) ** 2);
    }
  }
  if (errors.length === 0) return Infinity;
  return Math.sqrt(errors.reduce((a, b) => a + b, 0) / errors.length);
}



function setupControls() {
  // Aggregation selector
  const permanentPlotAggregation = document.getElementById("permanentPlotAggregation");
  if (permanentPlotAggregation) {
    permanentPlotAggregation.addEventListener("change", () => {
      renderDedicatedPermanentChart(document.getElementById("permanentPlotChart"));
      renderCountryComparisonChart(); // Also update comparison chart
    });
  }
  
  // Scatterplot controls
  const scatterplotYearSelect = document.getElementById("scatterplotYearSelect");
  const asmrYearRange = document.getElementById("asmrYearRange");
  const logXAxis = document.getElementById("logXAxis");
  const logYAxis = document.getElementById("logYAxis");
  
  const updateScatterplot = () => {
    // Get current filtered traces to re-render scatterplot
    const activeClusters = state.selectedClusters;
    const hasActive = activeClusters && activeClusters.size > 0;
    const hasManual = state.manualSelectedCountries && state.manualSelectedCountries.size > 0;
    
    let filteredTraces = state.dedicatedPermanentTraces.filter((trace, index) => {
      const metadata = state.dedicatedPermanentTraceMetadata[index];
      if (!hasActive && !hasManual) return false;
      const inCluster = hasActive ? activeClusters.has(countryClusters[metadata.country]) : false;
      const inManual = hasManual ? state.manualSelectedCountries.has(metadata.country) : false;
      return inCluster || inManual;
    });
    
    renderScatterplot(filteredTraces);
  };
  
  if (scatterplotYearSelect) {
    scatterplotYearSelect.addEventListener("change", updateScatterplot);
  }
  if (asmrYearRange) {
    asmrYearRange.addEventListener("change", updateScatterplot);
  }
  if (logXAxis) {
    logXAxis.addEventListener("change", updateScatterplot);
  }
  if (logYAxis) {
    logYAxis.addEventListener("change", updateScatterplot);
  }
  
  // Composite index year selector
  const compositeIndexYearSelect = document.getElementById('compositeIndexYearSelect');
  if (compositeIndexYearSelect) {
    compositeIndexYearSelect.addEventListener("change", () => {
      // Get current filtered traces to re-render composite index scatterplot
      const activeClusters = state.selectedClusters;
      const hasActive = activeClusters && activeClusters.size > 0;
      const hasManual = state.manualSelectedCountries && state.manualSelectedCountries.size > 0;
      
      let filteredTraces = state.dedicatedPermanentTraces.filter((trace, index) => {
        const metadata = state.dedicatedPermanentTraceMetadata[index];
        if (!hasActive && !hasManual) return false;
        const inCluster = hasActive ? activeClusters.has(countryClusters[metadata.country]) : false;
        const inManual = hasManual ? state.manualSelectedCountries.has(metadata.country) : false;
        return inCluster || inManual;
      });
      
      renderCompositeIndexScatterplot(filteredTraces);
      
      // Also update residual evolution plot
      const residualTypeSelect = document.getElementById('residualEvolutionTypeSelect');
      const residualType = residualTypeSelect ? residualTypeSelect.value : 'cumulative';
      const modeSelect = document.getElementById('compositeIndexModeSelect');
      const mode = modeSelect ? modeSelect.value : 'dynamic';
      renderCompositeIndexResidualEvolution(filteredTraces, mode, residualType);
    });
  }
  
  // Residual evolution type selector
  const residualEvolutionTypeSelect = document.getElementById('residualEvolutionTypeSelect');
  if (residualEvolutionTypeSelect) {
    residualEvolutionTypeSelect.addEventListener("change", () => {
      // Get current filtered traces to re-render residual evolution plot
      const activeClusters = state.selectedClusters;
      const hasActive = activeClusters && activeClusters.size > 0;
      const hasManual = state.manualSelectedCountries && state.manualSelectedCountries.size > 0;
      
      let filteredTraces = state.dedicatedPermanentTraces.filter((trace, index) => {
        const metadata = state.dedicatedPermanentTraceMetadata[index];
        if (!hasActive && !hasManual) return false;
        const inCluster = hasActive ? activeClusters.has(countryClusters[metadata.country]) : false;
        const inManual = hasManual ? state.manualSelectedCountries.has(metadata.country) : false;
        return inCluster || inManual;
      });
      
      // Get current mode
      const modeSelect = document.getElementById('compositeIndexModeSelect');
      const mode = modeSelect ? modeSelect.value : 'dynamic';
      
      // Get selected residual type
      const residualType = residualEvolutionTypeSelect.value;
      
      renderCompositeIndexResidualEvolution(filteredTraces, mode, residualType);
    });
  }
  
  // Composite index mode selector
  const compositeIndexModeSelect = document.getElementById('compositeIndexModeSelect');
  if (compositeIndexModeSelect) {
    compositeIndexModeSelect.addEventListener("change", (e) => {
      const selectedMode = e.target.value;
      console.log(`Index mode changed to: ${selectedMode}`);
      
      // Get current filtered traces to re-render composite index scatterplot
      const activeClusters = state.selectedClusters;
      const hasActive = activeClusters && activeClusters.size > 0;
      const hasManual = state.manualSelectedCountries && state.manualSelectedCountries.size > 0;
      
      let filteredTraces = state.dedicatedPermanentTraces.filter((trace, index) => {
        const metadata = state.dedicatedPermanentTraceMetadata[index];
        if (!hasActive && !hasManual) return false;
        const inCluster = hasActive ? activeClusters.has(countryClusters[metadata.country]) : false;
        const inManual = hasManual ? state.manualSelectedCountries.has(metadata.country) : false;
        return inCluster || inManual;
      });
      
      console.log(`Rendering with ${filteredTraces.length} filtered traces`);
      renderCompositeIndexScatterplot(filteredTraces);
      
      // Also update residual evolution plot
      const residualTypeSelect = document.getElementById('residualEvolutionTypeSelect');
      const residualType = residualTypeSelect ? residualTypeSelect.value : 'cumulative';
      renderCompositeIndexResidualEvolution(filteredTraces, selectedMode, residualType);
    });
  } else {
    console.error("compositeIndexModeSelect not found");
  }
  
  // Residual-residual plot factor selectors
  const residualYearSelect = document.getElementById('residualYearSelect');
  const residualXAxisFactor = document.getElementById('residualXAxisFactor');
  const residualYAxisFactor = document.getElementById('residualYAxisFactor');
  const updateResidualsPlot = () => {
    // Get current filtered traces
    const activeClusters = state.selectedClusters;
    const hasActive = activeClusters && activeClusters.size > 0;
    const hasManual = state.manualSelectedCountries && state.manualSelectedCountries.size > 0;
    
    let filteredTraces = state.dedicatedPermanentTraces.filter((trace, index) => {
      const metadata = state.dedicatedPermanentTraceMetadata[index];
      if (!hasActive && !hasManual) return false;
      const inCluster = hasActive ? activeClusters.has(countryClusters[metadata.country]) : false;
      const inManual = hasManual ? state.manualSelectedCountries.has(metadata.country) : false;
      return inCluster || inManual;
    });
    
    // Get selected year from dropdown
    const yearValue = residualYearSelect ? residualYearSelect.value : '2025';
    
    renderResidualsScatterplot(filteredTraces, yearValue);
  };
  
  if (residualYearSelect) {
    residualYearSelect.addEventListener("change", updateResidualsPlot);
  }
  if (residualXAxisFactor) {
    residualXAxisFactor.addEventListener("change", updateResidualsPlot);
  }
  if (residualYAxisFactor) {
    residualYAxisFactor.addEventListener("change", updateResidualsPlot);
  }
  
  // Build datalist options for countries
  const countryList = document.getElementById('countryList');
  if (countryList && countryList.children.length === 0) {
    // Only include countries present in data
    const presentCodes = Array.from(state.countries);
    const options = presentCodes
      .map(code => ({ code, name: countryNames[code] || code }))
      .sort((a,b) => a.name.localeCompare(b.name));
    options.forEach(({code, name}) => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.setAttribute('data-code', code);
      countryList.appendChild(opt);
    });
  }

  // Filter buttons (multi-select clusters)
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const label = (button.textContent || '').trim();
      if (label === 'All') {
        const wasActiveAll = button.classList.contains('active');
        if (wasActiveAll) {
          // Turn All off -> blank chart (unless manual)
          button.classList.remove('active');
          state.selectedClusters = new Set();
        } else {
          // Turn All on -> select all clusters, turn other cluster buttons off
          button.classList.add('active');
          state.selectedClusters = new Set(['Cluster 1','Cluster 2','Cluster 3','Cluster 4']);
          filterButtons.forEach(btn => {
            if ((btn.textContent || '').trim() !== 'All') btn.classList.remove('active');
          });
        }
      } else {
        // FIRST: Always turn off All when clicking individual clusters
        filterButtons.forEach(btn => {
          if ((btn.textContent || '').trim() === 'All') btn.classList.remove('active');
        });
        
        // THEN: Toggle cluster selection
        const wasActive = button.classList.contains('active');
        if (wasActive) {
          button.classList.remove('active');
          state.selectedClusters.delete(label);
        } else {
          button.classList.add('active');
          state.selectedClusters.add(label);
        }
        // If none selected and no manual, leave blank
      }
      renderDedicatedPermanentChart(document.getElementById("permanentPlotChart"));
    });
  });

  // Add country via + button
  const addBtn = document.getElementById('addCountryBtn');
  const addInput = document.getElementById('addCountryInput');
  if (addBtn && addInput) {
    addBtn.addEventListener('click', () => {
      const name = (addInput.value || '').trim();
      if (!name) return;
      // Map name back to code
      const code = Object.keys(countryNames).find(c => countryNames[c] === name);
      if (code) {
        state.manualSelectedCountries.add(code);
        // Ensure at least one cluster selected or manual exists to filter
        // Re-render chart
        renderDedicatedPermanentChart(document.getElementById("permanentPlotChart"));
      }
      addInput.value = '';
    });
  }
  
  // Country comparison selectors
  const compareCountry1 = document.getElementById('compareCountry1');
  const compareCountry2 = document.getElementById('compareCountry2');
  
  if (compareCountry1) {
    compareCountry1.addEventListener('change', () => {
      renderCountryComparisonChart();
    });
  }
  
  if (compareCountry2) {
    compareCountry2.addEventListener('change', () => {
      renderCountryComparisonChart();
    });
  }
  
  // QALY multiplier input
  const qalyMultiplierInput = document.getElementById('qalyMultiplier');
  if (qalyMultiplierInput) {
    qalyMultiplierInput.addEventListener('input', () => {
      // Re-render the table when multiplier changes (only if countries are selected)
      const select1 = document.getElementById('compareCountry1');
      const select2 = document.getElementById('compareCountry2');
      if (select1 && select2 && select1.value && select2.value) {
        renderCountryComparisonChart();
      }
    });
  }
  
  // Counterfactual validity type selector
  const counterfactualValidityType = document.getElementById('counterfactualValidityType');
  if (counterfactualValidityType) {
    counterfactualValidityType.addEventListener('change', () => {
      // Re-render comparison chart to update counterfactual validity
      renderCountryComparisonChart();
    });
  }
  
  // Calculate Area Ratios button
  const calculateAreaRatiosBtn = document.getElementById('calculateAreaRatiosBtn');
  if (calculateAreaRatiosBtn) {
    calculateAreaRatiosBtn.addEventListener('click', () => {
      const select1 = document.getElementById('compareCountry1');
      const select2 = document.getElementById('compareCountry2');
      if (select1 && select2 && select1.value && select2.value) {
        const country1Code = select1.value;
        const country2Code = select2.value;
        const country1Name = countryNames[country1Code] || country1Code;
        const country2Name = countryNames[country2Code] || country2Code;
        renderPolicyAreaRatioTable(country1Code, country2Code, country1Name, country2Name);
      } else {
        alert('Please select both countries to calculate area ratios.');
      }
    });
  }
  
  // Policy variable selector
  const policyVariableSelect = document.getElementById('policyVariableSelect');
  if (policyVariableSelect) {
    policyVariableSelect.addEventListener('change', () => {
      // Update description
      updatePolicyVariableDescription(policyVariableSelect.value);
      
      // Re-render policy chart with new variable
      const select1 = document.getElementById('compareCountry1');
      const select2 = document.getElementById('compareCountry2');
      if (select1 && select2 && select1.value && select2.value) {
        const country1Name = countryNames[select1.value] || select1.value;
        const country2Name = countryNames[select2.value] || select2.value;
        renderPolicyComparisonChart(select1.value, select2.value, country1Name, country2Name);
      }
    });
  }
  
  // Explanatory power controls
  const explanatoryPowerVariableSelect = document.getElementById('explanatoryPowerVariableSelect');
  const explanatoryPowerPolicyYearSelect = document.getElementById('explanatoryPowerPolicyYearSelect');
  const explanatoryPowerYearSelect = document.getElementById('explanatoryPowerYearSelect');
  const explanatoryPowerTypeSelect = document.getElementById('explanatoryPowerTypeSelect');
  
  // State for hiding influential points (resets when plot changes)
  let hideInfluentialPoints = false;
  let hideInfluentialPointsResidual = false;
  
  const updateExplanatoryPowerChart = () => {
    // Reset state when switching plots
    hideInfluentialPoints = false;
    
    // Get current filtered traces
    const activeClusters = state.selectedClusters;
    const hasActive = activeClusters && activeClusters.size > 0;
    const hasManual = state.manualSelectedCountries && state.manualSelectedCountries.size > 0;
    
    let filteredTraces = state.dedicatedPermanentTraces.filter((trace, index) => {
      const metadata = state.dedicatedPermanentTraceMetadata[index];
      if (!hasActive && !hasManual) return false;
      const inCluster = hasActive ? activeClusters.has(countryClusters[metadata.country]) : false;
      const inManual = hasManual ? state.manualSelectedCountries.has(metadata.country) : false;
      return inCluster || inManual;
    });
    
    // Get selected parameters
    const yearSelect = document.getElementById('explanatoryPowerYearSelect');
    const typeSelect = document.getElementById('explanatoryPowerTypeSelect');
    const policyYearSelect = document.getElementById('explanatoryPowerPolicyYearSelect');
    const selectedYear = yearSelect ? yearSelect.value : '2025';
    const selectedType = typeSelect ? typeSelect.value : 'cumulative';
    const selectedPolicyYear = policyYearSelect ? policyYearSelect.value : '2021';
    
    // Update description
    const selectedVariable = explanatoryPowerVariableSelect ? explanatoryPowerVariableSelect.value : '';
    const descText = document.getElementById('explanatoryPowerDescriptionText');
    if (descText) {
      descText.textContent = getPolicyVariableDescription(selectedVariable);
    }
    
    renderPolicyExplanatoryPowerChart(filteredTraces, hideInfluentialPoints);
    renderPolicyExplanatoryPowerTable(filteredTraces, selectedYear, selectedType, selectedPolicyYear);
  };
  
  // Button to toggle hiding influential points
  const hideInfluentialPointsBtn = document.getElementById('hideInfluentialPointsBtn');
  if (hideInfluentialPointsBtn) {
    hideInfluentialPointsBtn.addEventListener('click', () => {
      hideInfluentialPoints = !hideInfluentialPoints;
      // Get current filtered traces
      const activeClusters = state.selectedClusters;
      const hasActive = activeClusters && activeClusters.size > 0;
      const hasManual = state.manualSelectedCountries && state.manualSelectedCountries.size > 0;
      
      let filteredTraces = state.dedicatedPermanentTraces.filter((trace, index) => {
        const metadata = state.dedicatedPermanentTraceMetadata[index];
        if (!hasActive && !hasManual) return false;
        const inCluster = hasActive ? activeClusters.has(countryClusters[metadata.country]) : false;
        const inManual = hasManual ? state.manualSelectedCountries.has(metadata.country) : false;
        return inCluster || inManual;
      });
      
      renderPolicyExplanatoryPowerChart(filteredTraces, hideInfluentialPoints);
    });
  }
  
  if (explanatoryPowerVariableSelect) {
    explanatoryPowerVariableSelect.addEventListener('change', updateExplanatoryPowerChart);
  }
  if (explanatoryPowerPolicyYearSelect) {
    explanatoryPowerPolicyYearSelect.addEventListener('change', updateExplanatoryPowerChart);
  }
  if (explanatoryPowerYearSelect) {
    explanatoryPowerYearSelect.addEventListener('change', updateExplanatoryPowerChart);
  }
  if (explanatoryPowerTypeSelect) {
    explanatoryPowerTypeSelect.addEventListener('change', updateExplanatoryPowerChart);
  }
  
  // Residual explanatory power controls
  const residualExplanatoryPowerVariableSelect = document.getElementById('residualExplanatoryPowerVariableSelect');
  const residualExplanatoryPowerPolicyYearSelect = document.getElementById('residualExplanatoryPowerPolicyYearSelect');
  const residualExplanatoryPowerYearSelect = document.getElementById('residualExplanatoryPowerYearSelect');
  const residualExplanatoryPowerTypeSelect = document.getElementById('residualExplanatoryPowerTypeSelect');
  
  const updateResidualExplanatoryPowerChart = () => {
    // Reset state when switching plots
    hideInfluentialPointsResidual = false;
    
    // Get current filtered traces
    const activeClusters = state.selectedClusters;
    const hasActive = activeClusters && activeClusters.size > 0;
    const hasManual = state.manualSelectedCountries && state.manualSelectedCountries.size > 0;
    
    let filteredTraces = state.dedicatedPermanentTraces.filter((trace, index) => {
      const metadata = state.dedicatedPermanentTraceMetadata[index];
      if (!hasActive && !hasManual) return false;
      const inCluster = hasActive ? activeClusters.has(countryClusters[metadata.country]) : false;
      const inManual = hasManual ? state.manualSelectedCountries.has(metadata.country) : false;
      return inCluster || inManual;
    });
    
    // Get selected parameters
    const yearSelect = document.getElementById('residualExplanatoryPowerYearSelect');
    const typeSelect = document.getElementById('residualExplanatoryPowerTypeSelect');
    const policyYearSelect = document.getElementById('residualExplanatoryPowerPolicyYearSelect');
    const selectedYear = yearSelect ? yearSelect.value : '2025';
    const selectedType = typeSelect ? typeSelect.value : 'cumulative';
    const selectedPolicyYear = policyYearSelect ? policyYearSelect.value : '2021';
    
    // Update description
    const selectedVariable = residualExplanatoryPowerVariableSelect ? residualExplanatoryPowerVariableSelect.value : '';
    const descText = document.getElementById('residualExplanatoryPowerDescriptionText');
    if (descText) {
      descText.textContent = getPolicyVariableDescription(selectedVariable);
    }
    
    renderResidualExplanatoryPowerChart(filteredTraces, hideInfluentialPointsResidual);
    renderResidualExplanatoryPowerTable(filteredTraces, selectedYear, selectedType, selectedPolicyYear);
  };
  
  // Button to toggle hiding influential points for residual chart
  const hideInfluentialPointsResidualBtn = document.getElementById('hideInfluentialPointsResidualBtn');
  if (hideInfluentialPointsResidualBtn) {
    hideInfluentialPointsResidualBtn.addEventListener('click', () => {
      hideInfluentialPointsResidual = !hideInfluentialPointsResidual;
      // Get current filtered traces
      const activeClusters = state.selectedClusters;
      const hasActive = activeClusters && activeClusters.size > 0;
      const hasManual = state.manualSelectedCountries && state.manualSelectedCountries.size > 0;
      
      let filteredTraces = state.dedicatedPermanentTraces.filter((trace, index) => {
        const metadata = state.dedicatedPermanentTraceMetadata[index];
        if (!hasActive && !hasManual) return false;
        const inCluster = hasActive ? activeClusters.has(countryClusters[metadata.country]) : false;
        const inManual = hasManual ? state.manualSelectedCountries.has(metadata.country) : false;
        return inCluster || inManual;
      });
      
      renderResidualExplanatoryPowerChart(filteredTraces, hideInfluentialPointsResidual);
    });
  }
  
  if (residualExplanatoryPowerVariableSelect) {
    residualExplanatoryPowerVariableSelect.addEventListener('change', (e) => {
      const selectedVariable = e.target.value;
      const isIMF2021 = selectedVariable && selectedVariable.startsWith('IMF 2021');
      
      if (residualExplanatoryPowerPolicyYearSelect) {
        if (isIMF2021) {
          // Set to NA and disable for IMF 2021 variables
          residualExplanatoryPowerPolicyYearSelect.value = 'NA';
          residualExplanatoryPowerPolicyYearSelect.disabled = true;
        } else {
          // Enable and set to default for OxCGRT variables
          residualExplanatoryPowerPolicyYearSelect.disabled = false;
          if (residualExplanatoryPowerPolicyYearSelect.value === 'NA') {
            residualExplanatoryPowerPolicyYearSelect.value = '2021';
          }
        }
      }
      
      updateResidualExplanatoryPowerChart();
    });
  }
  if (residualExplanatoryPowerPolicyYearSelect) {
    residualExplanatoryPowerPolicyYearSelect.addEventListener('change', updateResidualExplanatoryPowerChart);
  }
  if (residualExplanatoryPowerYearSelect) {
    residualExplanatoryPowerYearSelect.addEventListener('change', updateResidualExplanatoryPowerChart);
  }
  if (residualExplanatoryPowerTypeSelect) {
    residualExplanatoryPowerTypeSelect.addEventListener('change', updateResidualExplanatoryPowerChart);
  }
  
  // Initialize year select state based on currently selected variable
  if (residualExplanatoryPowerVariableSelect && residualExplanatoryPowerPolicyYearSelect) {
    const selectedVariable = residualExplanatoryPowerVariableSelect.value;
    const isIMF2021 = selectedVariable && selectedVariable.startsWith('IMF 2021');
    if (isIMF2021) {
      residualExplanatoryPowerPolicyYearSelect.value = 'NA';
      residualExplanatoryPowerPolicyYearSelect.disabled = true;
    }
  }
  
  // Setup baseline comparison
  setupBaselineComparison();
  
  // Mode toggle functionality
  setupModeToggle();
  
}

function setupModeToggle() {
  // Check URL parameter for mode
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'basic';
  
  // Apply mode to body
  if (mode === 'basic') {
    document.body.classList.add('basic-mode');
    // Also directly hide advanced-only elements as a fallback
    const advancedElements = document.querySelectorAll('.advanced-only');
    advancedElements.forEach(el => {
      el.style.display = 'none';
    });
    // Uncheck log axis checkboxes in basic mode
    const logXAxis = document.getElementById('logXAxis');
    const logYAxis = document.getElementById('logYAxis');
    if (logXAxis) logXAxis.checked = false;
    if (logYAxis) logYAxis.checked = false;
    // Set Index Mode to 2024 Fixed in basic mode
    const compositeIndexModeSelect = document.getElementById('compositeIndexModeSelect');
    if (compositeIndexModeSelect) {
      compositeIndexModeSelect.value = '2024-fixed';
    }
    // Make table containers scrollable
    makeTablesScrollable();
  } else {
    document.body.classList.remove('basic-mode');
    // Show advanced-only elements
    const advancedElements = document.querySelectorAll('.advanced-only');
    advancedElements.forEach(el => {
      el.style.display = '';
    });
    // Remove scrollable styles from tables
    removeTableScrollableStyles();
  }
  
  // Set up Section 1 tutorial button
  const section1TutorialBtn = document.getElementById('section1TutorialBtn');
  if (section1TutorialBtn) {
    section1TutorialBtn.addEventListener('click', () => {
      if (typeof introJs !== 'undefined') {
        const intro = introJs();
        
        // Wait a moment to ensure table is rendered
        setTimeout(() => {
          intro.setOptions({
            steps: [
              {
                element: '#permanentPlotChart',
                intro: 'These curves show how many extra people have died since the pandemic began',
                position: 'top',
                highlightClass: 'introjs-highlight-box'
              },
              {
                element: '#summaryTable',
                intro: 'This table shows cumulative excess mortality values for each country by year.',
                position: 'top',
                highlightClass: 'introjs-highlight-box'
              },
              {
                element: '#permanentPlotChart .legend',
                intro: 'You can toggle countries on and off by clicking on their names in the legend.',
                position: 'left',
                highlightClass: 'introjs-highlight-box'
              },
              {
                element: '#permanentPlotChart',
                intro: 'This lets you focus on a few countries to see the details more clearly.',
                position: 'top',
                highlightClass: 'introjs-highlight-box'
              },
              {
                element: '#permanentPlotChart',
                intro: 'Click on any line to see the underlying age-standardized mortality data and baseline for that country.',
                position: 'top',
                highlightClass: 'introjs-highlight-box',
                // Custom step that will highlight both chart and details
                stepId: 'clickLineStep'
              }
            ],
            showProgress: true,
            showBullets: false,
            exitOnOverlayClick: true,
            exitOnEsc: true,
            tooltipClass: 'introjs-tooltip-custom',
            highlightClass: 'introjs-highlight-box',
            scrollToElement: true,
            scrollPadding: 50
          });
          
          // Add custom styling for white background tooltips and click animation
          const style = document.createElement('style');
          style.textContent = `
            .introjs-highlight-box {
              box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 15px rgba(66, 153, 225, 0.8) !important;
              border: 3px solid #4299e1 !important;
              border-radius: 4px !important;
            }
            .introjs-tooltip-custom {
              background-color: white !important;
              color: black !important;
              border: 2px solid #4299e1 !important;
            }
            .introjs-tooltip-custom .introjs-tooltip-header {
              color: black !important;
            }
            .introjs-tooltip-custom .introjs-tooltiptext {
              color: black !important;
            }
            .introjs-tooltip-custom .introjs-button {
              color: black !important;
              border-color: #4299e1 !important;
            }
            .introjs-tooltip-custom .introjs-button:hover {
              background-color: #4299e1 !important;
              color: white !important;
            }
            .introjs-tooltip-custom .introjs-progressbar {
              background-color: #4299e1 !important;
            }
            @keyframes clickAnimation {
              0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.7);
              }
              50% {
                transform: scale(0.95);
                box-shadow: 0 0 0 10px rgba(66, 153, 225, 0);
              }
              100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
              }
            }
            .tutorial-click-animation {
              animation: clickAnimation 0.4s ease-out;
              position: relative;
            }
            .tutorial-click-animation::after {
              content: '👆';
              position: absolute;
              top: -30px;
              left: 50%;
              transform: translateX(-50%);
              font-size: 24px;
              animation: clickAnimation 0.4s ease-out;
              pointer-events: none;
              z-index: 10000;
            }
            .tutorial-mouse-cursor {
              position: fixed !important;
              width: 24px;
              height: 24px;
              border: 3px solid #4299e1;
              border-radius: 50% 50% 50% 0;
              background: rgba(66, 153, 225, 0.5);
              transform-origin: center center;
              pointer-events: none;
              z-index: 999999 !important;
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
              margin: 0 !important;
              padding: 0 !important;
            }
            .tutorial-mouse-cursor::after {
              content: '';
              position: absolute;
              top: 9px;
              left: 9px;
              width: 5px;
              height: 5px;
              background: #4299e1;
              border-radius: 50%;
            }
          `;
          document.head.appendChild(style);
          
          // Track which step we're on
          let currentStep = 0;
          let scrollAnimationStarted = false;
          let countriesFiltered = false;
          let lineClicked = false;
          
          // On step change, handle automatic actions
          intro.onchange((targetElement) => {
            currentStep = intro._currentStep;
            
            // If we're on step 2 (legend step, 0-indexed), highlight only the visible legend
            if (currentStep === 2) {
              setTimeout(() => {
                const chartEl = document.getElementById('permanentPlotChart');
                if (chartEl) {
                  // Find the legend element within the Plotly chart
                  const legend = chartEl.querySelector('.legend');
                  if (legend) {
                    // Get the helper layer (intro.js highlight box)
                    const helperLayer = document.querySelector('.introjs-helperLayer');
                    if (helperLayer) {
                      const legendRect = legend.getBoundingClientRect();
                      const scrollX = window.scrollX || window.pageXOffset;
                      const scrollY = window.scrollY || window.pageYOffset;
                      
                      // Find the actual plot area (the main chart plotting area, not the container)
                      // This is the cumulative excess ASMR plot
                      const plotDiv = chartEl.querySelector('.plotly');
                      let plotHeight = legendRect.height;
                      
                      if (plotDiv) {
                        // Find the actual plot area within the plotly div
                        const plotArea = plotDiv.querySelector('.plot-container') || plotDiv.querySelector('.svg-container') || plotDiv;
                        const plotRect = plotArea.getBoundingClientRect();
                        // Use the plot area's height to match the cumulative excess ASMR plot
                        plotHeight = plotRect.height;
                      }
                      
                      // Align the top of the highlight with the plot's top
                      // The legend should align with the plot area
                      const plotDivRect = plotDiv ? plotDiv.getBoundingClientRect() : null;
                      const highlightTop = plotDivRect ? (plotDivRect.top + scrollY) : (legendRect.top + scrollY);
                      
                      // Update highlight to cover the legend area with fixed height
                      helperLayer.style.top = highlightTop + 'px';
                      helperLayer.style.left = (legendRect.left + scrollX) + 'px';
                      helperLayer.style.width = legendRect.width + 'px';
                      helperLayer.style.height = '300px';
                    }
                  }
                }
              }, 100);
            }
            
            // If we're on step 1 (table step, 0-indexed), automatically scroll the table
            if (currentStep === 1 && !scrollAnimationStarted) {
              scrollAnimationStarted = true;
              
              // Wait a moment for the element to be highlighted
              setTimeout(() => {
                const tableContainer = document.getElementById('summaryTable');
                if (!tableContainer) {
                  intro.nextStep();
                  return;
                }
                
                // Find the scrollable table element
                const table = tableContainer.querySelector('.summary-table');
                if (!table) {
                  intro.nextStep();
                  return;
                }
                
                // Get the table's parent or the container itself
                let scrollableElement = tableContainer;
                
                // Check if the table container has scrollable styles
                const hasScroll = tableContainer.style.maxHeight || tableContainer.style.overflowY === 'auto';
                
                // If not scrollable, we might need to make it scrollable temporarily
                if (!hasScroll) {
                  const originalMaxHeight = tableContainer.style.maxHeight;
                  const originalOverflowY = tableContainer.style.overflowY;
                  tableContainer.style.maxHeight = '300px';
                  tableContainer.style.overflowY = 'auto';
                  scrollableElement = tableContainer;
                  
                  // Restore original styles on exit
                  intro.onexit(() => {
                    tableContainer.style.maxHeight = originalMaxHeight;
                    tableContainer.style.overflowY = originalOverflowY;
                  });
                }
                
                // Get scroll properties
                const maxScroll = scrollableElement.scrollHeight - scrollableElement.clientHeight;
                if (maxScroll <= 0) {
                  // Table is not scrollable, move to next step
                  setTimeout(() => {
                    intro.nextStep();
                  }, 1000);
                  return;
                }
                
                // Scroll down, then back up, then move to next step
                scrollableElement.scrollTo({
                  top: maxScroll,
                  behavior: 'smooth'
                });
                
                // After scrolling down, scroll back up
                setTimeout(() => {
                  scrollableElement.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                  // Don't auto-advance - let user click next
                }, 1500);
              }, 500);
            }
            
            // If we're on step 3 (filter countries step, 0-indexed), toggle off countries in legend
            if (currentStep === 3 && !countriesFiltered) {
              countriesFiltered = true;
              
              // Wait a moment for the element to be highlighted
              setTimeout(() => {
                const chartEl = document.getElementById('permanentPlotChart');
                if (!chartEl || !chartEl.data) {
                  intro.nextStep();
                  return;
                }
                
                // Countries to keep visible: Iceland, Denmark, Norway, Australia, Finland, Taiwan
                const targetCountryNames = ['Iceland', 'Denmark', 'Norway', 'Australia', 'Finland', 'Taiwan'];
                
                // Create visibility array: 'true' for visible, 'legendonly' for hidden
                const visibilityUpdates = chartEl.data.map(trace => {
                  return targetCountryNames.includes(trace.name) ? true : 'legendonly';
                });
                
                // Update trace visibility using Plotly.restyle
                // This simulates clicking on legend items to hide them
                Plotly.restyle(chartEl, {
                  visible: visibilityUpdates
                });
                // Don't auto-advance - let user click next
              }, 500);
            }
            
            // If we're on step 4 (click line step, 0-indexed), automatically click on a line
            if (currentStep === 4 && !lineClicked) {
              lineClicked = true;
              
              // Wait a moment for the element to be highlighted and chart to be ready
              setTimeout(() => {
                // Find the first available trace from our filtered countries
                // The countries we filtered to: ISL, DNK, NOR, AUS, FIN, TWN
                const targetCountryNames = ['Iceland', 'Denmark', 'Norway', 'Australia', 'Finland', 'Taiwan'];
                let traceIndex = -1;
                
                // Find the first matching trace in state.dedicatedPermanentTraces
                for (let i = 0; i < state.dedicatedPermanentTraces.length; i++) {
                  const traceName = state.dedicatedPermanentTraces[i].name;
                  if (targetCountryNames.includes(traceName)) {
                    traceIndex = i;
                    break;
                  }
                }
                
                if (traceIndex >= 0) {
                  // Directly show the trace details (this is what clicking does)
                  showDedicatedTraceDetails(traceIndex);
                  
                  // Wait for details to appear, then update highlight to include both elements
                  setTimeout(() => {
                    const chartEl = document.getElementById('permanentPlotChart');
                    const detailsDiv = document.getElementById('permanentPlotTraceDetails');
                    
                    if (chartEl && detailsDiv && detailsDiv.style.display !== 'none') {
                      // Get bounding boxes of both elements
                      const chartRect = chartEl.getBoundingClientRect();
                      const detailsRect = detailsDiv.getBoundingClientRect();
                      
                      // Calculate combined bounding box
                      const minTop = Math.min(chartRect.top, detailsRect.top);
                      const maxBottom = Math.max(chartRect.bottom, detailsRect.bottom);
                      const minLeft = Math.min(chartRect.left, detailsRect.left);
                      const maxRight = Math.max(chartRect.right, detailsRect.right);
                      
                      // Find intro.js highlight elements
                      const helperLayer = document.querySelector('.introjs-helperLayer');
                      const overlay = document.querySelector('.introjs-overlay');
                      
                      if (helperLayer) {
                        // Update the highlight box to cover both elements
                        const scrollX = window.scrollX || window.pageXOffset;
                        const scrollY = window.scrollY || window.pageYOffset;
                        
                        helperLayer.style.top = (minTop + scrollY) + 'px';
                        helperLayer.style.left = (minLeft + scrollX) + 'px';
                        helperLayer.style.width = (maxRight - minLeft) + 'px';
                        helperLayer.style.height = (maxBottom - minTop) + 'px';
                      }
                      
                      // Update overlay to match
                      if (overlay) {
                        // The overlay should already cover everything, but we ensure it's correct
                        overlay.style.display = 'block';
                      }
                      
                      // Scroll to show both elements nicely
                      setTimeout(() => {
                        const scrollTarget = minTop < (window.scrollY + 100) ? chartEl : detailsDiv;
                        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }, 100);
                    }
                  }, 500);
                }
              }, 1000);
            }
          });
          
          intro.onexit(() => {
            scrollAnimationStarted = false;
            countriesFiltered = false;
            lineClicked = false;
          });
          
          intro.start();
        }, 100);
      }
    });
  }

  const modeToggleBtn = document.getElementById('modeToggleBtn');
  if (modeToggleBtn) {
    // Update button text based on current mode
    if (mode === 'basic') {
      modeToggleBtn.textContent = 'Switch to Advanced Mode';
    } else {
      modeToggleBtn.textContent = 'Switch to Basic Mode';
    }
    
    // Add click handler
    modeToggleBtn.addEventListener('click', () => {
      const currentMode = document.body.classList.contains('basic-mode') ? 'basic' : 'advanced';
      const newMode = currentMode === 'basic' ? 'advanced' : 'basic';
      
      // Update URL with new mode and refresh
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('mode', newMode);
      window.location.href = newUrl.toString();
    });
  }
}

function makeTablesScrollable() {
  // Find all table container divs
  const tableContainers = document.querySelectorAll('[id$="Table"], [id*="Table"]');
  tableContainers.forEach(container => {
    // Skip compositeIndexWeightsTable - it should be hidden
    if (container.id === 'compositeIndexWeightsTable') {
      container.style.display = 'none';
      return;
    }
    // Skip countryComparisonTable - it should show full table
    if (container.id === 'countryComparisonTable') {
      return;
    }
    // Only apply if container has content and is visible
    if (container.children.length > 0 || container.innerHTML.trim() !== '') {
      container.style.maxHeight = '200px';
      container.style.overflowY = 'auto';
      container.style.overflowX = 'auto';
      container.style.display = 'block';
    }
  });
}

function removeTableScrollableStyles() {
  // Remove scrollable styles from table containers
  const tableContainers = document.querySelectorAll('[id$="Table"], [id*="Table"]');
  tableContainers.forEach(container => {
    container.style.maxHeight = '';
    container.style.overflowY = '';
    container.style.overflowX = '';
  });
  
  // Remove scrollable styles from tables
  const tables = document.querySelectorAll('table, .summary-table');
  tables.forEach(table => {
    table.style.maxHeight = '';
    table.style.overflowY = '';
    table.style.overflowX = '';
  });
}

// Load data with specified filename
async function loadDataFile(filename) {
  console.log(`Plot Viewer loading data from: ${filename}`);
  
  const loadBtn = document.getElementById("loadDataFileBtn");
  const originalText = loadBtn ? loadBtn.textContent : "Load";
  
  try {
    // Disable button and show loading state
    if (loadBtn) {
      loadBtn.disabled = true;
      loadBtn.textContent = "Loading...";
    }
    
    console.log("Attempting to load reproduction data...");
    const text = await loadReproductionDataText(filename);
    console.log("Reproduction data loaded successfully, length:", text.length);
    console.log("First 500 chars:", text.substring(0, 500));
    
    // Clear ALL state - traces, metadata, everything
    console.log("=== CLEARING ALL STATE ===");
    console.log("Before clear - traces:", state.dedicatedPermanentTraces.length, "metadata:", state.dedicatedPermanentTraceMetadata.length);
    
    state.dedicatedPermanentTraces = [];
    state.dedicatedPermanentTraceMetadata = [];
    state.manualSelectedCountries.clear(); // Clear manual country selections
    state.selectedClusters = new Set(['Cluster 1','Cluster 2','Cluster 3','Cluster 4']); // Reset to default
    
    // Force clear all chart DOM elements
    const chartEl = document.getElementById("permanentPlotChart");
    const scatterplotEl = document.getElementById('scatterplotChart');
    const asmrGdpEl = document.getElementById('asmrGdpScatterplotChart');
    const compositeEl = document.getElementById('compositeIndexScatterplotChart');
    const residualEl = document.getElementById('residualsScatterplotChart');
    const compositeResidualEl = document.getElementById('compositeIndexResidualChart');
    
    [chartEl, scatterplotEl, asmrGdpEl, compositeEl, residualEl, compositeResidualEl].forEach(el => {
      if (el) {
        console.log("Purging chart:", el.id);
        try {
          Plotly.purge(el);
        } catch (e) {
          console.warn("Error purging chart", el.id, e);
          // Try to clear manually
          if (el.innerHTML) el.innerHTML = '';
        }
      }
    });
    
    // Clear tables
    const summaryTable = document.getElementById("summaryTable");
    const xAxisTable = document.getElementById("scatterplotXAxisTable");
    const residualsTable = document.getElementById("residualsTable");
    const asmrGdpTable = document.getElementById("asmrGdpTable");
    
    [summaryTable, xAxisTable, residualsTable, asmrGdpTable].forEach(el => {
      if (el) el.innerHTML = '';
    });
    
    console.log("State cleared. CSV data size:", state.dataByCountrySex.size);
    console.log("After clear - traces:", state.dedicatedPermanentTraces.length, "metadata:", state.dedicatedPermanentTraceMetadata.length);
    
    // If CSV data is already loaded, we can skip reloading it
    if (state.dataByCountrySex.size > 0) {
      console.log("CSV data already loaded, parsing reproduction data directly...");
      const traceConfigs = parseReproductionData(text);
      console.log("Parsed trace configurations:", traceConfigs.length);
      
      // Load traces based on reproduction data
      loadTracesFromReproductionData(traceConfigs);
      
      // Setup controls
      setupControls();
      
      // Populate country comparison selectors
      populateCountryComparisonSelectors();
      
      // Update filter buttons to reflect default state
      const filterAllBtn = document.getElementById("filterAll");
      const filterClusterBtns = document.querySelectorAll('[id^="filterCluster"]');
      if (filterAllBtn) filterAllBtn.classList.add('active');
      filterClusterBtns.forEach(btn => btn.classList.remove('active'));
      
      // Re-render charts
      console.log("About to render chart with", state.dedicatedPermanentTraces.length, "traces");
      if (state.dedicatedPermanentTraces.length > 0) {
        // Force clear existing chart before rendering
        const chartEl = document.getElementById("permanentPlotChart");
        if (chartEl && chartEl.data) {
          console.log("Clearing existing chart data...");
          Plotly.purge(chartEl);
        }
        renderDedicatedPermanentChart(chartEl);
        setTimeout(() => {
          // Clear and re-render scatterplot charts
          const scatterplotEl = document.getElementById('scatterplotChart');
          const asmrGdpEl = document.getElementById('asmrGdpScatterplotChart');
          const compositeEl = document.getElementById('compositeIndexScatterplotChart');
          const residualEl = document.getElementById('residualsScatterplotChart');
          const compositeResidualEl = document.getElementById('compositeIndexResidualChart');
          
          if (scatterplotEl) Plotly.purge(scatterplotEl);
          if (asmrGdpEl) Plotly.purge(asmrGdpEl);
          if (compositeEl) Plotly.purge(compositeEl);
          if (residualEl) Plotly.purge(residualEl);
          if (compositeResidualEl) Plotly.purge(compositeResidualEl);
          
          // renderASMRGDPScatterplot(state.dedicatedPermanentTraces); // Hidden
          
          const activeClusters = state.selectedClusters;
          const hasActive = activeClusters && activeClusters.size > 0;
          const hasManual = state.manualSelectedCountries && state.manualSelectedCountries.size > 0;
          
          let filteredTraces = state.dedicatedPermanentTraces.filter((trace, index) => {
            const metadata = state.dedicatedPermanentTraceMetadata[index];
            if (!hasActive && !hasManual) return false;
            const inCluster = hasActive ? activeClusters.has(countryClusters[metadata.country]) : false;
            const inManual = hasManual ? state.manualSelectedCountries.has(metadata.country) : false;
            return inCluster || inManual;
          });
          
          // Re-render scatterplot with filtered traces
          renderScatterplot(filteredTraces);
          // renderScatterplotXAxisTable(filteredTraces); // Hidden
          
          console.log("All charts re-rendered with new data");
        }, 100);
      } else {
        console.error("No traces to render!");
        alert("No traces were loaded. Check console for details.");
      }
    } else {
      // CSV data not loaded yet, use full boot process
      console.log("CSV data not loaded, using full boot process...");
      await bootWithReproductionData(text);
    }
    
    // Re-enable button
    if (loadBtn) {
      loadBtn.disabled = false;
      loadBtn.textContent = originalText;
    }
  } catch (e) {
    console.error("Failed to load reproduction data:", e);
    alert(`Failed to load reproduction data from ${filename}. Please ensure the file is in the data folder.`);
    
    // Re-enable button on error
    if (loadBtn) {
      loadBtn.disabled = false;
      loadBtn.textContent = originalText;
    }
  }
}

async function main() {
  console.log("Plot Viewer starting...");
  
  // Get the selected file from URL parameter or default
  const urlParams = new URLSearchParams(window.location.search);
  const fileParam = urlParams.get('file') || 'QPR-RSMEmin.txt';
  console.log('File parameter from URL:', fileParam);
  // Determine which file to load based on parameter
  let initialFile = 'QPR-RSMEmin.txt';
  console.log('Initial file to load:', initialFile);
  if (fileParam === 'QPR-RSMEmin.txt') {
    initialFile = 'QPR-RSMEmin.txt';
  } else if (fileParam === '20102019qpr.txt') {
    initialFile = '20102019qpr.txt';
  } else if (fileParam === '20112019qpr.txt') {
    initialFile = '20112019qpr.txt';
  } else if (fileParam === '20122019qpr.txt') {
    initialFile = '20122019qpr.txt';
  } else if (fileParam === '20132019qpr.txt') {
    initialFile = '20132019qpr.txt';
  } else if (fileParam === '20142019qpr.txt') {
    initialFile = '20142019qpr.txt';
  } else if (fileParam === '20152019qpr.txt') {
    initialFile = '20152019qpr.txt';
  } else if (fileParam === '20162019qpr.txt') {
    initialFile = '20162019qpr.txt';
  }
  
  // Set the dropdown to match URL parameter
  const dataFileSelect = document.getElementById("dataFileSelect");
  const loadDataFileBtn = document.getElementById("loadDataFileBtn");
  if (dataFileSelect) {
    dataFileSelect.value = initialFile;
  }
  
  // Load initial data
  await loadDataFile(initialFile);
  
  // Set up event listener for Load button - refresh page with new file
  if (loadDataFileBtn && dataFileSelect) {
    loadDataFileBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const selectedFile = dataFileSelect.value;
      console.log(`Loading file via page refresh: ${selectedFile}`);
      
      // Reload page with the selected file as URL parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('file', selectedFile);
      window.location.href = newUrl.toString();
    });
    console.log("Load button event listener attached - will refresh page");
  } else {
    console.error("Load button or data file select not found!", { loadDataFileBtn, dataFileSelect });
  }
  
}

function bootWithReproductionData(text) {
  return new Promise((resolve, reject) => {
    console.log("Parsing reproduction data...");
    
    // First, load both CSVs - merged data and HMD mortality data
    Promise.all([
      loadMergedData2019(),
      loadCSVForReproductionData(),
      loadOxCGRTData(),
      loadPolicyDocumentation()
    ]).then(() => {
      console.log("CSV data loaded, dataByCountrySex size:", state.dataByCountrySex.size);
      console.log("Available countries:", Array.from(state.countries));
      
      // Parse the reproduction data to get trace configurations
      const traceConfigs = parseReproductionData(text);
      console.log("Parsed trace configurations:", traceConfigs.length);
      
      // Load traces based on reproduction data
      loadTracesFromReproductionData(traceConfigs);
      
      // Setup controls (simplified)
      setupControls();
      
      // Populate country comparison selectors
      populateCountryComparisonSelectors();
      
      // Update filter buttons to reflect default state
      const filterAllBtn = document.getElementById("filterAll");
      const filterClusterBtns = document.querySelectorAll('[id^="filterCluster"]');
      if (filterAllBtn) filterAllBtn.classList.add('active');
      filterClusterBtns.forEach(btn => btn.classList.remove('active'));
      
      // Initialize chart
      console.log("About to render chart with", state.dedicatedPermanentTraces.length, "traces");
      if (state.dedicatedPermanentTraces.length > 0) {
        renderDedicatedPermanentChart(document.getElementById("permanentPlotChart"));
        // Also render ASMR-GDP chart on initial load (with a small delay to ensure DOM is ready)
        setTimeout(() => {
          console.log("Rendering ASMR-GDP chart after delay, metadata count:", state.dedicatedPermanentTraceMetadata.length);
          // renderASMRGDPScatterplot(state.dedicatedPermanentTraces); // Hidden
          
          // Also render the ASMR table
          const activeClusters = state.selectedClusters;
          const hasActive = activeClusters && activeClusters.size > 0;
          const hasManual = state.manualSelectedCountries && state.manualSelectedCountries.size > 0;
          
          let filteredTraces = state.dedicatedPermanentTraces.filter((trace, index) => {
            const metadata = state.dedicatedPermanentTraceMetadata[index];
            if (!hasActive && !hasManual) return false;
            const inCluster = hasActive ? activeClusters.has(countryClusters[metadata.country]) : false;
            const inManual = hasManual ? state.manualSelectedCountries.has(metadata.country) : false;
            return inCluster || inManual;
          });
          
          // renderScatterplotXAxisTable(filteredTraces); // Hidden
          resolve(); // Resolve after everything is rendered
        }, 100);
      } else {
        console.error("No traces to render!");
        alert("No traces were loaded. Check console for details.");
        reject(new Error("No traces loaded"));
      }
    }).catch(e => {
      console.error("Failed to load CSV data:", e);
      alert("Failed to load mortality data. Please ensure HMD.csv is in the data folder.");
      reject(e);
    });
  });
}

// Mapping from CSV country names to country codes
// Handles naming differences between CSV and internal country codes
function mapCountryNameToCode(countryName) {
  const name = countryName.trim();
  
  // Direct mappings
  const mappings = {
    'Australia': 'AUS',
    'Austria': 'AUT',
    'Belgium': 'BEL',
    'Bulgaria': 'BGR',
    'Canada': 'CAN',
    'Switzerland': 'CHE',
    'Chile': 'CHL',
    'Czechia': 'CZE',
    'Czech Republic': 'CZE',
    'Germany': 'DEUTNP',
    'Denmark': 'DNK',
    'Spain': 'ESP',
    'Estonia': 'EST',
    'Finland': 'FIN',
    'France': 'FRATNP',
    'United Kingdom': 'GBRTENW', // Default to England & Wales, may need special handling
    'Greece': 'GRC',
    'Croatia': 'HRV',
    'Hungary': 'HUN',
    'Iceland': 'ISL',
    'Israel': 'ISR',
    'Italy': 'ITA',
    'Korea, Rep.': null, // Not in our system
    'Lithuania': 'LTU',
    'Luxembourg': 'LUX',
    'Latvia': 'LVA',
    'Netherlands': 'NLD',
    'Norway': 'NOR',
    'New Zealand': 'NZL_NP',
    'Poland': 'POL',
    'Portugal': 'PRT',
    'Russian Federation': null, // Not in our system
    'Slovak Republic': 'SVK',
    'Slovakia': 'SVK',
    'Slovenia': 'SVN',
    'Sweden': 'SWE',
    'TWN': 'TWN',
    'Taiwan': 'TWN',
    'United States': 'USA',
  };
  
  return mappings[name] || null;
}

// Extract numeric value from CSV format like "54972.7017885437(2019)"
function extractNumericValue(value) {
  if (!value || value.trim() === '') return null;
  // Extract number before the opening parenthesis
  const match = value.match(/^([\d.]+)/);
  if (match) {
    const num = parseFloat(match[1]);
    return isFinite(num) ? num : null;
  }
  return null;
}

// Load OxCGRT policy data - store all policy variables
async function loadOxCGRTData() {
  const cacheBuster = Date.now();
  const paths = [
    `./data/OxCGRT_compact_national_v1.csv?t=${cacheBuster}`,
    `../data/OxCGRT_compact_national_v1.csv?t=${cacheBuster}`,
    `OxCGRT_compact_national_v1.csv?t=${cacheBuster}`
  ];
  
  for (const p of paths) {
    try {
      const res = await fetch(p);
      if (res.ok) {
        const text = await res.text();
        const rows = parseCSV(text);
        
        if (rows.length < 1) {
          console.warn("OxCGRT CSV has insufficient rows");
          return;
        }
        
        // Get all policy variable column names from the first row
        const firstRow = rows[0];
        const policyVariables = Object.keys(firstRow).filter(key => {
          // Policy variables are those that don't end with _Flag and aren't metadata columns
          return !key.includes('_Flag') && 
                 key !== 'CountryName' && 
                 key !== 'CountryCode' && 
                 key !== 'RegionName' && 
                 key !== 'RegionCode' && 
                 key !== 'Jurisdiction' && 
                 key !== 'Date' &&
                 key !== 'ConfirmedCases' &&
                 key !== 'ConfirmedDeaths' &&
                 key !== 'MajorityVaccinated' &&
                 key !== 'PopulationVaccinated' &&
                 !key.startsWith('Stringency') &&
                 !key.startsWith('GovernmentResponse') &&
                 !key.startsWith('ContainmentHealth') &&
                 !key.startsWith('EconomicSupport');
        });
        
        console.log(`Found ${policyVariables.length} policy variables:`, policyVariables);
        
        // Store data by country and policy variable
        // Structure: Map<countryCode, Map<policyVariable, array of {date, value}>>
        const policyDataByCountry = new Map();
        
        rows.forEach(row => {
          const countryCode = row['CountryCode'];
          if (!countryCode) return;
          
          // Only use national-level data (NAT_TOTAL)
          const jurisdiction = row['Jurisdiction'];
          if (jurisdiction !== 'NAT_TOTAL') return;
          
          const dateStr = row['Date'];
          if (!dateStr) return;
          
          // Parse date (format: YYYYMMDD)
          const year = parseInt(dateStr.substring(0, 4));
          const month = parseInt(dateStr.substring(4, 6)) - 1; // JS months are 0-indexed
          const day = parseInt(dateStr.substring(6, 8));
          const date = new Date(Date.UTC(year, month, day));
          
          if (!policyDataByCountry.has(countryCode)) {
            policyDataByCountry.set(countryCode, new Map());
          }
          
          const countryData = policyDataByCountry.get(countryCode);
          
          // Store all policy variables for this country/date
          policyVariables.forEach(policyVar => {
            const value = parseFloat(row[policyVar]);
            if (!isNaN(value)) {
              if (!countryData.has(policyVar)) {
                countryData.set(policyVar, []);
              }
              countryData.get(policyVar).push({
                date: date,
                value: value
              });
            }
          });
        });
        
        // Sort data by date for each country and policy variable
        policyDataByCountry.forEach((countryData, countryCode) => {
          countryData.forEach((data, policyVar) => {
            data.sort((a, b) => a.date - b.date);
          });
        });
        
        state.policyDataByCountry = policyDataByCountry;
        state.availablePolicyVariables = policyVariables;
        console.log(`Loaded OxCGRT data for ${policyDataByCountry.size} countries`);
        console.log(`Initial policy variables count: ${policyVariables.length}`);
        
        // Load IMF data after OxCGRT data is loaded
        loadIMFData().then(() => {
          // Populate the dropdowns after both are loaded
          console.log('Populating dropdowns with updated policy variables...');
          console.log('Available variables count:', state.availablePolicyVariables.length);
          console.log('First 10 variables:', state.availablePolicyVariables.slice(0, 10));
          
          // Use a small delay to ensure DOM is ready
          setTimeout(() => {
            populatePolicyVariableSelect(state.availablePolicyVariables);
            populateExplanatoryPowerVariableSelect();
            populateResidualExplanatoryPowerVariableSelect(state.availablePolicyVariables);
          }, 100);
        }).catch((err) => {
          console.warn('IMF data loading failed, using OxCGRT variables only:', err);
          // If IMF data fails to load, still populate with OxCGRT variables
          setTimeout(() => {
            populatePolicyVariableSelect(policyVariables);
            populateExplanatoryPowerVariableSelect();
            populateResidualExplanatoryPowerVariableSelect(policyVariables);
          }, 100);
        });
        return;
      }
    } catch (e) {
      console.warn(`Failed to load from ${p}:`, e);
    }
  }
  console.warn("Unable to load OxCGRT_compact_national_v1.csv from known paths.");
}

// Load IMF 2021 fiscal measures data
async function loadIMFData() {
  const cacheBuster = Date.now();
  const paths = [
    `./data/imf_2021_data.json?t=${cacheBuster}`,
    `../data/imf_2021_data.json?t=${cacheBuster}`,
    `imf_2021_data.json?t=${cacheBuster}`
  ];
  
  for (const p of paths) {
    try {
      const res = await fetch(p);
      if (res.ok) {
        const imfData = await res.json();
        
        // Add IMF variables to the top of available policy variables
        const imfVariables = [
          'IMF 2021 - Local Currency Spend in Billions',
          'IMF 2021 - USD Spend in Billions',
          'IMF 2021 - Spend as % of GDP',
          'IMF 2021 (derived) - USD Spend per Capita'
        ];
        
        // Add to the beginning of availablePolicyVariables
        state.availablePolicyVariables = [...imfVariables, ...state.availablePolicyVariables];
        console.log('IMF variables added. Total policy variables:', state.availablePolicyVariables.length);
        console.log('First 5 policy variables:', state.availablePolicyVariables.slice(0, 5));
        
        // Add IMF data to policyDataByCountry
        // Since IMF data is static (not time series), we'll create entries for multiple dates
        // to cover 2020-2021 period (so it works with 2020, 2021, and 2020-2021 selections)
        const dates2020 = [
          new Date(Date.UTC(2020, 5, 15)), // June 15, 2020
          new Date(Date.UTC(2020, 11, 15))  // December 15, 2020
        ];
        const dates2021 = [
          new Date(Date.UTC(2021, 0, 15)),  // January 15, 2021
          new Date(Date.UTC(2021, 5, 15)),  // June 15, 2021
          new Date(Date.UTC(2021, 11, 15))  // December 15, 2021
        ];
        const allDates = [...dates2020, ...dates2021];
        
        Object.keys(imfData).forEach(countryCode => {
          const countryData = imfData[countryCode];
          
          if (!state.policyDataByCountry.has(countryCode)) {
            state.policyDataByCountry.set(countryCode, new Map());
          }
          
          const countryPolicyData = state.policyDataByCountry.get(countryCode);
          
          // Add LC b value (same value for all dates in 2020-2021)
          if (countryData['LC b'] !== undefined) {
            countryPolicyData.set('IMF 2021 - Local Currency Spend in Billions', allDates.map(date => ({
              date: date,
              value: countryData['LC b']
            })));
          }
          
          // Add USD value
          if (countryData['USD'] !== undefined) {
            countryPolicyData.set('IMF 2021 - USD Spend in Billions', allDates.map(date => ({
              date: date,
              value: countryData['USD']
            })));
          }
          
          // Add %GI value
          if (countryData['%GI'] !== undefined) {
            countryPolicyData.set('IMF 2021 - Spend as % of GDP', allDates.map(date => ({
              date: date,
              value: countryData['%GI']
            })));
          }
          
          // Calculate and add USD per capita (derived)
          if (countryData['USD'] !== undefined) {
            // Get population for this country
            // First try direct lookup
            let population = population2019[countryCode];
            
            // If not found, try to find the internal code(s) that map to this OxCGRT code
            // Some countries like GBR have multiple regions that need to be summed
            if (population === undefined) {
              const matchingCodes = [];
              for (const [internalCode, oxCGRTCode] of Object.entries(oxCGRTCountryCodeMap)) {
                if (oxCGRTCode === countryCode) {
                  matchingCodes.push(internalCode);
                }
              }
              
              // Sum populations if multiple regions map to the same OxCGRT code
              if (matchingCodes.length > 0) {
                population = matchingCodes.reduce((sum, code) => {
                  return sum + (population2019[code] || 0);
                }, 0);
              }
            }
            
            // Calculate USD per capita: (USD in billions) / (population in millions) * 1000
            if (population !== undefined && population > 0) {
              const usdPerCapita = (countryData['USD'] / population) * 1000;
              countryPolicyData.set('IMF 2021 (derived) - USD Spend per Capita', allDates.map(date => ({
                date: date,
                value: usdPerCapita
              })));
            }
          }
        });
        
        console.log(`Loaded IMF 2021 data for ${Object.keys(imfData).length} countries`);
        console.log('Updated availablePolicyVariables:', state.availablePolicyVariables.slice(0, 10));
        
        // Dropdowns will be updated by loadOxCGRTData after this completes
        return Promise.resolve();
      }
    } catch (e) {
      console.warn(`Failed to load IMF data from ${p}:`, e);
    }
  }
  console.warn("Unable to load imf_2021_data.json from known paths.");
  return Promise.resolve(); // Return resolved promise even if loading fails
}

// Populate policy variable selector
function populatePolicyVariableSelect(policyVariables) {
  const select = document.getElementById('policyVariableSelect');
  if (!select) return;
  
  // Clear existing options except the first one
  select.innerHTML = '';
  
  policyVariables.forEach(policyVar => {
    const option = document.createElement('option');
    option.value = policyVar;
    option.textContent = policyVar;
    if (policyVar === 'C1M_School closing') {
      option.selected = true;
    }
    select.appendChild(option);
  });
  
  // Update description for initially selected variable
  updatePolicyVariableDescription('C1M_School closing');
}

// Load and parse policy documentation markdown file
async function loadPolicyDocumentation() {
  const cacheBuster = Date.now();
  const paths = [
    `./data/documentation_and_codebook.md?t=${cacheBuster}`,
    `../data/documentation_and_codebook.md?t=${cacheBuster}`,
    `documentation_and_codebook.md?t=${cacheBuster}`
  ];
  
  for (const p of paths) {
    try {
      const res = await fetch(p);
      if (res.ok) {
        const text = await res.text();
        parsePolicyDocumentation(text);
        console.log(`Loaded policy documentation, found ${state.policyVariableDescriptions.size} descriptions`);
        return;
      }
    } catch (e) {
      console.warn(`Failed to load documentation from ${p}:`, e);
    }
  }
  console.warn("Unable to load documentation_and_codebook.md from known paths.");
}

// Parse markdown file to extract policy variable descriptions
function parsePolicyDocumentation(markdownText) {
  const lines = markdownText.split('\n');
  let inTable = false;
  let currentId = null;
  let currentDescription = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect table start (look for "| ID | Name | Description |" pattern)
    if (line.startsWith('| ID |') && line.includes('Description')) {
      inTable = true;
      continue;
    }
    
    // Detect table end (empty line or new section)
    if (inTable && (line === '' || line.startsWith('##') || (line.startsWith('---') && i > 0))) {
      inTable = false;
      currentId = null;
      currentDescription = null;
      continue;
    }
    
    // Skip separator rows
    if (inTable && line.match(/^\|[\s\-:]+\|/)) {
      continue;
    }
    
    // Parse table rows
    if (inTable && line.startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      if (cells.length >= 3) {
        const firstCell = cells[0];
        
        // Check if first cell is a policy ID (C1, C2, E1, H1, H6, H7, H8, V1, V2, V3, V4, etc.)
        const idMatch = firstCell.match(/^(C[1-8]|E[1-4]|H[1-8]|V[1-4]|M1)$/);
        if (idMatch) {
          currentId = idMatch[1];
          
          // Find Name column (2nd column, index 1) for variable codes
          const nameCell = cells[1] || '';
          // Find Description column (3rd column, index 2)
          const descCell = cells[2] || '';
          
          // Extract variable codes from Name cell (e.g., "C1E_School closing", "C1M_School closing")
          // Handle both backtick format and plain text
          const variableCodeMatches = nameCell.match(/`([A-Z0-9]+_[^`]+)`/g);
          if (variableCodeMatches) {
            variableCodeMatches.forEach(match => {
              const code = match.replace(/`/g, '').trim();
              // Store description for this variable code
              if (descCell && descCell !== '') {
                // Clean up description (remove HTML tags, normalize whitespace)
                let cleanDesc = descCell
                  .replace(/<br\s*\/?>/gi, ' ')
                  .replace(/<[^>]+>/g, '')
                  .replace(/\s+/g, ' ')
                  .trim();
                state.policyVariableDescriptions.set(code, cleanDesc);
              }
            });
          }
          
          // Also store description using the base ID as key (for fallback)
          if (descCell && descCell !== '' && currentId) {
            let cleanDesc = descCell
              .replace(/<br\s*\/?>/gi, ' ')
              .replace(/<[^>]+>/g, '')
              .replace(/\s+/g, ' ')
              .trim();
            // Only store if we don't already have a description for this ID
            if (!state.policyVariableDescriptions.has(currentId)) {
              state.policyVariableDescriptions.set(currentId, cleanDesc);
            }
          }
        } else if (firstCell === '' && currentId && cells.length >= 2) {
          // This might be a continuation row (like flag rows) - skip it
          continue;
        }
      }
    }
  }
  
  // Also try to extract from the summary table at the top (Table 1)
  // Look for "| C1 | School closing |" pattern
  const table1Match = markdownText.match(/Table 1: OxCGRT Indicators:([\s\S]*?)(?=##|$)/);
  if (table1Match) {
    const table1Text = table1Match[1];
    const table1Lines = table1Text.split('\n');
    for (const line of table1Lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('|') && !trimmed.match(/^\|[\s\-:]+\|/)) {
        const match = trimmed.match(/^\|\s*(C[1-8]|E[1-4]|H[1-8]|V[1-4]|M1)\s*\|\s*([^|]+)\s*\|/);
        if (match) {
          const id = match[1];
          const name = match[2].trim();
          // Store a basic description using the name (as fallback)
          if (!state.policyVariableDescriptions.has(id)) {
            state.policyVariableDescriptions.set(id, name);
          }
        }
      }
    }
  }
  
  console.log('Parsed policy descriptions:', Array.from(state.policyVariableDescriptions.entries()).slice(0, 10));
}

// Get policy variable description
function getPolicyVariableDescription(policyVariable) {
  if (!policyVariable) return '—';
  
  // Try to find description for this exact variable
  let description = state.policyVariableDescriptions.get(policyVariable);
  
  // If not found, try to extract base ID (e.g., "C1M_School closing" -> "C1")
  if (!description) {
    const baseIdMatch = policyVariable.match(/^(C[1-8]|E[1-4]|H[1-8]|V[1-4]|M1)/);
    if (baseIdMatch) {
      description = state.policyVariableDescriptions.get(baseIdMatch[1]);
    }
  }
  
  // For IMF 2021 variables, provide a default description
  if (!description && policyVariable.startsWith('IMF 2021')) {
    if (policyVariable.includes('Local Currency')) {
      return 'Fiscal measures in local currency (billions)';
    } else if (policyVariable.includes('USD Spend')) {
      if (policyVariable.includes('per Capita')) {
        return 'Fiscal measures in USD per capita (derived)';
      } else {
        return 'Fiscal measures in USD (billions)';
      }
    } else if (policyVariable.includes('% of GDP')) {
      return 'Fiscal measures as percentage of GDP';
    }
  }
  
  return description || 'No description available';
}

// Update policy variable description display
function updatePolicyVariableDescription(policyVariable) {
  const descText = document.getElementById('policyDescriptionText');
  if (descText) {
    descText.textContent = getPolicyVariableDescription(policyVariable);
  }
}

// Load merged_data_2019.csv and populate data structures
async function loadMergedData2019() {
  const cacheBuster = Date.now();
  const paths = [
    `./data/merged_data_2019.csv?t=${cacheBuster}`,
    `../data/merged_data_2019.csv?t=${cacheBuster}`,
    `merged_data_2019.csv?t=${cacheBuster}`
  ];
  
  for (const p of paths) {
    try {
      const res = await fetch(p);
      if (res.ok) {
        const text = await res.text();
        const rows = parseCSV(text);
        
        if (rows.length < 1) {
          console.warn("merged_data_2019.csv has insufficient rows");
          return;
        }
        
        // parseCSV returns an array of objects with column names as keys
        // Column names from CSV: Country, GDP (nominal per capita), Health Expenditure (%GDP), Inequality (GINI), Poverty (% living below line)
        
        // Process each data row
        let loadedCount = 0;
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          
          // Check if row has Country property
          if (!row || !row['Country']) {
            continue;
          }
          
          const countryName = row['Country'];
          const countryCode = mapCountryNameToCode(countryName);
          
          if (!countryCode) {
            console.log(`Skipping country ${countryName} - no mapping found`);
            continue;
          }
          
          // Extract values from object properties
          const gdpVal = extractNumericValue(row['GDP (nominal per capita)']);
          if (gdpVal !== null) {
            gdpNominal2019[countryCode] = gdpVal;
            gdpPerCapita2019[countryCode] = gdpVal; // Also update old variable for compatibility
          }
          
          const healthVal = extractNumericValue(row['Health Expenditure (%GDP)']);
          if (healthVal !== null) {
            healthExpenditure2019[countryCode] = healthVal;
          }
          
          const giniVal = extractNumericValue(row['Inequality (GINI)']);
          if (giniVal !== null) {
            gini2019[countryCode] = giniVal;
          }
          
          const povertyVal = extractNumericValue(row['Poverty (% living below line)']);
          if (povertyVal !== null) {
            poverty2019[countryCode] = povertyVal;
          }
          
          loadedCount++;
        }
        
        console.log(`Loaded merged_data_2019.csv: ${loadedCount} countries with data`);
        console.log(`GDP data: ${Object.keys(gdpNominal2019).length} countries`, Object.keys(gdpNominal2019).slice(0, 5));
        console.log(`Health Expenditure data: ${Object.keys(healthExpenditure2019).length} countries`);
        console.log(`GINI data: ${Object.keys(gini2019).length} countries`);
        console.log(`Poverty data: ${Object.keys(poverty2019).length} countries`);
        
        // Debug: Log sample values
        if (Object.keys(gdpNominal2019).length > 0) {
          const sampleCountry = Object.keys(gdpNominal2019)[0];
          console.log(`Sample data for ${sampleCountry}:`, {
            gdp: gdpNominal2019[sampleCountry],
            health: healthExpenditure2019[sampleCountry],
            gini: gini2019[sampleCountry],
            poverty: poverty2019[sampleCountry]
          });
        }
        
        return;
      }
    } catch (e) {
      console.warn(`Failed to load from ${p}:`, e);
    }
  }
  console.warn("Unable to load merged_data_2019.csv from known paths.");
}

// Load CSV data for reproduction
async function loadCSVForReproductionData() {
  // Add cache-busting parameter to force reload if needed
  const cacheBuster = Date.now();
  const paths = [
    `./data/HMD.csv?t=${cacheBuster}`, // expected when deployed under docs/
    `../data/HMD.csv?t=${cacheBuster}`, // local dev from project root
    `HMD.csv?t=${cacheBuster}` // last resort (root)
  ];
  
  for (const p of paths) {
    try {
      const res = await fetch(p);
      if (res.ok) {
        const text = await res.text();
        const rows = parseCSV(text);
        console.log("Parsed CSV rows:", rows.length);
        
        const standard = "esp2013";
        state.currentStandard = standard;
        
        const cleaned = tidyRows(rows, standard);
        console.log("Cleaned rows sample:", cleaned[0]);
        const byKey = splitByCountrySex(cleaned);
        state.dataByCountrySex = byKey;
        
        // Fill countries set
        for (const key of byKey.keys()) {
          state.countries.add(key.split("|")[0]);
        }
        
        console.log("Available data keys:", Array.from(byKey.keys()));
        
        return;
      }
    } catch (e) { /* try next */ }
  }
  throw new Error("Unable to load HMD.csv from known paths.");
}

// Parse reproduction data format
function parseReproductionData(text) {
  const lines = text.split('\n');
  const traceConfigs = [];
  let currentTrace = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('Trace ')) {
      if (currentTrace) traceConfigs.push(currentTrace);
      const match = trimmed.match(/Trace \d+: (\w+) \((\w+)\)/);
      if (match) {
        currentTrace = {
          country: match[1],
          sex: match[2]
        };
      }
    } else if (currentTrace && line.startsWith('  ') && trimmed.length > 0) {
      if (trimmed.includes('Baseline Type:')) {
        currentTrace.baselineType = trimmed.split(': ')[1];
      } else if (trimmed.includes('Baseline Range:')) {
        const rangeMatch = trimmed.match(/(\d{4})-W(\d{2}) to (\d{4})-W(\d{2})/);
        if (rangeMatch) {
          currentTrace.baselineFrom = { year: parseInt(rangeMatch[1]), week: parseInt(rangeMatch[2]) };
          currentTrace.baselineTo = { year: parseInt(rangeMatch[3]), week: parseInt(rangeMatch[4]) };
        }
      } else if (trimmed.includes('Start Date:')) {
        currentTrace.startDate = new Date(trimmed.split(': ')[1] + "T00:00:00Z");
      }
    }
  }
  
  if (currentTrace) traceConfigs.push(currentTrace);
  console.log("Parsed trace configs:", traceConfigs.length);
  // Log first few configs to verify baseline ranges
  traceConfigs.slice(0, 3).forEach((cfg, i) => {
    console.log(`Config ${i+1}: ${cfg.country} (${cfg.sex}), baseline: ${cfg.baselineFrom?.year}-W${cfg.baselineFrom?.week} to ${cfg.baselineTo?.year}-W${cfg.baselineTo?.week}`);
  });
  return traceConfigs;
}

// Load traces from reproduction data
function loadTracesFromReproductionData(traceConfigs) {
  console.log("Loading traces from reproduction data, configs:", traceConfigs.length);
  state.dedicatedPermanentTraces = [];
  state.dedicatedPermanentTraceMetadata = [];
  
  let loadedCount = 0;
  for (const config of traceConfigs) {
    try {
      const key = `${config.country}|${config.sex}`;
      const rows = state.dataByCountrySex.get(key);
      
      if (!rows || rows.length === 0) {
        console.warn(`No data found for ${config.country} (${config.sex})`);
        continue;
      }
      
      console.log(`Processing ${config.country} (${config.sex}), rows: ${rows.length}, baseline range: ${config.baselineFrom?.year}-W${config.baselineFrom?.week} to ${config.baselineTo?.year}-W${config.baselineTo?.week}`);
      const baseline = computeBaseline(config.baselineType, rows, config.baselineFrom, config.baselineTo);
      console.log(`  Baseline computed, length: ${baseline.length}`);
      addToDedicatedPermanentPlot(rows, baseline, config.startDate, config.country, config.sex, config.baselineFrom, config.baselineTo, config.baselineType);
      loadedCount++;
      
    } catch (e) {
      console.error("Error processing trace:", config, e);
      continue;
    }
  }
  
    console.log(`Loaded ${loadedCount} traces out of ${traceConfigs.length} configs`);
    if (loadedCount === 0) {
      alert("No traces were loaded! Check console for details.");
    }
}

// Baseline comparison functions
const baselineFiles = [
  '20162019qpr.txt',
  '20152019qpr.txt',
  '20142019qpr.txt',
  '20132019qpr.txt',
  '20122019qpr.txt',
  '20112019qpr.txt',
  '20102019qpr.txt',
  'QPR-RSMEmin.txt'
];

// Generate baseline comparison for all baselines
async function generateBaselineComparison() {
  const gridContainer = document.getElementById('baselineComparisonGrid');
  const statusDiv = document.getElementById('baselineComparisonStatus');
  const generateBtn = document.getElementById('generateBaselineComparisonBtn');
  
  if (!gridContainer || !statusDiv || !generateBtn) {
    console.error('Baseline comparison elements not found');
    return;
  }
  
  // Disable button and show loading
  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';
  statusDiv.textContent = 'Starting...';
  gridContainer.style.display = 'none';
  gridContainer.innerHTML = '';
  
  // Save current state
  const originalFile = document.getElementById('dataFileSelect')?.value || 'QPR-RSMEmin.txt';
  const originalTraces = [...state.dedicatedPermanentTraces];
  const originalMetadata = [...state.dedicatedPermanentTraceMetadata];
  
  const results = [];
  
  try {
    for (let i = 0; i < baselineFiles.length; i++) {
      const filename = baselineFiles[i];
      statusDiv.textContent = `Processing ${i + 1}/${baselineFiles.length}: ${filename}...`;
      
      // Load the baseline file
      await loadDataFile(filename);
      
      // Wait a bit for state to settle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Process this baseline
      const result = await processBaselineForComparison(filename);
      results.push(result);
    }
    
    // Restore original state
    statusDiv.textContent = 'Restoring original baseline...';
    await loadDataFile(originalFile);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Render all results
    renderBaselineComparisonGrid(results);
    gridContainer.style.display = 'block';
    
    // Render aggregated views
    renderAggregatedViews(results);
    const aggregatedContainer = document.getElementById('baselineComparisonAggregated');
    if (aggregatedContainer) {
      aggregatedContainer.style.display = 'block';
    }
    
    // Show export buttons
    const exportAggregatedBtn = document.getElementById('exportAggregatedPDFBtn');
    if (exportAggregatedBtn) {
      exportAggregatedBtn.style.display = 'block';
    }
    
    const exportIndividualBtn = document.getElementById('exportIndividualBaselinesPDFBtn');
    if (exportIndividualBtn) {
      exportIndividualBtn.style.display = 'block';
    }
    
    statusDiv.textContent = 'Complete!';
    
  } catch (error) {
    console.error('Error generating baseline comparison:', error);
    statusDiv.textContent = `Error: ${error.message}`;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Baseline Comparison';
  }
}

// Process a single baseline and return results
async function processBaselineForComparison(filename) {
  const baselineName = getBaselineDisplayName(filename);
  
  // Get all traces (we'll use all countries for fixed regression)
  const allTraces = state.dedicatedPermanentTraces;
  
  if (!allTraces || allTraces.length === 0) {
    return {
      filename,
      baselineName,
      error: 'No traces available'
    };
  }
  
  // Clear cache to ensure we calculate fresh regression for this baseline
  fixedRegressionsCache['2025'] = null;
  
  // Calculate 2024 fixed regression (will be fresh since cache is cleared)
  const regression = calculateFixedRegression(2024);
  if (!regression) {
    return {
      filename,
      baselineName,
      error: 'Failed to calculate regression'
    };
  }
  
  // Generate residual evolution data (isolated type)
  const residualData = generateResidualEvolutionData(allTraces, '2024-fixed', 'isolated');
  
  // Calculate variance
  const varianceData = calculateResidualVariance(residualData);
  
  // Get weights
  const weights = regression.coefficients;
  
  // Calculate regression summary
  const regressionSummary = calculateRegressionSummaryForBaseline(allTraces, regression);
  
  // Generate plot data
  const plotData = generateResidualEvolutionPlotData(residualData);
  
  // Extract slope and intercept for each country
  const baselineSlopes = await extractBaselineSlopesIntercepts(filename);
  
  // Extract 2025 cumulative excess values for each country
  const cumulativeExcess2025 = {};
  allTraces.forEach((trace, index) => {
    const metadata = state.dedicatedPermanentTraceMetadata[index];
    if (!metadata || !metadata.country) return;
    
    const excessValue = getExcessValue('2025', trace);
    if (excessValue && excessValue.excess !== null && isFinite(excessValue.excess)) {
      cumulativeExcess2025[metadata.country] = excessValue.excess;
    }
  });
  
  return {
    filename,
    baselineName,
    regression,
    residualData,
    varianceData,
    weights,
    regressionSummary,
    plotData,
    baselineSlopes,
    cumulativeExcess2025
  };
}

// Extract slope and intercept for each country for a given baseline file
async function extractBaselineSlopesIntercepts(filename) {
  const slopes = {};
  
  // Load and parse the specific baseline file to get the trace configs for this baseline
  let traceConfigs = [];
  try {
    const response = await fetch(`./data/${filename}`);
    const text = await response.text();
    traceConfigs = parseReproductionData(text);
  } catch (e) {
    console.warn('Could not load file for slope extraction:', e);
    return slopes;
  }
  
  // Process each trace config from this specific file
  for (const config of traceConfigs) {
    const country = config.country;
    const key = `${country}|${config.sex}`;
    const rows = state.dataByCountrySex.get(key);
    
    if (!rows || rows.length === 0) continue;
    
    // Fit a linear trend to the baseline values for all baseline types
    // We'll use the baseline window data and fit y = intercept + slope*x
    if (!config.baselineFrom || !config.baselineTo) continue;
    
    const window = interpolateInsideWindow(getWindow(rows, config.baselineFrom, config.baselineTo));
    const xs = [], ys = [];
    for (const r of window) {
      if (!isFinite(r.ASMR100k)) continue;
      const x = r.Year*100 + r.Week;
      xs.push(x); ys.push(r.ASMR100k);
    }
    
    if (xs.length < 2) {
      if (!slopes[country]) {
        slopes[country] = { slope: null, intercept: null };
      }
      continue;
    }
    
    // Fit linear regression: y = intercept + slope*x
    const n = xs.length;
    const sumX = xs.reduce((a,b)=>a+b,0);
    const sumY = ys.reduce((a,b)=>a+b,0);
    const sumXX = xs.reduce((a,b)=>a+b*b,0);
    const sumXY = xs.reduce((a,xi,i)=>a + xi*ys[i],0);
    const denom = n*sumXX - sumX*sumX;
    
    if (Math.abs(denom) < 1e-10) {
      if (!slopes[country]) {
        slopes[country] = { slope: null, intercept: null };
      }
      continue;
    }
    
    const slope = (n*sumXY - sumX*sumY)/denom;
    const intercept = (sumY - slope*sumX)/n;
    
    slopes[country] = { slope, intercept };
  }
  
  console.log(`Extracted slopes for ${Object.keys(slopes).length} countries from ${filename}`);
  return slopes;
}

// Generate residual evolution data for a baseline
function generateResidualEvolutionData(filteredTraces, mode, residualType = 'isolated') {
  const years = [2021, 2022, 2023, 2024, 2025];
  const countryResiduals = new Map();
  const isIsolated = residualType === 'isolated';
  
  // Initialize data structure for each country
  filteredTraces.forEach(trace => {
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata) return;
    countryResiduals.set(trace.name, {
      name: trace.name,
      country: metadata.country,
      residuals: []
    });
  });
  
  // Calculate residuals for each year
  for (const year of years) {
    const yearValue = isIsolated ? `${year}-isolated` : `${year}`;
    
    // Build scatterData for this year
    const scatterData = [];
    filteredTraces.forEach((trace) => {
      const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
      if (traceIndex < 0) return;
      
      const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
      if (!metadata || !metadata.originalRows) return;
      
      const avgASMR = calculateAverageASMR(metadata.originalRows, '2019');
      if (avgASMR === null || !isFinite(avgASMR)) return;
      
      const gdp = gdpNominal2019[metadata.country];
      const gini = gini2019[metadata.country];
      const poverty = poverty2019[metadata.country];
      const healthExp = healthExpenditure2019[metadata.country];
      
      const excessResult = getExcessValue(yearValue, trace);
      if (excessResult && excessResult.excess !== null && isFinite(excessResult.excess)) {
        scatterData.push({
          name: trace.name,
          country: metadata.country,
          asmr: avgASMR,
          gdp: gdp,
          gini: gini,
          poverty: poverty,
          healthExp: healthExp,
          excess: excessResult.excess
        });
      }
    });
    
    if (scatterData.length < 6) {
      // Need to build from all countries for regression
      const allScatterData = [];
      state.dedicatedPermanentTraces.forEach((trace, traceIndex) => {
        const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
        if (!metadata || !metadata.originalRows) return;
        
        const avgASMR = calculateAverageASMR(metadata.originalRows, '2019');
        if (avgASMR === null || !isFinite(avgASMR)) return;
        
        const gdp = gdpNominal2019[metadata.country];
        const gini = gini2019[metadata.country];
        const poverty = poverty2019[metadata.country];
        const healthExp = healthExpenditure2019[metadata.country];
        
        const excessResult = getExcessValue(yearValue, trace);
        if (excessResult && excessResult.excess !== null && isFinite(excessResult.excess)) {
          allScatterData.push({
            name: trace.name,
            country: metadata.country,
            asmr: avgASMR,
            gdp: gdp,
            gini: gini,
            poverty: poverty,
            healthExp: healthExp,
            excess: excessResult.excess
          });
        }
      });
      
      if (allScatterData.length < 6) {
        countryResiduals.forEach((data) => {
          data.residuals.push(null);
        });
        continue;
      }
      
      // Fit regression on all countries
      const allAsmrData = allScatterData.map(d => d.asmr);
      const allGdpData = allScatterData.map(d => d.gdp);
      const allGiniData = allScatterData.map(d => d.gini);
      const allPovertyData = allScatterData.map(d => d.poverty);
      const allHealthExpData = allScatterData.map(d => d.healthExp);
      const allExcessData = allScatterData.map(d => d.excess);
      
      const regression = fitMultipleRegression5(
        allAsmrData, 
        allGdpData, 
        allGiniData, 
        allPovertyData, 
        allHealthExpData, 
        allExcessData
      );
      
      if (!regression) {
        countryResiduals.forEach((data) => {
          data.residuals.push(null);
        });
        continue;
      }
      
      // Calculate residuals for filtered countries
      scatterData.forEach(d => {
        const compositeIndex = regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp);
        const actual = d.excess;
        const xData = scatterData.map(sd => regression.predict(sd.asmr, sd.gdp, sd.gini, sd.poverty, sd.healthExp));
        const yData = scatterData.map(sd => sd.excess);
        const trendLine = fitPolynomialTrend(xData, yData, 1);
        
        let residual = null;
        if (trendLine && trendLine.coefficients) {
          let trendPred = 0;
          for (let j = 0; j < trendLine.coefficients.length; j++) {
            trendPred += trendLine.coefficients[j] * Math.pow(compositeIndex, j);
          }
          residual = actual - trendPred;
        } else {
          residual = actual - compositeIndex;
        }
        
        const countryData = countryResiduals.get(d.name);
        if (countryData) {
          countryData.residuals.push(residual);
        }
      });
      
      countryResiduals.forEach((data, name) => {
        if (!scatterData.find(d => d.name === name)) {
          data.residuals.push(null);
        }
      });
    } else {
      // Enough filtered data, use fixed regression
      let regression;
      
      if (mode === '2024-fixed' || mode === '2023-fixed' || mode === '2022-fixed') {
        const fixedYear = parseInt(mode.replace('-fixed', ''));
        regression = calculateFixedRegression(fixedYear);
        if (!regression) {
          countryResiduals.forEach((data) => {
            data.residuals.push(null);
          });
          continue;
        }
      } else {
        const asmrData = scatterData.map(d => d.asmr);
        const gdpData = scatterData.map(d => d.gdp);
        const giniData = scatterData.map(d => d.gini);
        const povertyData = scatterData.map(d => d.poverty);
        const healthExpData = scatterData.map(d => d.healthExp);
        const excessData = scatterData.map(d => d.excess);
        
        regression = fitMultipleRegression5(
          asmrData, 
          gdpData, 
          giniData, 
          povertyData, 
          healthExpData, 
          excessData
        );
        
        if (!regression) {
          countryResiduals.forEach((data) => {
            data.residuals.push(null);
          });
          continue;
        }
      }
      
      // Calculate composite indices and fit trend line
      const compositeIndices = scatterData.map(d => 
        regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp)
      );
      const actualValues = scatterData.map(d => d.excess);
      const trendLine = fitPolynomialTrend(compositeIndices, actualValues, 1);
      
      // Calculate residuals for each country
      scatterData.forEach((d, idx) => {
        const compositeIndex = compositeIndices[idx];
        const actual = actualValues[idx];
        
        let residual = null;
        if (trendLine && trendLine.coefficients) {
          let trendPred = 0;
          for (let j = 0; j < trendLine.coefficients.length; j++) {
            trendPred += trendLine.coefficients[j] * Math.pow(compositeIndex, j);
          }
          residual = actual - trendPred;
        } else {
          residual = actual - compositeIndex;
        }
        
        const countryData = countryResiduals.get(d.name);
        if (countryData) {
          countryData.residuals.push(residual);
        }
      });
    }
  }
  
  return countryResiduals;
}

// Calculate variance of residuals for each year
function calculateResidualVariance(countryResiduals) {
  const years = [2021, 2022, 2023, 2024, 2025];
  const varianceData = [];
  
  for (let yearIndex = 0; yearIndex < years.length; yearIndex++) {
    const year = years[yearIndex];
    const residualsForYear = [];
    countryResiduals.forEach((countryData) => {
      const residual = countryData.residuals[yearIndex];
      if (residual !== null && isFinite(residual)) {
        residualsForYear.push(residual);
      }
    });
    
    if (residualsForYear.length > 0) {
      const mean = residualsForYear.reduce((sum, r) => sum + r, 0) / residualsForYear.length;
      const variance = residualsForYear.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / residualsForYear.length;
      varianceData.push({
        year: year,
        variance: variance,
        count: residualsForYear.length
      });
    } else {
      varianceData.push({
        year: year,
        variance: null,
        count: 0
      });
    }
  }
  
  return varianceData;
}

// Generate plot data for residual evolution
function generateResidualEvolutionPlotData(countryResiduals) {
  const years = [2021, 2022, 2023, 2024, 2025];
  const traces = [];
  
  countryResiduals.forEach((countryData, name) => {
    if (countryData.residuals.some(r => r !== null && isFinite(r))) {
      traces.push({
        x: years,
        y: countryData.residuals,
        name: name
      });
    }
  });
  
  return traces;
}

// Calculate regression summary for a baseline
function calculateRegressionSummaryForBaseline(filteredTraces, regression) {
  const factors = [
    { key: '2019', label: '2019 ASMR' },
    { key: 'gdp', label: 'GDP (Nominal) per Capita' },
    { key: 'gini', label: 'Inequality (GINI)' },
    { key: 'poverty', label: 'Poverty (% living below line)' },
    { key: 'health_expenditure', label: 'Health Expenditure (%GDP)' }
  ];
  
  const results = [];
  const year = 2025;
  const yearStart = new Date(`${year}-01-01T00:00:00Z`);
  const yearValue = `${year}`;
  
  // Calculate for each factor
  factors.forEach(factor => {
    const scatterData = [];
    
    filteredTraces.forEach((trace) => {
      const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
      if (traceIndex < 0) return;
      
      const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
      if (!metadata || !metadata.originalRows) return;
      
      const xValue = getXAxisValue(metadata.country, metadata.originalRows, factor.key);
      if (xValue === null || !isFinite(xValue)) return;
      
      const excessResult = getExcessValue(yearValue, trace);
      if (excessResult && excessResult.excess !== null && isFinite(excessResult.excess)) {
        scatterData.push({
          x: xValue,
          y: excessResult.excess
        });
      }
    });
    
    if (scatterData.length >= 3) {
      const xData = scatterData.map(d => d.x);
      const yData = scatterData.map(d => d.y);
      const trendLine = fitPolynomialTrend(xData, yData, 2);
      
      if (trendLine && isFinite(trendLine.rSquared)) {
        results.push({
          factor: factor.label,
          rSquared: trendLine.rSquared,
          pValue: trendLine.pValue
        });
      } else {
        results.push({
          factor: factor.label,
          rSquared: null,
          pValue: null
        });
      }
    } else {
      results.push({
        factor: factor.label,
        rSquared: null,
        pValue: null
      });
    }
  });
  
  // Calculate for Composite Index
  const compositeData = [];
  filteredTraces.forEach((trace) => {
    const traceIndex = state.dedicatedPermanentTraces.findIndex(t => t.name === trace.name);
    if (traceIndex < 0) return;
    
    const metadata = state.dedicatedPermanentTraceMetadata[traceIndex];
    if (!metadata || !metadata.originalRows) return;
    
    const avgASMR = calculateAverageASMR(metadata.originalRows, '2019');
    if (avgASMR === null || !isFinite(avgASMR)) return;
    
    const gdp = gdpNominal2019[metadata.country];
    const gini = gini2019[metadata.country];
    const poverty = poverty2019[metadata.country];
    const healthExp = healthExpenditure2019[metadata.country];
    
    const excessResult = getExcessValue(yearValue, trace);
    if (excessResult && excessResult.excess !== null && isFinite(excessResult.excess)) {
      compositeData.push({
        asmr: avgASMR,
        gdp: gdp,
        gini: gini,
        poverty: poverty,
        healthExp: healthExp,
        excess: excessResult.excess
      });
    }
  });
  
  if (compositeData.length >= 6) {
    const compositeIndices = compositeData.map(d => 
      regression.predict(d.asmr, d.gdp, d.gini, d.poverty, d.healthExp)
    );
    const excessData = compositeData.map(d => d.excess);
    const trendLine = fitPolynomialTrend(compositeIndices, excessData, 1);
    
    if (trendLine && isFinite(trendLine.rSquared)) {
      results.push({
        factor: 'Structural Vulnerability Index',
        rSquared: trendLine.rSquared,
        pValue: trendLine.pValue
      });
    }
  }
  
  return results;
}

// Render the baseline comparison grid
function renderBaselineComparisonGrid(results) {
  const gridContainer = document.getElementById('baselineComparisonGrid');
  if (!gridContainer) return;
  
  const exportContainer = document.getElementById('individualBaselinesForExport');
  if (!exportContainer) return;
  
  // Render for display (with dark theme)
  let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px; margin-top: 20px;">';
  
  // Render for export (with white background)
  let exportHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px; margin-top: 20px;">';
  
  results.forEach((result, index) => {
    if (result.error) {
      html += `<div class="chart-card" style="padding: 20px;">
        <h3>${result.baselineName}</h3>
        <p style="color: var(--muted);">Error: ${result.error}</p>
      </div>`;
      exportHtml += `<div style="padding: 20px; border: 1px solid #ccc; border-radius: 4px; background: white; color: black;">
        <h3 style="margin-top: 0; color: black;">${result.baselineName}</h3>
        <p style="color: #666;">Error: ${result.error}</p>
      </div>`;
      return;
    }
    
    const plotId = `baselinePlot_${index}`;
    const varianceTableId = `baselineVariance_${index}`;
    const weightsTableId = `baselineWeights_${index}`;
    const regressionTableId = `baselineRegression_${index}`;
    
    const exportPlotId = `exportBaselinePlot_${index}`;
    const exportVarianceTableId = `exportBaselineVariance_${index}`;
    const exportWeightsTableId = `exportBaselineWeights_${index}`;
    const exportRegressionTableId = `exportBaselineRegression_${index}`;
    
    // Display version (dark theme)
    html += `<div class="chart-card" style="padding: 20px;">
      <h3 style="margin-top: 0;">${result.baselineName}</h3>
      
      <h4 style="margin-top: 20px; margin-bottom: 10px;">Residual Evolution Over Time (Isolated)</h4>
      <div id="${plotId}" class="chart" style="height: 300px;"></div>
      
      <h4 style="margin-top: 20px; margin-bottom: 10px;">Variance of Residuals by Year</h4>
      <div id="${varianceTableId}"></div>
      
      <h4 style="margin-top: 20px; margin-bottom: 10px;">Current Index Weights (2024 Fixed)</h4>
      <div id="${weightsTableId}"></div>
      
      <h4 style="margin-top: 20px; margin-bottom: 10px;">Regression Summary (R² and p-values)</h4>
      <div id="${regressionTableId}"></div>
    </div>`;
    
    // Export version (white background)
    exportHtml += `<div style="padding: 20px; border: 1px solid #ccc; border-radius: 4px; background: white; color: black; page-break-inside: avoid;">
      <h3 style="margin-top: 0; color: black;">${result.baselineName}</h3>
      
      <h4 style="margin-top: 20px; margin-bottom: 10px; color: black;">Residual Evolution Over Time (Isolated)</h4>
      <div id="${exportPlotId}" class="chart" style="height: 300px; background: white;"></div>
      
      <h4 style="margin-top: 20px; margin-bottom: 10px; color: black;">Variance of Residuals by Year</h4>
      <div id="${exportVarianceTableId}"></div>
      
      <h4 style="margin-top: 20px; margin-bottom: 10px; color: black;">Current Index Weights (2025 Fixed)</h4>
      <div id="${exportWeightsTableId}"></div>
      
      <h4 style="margin-top: 20px; margin-bottom: 10px; color: black;">Regression Summary (R² and p-values)</h4>
      <div id="${exportRegressionTableId}"></div>
    </div>`;
  });
  
  html += '</div>';
  exportHtml += '</div>';
  
  // Render display version
  const displayContainer = document.getElementById('individualBaselinesDisplay');
  if (displayContainer) {
    displayContainer.innerHTML = html;
  }
  
  // Render export version (hidden)
  exportContainer.innerHTML = exportHtml;
  
  // Render plots and tables for each result (both display and export versions)
  results.forEach((result, index) => {
    if (result.error) return;
    
    const plotId = `baselinePlot_${index}`;
    const varianceTableId = `baselineVariance_${index}`;
    const weightsTableId = `baselineWeights_${index}`;
    const regressionTableId = `baselineRegression_${index}`;
    
    const exportPlotId = `exportBaselinePlot_${index}`;
    const exportVarianceTableId = `exportBaselineVariance_${index}`;
    const exportWeightsTableId = `exportBaselineWeights_${index}`;
    const exportRegressionTableId = `exportBaselineRegression_${index}`;
    
    // Helper function to render table with white background styling
    const renderTableForExport = (containerId, tableHtml) => {
      const container = document.getElementById(containerId);
      if (container) {
        // Create table with inline white background styles from the start
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tableHtml;
        const tables = tempDiv.querySelectorAll('table');
        tables.forEach(table => {
          // Set inline styles directly
          table.setAttribute('style', 'width: 100%; border-collapse: collapse; background: white !important; background-color: white !important; color: black !important;');
          const rows = table.querySelectorAll('tr');
          rows.forEach(row => {
            row.setAttribute('style', 'background: white !important; background-color: white !important; color: black !important;');
          });
          const cells = table.querySelectorAll('td, th');
          cells.forEach(cell => {
            const existingStyle = cell.getAttribute('style') || '';
            cell.setAttribute('style', existingStyle + ' background: white !important; background-color: white !important; color: black !important; border-color: #ccc;');
          });
        });
        container.innerHTML = tempDiv.innerHTML;
      }
    };
    
    // Render plot (display version)
    const plotContainer = document.getElementById(plotId);
    if (plotContainer && result.plotData) {
      const plotTraces = result.plotData.map(trace => ({
        x: trace.x,
        y: trace.y,
        mode: 'lines+markers',
        type: 'scatter',
        name: trace.name,
        line: { width: 1.5 },
        marker: { size: 4 },
        connectgaps: false
      }));
      
      const zeroLine = {
        x: [2021, 2025],
        y: [0, 0],
        mode: 'lines',
        type: 'scatter',
        showlegend: false,
        line: { color: 'rgba(255, 100, 100, 0.6)', width: 1, dash: 'dash' }
      };
      
      Plotly.react(plotContainer, [...plotTraces, zeroLine], {
        paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: { title: "Year", type: 'linear', tickmode: 'linear', tick0: 2021, dtick: 1 },
        yaxis: { title: "Residual (Isolated Year Excess - Predicted)", type: 'linear' },
        margin: { t: 20, r: 10, b: 50, l: 70 },
        showlegend: true,
        legend: { x: 1.02, y: 1, xanchor: 'left', yanchor: 'top' }
      }, { responsive: true, displayModeBar: true });
    }
    
    // Render variance table (display and export)
    const varianceContainer = document.getElementById(varianceTableId);
    const exportVarianceContainer = document.getElementById(exportVarianceTableId);
    if (result.varianceData) {
      let tableHtml = '<table class="summary-table" style="max-width: 400px;">';
      tableHtml += '<thead><tr><th>Year</th><th>Variance</th><th>N</th></tr></thead>';
      tableHtml += '<tbody>';
      result.varianceData.forEach(data => {
        if (data.variance !== null) {
          tableHtml += `<tr><td>${data.year}</td><td>${data.variance.toFixed(4)}</td><td>${data.count}</td></tr>`;
        } else {
          tableHtml += `<tr><td>${data.year}</td><td>—</td><td>0</td></tr>`;
        }
      });
      tableHtml += '</tbody></table>';
      
      if (varianceContainer) varianceContainer.innerHTML = tableHtml;
      
      // For export, create table with inline white styles
      if (exportVarianceContainer) {
        let exportTableHtml = '<table style="width: 100%; border-collapse: collapse; background: white; background-color: white; color: black; max-width: 400px;">';
        exportTableHtml += '<thead><tr><th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">Year</th><th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">Variance</th><th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">N</th></tr></thead>';
        exportTableHtml += '<tbody>';
        result.varianceData.forEach(data => {
          if (data.variance !== null) {
            exportTableHtml += `<tr style="background: white; background-color: white; color: black;"><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${data.year}</td><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${data.variance.toFixed(4)}</td><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${data.count}</td></tr>`;
          } else {
            exportTableHtml += `<tr style="background: white; background-color: white; color: black;"><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${data.year}</td><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">—</td><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">0</td></tr>`;
          }
        });
        exportTableHtml += '</tbody></table>';
        exportVarianceContainer.innerHTML = exportTableHtml;
      }
    }
    
    // Render weights table (display and export)
    const weightsContainer = document.getElementById(weightsTableId);
    const exportWeightsContainer = document.getElementById(exportWeightsTableId);
    if (result.weights) {
      const factorNames = [
        'Intercept',
        '2019 ASMR',
        'GDP (Nominal) per Capita',
        'Inequality (GINI)',
        'Poverty (% living below line)',
        'Health Expenditure (%GDP)'
      ];
      
      let tableHtml = '<table class="summary-table" style="max-width: 600px;">';
      tableHtml += '<thead><tr><th>Factor</th><th>Coefficient</th></tr></thead>';
      tableHtml += '<tbody>';
      for (let i = 0; i < result.weights.length; i++) {
        tableHtml += `<tr><td>${factorNames[i]}</td><td>${result.weights[i].toFixed(4)}</td></tr>`;
      }
      tableHtml += '</tbody></table>';
      
      if (weightsContainer) weightsContainer.innerHTML = tableHtml;
      
      // For export, create table with inline white styles
      if (exportWeightsContainer) {
        let exportTableHtml = '<table style="width: 100%; border-collapse: collapse; background: white; background-color: white; color: black; max-width: 600px;">';
        exportTableHtml += '<thead><tr><th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">Factor</th><th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">Coefficient</th></tr></thead>';
        exportTableHtml += '<tbody>';
        for (let i = 0; i < result.weights.length; i++) {
          exportTableHtml += `<tr style="background: white; background-color: white; color: black;"><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${factorNames[i]}</td><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${result.weights[i].toFixed(4)}</td></tr>`;
        }
        exportTableHtml += '</tbody></table>';
        exportWeightsContainer.innerHTML = exportTableHtml;
      }
    }
    
    // Render regression summary table (display and export)
    const regressionContainer = document.getElementById(regressionTableId);
    const exportRegressionContainer = document.getElementById(exportRegressionTableId);
    if (result.regressionSummary) {
      let tableHtml = '<table class="summary-table">';
      tableHtml += '<thead><tr><th>Factor</th><th>R²</th><th>p-value</th></tr></thead>';
      tableHtml += '<tbody>';
      result.regressionSummary.forEach(item => {
        const rSquared = item.rSquared !== null ? item.rSquared.toFixed(4) : '—';
        // Format p-value with scientific notation for very small values
        let pValueFormatted = '—';
        if (item.pValue !== null) {
          if (item.pValue < 0.0001) {
            pValueFormatted = item.pValue.toExponential(2);
          } else {
            pValueFormatted = item.pValue.toFixed(4);
          }
        }
        tableHtml += `<tr><td>${item.factor}</td><td>${rSquared}</td><td>${pValueFormatted}</td></tr>`;
      });
      tableHtml += '</tbody></table>';
      
      if (regressionContainer) regressionContainer.innerHTML = tableHtml;
      
      // For export, create table with inline white styles
      if (exportRegressionContainer) {
        let exportTableHtml = '<table style="width: 100%; border-collapse: collapse; background: white; background-color: white; color: black;">';
        exportTableHtml += '<thead><tr><th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">Factor</th><th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">R²</th><th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">p-value</th></tr></thead>';
        exportTableHtml += '<tbody>';
        result.regressionSummary.forEach(item => {
          const rSquared = item.rSquared !== null ? item.rSquared.toFixed(4) : '—';
          // Format p-value with scientific notation for very small values
          let pValueFormatted = '—';
          if (item.pValue !== null) {
            if (item.pValue < 0.0001) {
              pValueFormatted = item.pValue.toExponential(2);
            } else {
              pValueFormatted = item.pValue.toFixed(4);
            }
          }
          exportTableHtml += `<tr style="background: white; background-color: white; color: black;"><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${item.factor}</td><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${rSquared}</td><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${pValueFormatted}</td></tr>`;
        });
        exportTableHtml += '</tbody></table>';
        exportRegressionContainer.innerHTML = exportTableHtml;
      }
    }
    
    // Render plot for export version (with white background)
    const exportPlotContainer = document.getElementById(exportPlotId);
    if (exportPlotContainer && result.plotData) {
      const plotTraces = result.plotData.map(trace => ({
        x: trace.x,
        y: trace.y,
        mode: 'lines+markers',
        type: 'scatter',
        name: trace.name,
        line: { width: 1.5 },
        marker: { size: 4 },
        connectgaps: false,
        showlegend: true
      }));
      
      const zeroLine = {
        x: [2021, 2025],
        y: [0, 0],
        mode: 'lines',
        type: 'scatter',
        showlegend: false,
        line: { color: 'rgba(255, 100, 100, 0.6)', width: 1, dash: 'dash' }
      };
      
      Plotly.react(exportPlotContainer, [...plotTraces, zeroLine], {
        paper_bgcolor: "white", 
        plot_bgcolor: "white",
        xaxis: { title: "Year", type: 'linear', tickmode: 'linear', tick0: 2021, dtick: 1, gridcolor: '#e0e0e0' },
        yaxis: { title: "Residual (Isolated Year Excess - Predicted)", type: 'linear', gridcolor: '#e0e0e0' },
        margin: { t: 20, r: 10, b: 50, l: 70 },
        showlegend: true,
        legend: { x: 1.02, y: 1, xanchor: 'left', yanchor: 'top' },
        font: { color: 'black' }
      }, { responsive: true, displayModeBar: false });
    }
  });
}

// Render aggregated views (plots grid and aggregated tables)
function renderAggregatedViews(results) {
  renderAggregatedPlotsGrid(results);
  renderAggregatedVarianceTable(results);
  renderAggregatedWeightsTable(results);
  renderAggregatedRegressionTable(results);
  renderAggregatedSlopesTable(results);
  renderAggregatedVarianceComparisonTable(results);
}

// Render aggregated plots grid
function renderAggregatedPlotsGrid(results) {
  const plotsGridContainer = document.getElementById('baselinePlotsGrid');
  if (!plotsGridContainer) return;
  
  plotsGridContainer.innerHTML = '';
  
  results.forEach((result, index) => {
    if (result.error || !result.plotData) return;
    
    const plotId = `aggregatedPlot_${index}`;
    const plotDiv = document.createElement('div');
    plotDiv.style.cssText = 'border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 10px; background: rgba(255,255,255,0.02);';
    plotDiv.innerHTML = `<h5 style="margin: 0 0 10px 0; font-size: 0.9em;">${result.baselineName}</h5><div id="${plotId}" class="chart" style="height: 250px;"></div>`;
    plotsGridContainer.appendChild(plotDiv);
    
    // Render plot
    setTimeout(() => {
      const plotContainer = document.getElementById(plotId);
      if (plotContainer) {
        const plotTraces = result.plotData.map(trace => ({
          x: trace.x,
          y: trace.y,
          mode: 'lines+markers',
          type: 'scatter',
          name: trace.name,
          line: { width: 1.5 },
          marker: { size: 3 },
          connectgaps: false,
          showlegend: false
        }));
        
        const zeroLine = {
          x: [2021, 2025],
          y: [0, 0],
          mode: 'lines',
          type: 'scatter',
          showlegend: false,
          line: { color: 'rgba(255, 100, 100, 0.6)', width: 1, dash: 'dash' }
        };
        
        Plotly.react(plotContainer, [...plotTraces, zeroLine], {
          paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
          xaxis: { title: "Year", type: 'linear', tickmode: 'linear', tick0: 2021, dtick: 1 },
          yaxis: { title: "Residual", type: 'linear' },
          margin: { t: 10, r: 10, b: 40, l: 50 },
          showlegend: false
        }, { responsive: true, displayModeBar: false });
      }
    }, 100);
  });
  
  // Add Idealised Equilibrium Shock plot
  const idealizedPlotId = 'idealizedEquilibriumShock';
  const idealizedPlotDiv = document.createElement('div');
  idealizedPlotDiv.style.cssText = 'border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 10px; background: rgba(255,255,255,0.02);';
  idealizedPlotDiv.innerHTML = `<h5 style="margin: 0 0 10px 0; font-size: 0.9em;">Idealised Equilibrium Shock</h5><div id="${idealizedPlotId}" class="chart" style="height: 250px;"></div>`;
  plotsGridContainer.appendChild(idealizedPlotDiv);
  
  setTimeout(() => {
    const idealizedContainer = document.getElementById(idealizedPlotId);
    if (idealizedContainer) {
      const years = [2021, 2022, 2023, 2024, 2025];
      
      // Positive line: starts at large positive value, decays exponentially to 0
      const positiveLine = {
        x: years,
        y: years.map(year => {
          // Exponential decay from 150 at 2021 to 0 at 2025
          const t = (year - 2021) / 4; // 0 to 1
          return 150 * Math.exp(-3 * t); // Exponential decay with decay constant
        }),
        mode: 'lines+markers',
        type: 'scatter',
        name: 'Positive Shock',
        line: { width: 1.5, color: 'rgba(96, 165, 250, 0.8)' },
        marker: { size: 3, color: 'rgba(96, 165, 250, 0.8)' },
        showlegend: false
      };
      
      // Negative line: starts at large negative value, decays exponentially to 0
      const negativeLine = {
        x: years,
        y: years.map(year => {
          // Exponential decay from -150 at 2021 to 0 at 2025
          const t = (year - 2021) / 4; // 0 to 1
          return -150 * Math.exp(-3 * t); // Exponential decay with decay constant
        }),
        mode: 'lines+markers',
        type: 'scatter',
        name: 'Negative Shock',
        line: { width: 1.5, color: 'rgba(96, 165, 250, 0.8)' },
        marker: { size: 3, color: 'rgba(96, 165, 250, 0.8)' },
        showlegend: false
      };
      
      const zeroLine = {
        x: [2021, 2025],
        y: [0, 0],
        mode: 'lines',
        type: 'scatter',
        showlegend: false,
        line: { color: 'rgba(255, 100, 100, 0.6)', width: 1, dash: 'dash' }
      };
      
      Plotly.react(idealizedContainer, [positiveLine, negativeLine, zeroLine], {
        paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: { title: "Year", type: 'linear', tickmode: 'linear', tick0: 2021, dtick: 1 },
        yaxis: { title: "Residual", type: 'linear' },
        margin: { t: 10, r: 10, b: 40, l: 50 },
        showlegend: false,
        font: { color: 'black' }
      }, { responsive: true, displayModeBar: false });
    }
  }, 100);
}

// Render aggregated variance table
function renderAggregatedVarianceTable(results) {
  const container = document.getElementById('aggregatedVarianceTable');
  if (!container) return;
  
  const validResults = results.filter(r => !r.error && r.varianceData);
  if (validResults.length === 0) {
    container.innerHTML = '<p style="color: var(--muted);">No data available</p>';
    return;
  }
  
  // Sort results: 2024 RMSE first, then others
  const sortedResults = [...validResults].sort((a, b) => {
    if (a.filename === 'QPR-RSMEmin.txt') return -1;
    if (b.filename === 'QPR-RSMEmin.txt') return 1;
    return a.baselineName.localeCompare(b.baselineName);
  });
  
  // Display labels: 2020-2024 (but varianceData may use actual years 2021-2025)
  const years = [2020, 2021, 2022, 2023, 2024];
  
  let html = '<div style="overflow-x: auto;"><table class="summary-table" style="background: white; background-color: white; color: black;">';
  html += '<thead><tr><th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">Year</th>';
  sortedResults.forEach(result => {
    html += `<th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${result.baselineName}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  // Find minimum variance for each year
  // Note: Display years are 2020-2024, but varianceData uses actual years 2021-2025
  const minVariancesByYear = {};
  years.forEach(displayYear => {
    const lookupYear = displayYear + 1; // Map display year to lookup year
    let minVariance = Infinity;
    sortedResults.forEach(result => {
      const yearData = result.varianceData.find(d => d.year === lookupYear);
      if (yearData && yearData.variance !== null && yearData.variance < minVariance) {
        minVariance = yearData.variance;
      }
    });
    minVariancesByYear[displayYear] = minVariance !== Infinity ? minVariance : null;
  });
  
  years.forEach(displayYear => {
    const lookupYear = displayYear + 1; // Map display year to lookup year
    html += `<tr style="background: white; background-color: white; color: black;"><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;"><strong>${displayYear}</strong></td>`;
    sortedResults.forEach(result => {
      const yearData = result.varianceData.find(d => d.year === lookupYear);
      if (yearData && yearData.variance !== null) {
        const isMin = minVariancesByYear[year] !== null && 
                     Math.abs(yearData.variance - minVariancesByYear[year]) < 0.0001;
        const value = `${yearData.variance.toFixed(4)} (${yearData.count})`;
        html += `<td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${isMin ? '<strong>***' + value + '***</strong>' : value}</td>`;
      } else {
        html += '<td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">—</td>';
      }
    });
    html += '</tr>';
  });
  
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

// Render aggregated weights table
function renderAggregatedWeightsTable(results) {
  const container = document.getElementById('aggregatedWeightsTable');
  if (!container) return;
  
  const validResults = results.filter(r => !r.error && r.weights);
  if (validResults.length === 0) {
    container.innerHTML = '<p style="color: var(--muted);">No data available</p>';
    return;
  }
  
  // Sort results: 2025 RMSE first, then others
  const sortedResults = [...validResults].sort((a, b) => {
    if (a.filename === 'QPR-RSMEmin.txt') return -1;
    if (b.filename === 'QPR-RSMEmin.txt') return 1;
    return a.baselineName.localeCompare(b.baselineName);
  });
  
  const factorNames = [
    'Intercept',
    '2019 ASMR',
    'GDP (Nominal) per Capita',
    'Inequality (GINI)',
    'Poverty (% living below line)',
    'Health Expenditure (%GDP)'
  ];
  
  let html = '<div style="overflow-x: auto;"><table class="summary-table" style="background: white; background-color: white; color: black;">';
  html += '<thead><tr><th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">Factor</th>';
  sortedResults.forEach(result => {
    html += `<th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${result.baselineName}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  factorNames.forEach((factorName, factorIndex) => {
    html += `<tr style="background: white; background-color: white; color: black;"><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;"><strong>${factorName}</strong></td>`;
    sortedResults.forEach(result => {
      if (result.weights && result.weights[factorIndex] !== undefined) {
        html += `<td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${result.weights[factorIndex].toFixed(4)}</td>`;
      } else {
        html += '<td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">—</td>';
      }
    });
    html += '</tr>';
  });
  
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

// Render aggregated regression summary table
function renderAggregatedRegressionTable(results) {
  const container = document.getElementById('aggregatedRegressionTable');
  if (!container) return;
  
  const validResults = results.filter(r => !r.error && r.regressionSummary);
  if (validResults.length === 0) {
    container.innerHTML = '<p style="color: var(--muted);">No data available</p>';
    return;
  }
  
  // Sort results: 2025 RMSE first, then others
  const sortedResults = [...validResults].sort((a, b) => {
    if (a.filename === 'QPR-RSMEmin.txt') return -1;
    if (b.filename === 'QPR-RSMEmin.txt') return 1;
    return a.baselineName.localeCompare(b.baselineName);
  });
  
  // Get all unique factors from all results
  const allFactors = new Set();
  sortedResults.forEach(result => {
    if (result.regressionSummary) {
      result.regressionSummary.forEach(item => {
        allFactors.add(item.factor);
      });
    }
  });
  const factors = Array.from(allFactors).sort();
  
  let html = '<div style="overflow-x: auto;"><table class="summary-table" style="background: white; background-color: white; color: black;">';
  html += '<thead><tr><th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">Factor</th>';
  sortedResults.forEach(result => {
    html += `<th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${result.baselineName}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  // Find maximum R² for each factor
  const maxRSquaredByFactor = {};
  factors.forEach(factor => {
    let maxRSquared = -Infinity;
    sortedResults.forEach(result => {
      const factorData = result.regressionSummary.find(item => item.factor === factor);
      if (factorData && factorData.rSquared !== null && factorData.rSquared > maxRSquared) {
        maxRSquared = factorData.rSquared;
      }
    });
    maxRSquaredByFactor[factor] = maxRSquared !== -Infinity ? maxRSquared : null;
  });
  
  // Helper function to format p-values
  const formatPValue = (pValue) => {
    if (pValue === null || pValue === undefined) return '—';
    if (pValue < 0.0001) {
      // Use scientific notation for very small values
      return pValue.toExponential(2);
    } else {
      // Use regular decimal notation for larger values
      return pValue.toFixed(4);
    }
  };
  
  factors.forEach(factor => {
    html += `<tr style="background: white; background-color: white; color: black;"><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;"><strong>${factor}</strong></td>`;
    sortedResults.forEach(result => {
      const factorData = result.regressionSummary.find(item => item.factor === factor);
      if (factorData && factorData.rSquared !== null) {
        const rSquared = factorData.rSquared.toFixed(4);
        const pValue = formatPValue(factorData.pValue);
        const isMax = maxRSquaredByFactor[factor] !== null && 
                     Math.abs(factorData.rSquared - maxRSquaredByFactor[factor]) < 0.0001;
        const value = `${rSquared} (${pValue})`;
        html += `<td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${isMax ? '<strong>***' + value + '***</strong>' : value}</td>`;
      } else {
        html += '<td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">—</td>';
      }
    });
    html += '</tr>';
  });
  
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

// Render aggregated baseline slopes and intercepts table
function renderAggregatedSlopesTable(results) {
  const container = document.getElementById('aggregatedSlopesTable');
  if (!container) return;
  
  // Include all results that have baselineSlopes property (even if empty)
  const validResults = results.filter(r => !r.error && r.hasOwnProperty('baselineSlopes'));
  if (validResults.length === 0) {
    container.innerHTML = '<p style="color: var(--muted);">No data available</p>';
    console.warn('No valid results with baselineSlopes property:', results);
    return;
  }
  
  console.log('Rendering slopes table with', validResults.length, 'results');
  validResults.forEach(r => {
    console.log(`  ${r.baselineName}: ${r.baselineSlopes ? Object.keys(r.baselineSlopes).length : 0} countries`);
  });
  
  // Sort results: 2025 RMSE first, then others
  const sortedResults = [...validResults].sort((a, b) => {
    if (a.filename === 'QPR-RSMEmin.txt') return -1;
    if (b.filename === 'QPR-RSMEmin.txt') return 1;
    return a.baselineName.localeCompare(b.baselineName);
  });
  
  // Get all unique countries from all results
  const allCountries = new Set();
  sortedResults.forEach(result => {
    if (result.baselineSlopes) {
      Object.keys(result.baselineSlopes).forEach(country => {
        allCountries.add(country);
      });
    }
  });
  const countries = Array.from(allCountries).sort();
  
  let html = '<div style="overflow-x: auto;"><table class="summary-table" style="background: white; background-color: white; color: black;">';
  html += '<thead><tr><th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">Country</th>';
  sortedResults.forEach(result => {
    html += `<th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${result.baselineName}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  countries.forEach(country => {
    html += `<tr style="background: white; background-color: white; color: black;"><td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;"><strong>${country}</strong></td>`;
    sortedResults.forEach(result => {
      const countryData = result.baselineSlopes && result.baselineSlopes[country];
      if (countryData && countryData.slope !== null && countryData.intercept !== null) {
        const slope = countryData.slope.toFixed(6);
        const intercept = countryData.intercept.toFixed(2);
        const value = `${slope}(${intercept})`;
        html += `<td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${value}</td>`;
      } else {
        html += '<td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">—</td>';
      }
    });
    html += '</tr>';
  });
  
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

// Render aggregated variance comparison table (RMSE 2025 vs others at 2025)
// Compares 2025 cumulative excess values for each country and baseline
function renderAggregatedVarianceComparisonTable(results) {
  const container = document.getElementById('aggregatedVarianceComparisonTable');
  if (!container) return;
  
  const validResults = results.filter(r => !r.error && r.cumulativeExcess2025);
  if (validResults.length === 0) {
    container.innerHTML = '<p style="color: var(--muted);">No data available</p>';
    return;
  }
  
  // Find RMSE 2025 baseline
  const rmseResult = validResults.find(r => r.filename === 'QPR-RSMEmin.txt');
  if (!rmseResult || !rmseResult.cumulativeExcess2025) {
    container.innerHTML = '<p style="color: var(--muted);">RMSE 2025 baseline not found</p>';
    return;
  }
  
  // Sort results: 2025 RMSE first, then others
  const sortedResults = [...validResults].sort((a, b) => {
    if (a.filename === 'QPR-RSMEmin.txt') return -1;
    if (b.filename === 'QPR-RSMEmin.txt') return 1;
    return a.baselineName.localeCompare(b.baselineName);
  });
  
  // Get all unique countries from all results
  const allCountries = new Set();
  sortedResults.forEach(result => {
    if (result.cumulativeExcess2025) {
      Object.keys(result.cumulativeExcess2025).forEach(country => {
        allCountries.add(country);
      });
    }
  });
  const countries = Array.from(allCountries).sort();
  
  // Counters for color statistics
  let greenCount = 0;
  let redCount = 0;
  let yellowCount = 0;
  
  let html = '<div style="overflow-x: auto;"><table class="summary-table" style="background: white; background-color: white; color: black;">';
  html += '<thead><tr><th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">Country</th>';
  sortedResults.forEach(result => {
    html += `<th style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${result.baselineName}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  countries.forEach(country => {
    html += `<tr style="background: white; background-color: white; color: black;">
      <td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;"><strong>${country}</strong></td>`;
    
    // Get RMSE 2025 cumulative excess value for this country
    const rmse2025Value = rmseResult.cumulativeExcess2025[country];
    
    sortedResults.forEach(result => {
      const cumulativeExcess = result.cumulativeExcess2025 && result.cumulativeExcess2025[country];
      
      if (cumulativeExcess === undefined || cumulativeExcess === null || !isFinite(cumulativeExcess)) {
        html += '<td style="background: white; background-color: white; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">—</td>';
        return;
      }
      
      // Calculate difference from RMSE 2025 for this country
      let difference = null;
      let bgColor = 'white';
      
      if (result.filename === 'QPR-RSMEmin.txt') {
        // This is the RMSE row - show value, no difference
        bgColor = '#f0f0f0'; // Light gray for RMSE column
        html += `<td style="background: ${bgColor}; background-color: ${bgColor}; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${cumulativeExcess.toFixed(2)}</td>`;
        return;
      } else if (rmse2025Value !== undefined && rmse2025Value !== null && isFinite(rmse2025Value)) {
        difference = cumulativeExcess - rmse2025Value;
        
        // Determine color based on whether RMSE is dragging excess mortality up or down:
        // Green: RMSE is dragging down (RMSE has lower value, so difference > 0 means other baseline is higher)
        // Red: RMSE is dragging up (RMSE has higher value, so difference < 0 means other baseline is lower)
        // Yellow: same
        if (Math.abs(difference) < 0.01) {
          bgColor = '#fffacd'; // Yellow for same
          yellowCount++;
        } else if (difference > 0) {
          bgColor = '#ccffcc'; // Green - RMSE is dragging down (other baseline has higher value, meaning RMSE is lower)
          greenCount++;
        } else {
          bgColor = '#ffcccc'; // Red - RMSE is dragging up (other baseline has lower value, meaning RMSE is higher)
          redCount++;
        }
      }
      
      const valueStr = cumulativeExcess.toFixed(2);
      const diffStr = difference !== null ? (difference >= 0 ? `+${difference.toFixed(2)}` : difference.toFixed(2)) : '';
      const displayValue = difference !== null ? `${valueStr} (${diffStr})` : valueStr;
      
      html += `<td style="background: ${bgColor}; background-color: ${bgColor}; color: black; padding: 8px 12px; border-bottom: 1px solid #ccc;">${displayValue}</td>`;
    });
    
    html += '</tr>';
  });
  
  html += '</tbody></table></div>';
  
  // Add color count summary
  html += '<div style="margin-top: 16px; padding: 12px; background: white; color: black;">';
  html += `<div style="margin-bottom: 8px;"><strong>Green:</strong> ${greenCount}</div>`;
  html += `<div style="margin-bottom: 8px;"><strong>Red:</strong> ${redCount}</div>`;
  html += `<div><strong>Yellow:</strong> ${yellowCount}</div>`;
  html += '</div>';
  
  container.innerHTML = html;
}

// Export individual baseline views as PNG
async function exportIndividualBaselinesAsPDF() {
  const exportContainer = document.getElementById('individualBaselinesForExport');
  if (!exportContainer) {
    console.error('Export container not found');
    return;
  }
  
  // Check if html2canvas is available
  if (typeof html2canvas === 'undefined') {
    alert('PNG export library not loaded. Please refresh the page and try again.');
    return;
  }
  
  // Show loading indicator
  const originalText = exportContainer.querySelector ? null : null;
  
  // Clone the container for export (to avoid affecting the display)
  const clone = exportContainer.cloneNode(true);
  
  // Apply white background styles to the clone
  clone.style.background = 'white';
  clone.style.color = 'black';
  clone.style.padding = '20px';
  clone.style.width = 'auto';
  clone.style.maxWidth = '1200px';
  
  // Update plot backgrounds to white
  const plots = clone.querySelectorAll('.chart');
  plots.forEach(plot => {
    plot.style.background = 'white';
    
    // Update any Plotly plot containers to have white backgrounds
    const plotlyDivs = plot.querySelectorAll('.plotly');
    plotlyDivs.forEach(plotlyDiv => {
      plotlyDiv.style.background = 'white';
    });
  });
  
  // Also update all text colors to black for better contrast on white background
  const allText = clone.querySelectorAll('*');
  allText.forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.color && computedStyle.color !== 'rgb(0, 0, 0)') {
      // Only update if it's not already black and it's a text element
      if (el.tagName && ['P', 'SPAN', 'DIV', 'TD', 'TH', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
        el.style.color = 'black';
      }
    }
  });
  
  // Update table styles for better PDF rendering - be very explicit
  const tables = clone.querySelectorAll('table');
  tables.forEach(table => {
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.marginBottom = '20px';
    table.style.setProperty('background', 'white', 'important');
    table.style.setProperty('background-color', 'white', 'important');
    table.style.setProperty('color', 'black', 'important');
    
    // Update all rows
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      row.style.setProperty('background', 'white', 'important');
      row.style.setProperty('background-color', 'white', 'important');
      row.style.setProperty('color', 'black', 'important');
    });
    
    // Update all cells
    const cells = table.querySelectorAll('td, th');
    cells.forEach(cell => {
      cell.style.setProperty('background', 'white', 'important');
      cell.style.setProperty('background-color', 'white', 'important');
      cell.style.setProperty('color', 'black', 'important');
      cell.style.borderColor = '#ccc';
    });
  });
  
  // Create a temporary container off-screen for rendering
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '0';
  tempContainer.style.width = '1200px';
  tempContainer.style.background = 'white';
  tempContainer.appendChild(clone);
  document.body.appendChild(tempContainer);
  
  try {
    // Wait a moment for styles to apply
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Use html2canvas to capture the content
    const canvas = await html2canvas(clone, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
      width: clone.scrollWidth,
      height: clone.scrollHeight,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight
    });
    
    // Convert canvas to PNG and download
    canvas.toBlob(function(blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'baseline-comparison-individual.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
    
    // Clean up
    document.body.removeChild(tempContainer);
    
  } catch (error) {
    console.error('Error generating PNG:', error);
    alert('Error generating PNG. Please try again.');
    // Clean up on error
    if (document.body.contains(tempContainer)) {
      document.body.removeChild(tempContainer);
    }
  }
}

// Export aggregated views as PNG
async function exportAggregatedViewsAsPDF() {
  const exportContainer = document.getElementById('aggregatedViewsForExport');
  if (!exportContainer) {
    console.error('Export container not found');
    return;
  }
  
  // Check if html2canvas is available
  if (typeof html2canvas === 'undefined') {
    alert('PNG export library not loaded. Please refresh the page and try again.');
    return;
  }
  
  // Clone the container for export (to avoid affecting the display)
  const clone = exportContainer.cloneNode(true);
  
  // Apply white background styles to the clone
  clone.style.background = 'white';
  clone.style.color = 'black';
  clone.style.padding = '20px';
  clone.style.width = 'auto';
  clone.style.maxWidth = '1200px';
  
  // Update plot backgrounds to white
  const plots = clone.querySelectorAll('.chart');
  plots.forEach(plot => {
    plot.style.background = 'white';
    
    // Update any Plotly plot containers to have white backgrounds
    const plotlyDivs = plot.querySelectorAll('.plotly');
    plotlyDivs.forEach(plotlyDiv => {
      plotlyDiv.style.background = 'white';
    });
  });
  
  // Also update all text colors to black for better contrast on white background
  const allText = clone.querySelectorAll('*');
  allText.forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.color && computedStyle.color !== 'rgb(0, 0, 0)') {
      // Only update if it's not already black and it's a text element
      if (el.tagName && ['P', 'SPAN', 'DIV', 'TD', 'TH', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
        el.style.color = 'black';
      }
    }
  });
  
  // Update table styles for better PDF rendering - be very explicit
  const tables = clone.querySelectorAll('table');
  tables.forEach(table => {
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.marginBottom = '20px';
    table.style.setProperty('background', 'white', 'important');
    table.style.setProperty('background-color', 'white', 'important');
    table.style.setProperty('color', 'black', 'important');
    
    // Update all rows
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      row.style.setProperty('background', 'white', 'important');
      row.style.setProperty('background-color', 'white', 'important');
      row.style.setProperty('color', 'black', 'important');
    });
    
    // Update all cells
    const cells = table.querySelectorAll('td, th');
    cells.forEach(cell => {
      cell.style.setProperty('background', 'white', 'important');
      cell.style.setProperty('background-color', 'white', 'important');
      cell.style.setProperty('color', 'black', 'important');
      cell.style.borderColor = '#ccc';
    });
  });
  
  // Create a temporary container off-screen for rendering
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '0';
  tempContainer.style.width = '1200px';
  tempContainer.style.background = 'white';
  tempContainer.appendChild(clone);
  document.body.appendChild(tempContainer);
  
  try {
    // Wait a moment for styles to apply
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Use html2canvas to capture the content
    const canvas = await html2canvas(clone, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
      width: clone.scrollWidth,
      height: clone.scrollHeight,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight
    });
    
    // Convert canvas to PNG and download
    canvas.toBlob(function(blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'baseline-comparison-aggregated.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
    
    // Clean up
    document.body.removeChild(tempContainer);
    
  } catch (error) {
    console.error('Error generating PNG:', error);
    alert('Error generating PNG. Please try again.');
    // Clean up on error
    if (document.body.contains(tempContainer)) {
      document.body.removeChild(tempContainer);
    }
  }
}

// Setup baseline comparison button
function setupBaselineComparison() {
  const generateBtn = document.getElementById('generateBaselineComparisonBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', generateBaselineComparison);
  }
  
  // Setup PDF export buttons
  const exportAggregatedBtn = document.getElementById('exportAggregatedPDFBtn');
  if (exportAggregatedBtn) {
    exportAggregatedBtn.addEventListener('click', exportAggregatedViewsAsPDF);
  }
  
  const exportIndividualBtn = document.getElementById('exportIndividualBaselinesPDFBtn');
  if (exportIndividualBtn) {
    exportIndividualBtn.addEventListener('click', exportIndividualBaselinesAsPDF);
  }
}

// Function to dynamically load html2pdf if not available
function ensureHtml2PdfLoaded() {
  return new Promise((resolve) => {
    const checkAvailable = () => {
      try {
        if (typeof window.html2pdf !== 'undefined') {
          return true;
        }
        if (typeof html2pdf !== 'undefined') {
          return true;
        }
      } catch (e) {
        // Not available
      }
      return false;
    };
    
    const checkAndLoad = () => {
      if (checkAvailable()) {
        resolve(true);
        return;
      }
      
      // Try to load from jsdelivr if no script tag exists
      const existingScript = document.querySelector('script[src*="html2pdf"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js';
        script.crossOrigin = 'anonymous';
        script.onload = () => {
          console.log('html2pdf loaded dynamically from jsdelivr');
          // Wait a moment for it to initialize
          setTimeout(() => {
            resolve(checkAvailable());
          }, 100);
        };
        script.onerror = () => {
          console.error('Failed to load html2pdf dynamically');
          resolve(false);
        };
        document.head.appendChild(script);
      } else {
        // Script tag exists, just wait a bit more
        setTimeout(() => {
          resolve(checkAvailable());
        }, 1000);
      }
    };
    
    // Check immediately
    if (checkAvailable()) {
      resolve(true);
    } else {
      // Wait a bit for initial load, then try dynamic load
      setTimeout(checkAndLoad, 500);
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded - starting main()");
  
  // Apply mode immediately on page load
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'basic';
  if (mode === 'basic') {
    document.body.classList.add('basic-mode');
    // Also directly hide advanced-only elements as a fallback
    const advancedElements = document.querySelectorAll('.advanced-only');
    advancedElements.forEach(el => {
      el.style.display = 'none';
    });
    // Uncheck log axis checkboxes in basic mode
    const logXAxis = document.getElementById('logXAxis');
    const logYAxis = document.getElementById('logYAxis');
    if (logXAxis) logXAxis.checked = false;
    if (logYAxis) logYAxis.checked = false;
    // Set Index Mode to 2024 Fixed in basic mode
    const compositeIndexModeSelect = document.getElementById('compositeIndexModeSelect');
    if (compositeIndexModeSelect) {
      compositeIndexModeSelect.value = '2024-fixed';
    }
    // Make tables scrollable after a short delay to ensure they're rendered
    setTimeout(() => {
      makeTablesScrollable();
    }, 100);
  } else {
    document.body.classList.remove('basic-mode');
    // Show advanced-only elements
    const advancedElements = document.querySelectorAll('.advanced-only');
    advancedElements.forEach(el => {
      el.style.display = '';
    });
  }
  
  // Ensure html2pdf is available
  ensureHtml2PdfLoaded().then(loaded => {
    if (loaded) {
      console.log('html2pdf library is available');
    } else {
      console.warn('html2pdf library may not be available');
    }
  });
  main();
  
  // Set up observer to apply scrollable styles when tables are added
  if (mode === 'basic') {
    let timeoutId;
    const observer = new MutationObserver(() => {
      // Debounce to avoid too many calls
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        makeTablesScrollable();
      }, 200);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
});

// Also try immediate execution for debugging
console.log("Script loaded, DOM ready state:", document.readyState);
