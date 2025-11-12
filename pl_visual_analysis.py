import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Configurar estilo de visualización
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")

# Leer datos del CSV generado
df = pd.read_csv('C:\\Users\\benito\\poweria\\ventas\\castro_pl_analysis.csv')

# Crear figura con múltiples subplots
fig = plt.figure(figsize=(20, 24))

# 1. Evolución de Income vs Net Income
ax1 = plt.subplot(6, 2, 1)
months = df['Month']
x = np.arange(len(months))
ax1.bar(x - 0.2, df['Total_Income'], width=0.4, label='Total Income', color='green', alpha=0.7)
ax1.bar(x + 0.2, df['Net_Income'], width=0.4, label='Net Income', color='blue', alpha=0.7)
ax1.axhline(y=0, color='red', linestyle='--', linewidth=1)
ax1.set_xlabel('Month')
ax1.set_ylabel('Amount ($)')
ax1.set_title('Total Income vs Net Income por Mes', fontsize=14, fontweight='bold')
ax1.set_xticks(x)
ax1.set_xticklabels(months)
ax1.legend()
ax1.grid(True, alpha=0.3)

# Añadir valores en las barras
for i, (income, net) in enumerate(zip(df['Total_Income'], df['Net_Income'])):
    ax1.text(i - 0.2, income, f'${income/1000:.0f}K', ha='center', va='bottom', fontsize=8)
    color = 'green' if net >= 0 else 'red'
    ax1.text(i + 0.2, net, f'${net/1000:.0f}K', ha='center',
             va='bottom' if net >= 0 else 'top', fontsize=8, color=color)

# 2. Composición del COGS
ax2 = plt.subplot(6, 2, 2)
cogs_components = ['Contract Labor', 'Supplies & Materials']
cogs_values = [df['Total_Contract_Labor'].mean(), df['Total_Supplies_Materials'].mean()]
colors = ['#ff9999', '#66b3ff']
wedges, texts, autotexts = ax2.pie(cogs_values, labels=cogs_components, colors=colors,
                                    autopct='%1.1f%%', startangle=90)
ax2.set_title('Composición Promedio del COGS', fontsize=14, fontweight='bold')
for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontweight('bold')

# 3. Tendencia de Gross Margin
ax3 = plt.subplot(6, 2, 3)
gross_margin = (df['Gross_Profit'] / df['Total_Income']) * 100
ax3.plot(months, gross_margin, marker='o', linewidth=2, markersize=8, color='purple')
ax3.axhline(y=gross_margin.mean(), color='red', linestyle='--',
           label=f'Promedio: {gross_margin.mean():.1f}%')
ax3.set_xlabel('Month')
ax3.set_ylabel('Gross Margin (%)')
ax3.set_title('Evolución del Gross Margin', fontsize=14, fontweight='bold')
ax3.legend()
ax3.grid(True, alpha=0.3)
for i, val in enumerate(gross_margin):
    ax3.text(i, val, f'{val:.1f}%', ha='center', va='bottom', fontsize=9)

# 4. Top 10 Gastos
ax4 = plt.subplot(6, 2, 4)
top_expenses = {
    'SRS Dist.': 237968.12,
    'Roofing': 191893.84,
    'Partners': 150776.04,
    'Sales Comm.': 130195.77,
    'Payroll Tax': 96732.28,
    'Salaries': 95027.16,
    'Siding': 79440.00,
    'Beacon/QXO': 77223.20,
    'Admin Labor': 54349.36,
    'Dump Fees': 37466.48
}
y_pos = np.arange(len(top_expenses))
ax4.barh(y_pos, list(top_expenses.values()), color='coral')
ax4.set_yticks(y_pos)
ax4.set_yticklabels(list(top_expenses.keys()))
ax4.set_xlabel('Total Amount ($)')
ax4.set_title('Top 10 Gastos Totales (Ene-Oct)', fontsize=14, fontweight='bold')
for i, v in enumerate(top_expenses.values()):
    ax4.text(v, i, f' ${v/1000:.0f}K', va='center', fontsize=9)

