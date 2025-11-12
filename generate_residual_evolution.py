#!/usr/bin/env python3
"""
Generate residual evolution over time plots for all baseline options.
Creates a grid of plots showing how residuals change over time (2021-2025)
for each baseline data file.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec
import re
from pathlib import Path
from sklearn.linear_model import LinearRegression
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Configuration
DATA_DIR = Path('data')
OUTPUT_FILE = 'residual_evolution_grid.png'

# Baseline files to process
BASELINE_FILES = [
    '20162019qpr.txt',
    '20152019qpr.txt',
    '20142019qpr.txt',
    '20132019qpr.txt',
    '20122019qpr.txt',
    '20112019qpr.txt',
    '20102019qpr.txt',
    'QPR-RSMEmin.txt'
]

# Years to analyze
YEARS = [2021, 2022, 2023, 2024, 2025]

# ESP2013 age-standardization weights
ESP2013_WEIGHTS = {
    '0-14': 0.156,
    '15-64': 0.654,
    '65-74': 0.080,
    '75-84': 0.066,
    '85+': 0.044
}


def parse_baseline_file(filepath):
    """Parse a baseline data file to extract trace configurations."""
    with open(filepath, 'r') as f:
        text = f.read()
    
    lines = text.split('\n')
    trace_configs = []
    current_trace = None
    
    for line in lines:
        trimmed = line.strip()
        
        if trimmed.startswith('Trace '):
            if current_trace:
                trace_configs.append(current_trace)
            match = re.match(r'Trace \d+: (\w+) \((\w+)\)', trimmed)
            if match:
                current_trace = {
                    'country': match.group(1),
                    'sex': match.group(2)
                }
        elif current_trace and line.startswith('  ') and trimmed:
            if 'Baseline Type:' in trimmed:
                current_trace['baseline_type'] = trimmed.split(': ')[1]
            elif 'Baseline Range:' in trimmed:
                match = re.search(r'(\d{4})-W(\d{2}) to (\d{4})-W(\d{2})', trimmed)
                if match:
                    current_trace['baseline_from'] = {
                        'year': int(match.group(1)),
                        'week': int(match.group(2))
                    }
                    current_trace['baseline_to'] = {
                        'year': int(match.group(3)),
                        'week': int(match.group(4))
                    }
            elif 'Start Date:' in trimmed:
                current_trace['start_date'] = pd.to_datetime(trimmed.split(': ')[1])
    
    if current_trace:
        trace_configs.append(current_trace)
    
    return trace_configs


def load_hmd_data():
    """Load HMD mortality data."""
    hmd_path = DATA_DIR / 'HMD.csv'
    df = pd.read_csv(hmd_path, comment='#')
    
    # Filter to both sexes only
    df = df[df['Sex'] == 'b'].copy()
    
    # Calculate ASMR using ESP2013 weights
    df['ASMR100k'] = (
        df['R0_14'] * ESP2013_WEIGHTS['0-14'] +
        df['R15_64'] * ESP2013_WEIGHTS['15-64'] +
        df['R65_74'] * ESP2013_WEIGHTS['65-74'] +
        df['R75_84'] * ESP2013_WEIGHTS['75-84'] +
        df['R85p'] * ESP2013_WEIGHTS['85+']
    ) * 100000
    
    return df


def load_structural_factors():
    """Load structural factors data."""
    factors_path = DATA_DIR / 'merged_data_2019.csv'
    df = pd.read_csv(factors_path)
    
    # Extract numeric values from strings like "54972.7017885437(2019)"
    def extract_value(val):
        if pd.isna(val) or val == '':
            return np.nan
        match = re.search(r'([\d.]+)', str(val))
        return float(match.group(1)) if match else np.nan
    
    df['GDP'] = df['GDP (nominal per capita)'].apply(extract_value)
    df['HealthExp'] = df['Health Expenditure (%GDP)'].apply(extract_value)
    df['GINI'] = df['Inequality (GINI)'].apply(extract_value)
    df['Poverty'] = df['Poverty (% living below line)'].apply(extract_value)
    
    # Map country names to codes
    # Note: Some countries have multiple entries (e.g., UK regions)
    # We'll map to the primary code and handle duplicates
    country_mapping = {
        'Australia': 'AUS',
        'Austria': 'AUT',
        'Belgium': 'BEL',
        'Bulgaria': 'BGR',
        'Canada': 'CAN',
        'Switzerland': 'CHE',
        'Chile': 'CHL',
        'Czechia': 'CZE',
        'Germany': 'DEUTNP',
        'Denmark': 'DNK',
        'Spain': 'ESP',
        'Estonia': 'EST',
        'Finland': 'FIN',
        'France': 'FRATNP',
        'United Kingdom': 'GBRTENW',  # Primary UK entry maps to England & Wales
        'Greece': 'GRC',
        'Croatia': 'HRV',
        'Hungary': 'HUN',
        'Iceland': 'ISL',
        'Israel': 'ISR',
        'Italy': 'ITA',
        'Korea, Rep.': 'KOR',
        'Lithuania': 'LTU',
        'Luxembourg': 'LUX',
        'Latvia': 'LVA',
        'Netherlands': 'NLD',
        'Norway': 'NOR',
        'New Zealand': 'NZL_NP',
        'Poland': 'POL',
        'Portugal': 'PRT',
        'Russian Federation': 'RUS',
        'Slovak Republic': 'SVK',
        'Slovenia': 'SVN',
        'Sweden': 'SWE',
        'TWN': 'TWN',
        'United States': 'USA'
    }
    
    # Handle UK entries - map first to GBRTENW, but we'll need to handle GBR_NIR and GBR_SCO separately
    # For now, map all UK entries to GBRTENW (they share the same structural factors)
    df['CountryCode'] = df['Country'].map(country_mapping)
    
    # Create a dictionary mapping country code to structural factors
    factors_dict = {}
    for _, row in df.iterrows():
        if pd.notna(row['CountryCode']):
            country_code = row['CountryCode']
            # Store factors for this country code
            factors_dict[country_code] = {
                'GDP': row['GDP'],
                'GINI': row['GINI'],
                'Poverty': row['Poverty'],
                'HealthExp': row['HealthExp']
            }
    
    # For UK regions that share the same structural factors, copy from GBRTENW
    if 'GBRTENW' in factors_dict:
        uk_factors = factors_dict['GBRTENW']
        for uk_code in ['GBR_NIR', 'GBR_SCO']:
            factors_dict[uk_code] = uk_factors.copy()
    
    return factors_dict


def calculate_baseline(df, country_code, baseline_from, baseline_to):
    """Calculate seasonal baseline ASMR for a country (mean per week of year)."""
    country_data = df[df['CountryCode'] == country_code].copy()
    
    # Filter to baseline period
    def in_baseline_period(row):
        year, week = row['Year'], row['Week']
        if year < baseline_from['year'] or year > baseline_to['year']:
            return False
        if year == baseline_from['year'] and week < baseline_from['week']:
            return False
        if year == baseline_to['year'] and week > baseline_to['week']:
            return False
        return True
    
    baseline_data = country_data[country_data.apply(in_baseline_period, axis=1)].copy()
    
    if len(baseline_data) == 0:
        return None
    
    # Calculate seasonal baseline (mean ASMR per week of year)
    # Group by week number and calculate mean
    baseline = baseline_data.groupby('Week')['ASMR100k'].mean().to_dict()
    
    return baseline


def get_cumulative_at_date(df, country_code, baseline, start_date, target_date):
    """Get cumulative excess mortality at a specific date (matching JavaScript getExcessValue logic)."""
    country_data = df[df['CountryCode'] == country_code].copy()
    
    # Create date from year and week (approximate - using ISO week)
    def week_to_date(year, week):
        # First day of the year
        jan1 = pd.Timestamp(f'{year}-01-01')
        # Find the first Monday of the year (ISO week starts on Monday)
        days_offset = (7 - jan1.weekday()) % 7
        first_monday = jan1 + pd.Timedelta(days=days_offset)
        # Add weeks
        return first_monday + pd.Timedelta(weeks=week-1)
    
    country_data['Date'] = country_data.apply(
        lambda row: week_to_date(row['Year'], row['Week']), axis=1
    )
    
    # Filter to period from start_date to target_date
    mask = (country_data['Date'] >= start_date) & (country_data['Date'] <= target_date)
    pandemic_data = country_data[mask].copy()
    
    if len(pandemic_data) == 0:
        return None
    
    # Calculate expected ASMR based on baseline (seasonal mean for that week)
    pandemic_data['ExpectedASMR'] = pandemic_data['Week'].map(baseline)
    
    # Remove rows where we don't have baseline data
    pandemic_data = pandemic_data[pandemic_data['ExpectedASMR'].notna()].copy()
    
    if len(pandemic_data) == 0:
        return None
    
    # Calculate excess (actual - expected)
    pandemic_data['ExcessASMR'] = pandemic_data['ASMR100k'] - pandemic_data['ExpectedASMR']
    
    # Sum of excess for this period (cumulative)
    cumulative_excess = pandemic_data['ExcessASMR'].sum()
    
    return cumulative_excess


def calculate_excess_mortality(df, country_code, baseline, start_date, target_year, isolated=False):
    """Calculate excess mortality for target year (matching JavaScript getExcessValue logic).
    
    If isolated=True, returns excess for just that year:
    - For 2021: cumulative at 2021-01-01
    - For 2022+: cumulative at target_year-01-01 - cumulative at (target_year-1)-01-01
    
    If isolated=False, returns cumulative excess at target_year-01-01.
    """
    # Get cumulative at the start of the target year
    year_start = pd.Timestamp(f'{target_year}-01-01')
    cumulative_at_year = get_cumulative_at_date(df, country_code, baseline, start_date, year_start)
    
    if cumulative_at_year is None:
        return None
    
    if isolated:
        # For isolated years, subtract previous year's cumulative
        if target_year == 2021:
            # 2021 isolated is the same as 2021 cumulative (no previous year)
            return cumulative_at_year
        else:
            # For years after 2021, subtract previous year's cumulative at its start
            prev_year_start = pd.Timestamp(f'{target_year-1}-01-01')
            prev_cumulative = get_cumulative_at_date(df, country_code, baseline, start_date, prev_year_start)
            if prev_cumulative is not None:
                isolated_excess = cumulative_at_year - prev_cumulative
                return isolated_excess
            else:
                return None
    else:
        # Return cumulative excess at start of target year
        return cumulative_at_year


def calculate_asmr_2019(df, country_code):
    """Calculate average ASMR for 2019."""
    country_data = df[(df['CountryCode'] == country_code) & (df['Year'] == 2019)].copy()
    
    if len(country_data) == 0:
        return None
    
    return country_data['ASMR100k'].mean()


def fit_multiple_regression(asmr_data, gdp_data, gini_data, poverty_data, health_exp_data, excess_data):
    """Fit multiple regression: excess = f(ASMR, GDP, GINI, Poverty, HealthExp)."""
    # Prepare data
    X = np.column_stack([
        asmr_data,
        gdp_data,
        gini_data,
        poverty_data,
        health_exp_data
    ])
    y = np.array(excess_data)
    
    # Remove rows with NaN
    valid_mask = ~(np.isnan(X).any(axis=1) | np.isnan(y))
    X_clean = X[valid_mask]
    y_clean = y[valid_mask]
    
    if len(X_clean) < 6:  # Need at least 6 data points
        return None
    
    # Fit regression
    reg = LinearRegression()
    reg.fit(X_clean, y_clean)
    
    return reg


def fit_trend_line(x_data, y_data, degree=1):
    """Fit a polynomial trend line and return coefficients."""
    # Remove NaN values
    valid_mask = ~(np.isnan(x_data) | np.isnan(y_data))
    x_clean = np.array(x_data)[valid_mask]
    y_clean = np.array(y_data)[valid_mask]
    
    if len(x_clean) < degree + 1:
        return None
    
    # Fit polynomial
    coeffs = np.polyfit(x_clean, y_clean, degree)
    
    # Calculate R²
    y_pred = np.polyval(coeffs, x_clean)
    ss_res = np.sum((y_clean - y_pred) ** 2)
    ss_tot = np.sum((y_clean - np.mean(y_clean)) ** 2)
    r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
    
    return {
        'coefficients': coeffs[::-1],  # Reverse to match JavaScript format [c0, c1, ...]
        'rSquared': r_squared
    }


def calculate_residual_evolution(df, trace_configs, structural_factors):
    """Calculate residual evolution over time for all countries.
    
    Steps:
    1. Calculate SVI (Structural Vulnerability Index) using 2025 fixed regression
    2. For each year, regress isolated excess vs SVI
    3. Take residuals from that regression
    4. Return residuals for each country over time
    """
    # Step 1: Calculate 2025 fixed regression to get SVI
    all_data_2025 = []
    for config in trace_configs:
        country_code = config['country']
        if country_code not in structural_factors:
            continue
        factors = structural_factors[country_code]
        if any(pd.isna(v) for v in [factors['GDP'], factors['GINI'], factors['Poverty'], factors['HealthExp']]):
            continue
        asmr_2019 = calculate_asmr_2019(df, country_code)
        if asmr_2019 is None or pd.isna(asmr_2019):
            continue
        baseline = calculate_baseline(df, country_code, config['baseline_from'], config['baseline_to'])
        if baseline is None:
            continue
        excess_2025 = calculate_excess_mortality(df, country_code, baseline, config['start_date'], 2025, isolated=False)
        if excess_2025 is None or pd.isna(excess_2025):
            continue
        all_data_2025.append({
            'country': country_code,
            'asmr_2019': asmr_2019,
            'gdp': factors['GDP'],
            'gini': factors['GINI'],
            'poverty': factors['Poverty'],
            'health_exp': factors['HealthExp'],
            'excess': excess_2025
        })
    
    if len(all_data_2025) < 6:
        return {}
    
    # Fit 2025 cumulative regression
    asmr_data = [d['asmr_2019'] for d in all_data_2025]
    gdp_data = [d['gdp'] for d in all_data_2025]
    gini_data = [d['gini'] for d in all_data_2025]
    poverty_data = [d['poverty'] for d in all_data_2025]
    health_exp_data = [d['health_exp'] for d in all_data_2025]
    excess_data = [d['excess'] for d in all_data_2025]
    
    svi_regression = fit_multiple_regression(
        asmr_data, gdp_data, gini_data, poverty_data, health_exp_data, excess_data
    )
    
    if svi_regression is None:
        return {}
    
    # Calculate SVI for each country (fixed across all years)
    country_svi = {}
    for d in all_data_2025:
        X = np.array([[
            d['asmr_2019'],
            d['gdp'],
            d['gini'],
            d['poverty'],
            d['health_exp']
        ]])
        svi = svi_regression.predict(X)[0]
        country_svi[d['country']] = svi
    
    # Initialize residuals structure
    country_residuals = {}
    for country_code in country_svi:
        country_residuals[country_code] = []
    
    # Step 2 & 3: For each year, regress isolated excess vs SVI and get residuals
    for year in YEARS:
        print(f"    Processing year {year}...", end=' ')
        # Collect data for this year: SVI and isolated excess
        year_data = []
        for config in trace_configs:
            country_code = config['country']
            if country_code not in country_svi:
                continue
            
            baseline = calculate_baseline(df, country_code, config['baseline_from'], config['baseline_to'])
            if baseline is None:
                continue
            
            # Get isolated excess for this year
            isolated_excess = calculate_excess_mortality(
                df, country_code, baseline,
                config['start_date'], year, isolated=True
            )
            if isolated_excess is None or pd.isna(isolated_excess):
                continue
            
            year_data.append({
                'country': country_code,
                'svi': country_svi[country_code],
                'isolated_excess': isolated_excess
            })
        
        if len(year_data) < 6:
            # Not enough data, add NaN for all countries
            for country_code in country_residuals:
                country_residuals[country_code].append(np.nan)
            continue
        
        # Regress isolated excess vs SVI
        svi_values = [d['svi'] for d in year_data]
        excess_values = [d['isolated_excess'] for d in year_data]
        
        # Fit linear regression: isolated_excess = a + b * SVI
        reg = LinearRegression()
        X = np.array(svi_values).reshape(-1, 1)
        y = np.array(excess_values)
        reg.fit(X, y)
        
        # Calculate residuals
        residuals = {}
        for d in year_data:
            predicted = reg.predict([[d['svi']]])[0]
            residual = d['isolated_excess'] - predicted
            residuals[d['country']] = residual
        
        # Store residuals
        for country_code in country_residuals:
            if country_code in residuals:
                country_residuals[country_code].append(residuals[country_code])
            else:
                country_residuals[country_code].append(np.nan)
        
        print(f"({len(residuals)} countries)")
    
    return country_residuals


def get_baseline_display_name(filename):
    """Get display name for baseline file."""
    if filename == 'QPR-RSMEmin.txt':
        return 'RMSE-minimized\nbaselines'
    
    match = re.match(r'(\d{4})(\d{4})qpr\.txt', filename)
    if match:
        return f"{match.group(1)}-{match.group(2)}\nbaselines"
    
    return filename


def plot_residual_evolution_grid():
    """Create a grid plot of residual evolution for all baseline files."""
    print("Loading data...")
    df = load_hmd_data()
    structural_factors = load_structural_factors()
    
    # Create figure with grid
    n_files = len(BASELINE_FILES)
    n_cols = 4
    n_rows = (n_files + n_cols - 1) // n_cols
    
    fig = plt.figure(figsize=(20, 5 * n_rows))
    gs = GridSpec(n_rows, n_cols, figure=fig, hspace=0.3, wspace=0.3)
    
    for idx, baseline_file in enumerate(BASELINE_FILES):
        print(f"Processing {baseline_file}...")
        
        filepath = DATA_DIR / baseline_file
        if not filepath.exists():
            print(f"  Warning: {baseline_file} not found, skipping...")
            continue
        
        # Parse baseline file
        trace_configs = parse_baseline_file(filepath)
        if len(trace_configs) == 0:
            print(f"  Warning: No trace configs found in {baseline_file}, skipping...")
            continue
        
        # Calculate residual evolution (SVI from 2025 fixed, regress vs isolated excess each year)
        country_residuals = calculate_residual_evolution(df, trace_configs, structural_factors)
        
        # Create subplot
        row = idx // n_cols
        col = idx % n_cols
        ax = fig.add_subplot(gs[row, col])
        
        # Plot each country
        for country_code, residuals in country_residuals.items():
            valid_residuals = [r for r in residuals if not np.isnan(r)]
            if len(valid_residuals) > 0:
                valid_years = [YEARS[i] for i, r in enumerate(residuals) if not np.isnan(r)]
                ax.plot(valid_years, valid_residuals, marker='o', markersize=3, linewidth=1, alpha=0.6)
        
        # Add zero line
        ax.axhline(y=0, color='red', linestyle='--', linewidth=1, alpha=0.5)
        
        # Formatting
        ax.set_xlabel('Year', fontsize=10)
        ax.set_ylabel('Residual (Actual - Predicted)', fontsize=10)
        ax.set_title(get_baseline_display_name(baseline_file), fontsize=12, fontweight='bold')
        ax.grid(True, alpha=0.3)
        ax.set_xticks(YEARS)
        
    plt.suptitle('Residual Evolution Over Time by Baseline Option (Isolated Years)', fontsize=16, fontweight='bold', y=0.995)
    plt.savefig(OUTPUT_FILE, dpi=300, bbox_inches='tight')
    
    # Get file info to confirm it was updated
    import os
    file_stat = os.stat(OUTPUT_FILE)
    file_size_mb = file_stat.st_size / (1024 * 1024)
    mod_time = datetime.fromtimestamp(file_stat.st_mtime).strftime('%Y-%m-%d %H:%M:%S')
    print(f"\nPlot saved to {OUTPUT_FILE}")
    print(f"  File size: {file_size_mb:.2f} MB")
    print(f"  Last modified: {mod_time}")


if __name__ == '__main__':
    plot_residual_evolution_grid()

