import pandas as pd
import numpy as np
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Datos extraídos del PDF - G.A. Castro Construction LLC
# Período: Enero 1 - Octubre 31, 2025

# Crear diccionario con todos los datos financieros mensuales
data = {
    'Month': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],

    # INCOME - Desglosado por categorías
    'Revenue_GA_Castro': [122936.33, 157957.81, 95512.68, 79420.58, 215716.53, 141889.45,
                          68297.32, 279688.27, 131643.64, 304629.27],
    'Revenue_Labor_Service': [4400.00, 1.00, -17730.55, 0, 0, 0, 0, 0, 0, 0],
    'Revenue_Sales': [0, 3050.91, 82.11, 0, 223.25, 15.00, 76.95, 227.22, 20.00, 20.00],
    'Revenue_Services': [2075.00, 0, 200.00, 0, 0, 0, 59000.00, 0, 900.00, 0],
    'Uncategorized_Income': [0, 0, 0, 0, 0, 535.97, 0, 0, 0, 0],

    # COGS - Contract Labor (todos los tipos)
    'Casual_Labor': [2300.00, 1450.00, 3300.00, 1000.00, 0, 0, 0, 0, 0, 0],
    'Contract_Labor_Asbestos': [0, 20.00, 13385.00, 0, 4572.50, 4602.50, 0, 0, 0, 0],
    'Contract_Labor_Carpentry': [5100.00, 640.29, 1900.00, 0, 8652.00, 8575.00, 3796.00, 2000.00, 0, 0],
    'Contract_Labor_Handyman': [2933.00, 2540.00, 3485.00, 3513.50, 3158.50, 5059.50, 3419.20, 0, 6145.00, 0],
    'Contract_Labor_Masonry': [0, 0, 0, 1000.00, 0, 1800.00, 0, 0, 0, 0],
    'Contract_Labor_MISC': [12496.50, 6449.50, 1000.00, 3324.40, 6365.00, 710.00, 505.16, 0, 350.00, 0],
    'Contract_Labor_Painting': [1000.00, 0, 0, 0, 4400.00, 4790.00, 800.00, 6100.00, 7200.00, 0],
    'Contract_Labor_Roofing': [5710.00, 7415.00, 15107.85, 22285.50, 7689.85, 25318.10,
                               16429.15, 17678.90, 33736.99, 40522.50],
    'Contract_Labor_Siding': [4610.00, 0, 12230.00, 4640.00, 17360.00, 6020.00,
                             7000.00, 11590.00, 9530.00, 6460.00],

    # COGS - Supplies & Materials (todos los proveedores)
    'COGS_ABC_Supply': [0, 222.18, 67.71, 0, 0, 492.54, 0, -474.80, 0, 0],
    'COGS_Beacon_QXO': [495.10, 7938.65, 14925.67, 16395.78, 8894.43, 1211.48,
                        7013.38, 0, 12787.85, 7560.86],
    'COGS_Dump_Fees': [2170.09, 1266.10, 3909.06, 3056.67, 2122.18, 6431.30,
                       4483.04, 3788.73, 5688.57, 4550.74],
    'COGS_Home_Depot': [2163.00, 760.09, 2453.63, 3276.38, 5394.68, 2652.43,
                        4260.59, 2778.93, 1148.29, 368.29],
    'COGS_King_Floors': [0, 0, 0, 0, 1805.89, 0, 1006.34, 0, 0, 0],
    'COGS_Lansing_Building': [632.76, 0.01, 0.01, 0, 0, 0, 42.94, 0, 10192.74, 0],
    'COGS_Lowes': [0, 0, 0, 0, 0, 278.52, -16.99, 0, 0, 0],
    'COGS_MISC_Suppliers': [329.41, -657.39, 193.84, 0, 48.44, 46.77, 0, 5097.26, 3065.92, 0],
    'COGS_New_Castle': [0, 0, 3228.59, 145.36, 0, 204.19, 0, 263.75, 348.53, 128.68],
    'COGS_OG': [273.91, 0, 96.62, 0, 194.20, 10.58, 0, 0, 0, 0],
    'COGS_Permits_Fees': [1196.90, 340.84, 2187.00, 1510.00, 1818.66, 749.15,
                          1639.70, 1769.26, 0, 2777.89],
    'COGS_Rings_End': [547.70, 159.59, 0, 425.88, 0, 470.26, 154.14, 140.81, 0, 414.32],
    'COGS_Sherwin_Williams': [0, 0, 0, 0, 34.78, 0, 54.88, 0, 0, 0],
    'COGS_SRS_Distribution': [0, 33102.15, 13490.85, 8934.72, 29981.24, 30720.59,
                              38693.77, 28108.26, 25649.51, 29287.03],
    'COGS_Tools_Equipment': [0, 0, 0, 0, 0, 0, 0, 12.75, 0, 0],
    'Sales_Commissions': [8542.84, 21051.84, 13050.55, 14031.82, 7704.04, 14570.35,
                          15379.52, 12126.20, 9755.07, 13983.54],
    'Supplement_Fees': [0, 123.90, 417.20, 504.51, 0, 0, 610.00, 0, 1000.00, 0],

    # Operating Expenses - Advertising & Marketing
    'Advertising_Lead_Gen': [350.00, 920.96, 938.29, 2358.19, 2329.23, 2529.76,
                             2140.00, 4271.40, 3436.94, 7969.70],
    'Advertising_Media': [255.77, 26.77, 26.77, 26.77, 132.82, 26.77,
                         26.77, 401.61, 3229.49, 26.77],
    'Advertising_Print': [896.31, 1540.28, 0, 1348.45, 1502.00, 0, 118.77, 0, 0, 142.41],
    'Advertising_Sponsor': [750.00, 1100.00, 1450.00, 1843.50, 127.83, 800.00, 0, 950.00, 0, 395.00],

    # Operating Expenses - Auto
    'Auto_Gasoline': [1628.53, 993.22, 1687.30, 1771.79, 1950.24, 1983.95,
                     2159.92, 1778.20, 1754.72, 129.11],
    'Auto_Insurance': [1866.01, 1018.01, 840.00, 1211.00, 1208.00, 1208.00,
                      1208.00, 1208.00, 2273.00, 1697.00],
    'Auto_Parking_Tolls': [3.00, 14.00, 147.75, 120.62, 73.81, 149.00, 59.00, 59.00, 199.93, 0],
    'Auto_Repairs_Maint': [396.20, 195.13, 385.62, 207.39, 1587.61, 2121.67,
                          1471.81, 3046.57, 58.45, 252.04],
    'Auto_Taxes_Reg': [0, 0, 0, 172.40, 0, 0, 0, 0, 550.00, 0],

    # Operating Expenses - G&A
    'GA_Bank_Charges': [25.00, 4.50, 0, 0, 0, 0, 8.48, 20.00, 10.00, 1.95],
    'GA_Contract_Labor_Admin': [7126.35, 7925.20, 7782.16, 3491.04, 3819.94, 5849.80,
                                3983.10, 4500.00, 4924.00, 4947.77],
    'GA_Customer_Gifts': [0, 0, 0, 0, 0, 0, 0, 0, 0, 240.21],
    'GA_Dues_Subscriptions': [3.02, 3.02, 3.02, 0, 0, 112.38, 3.02, 0, 0, 0],
    'GA_Interest_Paid': [517.11, 476.52, 802.72, 423.79, 708.98, 669.68,
                         6032.58, 473.98, 1323.64, 1292.50],
    'GA_Meals_Staff': [306.00, 121.29, 268.61, 1556.16, 50.36, 348.66,
                       41.32, 0, 235.68, 1905.65],
    'GA_Memberships_Subs': [1014.99, 14.99, 14.99, 14.99, 14.99, 14.99,
                           14.99, 14.99, 14.99, 0],
    'GA_Office_Supplies': [261.44, 6152.71, 1035.52, 1106.26, 1432.81, 73.94,
                          576.23, 2028.53, 145.67, 2147.12],
    'GA_Printing_Photo': [0, 1490.00, 0, 0, 150.02, 0, 1570.97, 1400.00, 0, 0],
    'GA_QuickBooks_Fees': [0, 151.55, 90.01, 158.38, 285.73, 3409.69,
                          951.42, 684.32, 144.08, 312.63],
    'GA_Rent_Expenses': [4000.00, 6892.95, 4295.69, 2000.00, 3994.63, 4004.62,
                        4004.62, 1994.63, 2313.68, 1994.63],
    'GA_Repairs_Maint': [0, 0, 0, 0, 79.76, 0, 200.00, 200.00, 0, 0],
    'GA_Shipping_Postage': [0, 32.00, 0, 73.00, 0, 0, 146.00, 0, 0, 0],
    'GA_Small_Tools': [0, 0, 155.85, 0, 0, 0, 0, 0, 0, 0],
    'GA_Software_Apps': [448.79, 410.92, 520.29, 2335.90, 539.13, 410.91,
                        1301.08, 1106.75, 633.50, 887.18],
    'GA_Uniforms': [436.03, 0, 212.70, 0, 376.47, 0, 567.91, 0, 0, 282.89],

    # Operating Expenses - Insurance
    'Insurance_Business': [915.00, 3829.00, 526.69, 3101.46, 985.66, 454.66,
                          454.66, -1901.04, 195.00, 195.00],
    'Insurance_Hazard': [0, 0, 0, 0, 0, 0, 2401.44, 0, 0, 0],

    # Operating Expenses - Legal & Professional
    'Professional_Accounting': [1190.00, 710.00, 0, 600.00, 1900.00, 0,
                               2400.00, 0, 1150.00, 650.00],
    'Professional_Audit': [0, 0, 0, 0, 7650.00, 0, 0, 0, 0, 0],
    'Professional_Consulting': [0, 0, 0, 2975.00, 0, 0, 2975.00, 1000.00, 1793.00, 1853.22],
    'Professional_Legal': [1275.00, 0, 375.00, 0, 375.00, 862.77, 0, 0, 537.50, 0],

    # Operating Expenses - Payroll
    'Payroll_Bonus': [0, 2000.00, 0, 1000.00, 0, 0, 0, 0, 0, 0],
    'Payroll_Group_Life_Ins': [0, 0, 0, 0, 0, -1062.00, 0, 0, 0, 0],
    'Payroll_Salaries_Wages': [7090.46, 7648.46, 9742.74, 11648.26, 10585.92, 10892.55,
                               9699.20, 8669.05, 8700.60, 10349.92],
    'Payroll_Commissions_Fees': [0, 0, 0, 0, 3000.00, 0, 0, 0, 0, 0],
    'Payroll_Partners': [11861.30, 11852.60, 21743.48, 31634.34, 31634.32, 21000.00,
                        16750.00, 4300.00, 0, 0],

    # Operating Expenses - Taxes
    'Business_Licenses': [301.97, 0, 300.00, 0, 0, 500.00, 0, 0, 0, 0],
    'Payroll_Taxes': [8806.97, 5972.33, 11251.15, 16213.38, 17275.75, 17066.76,
                     9483.44, 4963.40, 2144.20, 3554.90],

    # Operating Expenses - Travel
    'Travel_Airfare': [0, 0, 0, 1320.98, 0, 0, 0, 0, 0, 0],
    'Travel_Hotels': [0, 0, 0, 258.82, 0, 0, 0, 0, 0, 0],
    'Travel_Vehicle_Rental': [0, 0, 0, 351.54, 0, 0, 0, 0, 0, 0],

    # Operating Expenses - Utilities
    'Utilities_Disposal': [2.55, 0, 0, 0, 0, 190.07, 0, 0, 0, 0],
    'Utilities_Internet_TV': [174.12, 215.44, 212.31, 0, 85.00, 160.97,
                             80.00, 95.67, 80.00, 80.00],
    'Utilities_Phone': [457.45, 342.50, 389.34, 440.64, 215.81, 483.02,
                       215.61, 482.32, 275.98, 413.69],

    # Other Income/Expenses
    'Other_Income': [0, 0, 0, 0, 0, 0, 0, 2000.00, 0, 0],
    'Other_Expenses': [0, 0, 518.48, 0, -483.00, 0, -18.96, 0, 0, 0],
    'Loss_Disposal_Asset': [0, 0, 0, 0, 0, 0, 23107.75, 0, 0, 0]
}

