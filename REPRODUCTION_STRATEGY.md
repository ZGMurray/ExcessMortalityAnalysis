# Strategy for Reproducing Plots from CSV Files

## Overview
This document outlines a strategy for reproducing the plots from this project using only CSV files, without requiring the full web application.

## Current Architecture

### Data Flow
1. **Raw Data Sources:**
   - `HMD.csv` - Weekly mortality data by age group (2015-2025)
   - `merged_data_2019.csv` - Structural factors (GDP, GINI, Poverty, Health Expenditure)
   - `OxCGRT_compact_national_v1.csv` - Policy intervention data
   - `.txt` files (e.g., `20162019qpr.txt`) - Reproduction metadata files

2. **Processing Pipeline:**
   - Load HMD.csv → Parse weekly mortality by country/sex
   - Calculate ASMR (Age-Standardized Mortality Rate) using ESP2013 weights
   - Compute baselines using quasi-Poisson regression (or other methods)
   - Calculate excess mortality = observed ASMR - baseline ASMR
   - Calculate cumulative excess over time
   - Aggregate data (weekly/quarterly/6-monthly/annual)

3. **Plot Generation:**
   - Main plot: Cumulative Excess ASMR over time (line chart)
   - Scatterplots: Excess mortality vs structural factors
   - Composite Index plots: Structural Vulnerability Index
   - Policy analysis plots: Policy variables vs excess mortality
   - Country comparison plots

## Key Plots Identified

### Section 1: Cumulative Excess ASMR
- **Type:** Time series line chart
- **X-axis:** Date (2020-2025)
- **Y-axis:** Cumulative Excess ASMR (per 100k)
- **Data needed:** 
  - Country, Date, Cumulative Excess ASMR
  - Baseline configuration (from .txt files)

### Section 2: Structural Factors
- **Type:** Scatter plots
- **Variants:**
  1. Excess Mortality vs 2019 ASMR
  2. Excess Mortality vs GDP (Nominal per Capita)
  3. Excess Mortality vs GINI (Inequality)
  4. Excess Mortality vs Poverty Rate
  5. Excess Mortality vs Health Expenditure (%GDP)
  6. Excess Mortality vs Structural Vulnerability Index (composite)
- **Data needed:**
  - Country, Excess Mortality (by year), Structural factors from merged_data_2019.csv

### Section 3: Policy Factors
- **Type:** Scatter plots
- **Variants:**
  1. Policy Variable vs Excess Mortality
  2. Policy Variable vs SVI Residuals
  3. Country Comparison plots
  4. Policy Comparison plots
- **Data needed:**
  - Country, Policy variable values (from OxCGRT), Excess Mortality

## Strategy Options

### Option 1: Export Pre-Processed Data to CSV (Recommended)
**Approach:** Create a script that processes the raw data and exports all necessary intermediate results to CSV files.

**Advantages:**
- Fastest reproduction (no need to re-run complex calculations)
- Clear separation of data processing from visualization
- Easy to share and version control
- Can be used with any plotting tool (Python, R, etc.)

**Output CSV Files:**
1. `cumulative_excess_asmr.csv`
   - Columns: Country, Sex, Date, Cumulative_Excess_ASMR, Baseline_ASMR, Observed_ASMR
   - One row per country/sex/date combination

2. `excess_mortality_by_year.csv`
   - Columns: Country, Year, Cumulative_Excess, Isolated_Excess
   - One row per country/year combination

3. `structural_factors.csv` (enhanced version of merged_data_2019.csv)
   - Columns: Country, GDP_Nominal, Health_Expenditure, GINI, Poverty, 2019_ASMR
   - One row per country

4. `policy_data_summary.csv`
   - Columns: Country, Policy_Variable, Year, Average_Value
   - Multiple rows per country (one per policy variable/year)

5. `composite_index.csv`
   - Columns: Country, Year, Composite_Index, Excess_Mortality, Residual
   - One row per country/year combination

**Implementation:**
- Create a Node.js/Python script that:
  1. Loads HMD.csv and processes it (same logic as current app)
  2. Calculates all baselines and excess mortality
  3. Exports results to the CSV files above
  4. Can be run independently: `node export_data.js` or `python export_data.py`

### Option 2: Standalone Processing Scripts
**Approach:** Extract the data processing logic into standalone scripts that can be run with just CSV inputs.