# 5. Operating Expenses Breakdown
ax5 = plt.subplot(6, 2, 5)
opex_categories = ['Advertising', 'Auto', 'G&A', 'Insurance', 'Legal/Prof', 'Payroll', 'Taxes', 'Utilities']
opex_values = [
    df['Total_Advertising'].sum(),
    df['Total_Auto'].sum(),
    df['Total_GA'].sum(),
    df['Total_Insurance'].sum(),
    df['Total_Legal_Professional'].sum(),
    df['Total_Payroll'].sum(),
    df['Total_Taxes'].sum(),
    df['Total_Utilities'].sum()
]
colors_opex = plt.cm.Set3(np.linspace(0, 1, len(opex_categories)))
ax5.bar(opex_categories, opex_values, color=colors_opex)
ax5.set_xlabel('Category')
ax5.set_ylabel('Total Amount ($)')
ax5.set_title('Operating Expenses por Categoría (Total)', fontsize=14, fontweight='bold')
ax5.tick_params(axis='x', rotation=45)
for i, v in enumerate(opex_values):
    ax5.text(i, v, f'${v/1000:.0f}K', ha='center', va='bottom', fontsize=9)

# 6. Cash Flow Pattern
ax6 = plt.subplot(6, 2, 6)
cumulative_net = df['Net_Income'].cumsum()
ax6.fill_between(range(len(months)), 0, cumulative_net, where=(cumulative_net >= 0),
                 color='green', alpha=0.3, label='Ganancia Acumulada')
ax6.fill_between(range(len(months)), 0, cumulative_net, where=(cumulative_net < 0),
                 color='red', alpha=0.3, label='Pérdida Acumulada')
ax6.plot(cumulative_net, marker='o', linewidth=2, markersize=6, color='black')
ax6.axhline(y=0, color='black', linestyle='-', linewidth=1)
ax6.set_xlabel('Month')
ax6.set_ylabel('Cumulative Net Income ($)')
ax6.set_title('Cash Flow Acumulado', fontsize=14, fontweight='bold')
ax6.set_xticks(range(len(months)))
ax6.set_xticklabels(months)
ax6.legend()
ax6.grid(True, alpha=0.3)

# 7. Revenue Breakdown por Tipo
ax7 = plt.subplot(6, 2, 7)
revenue_types = {
    'GA Castro': df['Revenue_GA_Castro'].sum(),
    'Labor Service': max(0, df['Revenue_Labor_Service'].sum()),
    'Sales': df['Revenue_Sales'].sum(),
    'Services': df['Revenue_Services'].sum()
}
# Filtrar valores negativos para el pie chart
positive_revenues = {k: v for k, v in revenue_types.items() if v > 0}
if positive_revenues:
    wedges, texts, autotexts = ax7.pie(positive_revenues.values(), labels=positive_revenues.keys(),
                                        autopct=lambda pct: f'{pct:.1f}%' if pct > 1 else '',
                                        startangle=45)
    ax7.set_title('Composición de Ingresos por Tipo', fontsize=14, fontweight='bold')

# 8. Contract Labor Breakdown
ax8 = plt.subplot(6, 2, 8)
labor_types = {
    'Roofing': df['Contract_Labor_Roofing'].sum(),
    'Siding': df['Contract_Labor_Siding'].sum(),
    'Carpentry': df['Contract_Labor_Carpentry'].sum(),
    'Handyman': df['Contract_Labor_Handyman'].sum(),
    'MISC': df['Contract_Labor_MISC'].sum(),
    'Painting': df['Contract_Labor_Painting'].sum(),
    'Asbestos': df['Contract_Labor_Asbestos'].sum(),
    'Casual': df['Casual_Labor'].sum(),
    'Masonry': df['Contract_Labor_Masonry'].sum()
}
labor_sorted = dict(sorted(labor_types.items(), key=lambda x: x[1], reverse=True))
ax8.bar(range(len(labor_sorted)), list(labor_sorted.values()), color='skyblue')
ax8.set_xticks(range(len(labor_sorted)))
ax8.set_xticklabels(list(labor_sorted.keys()), rotation=45, ha='right')
ax8.set_ylabel('Total Amount ($)')
ax8.set_title('Contract Labor por Tipo (Total)', fontsize=14, fontweight='bold')
for i, v in enumerate(labor_sorted.values()):
    ax8.text(i, v, f'${v/1000:.0f}K', ha='center', va='bottom', fontsize=8)