# Crear DataFrame
df = pd.DataFrame(data)

# Calcular métricas totales
df['Total_Income'] = (df['Revenue_GA_Castro'] + df['Revenue_Labor_Service'] +
                      df['Revenue_Sales'] + df['Revenue_Services'] + df['Uncategorized_Income'])

df['Total_Contract_Labor'] = (df['Casual_Labor'] + df['Contract_Labor_Asbestos'] +
                              df['Contract_Labor_Carpentry'] + df['Contract_Labor_Handyman'] +
                              df['Contract_Labor_Masonry'] + df['Contract_Labor_MISC'] +
                              df['Contract_Labor_Painting'] + df['Contract_Labor_Roofing'] +
                              df['Contract_Labor_Siding'])

df['Total_Supplies_Materials'] = (df['COGS_ABC_Supply'] + df['COGS_Beacon_QXO'] +
                                  df['COGS_Dump_Fees'] + df['COGS_Home_Depot'] +
                                  df['COGS_King_Floors'] + df['COGS_Lansing_Building'] +
                                  df['COGS_Lowes'] + df['COGS_MISC_Suppliers'] +
                                  df['COGS_New_Castle'] + df['COGS_OG'] +
                                  df['COGS_Permits_Fees'] + df['COGS_Rings_End'] +
                                  df['COGS_Sherwin_Williams'] + df['COGS_SRS_Distribution'] +
                                  df['COGS_Tools_Equipment'] + df['Sales_Commissions'] +
                                  df['Supplement_Fees'])

