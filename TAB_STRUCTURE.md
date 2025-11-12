# Dashboard Tab Structure

## Complete Tab Navigation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Dashboard Navigation Bar                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [1] Sales Dashboard        [Main metrics and overview]                     │
│  [2] JobNimbus Analytics    [Lead tracking and pipeline]                    │
│  [3] P&L Analysis          [Financial performance]                          │
│  [4] Sales Rep Simulator   [Team compensation modeling]                     │
│  [5] Lead Cost Analysis    [Customer acquisition costs] ← NEW!              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Tab 5: Lead Cost Analysis Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER: Lead Cost Analysis                                                  │
│  Gradient: Teal → Emerald → Green                                           │
│  Period: Jan-Oct 2025 | Leads: 351 | Conversions: 63 | LTV:CAC: [X]:1     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  KEY METRICS (4 Cards)                                                       │
├──────────────────┬──────────────────┬──────────────────┬──────────────────┤
│  Avg Cost/Lead   │  Avg CAC         │  Lead Efficiency │  Payback Period  │
│  $XXX            │  $XXX            │  X.XXx           │  XX months       │
│  [Target Icon]   │  [Dollar Icon]   │  [TrendUp Icon]  │  [Timer Icon]    │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  CHARTS ROW 1                                                                │
├───────────────────────────────────┬─────────────────────────────────────────┤
│  CPL Trend (Area Chart)           │  CAC vs LTV (Composed Chart)            │
│  - Monthly cost evolution         │  - Monthly CAC bars                     │
│  - Average reference line         │  - LTV target line                      │
│  - Gradient fill                  │  - Healthy zone indicator               │
└───────────────────────────────────┴─────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  CHARTS ROW 2                                                                │
├───────────────────────────────────┬─────────────────────────────────────────┤
│  Conversion Funnel                │  Monthly Efficiency Heatmap             │
│  - Leads → Contracts → Revenue    │  - 10-month grid                        │
│  - Cost per stage                 │  - Color-coded LTV:CAC ratios           │
│  - Conversion rates               │  - ROI percentages                      │
└───────────────────────────────────┴─────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  QUARTERLY PERFORMANCE (Bar Chart)                                           │
│  Q1 | Q2 | Q3 | Q4                                                          │
│  CPL + CAC bars + ROI line overlay                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  MONTH COMPARISON TOOL                                                       │
├───────────────────────────────────┬─────────────────────────────────────────┤
│  Select Month 1: [Dropdown]       │  Select Month 2: [Dropdown]             │
├───────────────────────────────────┼─────────────────────────────────────────┤
│  January 2025 Metrics             │  October 2025 Metrics                   │
│  • Leads: XX                      │  • Leads: XX (+/- delta)                │
│  • Closed: XX                     │  • Closed: XX (+/- delta)               │
│  • CPL: $XXX                      │  • CPL: $XXX (+/- delta)                │
│  • CAC: $XXX                      │  • CAC: $XXX (+/- delta)                │
│  • LTV:CAC: X.XX:1                │  • LTV:CAC: X.XX:1 (+/- delta)          │
│  • ROI: XX%                       │  • ROI: XX% (+/- delta)                 │
│  • Revenue: $XXX,XXX              │  • Revenue: $XXX,XXX (+/- delta)        │
└───────────────────────────────────┴─────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  SMART INSIGHTS PANEL                                                        │
├───────────────────────────────────┬─────────────────────────────────────────┤
│  Left Column:                     │  Right Column:                          │
│  • LTV:CAC Ratio Analysis         │  • Overall ROI Assessment               │
│  • Best Performing Month          │  • Optimization Opportunities           │
│  • Payback Period Evaluation      │  • Seasonal Pattern Insights            │
└───────────────────────────────────┴─────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  DETAILED MONTHLY DATA TABLE                                                 │
│  Month | Leads | Closed | Conv% | CPL | CAC | LTV:CAC | ROI | Revenue | Eff│
│  ──────────────────────────────────────────────────────────────────────────│
│  Jan   |  28   |   5    | 17.9% | $XX | $XX |  X.XX:1 | XX% | $XXX,XXX| X.X│
│  Feb   |  32   |   6    | 18.8% | $XX | $XX |  X.XX:1 | XX% | $XXX,XXX| X.X│
│  ...   |  ...  |  ...   |  ...  | ... | ... |  ...    | ... |  ...    | ...│
│  ──────────────────────────────────────────────────────────────────────────│
│  AVG   |  35   |   6    | 18.0% | $XX | $XX |  X.XX:1 | XX% | $XXX,XXX| X.X│
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Structure

