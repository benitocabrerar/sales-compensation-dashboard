# Break-even calculation
defaultV = 12000
defaultGm = 0.409
defaultPL = 48
defaultC = 0.15
defaultR = 0.079
defaultM = 1000
defaultOperatingExpenses = 4439 + 4079 + 14639 + 1016 + 3027 + 25074 + 9715 + 193 + 509

PVU = defaultV
CVU = defaultV * (1 - defaultGm) + (defaultPL / defaultC) + (defaultR * defaultV)
CFT = defaultOperatingExpenses + defaultM
QE = CFT / (PVU - CVU)
import math
minLeads = math.ceil(QE / defaultC)

print(f'PVU (Precio de Venta Unitario): ${PVU:,.2f}')
print(f'CVU (Costo Variable Unitario): ${CVU:,.2f}')
print(f'CFT (Costos Fijos Totales): ${CFT:,.2f}')
print(f'QE (Contratos para Equilibrio): {QE:.2f}')
print(f'Minimum Leads for Break-even: {minLeads}')
print(f'\nWith {minLeads} leads at {defaultC*100}% conversion:')
print(f'  Expected contracts: {minLeads * defaultC:.2f}')
print(f'  Expected revenue: ${minLeads * defaultC * PVU:,.2f}')