df['Total_COGS'] = df['Total_Contract_Labor'] + df['Total_Supplies_Materials']
df['Gross_Profit'] = df['Total_Income'] - df['Total_COGS']

df['Total_Advertising'] = (df['Advertising_Lead_Gen'] + df['Advertising_Media'] +
                          df['Advertising_Print'] + df['Advertising_Sponsor'])

df['Total_Auto'] = (df['Auto_Gasoline'] + df['Auto_Insurance'] +
                   df['Auto_Parking_Tolls'] + df['Auto_Repairs_Maint'] +
                   df['Auto_Taxes_Reg'])

df['Total_GA'] = (df['GA_Bank_Charges'] + df['GA_Contract_Labor_Admin'] +
                 df['GA_Customer_Gifts'] + df['GA_Dues_Subscriptions'] +
                 df['GA_Interest_Paid'] + df['GA_Meals_Staff'] +
                 df['GA_Memberships_Subs'] + df['GA_Office_Supplies'] +
                 df['GA_Printing_Photo'] + df['GA_QuickBooks_Fees'] +
                 df['GA_Rent_Expenses'] + df['GA_Repairs_Maint'] +
                 df['GA_Shipping_Postage'] + df['GA_Small_Tools'] +
                 df['GA_Software_Apps'] + df['GA_Uniforms'])