```javascript
LeadCostAnalysis/
├── State Management
│   ├── monthlyLeadData (10 months of real data)
│   ├── analysisData (calculated metrics)
│   └── comparison state (compareMonth1, compareMonth2)
│
├── Metrics Calculations
│   ├── CPL (Cost per Lead)
│   ├── CAC (Customer Acquisition Cost)
│   ├── LTV:CAC Ratio
│   ├── Payback Period
│   ├── Lead Efficiency
│   └── ROI
│
├── Visual Components
│   ├── Hero Header (gradient banner)
│   ├── Key Metrics Cards (4 cards)
│   ├── CPL Trend Chart (area)
│   ├── CAC vs LTV Chart (composed)
│   ├── Conversion Funnel (custom)
│   ├── Efficiency Heatmap (grid)
│   ├── Quarterly Chart (bar)
│   ├── Comparison Tool (interactive)
│   ├── Insights Panel (smart cards)
│   └── Data Table (detailed)
│
└── Interactivity
    ├── Month selection dropdowns
    ├── Hover tooltips
    ├── Color-coded indicators
    └── Delta calculations
```

## Data Flow

```
Real Monthly Data
        ↓
Calculate Metrics
        ↓
┌─────────────────┬─────────────────┬─────────────────┐
│   CPL           │   CAC           │   LTV:CAC       │
│   Efficiency    │   ROI           │   Payback       │
└─────────────────┴─────────────────┴─────────────────┘
        ↓
Aggregate by Quarter
        ↓
Generate Insights
        ↓
Render Visualizations
```

## Color Coding System

### Metric Performance Colors
```
CPL/CAC:
  Green  = Below average (better)
  Red    = Above average (worse)

LTV:CAC Ratio:
  Green  = ≥ 3:1 (healthy)
  Yellow = 2-3:1 (acceptable)
  Red    = < 2:1 (concerning)

ROI:
  Green  = Positive
  Red    = Negative

Efficiency Heatmap:
  Dark Green  = ≥ 4:1 (excellent)
  Emerald     = 3-4:1 (healthy)
  Yellow      = 2-3:1 (acceptable)
  Orange      = 1-2:1 (caution)
  Red         = < 1:1 (critical)
```

## Key Metrics Explained

### Cost per Lead (CPL)
```
Formula: (Advertising + Sales Payroll + 30% Overhead) / Number of Leads
Purpose: Measures cost efficiency of lead generation
Target: Lower is better, track trends
```

### Customer Acquisition Cost (CAC)
```
Formula: Total Marketing & Sales Costs / Closed Contracts
Purpose: True cost to acquire a paying customer
Target: Should be less than LTV/3 for healthy ratio
```

### LTV:CAC Ratio
```
Formula: Customer Lifetime Value / Customer Acquisition Cost
Purpose: Measures profitability of customer acquisition
Target: 3:1 or higher (customer worth 3x acquisition cost)
```

### Payback Period
```
Formula: CAC / (Monthly Revenue per Customer × Gross Margin)
Purpose: Time to recover customer acquisition investment
Target: Under 12 months is excellent
```

### Lead Efficiency
```
Formula: Total Revenue / Total Costs
Purpose: Revenue generated per dollar spent
Target: Higher is better, >1.5x is good
```

### ROI (Return on Investment)
```
Formula: ((Revenue - Costs) / Costs) × 100%
Purpose: Overall profitability percentage
Target: Positive is profitable, >50% is excellent
```

## Usage Tips

### For Quick Assessment
1. Check the LTV:CAC ratio in the header (should be green ≥ 3:1)
2. Review the Efficiency Heatmap for problem months (red/orange)
3. Read Smart Insights for actionable recommendations

### For Deep Analysis
1. Study CPL Trend chart for cost evolution patterns
2. Compare specific months using the comparison tool
3. Review detailed table for comprehensive month-by-month data
4. Analyze Quarterly Performance for seasonal trends

### For Strategic Planning
1. Identify best performing months and replicate strategies
2. Flag concerning trends (rising CPL, falling conversion)
3. Calculate optimization opportunities from insights
4. Plan budget adjustments based on seasonal patterns

---

**Navigation:** Click "Lead Cost Analysis" tab (5th tab, dollar sign icon)
**Build Status:** ✅ Successful
**Component Size:** ~830 lines
**Charts:** 7 visualizations
**Metrics:** 10+ calculated KPIs
