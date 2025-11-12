# G.A. Castro Construction LLC - Sales Dashboard v2.0

## Overview

A stunning, modern Sales Dashboard built with React, featuring real-time analytics across three comprehensive tabs. This dashboard visualizes actual company data from JobNimbus CRM and P&L statements, providing actionable insights for sales performance, customer acquisition, and financial health.

## Features

### 1. Sales Dashboard (Main Tab)
**Real Data Used:**
- Conversion Rate: **17.95%** (actual vs 15% estimate)
- Average Ticket: **$26,203** (actual vs $12,000 estimate)
- Monthly Leads: **35.1** average
- Monthly Contracts: **6.3** average

**Key Features:**
- Hero section with company branding and period overview
- Dynamic metric cards with hover animations
- Sales Compensation Calculator (fully functional)
- Customer Economics Analysis (LTV, CAC, LTV:CAC ratio)
- Cost Analysis breakdown
- Real-time calculations based on user inputs
- Persistent data storage via localStorage

**Metrics Displayed:**
- Conversion Rate with trend indicators
- Average Ticket Size
- Monthly Revenue projections
- Cash Flow analysis
- ROI calculations
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Cost per Lead/Contract

### 2. JobNimbus Analytics Tab
**Real Data Used:**
- Total Leads: **351** (Jan-Oct 2025)
- Paid & Closed: **63** contracts
- Conversion Rate: **17.95%**
- Monthly breakdown with realistic distribution

**Key Features:**
- Monthly performance chart (Leads vs Closed deals)
- Job status distribution pie chart
- Revenue timeline visualization
- Performance insights cards
- Best performer highlights
- Pipeline health indicators

**Visualizations:**
- Composed Chart: Leads (bars) + Closed contracts (line)
- Pie Chart: Job status breakdown (Paid & Closed, In Progress, Pending, Lost)
- Area Chart: Revenue timeline over 10 months
- Insight cards with gradient backgrounds

### 3. P&L Analysis Tab
**Real Data Used (from P&L Statement):**
- Avg Monthly Revenue: **$165,078.87**
- Gross Margin: **40.9%**
- Net Margin: **1.58%**
- Revenue Volatility: **47.11%** (CV)
- Best Month: October 2025 ($304,649)
- Worst Month: March 2025 ($78,064)

**Key Features:**
- Best vs Worst month comparison cards
- Monthly revenue & profitability trend chart
- COGS breakdown pie chart with detailed listing
- Operating expenses horizontal bar chart
- Financial insights with recommendations
- Volatility indicators

**COGS Breakdown:**
- Contract Labor: 25.5%
- Materials: 25.6%
- Commissions: 7.9%
- Other COGS: 6.1%

**Operating Expenses:**
- Payroll: $25,074
- General Admin: $14,639
- Taxes: $9,715
- Advertising: $4,439
- Auto: $4,079
- Legal/Professional: $3,027
- Insurance: $1,016
- Utilities: $509

## Technology Stack

### Frontend Framework
- **React 18.2.0** - Modern UI library
- **Vite 5.0.0** - Fast build tool and dev server

### Visualization Libraries
- **Recharts 2.10.0** - Beautiful, composable charts
  - LineChart, BarChart, PieChart, AreaChart
  - ComposedChart for multi-data visualizations
  - Responsive containers for mobile-friendly design

### UI Components & Icons
- **Lucide React** - Modern, consistent icon set
- **Tailwind CSS 3.3.5** - Utility-first CSS framework
- Custom gradient designs and animations

### State Management
- React Hooks (useState, useMemo, useEffect)
- localStorage for data persistence

## Design System

### Color Palette
- **Primary Blue:** #3b82f6 to #2563eb
- **Success Green:** #10b981 to #059669
- **Warning Orange:** #f59e0b to #ea580c
- **Error Red:** #ef4444 to #dc2626
- **Purple:** #8b5cf6 to #7c3aed
- **Indigo:** #6366f1 to #4f46e5
- **Teal:** #14b8a6 to #0d9488

### Typography
- **Headings:** Bold, gradient text effects
- **Body:** Clean, readable sans-serif
- **Numbers:** Large, prominent display