df['Total_Insurance'] = df['Insurance_Business'] + df['Insurance_Hazard']

df['Total_Legal_Professional'] = (df['Professional_Accounting'] + df['Professional_Audit'] +
                                  df['Professional_Consulting'] + df['Professional_Legal'])

df['Total_Payroll'] = (df['Payroll_Bonus'] + df['Payroll_Group_Life_Ins'] +
                       df['Payroll_Salaries_Wages'] + df['Payroll_Commissions_Fees'] +
                       df['Payroll_Partners'])

df['Total_Taxes'] = df['Business_Licenses'] + df['Payroll_Taxes']

df['Total_Travel'] = df['Travel_Airfare'] + df['Travel_Hotels'] + df['Travel_Vehicle_Rental']

df['Total_Utilities'] = df['Utilities_Disposal'] + df['Utilities_Internet_TV'] + df['Utilities_Phone']

df['Total_Operating_Expenses'] = (df['Total_Advertising'] + df['Total_Auto'] +
                                  df['Total_GA'] + df['Total_Insurance'] +
                                  df['Total_Legal_Professional'] + df['Total_Payroll'] +
                                  df['Total_Taxes'] + df['Total_Travel'] +
                                  df['Total_Utilities'] + 500.00)  # Contributions to charities

df['Operating_Income'] = df['Gross_Profit'] - df['Total_Operating_Expenses']
# Valores exactos del Net Income del PDF
net_income_actual = [26394.75, 11374.81, -94037.13, -91062.53, 15194.59, -46031.82,
                     -68921.98, 147862.62, -23714.70, 149088.45]
df['Net_Income'] = net_income_actual

print("="*100)
print("ANÁLISIS ESTADÍSTICO ULTRA-PROFUNDO - G.A. CASTRO CONSTRUCTION LLC")
print("Período: Enero 1 - Octubre 31, 2025")
print("="*100)

