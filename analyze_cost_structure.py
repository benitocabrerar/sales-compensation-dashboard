# Analizar la estructura de costos para identificar el problema

L = 35  # leads
c = 0.1795  # conversion rate
V = 26203  # average ticket
pL = 48  # cost per lead
r = 0.079  # commission rate
gm = 0.409  # gross margin

# Operating expenses
totalOperatingExpenses = 62691
M = 1000

# Calculations
N = round(L * c)  # 6 contracts
I_total = N * V  # Total revenue
C_variable = N * V * r  # Commissions
P_total = (pL / c) * N  # Total lead costs

print('=' * 70)
print('ANÁLISIS DE ESTRUCTURA DE COSTOS')
print('=' * 70)
print()
print(f'Con {L} leads mensuales y conversion de {c*100:.2f}%:')
print(f'  - Se cierran {N} contratos al mes')
print(f'  - Revenue total: ${I_total:,.2f}')
print()

print('DESGLOSE DE COSTOS:')
print(f'  1. Costo directo de leads: ${pL} x {L} = ${pL * L:,.2f}')
print(f'  2. Comisiones (7.9% de revenue): ${C_variable:,.2f}')
print(f'  3. Gastos operativos fijos: ${totalOperatingExpenses:,.2f}')
print(f'  4. Compensación dueño: ${M:,.2f}')
print(f'  TOTAL COSTOS: ${pL * L + C_variable + totalOperatingExpenses + M:,.2f}')
print()

# Revenue después de costos de bienes vendidos (COGS)
revenue_after_cogs = I_total * gm
cogs = I_total * (1 - gm)

print('REVENUE Y MÁRGENES:')
print(f'  Revenue bruto: ${I_total:,.2f}')
print(f'  COGS (59.1%): ${cogs:,.2f}')
print(f'  Revenue después de COGS (40.9%): ${revenue_after_cogs:,.2f}')
print()

print('PROBLEMA IDENTIFICADO:')
print(f'  Revenue disponible para gastos: ${revenue_after_cogs:,.2f}')
print(f'  Gastos totales (sin COGS): ${pL * L + C_variable + totalOperatingExpenses + M:,.2f}')
print(f'  DÉFICIT: ${revenue_after_cogs - (pL * L + C_variable + totalOperatingExpenses + M):,.2f}')
print()

print('=' * 70)
print('CÁLCULO DEL BREAK-EVEN:')
print('=' * 70)
print()

# Para break-even: Revenue después COGS = Costos totales
# (N × V × gm) = pL × L + (N × V × r) + totalOperatingExpenses + M
# Donde N = L × c
# (L × c × V × gm) = pL × L + (L × c × V × r) + totalOperatingExpenses + M
# L × c × V × gm - pL × L - L × c × V × r = totalOperatingExpenses + M
# L × (c × V × gm - pL - c × V × r) = totalOperatingExpenses + M
# L = (totalOperatingExpenses + M) / (c × V × gm - pL - c × V × r)

contribucion_por_lead = c * V * gm - pL - c * V * r
leads_breakeven = (totalOperatingExpenses + M) / contribucion_por_lead

print(f'Contribución por lead: ${contribucion_por_lead:,.2f}')
print(f'LEADS NECESARIOS PARA BREAK-EVEN: {leads_breakeven:.0f} leads/mes')
print(f'Contratos resultantes: {leads_breakeven * c:.0f} contratos/mes')
print()

print('COMPARACIÓN:')
print(f'  Leads actuales: {L}')
print(f'  Leads necesarios: {leads_breakeven:.0f}')
print(f'  GAP: {leads_breakeven - L:.0f} leads adicionales necesarios')
print()

# Verificar con los datos reales del P&L
print('=' * 70)
print('VALIDACIÓN CON DATOS REALES:')
print('=' * 70)
print()
print('Del P&L real (promedio Ene-Oct 2025):')
print('  Revenue promedio mensual: $165,079')
print('  Contratos promedio: 6.3')
print('  Leads promedio: 35.1')
print()
print('Esto confirma que:')
print('  - Con ~35 leads, se cierran ~6 contratos')
print('  - Generan ~$165k en revenue')
print('  - Pero los gastos operativos son muy altos para este volumen')