**Advantages:**
- Fully reproducible from raw data
- Can modify parameters and regenerate
- No intermediate files needed

**Disadvantages:**
- Slower (recalculates everything each time)
- More complex to maintain

**Implementation:**
- Create Python/R scripts that:
  1. Read HMD.csv, merged_data_2019.csv, OxCGRT_compact_national_v1.csv
  2. Implement ASMR calculation, baseline computation, excess calculation
  3. Generate plots directly using matplotlib/ggplot2/plotly

### Option 3: Hybrid Approach (Best of Both)
**Approach:** Create both export scripts AND standalone reproduction scripts.

**Advantages:**
- Export scripts for quick reproduction
- Standalone scripts for full reproducibility
- Users can choose based on their needs

## Recommended Implementation Plan

### Phase 1: Data Export Script
1. Create `scripts/export_processed_data.js` (or `.py`)
   - Extract processing logic from `assets/script.js`
   - Process HMD.csv to calculate:
     - ASMR for each country/sex/week
     - Baselines using quasi-Poisson regression
     - Excess mortality
     - Cumulative excess
   - Export to CSV files listed in Option 1

2. Create `scripts/export_policy_data.js`
   - Process OxCGRT data
   - Calculate average policy values by year
   - Export to `policy_data_summary.csv`

### Phase 2: Standalone Plot Scripts
1. Create `scripts/reproduce_plots.py` (Python with matplotlib/plotly)
   - Read exported CSV files
   - Generate each plot type
   - Save as PNG/SVG/HTML

2. Alternative: Create `scripts/reproduce_plots.R` (R with ggplot2)
   - Same functionality, different language

### Phase 3: Documentation
1. Create `REPRODUCTION_GUIDE.md`
   - Step-by-step instructions
   - Example commands
   - Expected outputs

2. Update `README.md`
   - Add section on reproduction
   - Link to guide

## Technical Details to Extract

### ASMR Calculation
- ESP2013 weights: R0_14: 0.156, R15_64: 0.654, R65_74: 0.080, R75_84: 0.066, R85p: 0.044
- Formula: ASMR = Σ(age_group_rate × weight)

### Baseline Calculation (Quasi-Poisson)
- Uses baseline period (e.g., 2010-W01 to 2019-W52)
- Fits quasi-Poisson regression model
- Projects baseline forward to pandemic period

### Excess Mortality
- Excess = Observed ASMR - Baseline ASMR
- Cumulative Excess = Running sum of excess from 2020-01-01

### Aggregation
- Weekly: Original data
- Quarterly: Average of 13 weeks
- 6-monthly: Average of 26 weeks
- Annual: Average of 52 weeks

## File Structure Proposal

```
DetailedAnalysis/
├── data/                          # Raw data (existing)
│   ├── HMD.csv
│   ├── merged_data_2019.csv
│   ├── OxCGRT_compact_national_v1.csv
│   └── ...
├── scripts/                       # New folder
│   ├── export_processed_data.js   # Export all processed data to CSV
│   ├── export_policy_data.js       # Export policy summaries
│   ├── reproduce_plots.py         # Python script to reproduce plots
│   └── reproduce_plots.R          # R script alternative
├── output/                        # New folder for exported CSVs
│   ├── cumulative_excess_asmr.csv
│   ├── excess_mortality_by_year.csv
│   ├── structural_factors.csv
│   ├── policy_data_summary.csv
│   └── composite_index.csv
├── plots/                         # New folder for generated plots
│   ├── cumulative_excess_asmr.png
│   ├── scatterplot_asmr_vs_gdp.png
│   └── ...
└── REPRODUCTION_GUIDE.md          # User guide
```

## Next Steps

1. **Review this strategy** - Confirm approach and priorities
2. **Implement Phase 1** - Create data export scripts
3. **Test exports** - Verify exported CSVs match app calculations
4. **Implement Phase 2** - Create plot reproduction scripts
5. **Document** - Create user guide

## Questions to Consider

1. Which language preference for scripts? (Python, R, Node.js, or all?)
2. Should we maintain the same visual styling as the web app?
3. Do we need interactive plots (HTML) or static images (PNG/SVG)?
4. Should the export scripts be part of the main app or separate?
5. Do we need to support all baseline methods or just quasi-Poisson?