# 1. PROMEDIOS MENSUALES DE TODOS LOS COMPONENTES FINANCIEROS
print("\n" + "="*80)
print("1. PROMEDIOS MENSUALES DE TODOS LOS COMPONENTES (Enero-Octubre 2025)")
print("="*80)

print("\n--- INCOME (PROMEDIO MENSUAL) ---")
print(f"Revenue GA Castro Construction: ${df['Revenue_GA_Castro'].mean():,.2f}")
print(f"Revenue Labor Service: ${df['Revenue_Labor_Service'].mean():,.2f}")
print(f"Revenue Sales: ${df['Revenue_Sales'].mean():,.2f}")
print(f"Revenue Services: ${df['Revenue_Services'].mean():,.2f}")
print(f"TOTAL INCOME PROMEDIO: ${df['Total_Income'].mean():,.2f}")

print("\n--- COGS - CONTRACT LABOR (PROMEDIO MENSUAL) ---")
print(f"Casual Labor: ${df['Casual_Labor'].mean():,.2f}")
print(f"Contract Labor - Asbestos: ${df['Contract_Labor_Asbestos'].mean():,.2f}")
print(f"Contract Labor - Carpentry: ${df['Contract_Labor_Carpentry'].mean():,.2f}")
print(f"Contract Labor - Handyman: ${df['Contract_Labor_Handyman'].mean():,.2f}")
print(f"Contract Labor - Masonry: ${df['Contract_Labor_Masonry'].mean():,.2f}")
print(f"Contract Labor - MISC: ${df['Contract_Labor_MISC'].mean():,.2f}")
print(f"Contract Labor - Painting: ${df['Contract_Labor_Painting'].mean():,.2f}")
print(f"Contract Labor - Roofing: ${df['Contract_Labor_Roofing'].mean():,.2f}")
print(f"Contract Labor - Siding: ${df['Contract_Labor_Siding'].mean():,.2f}")
print(f"TOTAL CONTRACT LABOR PROMEDIO: ${df['Total_Contract_Labor'].mean():,.2f}")

print("\n--- COGS - SUPPLIES & MATERIALS (PROMEDIO MENSUAL) ---")
print(f"ABC Supply: ${df['COGS_ABC_Supply'].mean():,.2f}")
print(f"Beacon/QXO: ${df['COGS_Beacon_QXO'].mean():,.2f}")
print(f"Dump Fees: ${df['COGS_Dump_Fees'].mean():,.2f}")
print(f"Home Depot: ${df['COGS_Home_Depot'].mean():,.2f}")
print(f"King Floors Supplies: ${df['COGS_King_Floors'].mean():,.2f}")
print(f"Lansing Building: ${df['COGS_Lansing_Building'].mean():,.2f}")
print(f"Lowe's: ${df['COGS_Lowes'].mean():,.2f}")
print(f"MISC Suppliers: ${df['COGS_MISC_Suppliers'].mean():,.2f}")
print(f"New Castle Building: ${df['COGS_New_Castle'].mean():,.2f}")
print(f"O&G: ${df['COGS_OG'].mean():,.2f}")
print(f"Permits and Fees: ${df['COGS_Permits_Fees'].mean():,.2f}")
print(f"Ring's End: ${df['COGS_Rings_End'].mean():,.2f}")
print(f"Sherwin Williams: ${df['COGS_Sherwin_Williams'].mean():,.2f}")
print(f"SRS Distribution: ${df['COGS_SRS_Distribution'].mean():,.2f}")
print(f"Tools & Equipment: ${df['COGS_Tools_Equipment'].mean():,.2f}")
print(f"Sales Commissions: ${df['Sales_Commissions'].mean():,.2f}")
print(f"Supplement Fees: ${df['Supplement_Fees'].mean():,.2f}")
print(f"TOTAL SUPPLIES & MATERIALS PROMEDIO: ${df['Total_Supplies_Materials'].mean():,.2f}")

print("\n--- OPERATING EXPENSES (PROMEDIO MENSUAL) ---")
print(f"Advertising & Marketing Total: ${df['Total_Advertising'].mean():,.2f}")
print(f"  - Lead Generation: ${df['Advertising_Lead_Gen'].mean():,.2f}")
print(f"  - Media: ${df['Advertising_Media'].mean():,.2f}")
print(f"  - Print & Branding: ${df['Advertising_Print'].mean():,.2f}")
print(f"  - Sponsor Events: ${df['Advertising_Sponsor'].mean():,.2f}")