# 9. Monthly Volatility Analysis
ax9 = plt.subplot(6, 2, 9)
income_mean = df['Total_Income'].mean()
income_std = df['Total_Income'].std()
ax9.bar(months, df['Total_Income'], color='lightblue', label='Monthly Income')
ax9.axhline(y=income_mean, color='red', linestyle='-', linewidth=2, label=f'Mean: ${income_mean/1000:.0f}K')
ax9.axhline(y=income_mean + income_std, color='orange', linestyle='--', label=f'+1 Std Dev')
ax9.axhline(y=income_mean - income_std, color='orange', linestyle='--', label=f'-1 Std Dev')
ax9.set_xlabel('Month')
ax9.set_ylabel('Total Income ($)')
ax9.set_title(f'Volatilidad de Ingresos (CV: {(income_std/income_mean*100):.1f}%)',
             fontsize=14, fontweight='bold')
ax9.legend(loc='upper left')
ax9.grid(True, alpha=0.3)

# 10. COGS as % of Revenue (Monthly)
ax10 = plt.subplot(6, 2, 10)
cogs_percentage = (df['Total_COGS'] / df['Total_Income']) * 100
ax10.plot(months, cogs_percentage, marker='s', linewidth=2, markersize=8, color='red')
ax10.axhline(y=cogs_percentage.mean(), color='blue', linestyle='--',
            label=f'Promedio: {cogs_percentage.mean():.1f}%')
ax10.axhline(y=50, color='green', linestyle=':', label='Target: 50%')
ax10.set_xlabel('Month')
ax10.set_ylabel('COGS as % of Revenue')
ax10.set_title('COGS como % de Revenue (Mensual)', fontsize=14, fontweight='bold')
ax10.legend()
ax10.grid(True, alpha=0.3)
for i, val in enumerate(cogs_percentage):
    ax10.text(i, val, f'{val:.0f}%', ha='center', va='bottom', fontsize=8)

# 11. Supplier Costs Distribution
ax11 = plt.subplot(6, 2, 11)
supplier_costs = {
    'SRS Dist.': df['COGS_SRS_Distribution'].sum(),
    'Beacon/QXO': df['COGS_Beacon_QXO'].sum(),
    'Dump Fees': df['COGS_Dump_Fees'].sum(),
    'Home Depot': df['COGS_Home_Depot'].sum(),
    'Permits': df['COGS_Permits_Fees'].sum(),
    'Lansing': df['COGS_Lansing_Building'].sum(),
    'Others': (df['COGS_ABC_Supply'].sum() + df['COGS_King_Floors'].sum() +
               df['COGS_Lowes'].sum() + df['COGS_MISC_Suppliers'].sum() +
               df['COGS_New_Castle'].sum() + df['COGS_OG'].sum() +
               df['COGS_Rings_End'].sum() + df['COGS_Sherwin_Williams'].sum())
}
colors_suppliers = plt.cm.Pastel1(np.linspace(0, 1, len(supplier_costs)))
wedges, texts, autotexts = ax11.pie(supplier_costs.values(), labels=supplier_costs.keys(),
                                     autopct='%1.1f%%', startangle=90, colors=colors_suppliers)
ax11.set_title('Distribución de Costos por Proveedor', fontsize=14, fontweight='bold')

