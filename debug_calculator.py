# Debug Sales Compensation Calculator
# Using the current state values from App.jsx

L = 35  # leads
c = 0.1795  # conversion rate
V = 26203  # average ticket
pL = 48  # cost per lead
r = 0.079  # commission rate
gm = 0.409  # gross margin
M = 1000  # owner compensation

# Operating expenses
advertising = 4439
autoCosts = 4079
generalAdmin = 14639
insurance = 1016
legalProfessional = 3027
payrollCosts = 25074
taxesPaid = 9715
travelCosts = 193
utilities = 509
totalOperatingExpenses = advertising + autoCosts + generalAdmin + insurance + legalProfessional + payrollCosts + taxesPaid + travelCosts + utilities

# Calculations from App.jsx
N = round(L * c)
I_total = N * V
C_variable = N * V * r
P_total = (pL / c) * N
I_neto = I_total * gm
CF = I_neto - C_variable - P_total - totalOperatingExpenses - M
ROI = (CF / (C_variable + P_total + totalOperatingExpenses + M)) * 100

costo_por_lead = pL + (C_variable / N) + (totalOperatingExpenses / N) + (M / N)
costo_por_contrato = costo_por_lead / c
margen_por_contrato = V * gm - costo_por_contrato

print('SALES COMPENSATION CALCULATOR - Expected Values')
print('=' * 60)
print(f'Contracts (N): {N}')
print(f'Total Revenue (I_total): ${I_total:,.2f}')
print(f'Variable Costs (C_variable): ${C_variable:,.2f}')
print(f'Lead Costs (P_total): ${P_total:,.2f}')
print(f'Operating Expenses: ${totalOperatingExpenses:,.2f}')
print(f'Net Revenue (I_neto): ${I_neto:,.2f}')
print()
print(f'Cash Flow (CF): ${CF:,.2f}')
print(f'ROI: {ROI:.2f}%')
print()
print(f'Cost per Lead: ${costo_por_lead:,.2f}')
print(f'Cost per Contract: ${costo_por_contrato:,.2f}')
print(f'Margin per Contract: ${margen_por_contrato:,.2f}')
print()
print('=' * 60)
print('ANALYSIS:')
if CF < 0:
    print(f'CASH FLOW IS NEGATIVE: ${CF:,.2f}')
    print(f'   Revenue after GM: ${I_neto:,.2f}')
    print(f'   Total Costs: ${C_variable + P_total + totalOperatingExpenses + M:,.2f}')
    print(f'   Deficit: ${abs(CF):,.2f}')
if ROI < 0:
    print(f'ROI IS NEGATIVE: {ROI:.2f}%')
if margen_por_contrato < 0:
    print(f'MARGIN PER CONTRACT IS NEGATIVE: ${margen_por_contrato:,.2f}')