print(f"\nAuto Total: ${df['Total_Auto'].mean():,.2f}")
print(f"  - Gasoline: ${df['Auto_Gasoline'].mean():,.2f}")
print(f"  - Insurance: ${df['Auto_Insurance'].mean():,.2f}")
print(f"  - Parking & Tolls: ${df['Auto_Parking_Tolls'].mean():,.2f}")
print(f"  - Repairs & Maintenance: ${df['Auto_Repairs_Maint'].mean():,.2f}")

print(f"\nGeneral & Administrative Total: ${df['Total_GA'].mean():,.2f}")
print(f"  - Contract Labor (Admin): ${df['GA_Contract_Labor_Admin'].mean():,.2f}")
print(f"  - Office Supplies: ${df['GA_Office_Supplies'].mean():,.2f}")
print(f"  - Rent Expenses: ${df['GA_Rent_Expenses'].mean():,.2f}")
print(f"  - Software & Apps: ${df['GA_Software_Apps'].mean():,.2f}")
print(f"  - QuickBooks Fees: ${df['GA_QuickBooks_Fees'].mean():,.2f}")

print(f"\nInsurance Total: ${df['Total_Insurance'].mean():,.2f}")
print(f"  - Business Insurance: ${df['Insurance_Business'].mean():,.2f}")
print(f"  - Hazard Insurance: ${df['Insurance_Hazard'].mean():,.2f}")

print(f"\nLegal & Professional Services Total: ${df['Total_Legal_Professional'].mean():,.2f}")
print(f"  - Accounting: ${df['Professional_Accounting'].mean():,.2f}")
print(f"  - Audit: ${df['Professional_Audit'].mean():,.2f}")
print(f"  - Consulting: ${df['Professional_Consulting'].mean():,.2f}")
print(f"  - Legal: ${df['Professional_Legal'].mean():,.2f}")

print(f"\nPayroll Total: ${df['Total_Payroll'].mean():,.2f}")
print(f"  - Salaries & Wages: ${df['Payroll_Salaries_Wages'].mean():,.2f}")
print(f"  - Payments to Partners: ${df['Payroll_Partners'].mean():,.2f}")

print(f"\nTaxes Total: ${df['Total_Taxes'].mean():,.2f}")
print(f"  - Payroll Taxes: ${df['Payroll_Taxes'].mean():,.2f}")
print(f"  - Business Licenses: ${df['Business_Licenses'].mean():,.2f}")

print(f"\nTravel Total: ${df['Total_Travel'].mean():,.2f}")

print(f"\nUtilities Total: ${df['Total_Utilities'].mean():,.2f}")
print(f"  - Phone Service: ${df['Utilities_Phone'].mean():,.2f}")
print(f"  - Internet & TV: ${df['Utilities_Internet_TV'].mean():,.2f}")

# 2. ANÁLISIS DE VOLATILIDAD
print("\n" + "="*80)
print("2. ANÁLISIS DE VOLATILIDAD")
print("="*80)

print(f"\nIngresos Mensuales:")
print(f"  - Promedio: ${df['Total_Income'].mean():,.2f}")
print(f"  - Desviación Estándar: ${df['Total_Income'].std():,.2f}")
print(f"  - Coeficiente de Variación: {(df['Total_Income'].std()/df['Total_Income'].mean()*100):.2f}%")
print(f"  - Mínimo: ${df['Total_Income'].min():,.2f} ({df['Month'].iloc[df['Total_Income'].idxmin()]})")
print(f"  - Máximo: ${df['Total_Income'].max():,.2f} ({df['Month'].iloc[df['Total_Income'].idxmax()]})")

print(f"\nMeses con PÉRDIDAS:")
losses = df[df['Net_Income'] < 0]
for _, row in losses.iterrows():
    print(f"  - {row['Month']}: ${row['Net_Income']:,.2f}")

print(f"\nMeses con GANANCIAS:")
profits = df[df['Net_Income'] >= 0]
for _, row in profits.iterrows():
    print(f"  - {row['Month']}: ${row['Net_Income']:,.2f}")

# 3. RATIOS CLAVE
print("\n" + "="*80)
print("3. RATIOS CLAVE (PROMEDIOS)")
print("="*80)

