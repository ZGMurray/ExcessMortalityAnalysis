# Excess Mortality Analysis

An interactive web application for viewing and analyzing cumulative excess ASMR (Age-Standardized Mortality Rate) comparisons with comprehensive analysis tools including structural factors, policy factors, and counterfactual comparisons.

## 🌐 Online Access

This application is available online via GitHub Pages. Simply visit the deployed site to use it in your browser.

## 🚀 Deployment to GitHub Pages

To deploy this project to GitHub Pages:

1. **Create a GitHub repository** and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy when you push to the `main` or `master` branch

3. **Access your site**:
   - Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
   - The deployment workflow will run automatically on every push to the main branch

## 📋 Local Development

For local development:

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Run a local server** (required due to CORS restrictions):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Node.js
   npx http-server
   ```

3. Open `http://localhost:8000` in your browser

## Usage

1. The application will automatically load data files from the `data/` directory
2. Use the controls to filter countries, change aggregation levels, and explore different sections
3. Section 1: View cumulative excess ASMR comparisons
4. Section 2: Analyze structural factors (ASMR, GDP, GINI, Poverty, Health Expenditure)
5. Section 3: Explore policy factors and their relationship to excess mortality
6. Section 4: Compare countries using counterfactual analysis
7. Section 5: Review method notes and documentation

## File Structure

```
plot-viewer/
├── index.html              # Main HTML file
├── assets/
│   ├── style.css          # Styling
│   ├── script.js          # Main JavaScript functionality
│   └── libs/
│       └── plotly.min.js  # Plotly.js library
├── data/
│   └── HMD.csv            # Mortality data
└── README.md              # This file
```

## Data Format

The application expects reproduction data in a specific text format that includes:
- Trace details (country, sex, baseline type, baseline range, start date)
- Baseline method information
- Data point counts and date ranges
- RMSE calculations for validation

## Baseline Methods

- **Seasonal**: Mean by ISO week within baseline window
- **Flat**: Mean of all weeks in baseline window
- **Linear**: Linear trend over baseline window, projected
- **Rolling**: Moving average within baseline window
- **GLM Poisson**: Generalized Linear Model with Poisson distribution
- **Quasi Poisson**: Quasi-Poisson regression accounting for overdispersion

## Technical Details

- Uses ESP2013 standardization weights by default
- Data filtered to 2020 and beyond for cumulative calculations
- Seasonal adjustments applied to trend baselines
- ISO week 53 handled conservatively
- Responsive design with dark theme

## Features

- **Section 1: Cumulative Excess ASMR** - Interactive visualization of excess mortality over time
- **Section 2: Structural Factors** - Analysis of structural vulnerability factors (ASMR, GDP, GINI, Poverty, Health Expenditure)
- **Section 3: Policy Factors** - Examination of policy variables and their relationship to excess mortality
- **Section 4: Counterfactuals** - Country comparison with financial analysis and QALY calculations
- **Section 5: Method Notes** - Detailed documentation of methodologies

## Requirements

- Modern web browser with JavaScript enabled
- For local development: A local web server (due to CORS restrictions)
- For production: GitHub Pages (automatically configured)

## License

Same as the original project.
