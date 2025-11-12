"""
Analisis de Factor de Conversion Real - G.A. Castro Construction
Basado en datos reales de JobNimbus Stamford (Enero-Octubre 2025)
"""

# Datos obtenidos de JobNimbus
total_jobs_created = 351  # Total de trabajos creados de enero a octubre 2025

# Trabajos "Paid & Closed" (contratos cerrados y pagados)
paid_closed_jobs = 63

# Solo 2 trabajos en estado "Lead" actualmente
# Esto significa que la mayoria de los leads ya fueron procesados

print("=" * 70)
print("ANALISIS DE CONVERSION REAL - G.A. CASTRO CONSTRUCTION LLC")
print("Datos de JobNimbus Stamford - Enero a Octubre 2025")
print("=" * 70)
print()

print("DATOS GENERALES:")
print(f"  * Total de Jobs Creados (Leads): {total_jobs_created}")
print(f"  * Jobs Paid & Closed (Contratos Ganados): {paid_closed_jobs}")
print(f"  * Periodo: 10 meses (Enero - Octubre 2025)")
print()

# Calcular factor de conversion real
conversion_rate = (paid_closed_jobs / total_jobs_created) * 100

print("FACTOR DE CONVERSION REAL:")
print(f"  * Conversion = {paid_closed_jobs} / {total_jobs_created} = {conversion_rate:.2f}%")
print()

# Promedios mensuales
avg_leads_per_month = total_jobs_created / 10
avg_closed_per_month = paid_closed_jobs / 10

print("PROMEDIOS MENSUALES:")
print(f"  * Leads Promedio por Mes: {avg_leads_per_month:.1f}")
print(f"  * Contratos Cerrados por Mes: {avg_closed_per_month:.1f}")
print()

# Comparacion con dashboard actual
current_dashboard_conversion = 0.15

print("COMPARACION CON DASHBOARD ACTUAL:")
print(f"  * Dashboard Actual: {current_dashboard_conversion*100:.0f}%")
print(f"  * Conversion Real: {conversion_rate:.2f}%")
print(f"  * Diferencia: {abs(conversion_rate - current_dashboard_conversion*100):.2f} puntos porcentuales")
print()

if conversion_rate > current_dashboard_conversion * 100:
    print("  >>> La conversion real es MAYOR que la del dashboard")
    print(f"      El dashboard esta siendo CONSERVADOR en {conversion_rate - current_dashboard_conversion*100:.2f}%")
else:
    print("  >>> La conversion real es MENOR que la del dashboard")
    print(f"      El dashboard esta siendo OPTIMISTA en {current_dashboard_conversion*100 - conversion_rate:.2f}%")
print()

# Analisis adicional con datos del P&L
print("=" * 70)
print("VALIDACION CON DATOS FINANCIEROS")
print("=" * 70)
print()

revenue_promedio_mensual = 165078.87
ticket_promedio_calculado = revenue_promedio_mensual / avg_closed_per_month

print(f"Del P&L Statement:")
print(f"  * Revenue Promedio Mensual: ${revenue_promedio_mensual:,.2f}")
print(f"  * Contratos Cerrados Reales: {avg_closed_per_month:.1f} por mes")
print(f"  * Ticket Promedio REAL Calculado: ${ticket_promedio_calculado:,.2f}")
print()

# Desglose de estados de jobs
print("=" * 70)
print("DESGLOSE DE ESTADOS DE JOBS")
print("=" * 70)
print()
print("Estados encontrados:")
print(f"  * Paid & Closed: {paid_closed_jobs} ({(paid_closed_jobs/total_jobs_created)*100:.1f}% del total)")
print("  * Lead: 2 (0.6%)")
print("  * Lost: ~25-30% (estimado)")
print("  * En Proceso/Pendiente: resto")
print()

print("=" * 70)
print("CONCLUSIONES:")
print("=" * 70)
print()
print(f"1. El factor de conversion REAL es: {conversion_rate:.2f}%")
print(f"2. De cada 100 leads, aproximadamente {conversion_rate:.0f} se convierten en contratos pagados")
print(f"3. El promedio mensual es de {avg_leads_per_month:.0f} leads generando {avg_closed_per_month:.1f} contratos")
print(f"4. El ticket promedio REAL es aproximadamente ${ticket_promedio_calculado:,.2f}")
print(f"   (NO $12,000 como se estimo inicialmente)")
print()
print("RECOMENDACION PARA EL DASHBOARD:")
print(f"  * Actualizar el factor de conversion de 15% a {conversion_rate:.1f}%")
print(f"  * Actualizar el ticket promedio de $12,000 a ${ticket_promedio_calculado:,.0f}")
print(f"  * Recalcular el numero de leads minimo con estos valores reales")
print()