gross_margin = (df['Gross_Profit'].mean() / df['Total_Income'].mean()) * 100
operating_margin = (df['Operating_Income'].mean() / df['Total_Income'].mean()) * 100
net_margin = (df['Net_Income'].mean() / df['Total_Income'].mean()) * 100
cogs_ratio = (df['Total_COGS'].mean() / df['Total_Income'].mean()) * 100

print(f"\nGross Margin Promedio: {gross_margin:.2f}%")
print(f"Operating Margin Promedio: {operating_margin:.2f}%")
print(f"Net Margin Promedio: {net_margin:.2f}%")
print(f"COGS como % de Revenue: {cogs_ratio:.2f}%")

print("\nCategorías de Gasto como % de Revenue:")
print(f"  - Contract Labor: {(df['Total_Contract_Labor'].mean()/df['Total_Income'].mean()*100):.2f}%")
print(f"  - Supplies & Materials: {(df['Total_Supplies_Materials'].mean()/df['Total_Income'].mean()*100):.2f}%")
print(f"  - Advertising & Marketing: {(df['Total_Advertising'].mean()/df['Total_Income'].mean()*100):.2f}%")
print(f"  - Auto: {(df['Total_Auto'].mean()/df['Total_Income'].mean()*100):.2f}%")
print(f"  - General & Administrative: {(df['Total_GA'].mean()/df['Total_Income'].mean()*100):.2f}%")
print(f"  - Insurance: {(df['Total_Insurance'].mean()/df['Total_Income'].mean()*100):.2f}%")
print(f"  - Legal & Professional: {(df['Total_Legal_Professional'].mean()/df['Total_Income'].mean()*100):.2f}%")
print(f"  - Payroll: {(df['Total_Payroll'].mean()/df['Total_Income'].mean()*100):.2f}%")
print(f"  - Taxes: {(df['Total_Taxes'].mean()/df['Total_Income'].mean()*100):.2f}%")
print(f"  - Utilities: {(df['Total_Utilities'].mean()/df['Total_Income'].mean()*100):.2f}%")

# 4. TENDENCIAS Y PATRONES
print("\n" + "="*80)
print("4. TENDENCIAS Y PATRONES")
print("="*80)

print("\nMeses más RENTABLES (por Net Income):")
df_sorted = df.sort_values('Net_Income', ascending=False)
for i in range(3):
    print(f"  {i+1}. {df_sorted.iloc[i]['Month']}: ${df_sorted.iloc[i]['Net_Income']:,.2f}")

print("\nMeses menos RENTABLES (por Net Income):")
for i in range(3):
    print(f"  {i+1}. {df_sorted.iloc[-(i+1)]['Month']}: ${df_sorted.iloc[-(i+1)]['Net_Income']:,.2f}")

print("\nEstacionalidad en Ingresos:")
q1_avg = df.iloc[0:3]['Total_Income'].mean()
q2_avg = df.iloc[3:6]['Total_Income'].mean()
q3_avg = df.iloc[6:9]['Total_Income'].mean()
q4_oct = df.iloc[9]['Total_Income']

print(f"  - Q1 (Ene-Mar) Promedio: ${q1_avg:,.2f}")
print(f"  - Q2 (Abr-Jun) Promedio: ${q2_avg:,.2f}")
print(f"  - Q3 (Jul-Sep) Promedio: ${q3_avg:,.2f}")
print(f"  - Octubre: ${q4_oct:,.2f}")

# 5. TOP 10 GASTOS MÁS GRANDES
print("\n" + "="*80)
print("5. TOP 10 GASTOS MÁS GRANDES (TOTALES DEL PERÍODO)")
print("="*80)

