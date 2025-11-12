# Cálculo del factor de conversión real de G.A. Castro Construction
# Basado en datos reales de Enero-Octubre 2025

# Datos disponibles del P&L
revenue_promedio_mensual = 165078.87
ticket_promedio = 12000  # Estimado basado en industria de construcción

# Calcular número de contratos cerrados por mes
contratos_cerrados_por_mes = revenue_promedio_mensual / ticket_promedio

print("=" * 60)
print("ANÁLISIS DE CONVERSIÓN - G.A. CASTRO CONSTRUCTION LLC")
print("Período: Enero - Octubre 2025")
print("=" * 60)
print()
print(f"Revenue Promedio Mensual: ${revenue_promedio_mensual:,.2f}")
print(f"Ticket Promedio Estimado: ${ticket_promedio:,.2f}")
print(f"Contratos Cerrados por Mes: {contratos_cerrados_por_mes:.2f}")
print()

# Escenarios de leads según gasto en advertising
advertising_mensual = 4438.93
costo_por_lead = 48  # Estimado

leads_generados = advertising_mensual / costo_por_lead

print(f"Gasto en Advertising Mensual: ${advertising_mensual:,.2f}")
print(f"Costo por Lead Estimado: ${costo_por_lead:.2f}")
print(f"Leads Generados (estimado): {leads_generados:.0f}")
print()

# Calcular factor de conversión
if leads_generados > 0:
    conversion_rate = (contratos_cerrados_por_mes / leads_generados) * 100
    print(f"FACTOR DE CONVERSIÓN ESTIMADO: {conversion_rate:.2f}%")
    print()
    print("⚠️ NOTA: Este es un cálculo estimado basado en:")
    print("   - Revenue promedio mensual del P&L")
    print("   - Ticket promedio estimado de $12,000")
    print("   - Gasto en advertising del P&L")
    print("   - Costo por lead estimado de $48")
    print()
    print("Para un cálculo preciso, se necesitan datos reales de:")
    print("   1. Número exacto de leads generados por mes")
    print("   2. Número exacto de contratos cerrados por mes")
    print("   3. Ticket promedio real de cada contrato")
else:
    print("No se puede calcular el factor de conversión sin datos de leads")

print()
print("=" * 60)
print("ANÁLISIS ADICIONAL")
print("=" * 60)
print()

# Calcular diferentes escenarios de conversión
print("Si el ticket promedio fuera diferente:")
print()
for ticket in [8000, 10000, 12000, 15000, 20000]:
    contratos = revenue_promedio_mensual / ticket
    if leads_generados > 0:
        conv = (contratos / leads_generados) * 100
        print(f"Ticket ${ticket:,}: {contratos:.1f} contratos/mes = {conv:.2f}% conversión")