# 12. Profitability Trend
ax12 = plt.subplot(6, 2, 12)
net_margin = (df['Net_Income'] / df['Total_Income']) * 100
colors_margin = ['green' if x >= 0 else 'red' for x in net_margin]
bars = ax12.bar(months, net_margin, color=colors_margin, alpha=0.7)
ax12.axhline(y=0, color='black', linestyle='-', linewidth=1)
ax12.axhline(y=10, color='green', linestyle='--', label='Target: 10%')
ax12.set_xlabel('Month')
ax12.set_ylabel('Net Margin (%)')
ax12.set_title('Net Margin Mensual', fontsize=14, fontweight='bold')
ax12.legend()
ax12.grid(True, alpha=0.3)
for i, (bar, val) in enumerate(zip(bars, net_margin)):
    height = bar.get_height()
    ax12.text(bar.get_x() + bar.get_width()/2., height,
             f'{val:.1f}%', ha='center', va='bottom' if height >= 0 else 'top', fontsize=8)

plt.suptitle('G.A. CASTRO CONSTRUCTION LLC - ANÁLISIS VISUAL P&L (Ene-Oct 2025)',
            fontsize=16, fontweight='bold', y=1.002)
plt.tight_layout()

# Guardar la figura
plt.savefig('C:\\Users\\benito\\poweria\\ventas\\castro_pl_visual_analysis.png', dpi=150, bbox_inches='tight')
plt.savefig('C:\\Users\\benito\\poweria\\ventas\\castro_pl_visual_analysis.pdf', bbox_inches='tight')

print("Gráficos guardados como:")
print("  - castro_pl_visual_analysis.png")
print("  - castro_pl_visual_analysis.pdf")

# Mostrar estadísticas adicionales no incluidas en el análisis principal
print("\n" + "="*80)
print("ESTADÍSTICAS ADICIONALES Y MÉTRICAS AVANZADAS")
print("="*80)

# Análisis de correlación
print("\nCORRELACIÓN entre componentes financieros:")
correlation_matrix = df[['Total_Income', 'Total_COGS', 'Total_Operating_Expenses', 'Net_Income']].corr()
print(correlation_matrix.round(3))

# Análisis de tendencia (regresión lineal simple)
from scipy import stats
months_numeric = np.arange(1, 11)
slope, intercept, r_value, p_value, std_err = stats.linregress(months_numeric, df['Total_Income'])
print(f"\nTENDENCIA DE INGRESOS:")
print(f"  - Pendiente: ${slope:,.2f} por mes")
print(f"  - R-squared: {r_value**2:.3f}")
print(f"  - Proyección Nov 2025: ${(slope * 11 + intercept):,.2f}")

# Análisis de eficiencia
print("\nRATIOS DE EFICIENCIA:")
print(f"  - Revenue por dólar de Contract Labor: ${(df['Total_Income'].sum()/df['Total_Contract_Labor'].sum()):.2f}")
print(f"  - Revenue por dólar de Supplies: ${(df['Total_Income'].sum()/df['Total_Supplies_Materials'].sum()):.2f}")
print(f"  - Revenue por dólar de Payroll: ${(df['Total_Income'].sum()/df['Total_Payroll'].sum()):.2f}")

# Break-even analysis
fixed_costs = df['Total_GA'].mean() + df['Total_Insurance'].mean() + df['GA_Rent_Expenses'].mean()
variable_cost_ratio = df['Total_COGS'].sum() / df['Total_Income'].sum()
breakeven_revenue = fixed_costs / (1 - variable_cost_ratio)
print(f"\nBREAK-EVEN ANALYSIS (Mensual):")
print(f"  - Fixed Costs Promedio: ${fixed_costs:,.2f}")
print(f"  - Variable Cost Ratio: {variable_cost_ratio:.2%}")
print(f"  - Break-even Revenue: ${breakeven_revenue:,.2f}")

# Análisis de riesgo
print("\nANÁLISIS DE RIESGO:")
negative_months = (df['Net_Income'] < 0).sum()
print(f"  - Meses con pérdidas: {negative_months} de 10 ({negative_months/10*100:.0f}%)")
print(f"  - Pérdida máxima en un mes: ${df['Net_Income'].min():,.2f}")
print(f"  - Ganancia máxima en un mes: ${df['Net_Income'].max():,.2f}")
print(f"  - Rango (volatilidad): ${(df['Net_Income'].max() - df['Net_Income'].min()):,.2f}")

plt.show()