expenses_totals = {
    'Contract Labor - Roofing': df['Contract_Labor_Roofing'].sum(),
    'SRS Distribution': df['COGS_SRS_Distribution'].sum(),
    'Payroll - Partners': df['Payroll_Partners'].sum(),
    'Sales Commissions': df['Sales_Commissions'].sum(),
    'Payroll Taxes': df['Payroll_Taxes'].sum(),
    'Payroll - Salaries': df['Payroll_Salaries_Wages'].sum(),
    'Contract Labor - Siding': df['Contract_Labor_Siding'].sum(),
    'Beacon/QXO': df['COGS_Beacon_QXO'].sum(),
    'G&A - Contract Labor Admin': df['GA_Contract_Labor_Admin'].sum(),
    'Dump Fees': df['COGS_Dump_Fees'].sum(),
    'G&A - Rent': df['GA_Rent_Expenses'].sum(),
    'Contract Labor - Carpentry': df['Contract_Labor_Carpentry'].sum(),
    'Contract Labor - Handyman': df['Contract_Labor_Handyman'].sum(),
    'Contract Labor - MISC': df['Contract_Labor_MISC'].sum(),
    'Legal & Professional': df['Total_Legal_Professional'].sum(),
    'Home Depot': df['COGS_Home_Depot'].sum(),
    'Contract Labor - Painting': df['Contract_Labor_Painting'].sum(),
    'Contract Labor - Asbestos': df['Contract_Labor_Asbestos'].sum(),
    'Auto - Gasoline': df['Auto_Gasoline'].sum(),
    'G&A - Office Supplies': df['GA_Office_Supplies'].sum(),
    'Auto - Insurance': df['Auto_Insurance'].sum(),
    'Permits and Fees': df['COGS_Permits_Fees'].sum(),
    'G&A - Interest Paid': df['GA_Interest_Paid'].sum(),
    'Advertising - Lead Gen': df['Advertising_Lead_Gen'].sum(),
    'Lansing Building': df['COGS_Lansing_Building'].sum()
}

sorted_expenses = sorted(expenses_totals.items(), key=lambda x: x[1], reverse=True)

for i, (expense, total) in enumerate(sorted_expenses[:10], 1):
    print(f"  {i}. {expense}: ${total:,.2f} ({(total/df['Total_Income'].sum()*100):.2f}% de Revenue)")

# Identificar fugas de dinero
print("\n" + "="*80)
print("MAYORES FUGAS DE DINERO (ÁREAS DE OPORTUNIDAD)")
print("="*80)

print("\n1. COGS Elevado:")
print(f"   - COGS Total: ${df['Total_COGS'].sum():,.2f} ({cogs_ratio:.1f}% de Revenue)")
print(f"   - Contract Labor: ${df['Total_Contract_Labor'].sum():,.2f}")
print(f"   - Supplies & Materials: ${df['Total_Supplies_Materials'].sum():,.2f}")

print("\n2. Gastos Administrativos Altos:")
print(f"   - G&A Total: ${df['Total_GA'].sum():,.2f}")
print(f"   - Contract Labor Admin: ${df['GA_Contract_Labor_Admin'].sum():,.2f}")

print("\n3. Payroll Significativo:")
print(f"   - Payroll Total: ${df['Total_Payroll'].sum():,.2f}")
print(f"   - Partners Payments: ${df['Payroll_Partners'].sum():,.2f}")

print("\n4. Pérdidas por Disposal de Activos:")
print(f"   - Loss on Disposal: ${df['Loss_Disposal_Asset'].sum():,.2f}")

# Resumen ejecutivo
print("\n" + "="*80)
print("RESUMEN EJECUTIVO")
print("="*80)

total_revenue = df['Total_Income'].sum()
total_cogs = df['Total_COGS'].sum()
total_expenses = df['Total_Operating_Expenses'].sum()
total_net = df['Net_Income'].sum()

print(f"\nTOTAL REVENUE (Ene-Oct): ${total_revenue:,.2f}")
print(f"TOTAL COGS: ${total_cogs:,.2f}")
print(f"TOTAL OPERATING EXPENSES: ${total_expenses:,.2f}")
print(f"NET INCOME: ${total_net:,.2f}")
print(f"NET MARGIN: {(total_net/total_revenue*100):.2f}%")

print("\nALERTAS CRITICAS:")
print("1. Alta volatilidad en ingresos (CV: {:.1f}%)".format(df['Total_Income'].std()/df['Total_Income'].mean()*100))
print("2. COGS representa {:.1f}% de Revenue (muy alto)".format(cogs_ratio))
print("3. 4 meses con perdidas netas significativas")
print("4. Perdida por disposal de activos: ${:,.2f}".format(df['Loss_Disposal_Asset'].sum()))

# Guardar datos a CSV para análisis adicional
df.to_csv('C:\\Users\\benito\\poweria\\ventas\\castro_pl_analysis.csv', index=False)
print("\nAnalisis completo guardado en castro_pl_analysis.csv")