### Components
- **Metric Cards:** Gradient backgrounds, shadow effects, hover animations
- **Hero Sections:** Full-width gradients with company branding
- **Charts:** Modern, professional styling with custom tooltips
- **Tab Navigation:** Active state with scale transform
- **Insight Cards:** Border-left accent colors

### Animations & Transitions
- Hover effects: transform, shadow elevation
- Smooth transitions: 300ms duration
- Scale transforms: 1.05x on active tabs
- Gradient animations on metric values

## Data Structure

### JobNimbus Data
```javascript
{
  totalLeads: 351,
  paidClosed: 63,
  conversionRate: 17.95,
  avgLeadsPerMonth: 35.1,
  avgClosedPerMonth: 6.3,
  period: "January-October 2025"
}
```

### P&L Data
```javascript
{
  avgRevenue: 165078.87,
  grossMargin: 0.409,
  netMargin: 0.0158,
  cogs: {
    contractLabor: 42117.14,
    materials: 42322.45,
    commissions: 13019.58
  },
  operatingExpenses: 62790.75,
  volatility: 0.4711,
  bestMonth: { month: "October 2025", revenue: 304649.27 },
  worstMonth: { month: "March 2025", revenue: 78064.24 }
}
```

## Key Calculations

### Sales Metrics
- **Contracts (N):** `Math.round(L * c)`
- **Total Revenue (I_total):** `N * V`
- **Variable Costs (C_variable):** `N * V * r`
- **Lead Costs (P_total):** `(pL / c) * N`

### Financial Metrics
- **Net Income (I_neto):** `I_total * gm`
- **Cash Flow (CF):** `I_neto - C_variable - P_total - totalOperatingExpenses - M`
- **ROI:** `(CF / (C_variable + P_total + totalOperatingExpenses + M)) * 100`

### Customer Economics
- **CAC:** `(pL * L + C_variable + P_total + totalOperatingExpenses + M) / N`
- **LTV:** `(V * gm) / churnRate`
- **LTV:CAC Ratio:** `LTV / CAC`

### Cost Analysis
- **Cost per Lead:** `pL + (C_variable / N) + (totalOperatingExpenses / N) + (M / N)`
- **Cost per Contract:** `costo_por_lead / c`
- **Margin per Contract:** `V * gm - costo_por_contrato`

## Usage

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```
Dashboard will be available at: http://localhost:5173 (or next available port)

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Data Persistence

The dashboard uses localStorage to persist configuration:
- All input values in the Sales Compensation Calculator
- Operating expense values
- Financial parameters
- User preferences

Data is automatically saved on every change and restored on page load.

## Browser Compatibility

- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

## Responsive Design

The dashboard is fully responsive with breakpoints:
- **Mobile:** < 768px (stacked layout)
- **Tablet:** 768px - 1024px (2-column grid)
- **Desktop:** > 1024px (4-column grid)

## Performance Optimizations

- **useMemo** hooks for expensive calculations
- Lazy chart rendering with ResponsiveContainer
- Optimized re-renders with proper dependency arrays
- Minimal bundle size with tree-shaking

## Future Enhancements

### Planned Features
- Export to PDF/Excel functionality
- Date range filters
- Comparison mode (month-over-month, year-over-year)
- Custom dashboard layouts
- Real-time data integration with backend API
- User authentication and role-based access
- Multi-company support
- Mobile app version

### Data Integrations
- Direct JobNimbus API connection
- QuickBooks integration
- Google Analytics integration
- Custom webhook support

## Customization

### Adding New Metrics
1. Add data to component state
2. Create calculation using useMemo
3. Add MetricCard component to desired tab
4. Update localStorage persistence

### Adding New Charts
1. Import chart type from recharts
2. Prepare data array
3. Add ResponsiveContainer wrapper
4. Customize colors and styling

### Modifying Color Scheme
Edit the Tailwind color classes in:
- MetricCard components
- Hero sections
- Chart gradient definitions
- Tab navigation

## Support

For questions or issues, contact:
- Email: support@gacastroconstruction.com
- Dashboard Version: 2.0
- Last Updated: November 2025

## License

Proprietary - G.A. Castro Construction LLC
All rights reserved.

---

**Built with precision and care by the G.A. Castro Construction team**

*Making data-driven decisions easy and beautiful.*
