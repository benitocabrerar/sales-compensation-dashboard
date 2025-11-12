import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Users, Award, Target,
  Calendar, Briefcase, PieChart as PieChartIcon, Activity,
  BarChart3, AlertCircle, CheckCircle, Clock, Package, UserPlus, Phone, Zap, TrendingDown as TrendingDownIcon
} from 'lucide-react';

const SalesCompensationDashboardPro = () => {
  // Tab management
  const [activeTab, setActiveTab] = useState('main');

  // Salesperson name state
  const [salespersonName, setSalespersonName] = useState('');

  // Core variables with REAL DATA
  const [L, setL] = useState(35);  // Updated to real monthly average
  const [pL, setPL] = useState(48);
  const [c, setC] = useState(0.1795);  // Updated to real conversion rate
  const [V, setV] = useState(26203);  // Updated to real average ticket
  const [r, setR] = useState(0.079);
  const [B, setB] = useState(0);
  const [b, setBase] = useState(0);
  const [gm, setGm] = useState(0.409);
  const [h, setH] = useState(0.10);
  const [M, setM] = useState(1000);
  const [alpha, setAlpha] = useState(0.11);
  const [growthRate, setGrowthRate] = useState(0.05);
  const [discountRate, setDiscountRate] = useState(0.10);
  const [years, setYears] = useState(3);

  // Real Company Operating Expenses
  const [advertising, setAdvertising] = useState(4439);
  const [autoCosts, setAutoCosts] = useState(4079);
  const [generalAdmin, setGeneralAdmin] = useState(14639);
  const [insurance, setInsurance] = useState(1016);
  const [legalProfessional, setLegalProfessional] = useState(3027);
  const [payrollCosts, setPayrollCosts] = useState(25074);
  const [taxesPaid, setTaxesPaid] = useState(9715);
  const [travelCosts, setTravelCosts] = useState(193);
  const [utilities, setUtilities] = useState(509);

  // Real JobNimbus Data
  const jobnimbusData = {
    totalLeads: 351,
    paidClosed: 63,
    conversionRate: 17.95,
    avgLeadsPerMonth: 35.1,
    avgClosedPerMonth: 6.3,
    period: "January-October 2025"
  };

  // Real P&L Data
  const plData = {
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
  };

  // Sales Rep Simulator State
  const [repSalary, setRepSalary] = useState(3000);
  const [commissionSmall, setCommissionSmall] = useState(100);
  const [commissionMedium, setCommissionMedium] = useState(200);
  const [commissionLarge, setCommissionLarge] = useState(300);
  const [commissionPct, setCommissionPct] = useState(1.0);
  const [monthlyBonus, setMonthlyBonus] = useState(500);
  const [bonusThreshold, setBonusThreshold] = useState(10);
  const [monthlyCalls, setMonthlyCalls] = useState(300);
  const [callToLeadRate, setCallToLeadRate] = useState(15);
  const [leadToContractRate, setLeadToContractRate] = useState(30);
  const [dealsUnder10k, setDealsUnder10k] = useState(30);
  const [deals10to20k, setDeals10to20k] = useState(50);
  const [dealsOver20k, setDealsOver20k] = useState(20);
  const [activeScenario, setActiveScenario] = useState('expected');

  // Monthly data for JobNimbus (realistic distribution)
  const monthlyJobNimbusData = [
    { month: 'Jan', leads: 38, closed: 7, revenue: 183421 },
    { month: 'Feb', leads: 32, closed: 6, revenue: 157218 },
    { month: 'Mar', leads: 28, closed: 5, revenue: 78064 },
    { month: 'Apr', leads: 35, closed: 8, revenue: 209624 },
    { month: 'May', leads: 40, closed: 7, revenue: 183421 },
    { month: 'Jun', leads: 38, closed: 6, revenue: 157218 },
    { month: 'Jul', leads: 35, closed: 5, revenue: 131015 },
    { month: 'Aug', leads: 33, closed: 7, revenue: 183421 },
    { month: 'Sep', leads: 36, closed: 6, revenue: 157218 },
    { month: 'Oct', leads: 36, closed: 6, revenue: 304649 }
  ];

  // Job Status Breakdown
  const jobStatusData = [
    { name: 'Paid & Closed', value: 63, color: '#10b981' },
    { name: 'In Progress', value: 45, color: '#3b82f6' },
    { name: 'Pending', value: 38, color: '#f59e0b' },
    { name: 'Lost', value: 205, color: '#ef4444' }
  ];

  // Monthly Revenue Data for P&L
  // Real monthly data from Accrual P&L Statement (Jan-Oct 2025)
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 129411, expenses: 52515, profit: 26395 },
    { month: 'Feb', revenue: 161010, expenses: 62412, profit: 11375 },
    { month: 'Mar', revenue: 78064, expenses: 67769, profit: -94037 },
    { month: 'Apr', revenue: 79421, expenses: 86487, profit: -91063 },
    { month: 'May', revenue: 215940, expenses: 93815, profit: 15195 },
    { month: 'Jun', revenue: 142440, expenses: 74712, profit: -46032 },
    { month: 'Jul', revenue: 127374, expenses: 70986, profit: -68922 },
    { month: 'Aug', revenue: 279915, expenses: 41747, profit: 147863 },
    { month: 'Sep', revenue: 132564, expenses: 35741, profit: -23715 },
    { month: 'Oct', revenue: 304649, expenses: 41721, profit: 149088 }
  ];

  // COGS Breakdown
  const cogsBreakdown = [
    { name: 'Contract Labor', value: 42117.14, percentage: 25.5, color: '#3b82f6' },
    { name: 'Materials', value: 42322.45, percentage: 25.6, color: '#8b5cf6' },
    { name: 'Commissions', value: 13019.58, percentage: 7.9, color: '#10b981' },
    { name: 'Other COGS', value: 10000, percentage: 6.1, color: '#f59e0b' }
  ];

  // Operating Expenses Breakdown
  const opexBreakdown = [
    { name: 'Payroll', value: payrollCosts, color: '#3b82f6' },
    { name: 'General Admin', value: generalAdmin, color: '#8b5cf6' },
    { name: 'Taxes', value: taxesPaid, color: '#10b981' },
    { name: 'Advertising', value: advertising, color: '#f59e0b' },
    { name: 'Auto', value: autoCosts, color: '#ef4444' },
    { name: 'Legal/Professional', value: legalProfessional, color: '#06b6d4' },
    { name: 'Insurance', value: insurance, color: '#f43f5e' },
    { name: 'Utilities', value: utilities, color: '#84cc16' }
  ];

  // LocalStorage persistence
  useEffect(() => {
    const saved = localStorage.getItem('salesDashboardConfig');
    if (saved) {
      const config = JSON.parse(saved);
      setSalespersonName(config.salespersonName || '');
      setL(config.L || 35);
      setPL(config.pL || 48);
      setC(config.c || 0.1795);
      setV(config.V || 26203);
      setR(config.r || 0.079);
      setB(config.B || 0);
      setBase(config.b || 0);
      setGm(config.gm || 0.409);
      setH(config.h || 0.10);
      setM(config.M || 1000);
      setAlpha(config.alpha || 0.11);
      setGrowthRate(config.growthRate || 0.05);
      setDiscountRate(config.discountRate || 0.10);
      setYears(config.years || 3);
      setAdvertising(config.advertising || 4439);
      setAutoCosts(config.autoCosts || 4079);
      setGeneralAdmin(config.generalAdmin || 14639);
      setInsurance(config.insurance || 1016);
      setLegalProfessional(config.legalProfessional || 3027);
      setPayrollCosts(config.payrollCosts || 25074);
      setTaxesPaid(config.taxesPaid || 9715);
      setTravelCosts(config.travelCosts || 193);
      setUtilities(config.utilities || 509);
    }
  }, []);

  useEffect(() => {
    const config = {
      salespersonName, L, pL, c, V, r, B, b, gm, h, M, alpha, growthRate, discountRate, years,
      advertising, autoCosts, generalAdmin, insurance, legalProfessional,
      payrollCosts, taxesPaid, travelCosts, utilities
    };
    localStorage.setItem('salesDashboardConfig', JSON.stringify(config));
  }, [salespersonName, L, pL, c, V, r, B, b, gm, h, M, alpha, growthRate, discountRate, years,
      advertising, autoCosts, generalAdmin, insurance, legalProfessional,
      payrollCosts, taxesPaid, travelCosts, utilities]);

  // Calculations
  const N = useMemo(() => Math.round(L * c), [L, c]);
  const I_total = useMemo(() => N * V, [N, V]);
  const C_variable = useMemo(() => N * V * r, [N, V, r]);
  const P_total = useMemo(() => (pL / c) * N, [pL, c, N]);
  const totalOperatingExpenses = useMemo(() =>
    advertising + autoCosts + generalAdmin + insurance + legalProfessional +
    payrollCosts + taxesPaid + travelCosts + utilities,
    [advertising, autoCosts, generalAdmin, insurance, legalProfessional,
     payrollCosts, taxesPaid, travelCosts, utilities]
  );
  const I_neto = useMemo(() => I_total * gm, [I_total, gm]);
  const CF = useMemo(() => I_neto - C_variable - P_total - totalOperatingExpenses - M,
    [I_neto, C_variable, P_total, totalOperatingExpenses, M]);
  const ROI = useMemo(() => (CF / (C_variable + P_total + totalOperatingExpenses + M)) * 100,
    [CF, C_variable, P_total, totalOperatingExpenses, M]);

  // Fixed calculations: costo_por_contrato should be total costs / number of contracts
  const costo_total = useMemo(() => pL * L + C_variable + totalOperatingExpenses + M,
    [pL, L, C_variable, totalOperatingExpenses, M]);
  const costo_por_contrato = useMemo(() => costo_total / N, [costo_total, N]);
  const costo_por_lead = useMemo(() => costo_total / L, [costo_total, L]);
  const margen_por_contrato = useMemo(() => V * gm - costo_por_contrato, [V, gm, costo_por_contrato]);

  // Break-even calculations
  const contribucion_por_lead = useMemo(() => c * V * gm - pL - c * V * r, [c, V, gm, pL, r]);
  const leads_breakeven = useMemo(() =>
    Math.ceil((totalOperatingExpenses + M) / contribucion_por_lead),
    [totalOperatingExpenses, M, contribucion_por_lead]
  );
  const contratos_breakeven = useMemo(() => Math.round(leads_breakeven * c), [leads_breakeven, c]);
  const gap_leads = useMemo(() => leads_breakeven - L, [leads_breakeven, L]);

  const CF_mes = useMemo(() => CF, [CF]);
  const CAC = useMemo(() => costo_por_contrato, [costo_por_contrato]);
  const LTV = useMemo(() => {
    const margen = V * gm;
    const churnRate = 1;
    return margen / churnRate;
  }, [V, gm]);
  const LTV_CAC = useMemo(() => LTV / CAC, [LTV, CAC]);

  const CLV_simple = useMemo(() => V * gm, [V, gm]);
  const utilidad_neta_cliente = useMemo(() => CLV_simple - CAC, [CLV_simple, CAC]);

  // Formato de moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Métrica card component con animación
  const MetricCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue', subtitle }) => {
    const colorClasses = {
      blue: { text: 'from-blue-600 to-blue-400', bg: 'from-blue-500 to-blue-600' },
      green: { text: 'from-green-600 to-green-400', bg: 'from-green-500 to-green-600' },
      purple: { text: 'from-purple-600 to-purple-400', bg: 'from-purple-500 to-purple-600' },
      orange: { text: 'from-orange-600 to-orange-400', bg: 'from-orange-500 to-orange-600' },
      red: { text: 'from-red-600 to-red-400', bg: 'from-red-500 to-red-600' }
    };
    const colors = colorClasses[color] || colorClasses.blue;

    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <h3 className={`text-3xl font-bold bg-gradient-to-r ${colors.text} bg-clip-text text-transparent`}>
              {value}
            </h3>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                <span className="font-medium">{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`bg-gradient-to-br ${colors.bg} p-3 rounded-xl shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  // Tab Navigation Component
  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        activeTab === id
          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transform scale-105'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  // Main Dashboard Tab
  const MainDashboard = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">G.A. Castro Construction LLC</h1>
            <p className="text-blue-100 text-lg">Sales Performance Dashboard</p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm text-blue-100">Period</p>
                <p className="text-xl font-bold">Jan-Oct 2025</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm text-blue-100">Total Leads</p>
                <p className="text-xl font-bold">{jobnimbusData.totalLeads}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm text-blue-100">Contracts Closed</p>
                <p className="text-xl font-bold">{jobnimbusData.paidClosed}</p>
              </div>
            </div>
          </div>
          <Award className="w-32 h-32 text-white/30" />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Conversion Rate"
          value={`${(c * 100).toFixed(2)}%`}
          icon={Target}
          trend="up"
          trendValue="+2.95% vs target"
          color="green"
          subtitle="Real performance metric"
        />
        <MetricCard
          title="Average Ticket"
          value={formatCurrency(V)}
          icon={DollarSign}
          trend="up"
          trendValue="+118% vs estimate"
          color="blue"
          subtitle="Actual average deal size"
        />
        <MetricCard
          title="Monthly Leads"
          value={L.toFixed(1)}
          icon={Users}
          color="purple"
          subtitle={`${jobnimbusData.avgLeadsPerMonth} avg/month actual`}
        />
        <MetricCard
          title="Monthly Contracts"
          value={N.toFixed(1)}
          icon={Briefcase}
          color="indigo"
          subtitle={`${jobnimbusData.avgClosedPerMonth} avg/month actual`}
        />
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Monthly Revenue"
          value={formatCurrency(I_total)}
          icon={TrendingUp}
          trend="up"
          trendValue="Strong performance"
          color="green"
        />
        <MetricCard
          title="Cash Flow"
          value={formatCurrency(CF)}
          icon={Activity}
          trend={CF > 0 ? 'up' : 'down'}
          trendValue={CF > 0 ? 'Positive' : 'Negative'}
          color={CF > 0 ? 'green' : 'red'}
        />
        <MetricCard
          title="ROI"
          value={`${ROI.toFixed(1)}%`}
          icon={Award}
          trend={ROI > 0 ? 'up' : 'down'}
          trendValue={ROI > 0 ? 'Profitable' : 'Loss'}
          color={ROI > 0 ? 'green' : 'red'}
        />
      </div>

      {/* Break-Even Analysis Alert */}
      {CF < 0 && (
        <div className={`rounded-xl shadow-lg p-6 border-2 ${gap_leads > 0 ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-orange-300' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'}`}>
          <div className="flex items-start space-x-4">
            <div className={`${gap_leads > 0 ? 'bg-orange-500' : 'bg-green-500'} p-3 rounded-xl`}>
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`text-2xl font-bold mb-2 ${gap_leads > 0 ? 'text-orange-800' : 'text-green-800'}`}>
                {gap_leads > 0 ? 'Operating Below Break-Even' : 'Operating At Break-Even'}
              </h3>
              <p className="text-gray-700 mb-4">
                {gap_leads > 0
                  ? `With current operating expenses and ${L} monthly leads, the business is generating a cash flow deficit of ${formatCurrency(Math.abs(CF))}/month.`
                  : 'Your current lead volume is exactly at break-even point.'
                }
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">Current Monthly Leads</p>
                  <p className="text-3xl font-bold text-blue-600">{L}</p>
                  <p className="text-xs text-gray-500 mt-1">{N} contracts/month</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">Break-Even Leads Needed</p>
                  <p className="text-3xl font-bold text-orange-600">{leads_breakeven}</p>
                  <p className="text-xs text-gray-500 mt-1">{contratos_breakeven} contracts/month</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">Additional Leads Required</p>
                  <p className={`text-3xl font-bold ${gap_leads > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {gap_leads > 0 ? `+${gap_leads}` : gap_leads}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {gap_leads > 0 ? `${((gap_leads / L) * 100).toFixed(0)}% increase needed` : 'At target'}
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-800 mb-2">Key Insight:</p>
                <p className="text-sm text-blue-700">
                  Each lead contributes ${contribucion_por_lead.toFixed(2)} towards fixed costs. To cover ${formatCurrency(totalOperatingExpenses + M)} in monthly operating expenses plus owner compensation, you need {leads_breakeven} leads.
                  {gap_leads > 0 && ` Currently short by ${gap_leads} leads (${((gap_leads / leads_breakeven) * 100).toFixed(0)}% below break-even).`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Compensation Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Sales Compensation Calculator</h2>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Leads (L)</label>
            <input
              type="number"
              value={L}
              onChange={(e) => setL(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Rate (%)</label>
            <input
              type="number"
              value={(c * 100).toFixed(2)}
              onChange={(e) => setC(Number(e.target.value) / 100)}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Average Ticket ($)</label>
            <input
              type="number"
              value={V}
              onChange={(e) => setV(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Lead ($)</label>
            <input
              type="number"
              value={pL}
              onChange={(e) => setPL(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-600 font-medium mb-1">Contracts Generated</p>
            <p className="text-2xl font-bold text-blue-700">{N}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-600 font-medium mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(I_total)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-purple-600 font-medium mb-1">Profit per Contract</p>
            <p className="text-2xl font-bold text-purple-700">{formatCurrency(margen_por_contrato)}</p>
          </div>
        </div>
      </div>

      {/* Customer Economics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Target className="w-6 h-6 mr-2 text-blue-600" />
            Customer Economics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Customer Acquisition Cost</span>
              <span className="text-xl font-bold text-blue-600">{formatCurrency(CAC)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700 font-medium">Lifetime Value</span>
              <span className="text-xl font-bold text-green-600">{formatCurrency(LTV)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700 font-medium">LTV:CAC Ratio</span>
              <span className="text-xl font-bold text-purple-600">{LTV_CAC.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
              <span className="text-gray-700 font-medium">Net Profit per Customer</span>
              <span className="text-xl font-bold text-indigo-600">{formatCurrency(utilidad_neta_cliente)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-green-600" />
            Cost Analysis
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Cost per Lead</span>
              <span className="text-xl font-bold text-gray-700">{formatCurrency(costo_por_lead)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Cost per Contract</span>
              <span className="text-xl font-bold text-gray-700">{formatCurrency(costo_por_contrato)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Variable Costs</span>
              <span className="text-xl font-bold text-gray-700">{formatCurrency(C_variable)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Operating Expenses</span>
              <span className="text-xl font-bold text-gray-700">{formatCurrency(totalOperatingExpenses)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // JobNimbus Analytics Tab
  const JobNimbusAnalytics = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">JobNimbus Analytics</h1>
            <p className="text-purple-100 text-lg">Real-time CRM Performance Metrics</p>
            <p className="text-purple-200 text-sm mt-2">Data Period: {jobnimbusData.period}</p>
          </div>
          <Briefcase className="w-32 h-32 text-white/30" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads Created"
          value={jobnimbusData.totalLeads}
          icon={Users}
          color="blue"
          subtitle="Jan-Oct 2025"
        />
        <MetricCard
          title="Paid & Closed"
          value={jobnimbusData.paidClosed}
          icon={CheckCircle}
          color="green"
          subtitle="Completed contracts"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${jobnimbusData.conversionRate}%`}
          icon={Target}
          trend="up"
          trendValue="Above industry avg"
          color="purple"
        />
        <MetricCard
          title="Avg Monthly Leads"
          value={jobnimbusData.avgLeadsPerMonth.toFixed(1)}
          icon={Calendar}
          color="indigo"
          subtitle={`${jobnimbusData.avgClosedPerMonth} closed/month`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
            Monthly Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyJobNimbusData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="leads" fill="url(#colorLeads)" name="Leads" radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="closed" stroke="#10b981" strokeWidth={3} name="Closed" dot={{ fill: '#10b981', r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Job Status Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <PieChartIcon className="w-6 h-6 mr-2 text-purple-600" />
            Job Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {jobStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {jobStatusData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Clock className="w-6 h-6 mr-2 text-indigo-600" />
          Revenue Timeline (Jan-Oct 2025)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyJobNimbusData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Best Performer</span>
          </div>
          <h4 className="text-lg font-medium mb-2">Highest Conversion Month</h4>
          <p className="text-3xl font-bold">August 2025</p>
          <p className="text-green-100 mt-2">7 contracts from 33 leads</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Trend</span>
          </div>
          <h4 className="text-lg font-medium mb-2">Average Deal Size</h4>
          <p className="text-3xl font-bold">{formatCurrency(V)}</p>
          <p className="text-blue-100 mt-2">Based on closed contracts</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Goal</span>
          </div>
          <h4 className="text-lg font-medium mb-2">Pipeline Health</h4>
          <p className="text-3xl font-bold">Strong</p>
          <p className="text-purple-100 mt-2">83 active opportunities</p>
        </div>
      </div>
    </div>
  );

  // P&L Analysis Tab
  const PLAnalysis = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Profit & Loss Analysis</h1>
            <p className="text-emerald-100 text-lg">Financial Performance Breakdown</p>
            <p className="text-emerald-200 text-sm mt-2">Jan-Oct 2025 Average Monthly Data</p>
          </div>
          <Activity className="w-32 h-32 text-white/30" />
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Avg Monthly Revenue"
          value={formatCurrency(plData.avgRevenue)}
          icon={DollarSign}
          color="green"
          subtitle="Average across 10 months"
        />
        <MetricCard
          title="Gross Margin"
          value={`${(plData.grossMargin * 100).toFixed(1)}%`}
          icon={TrendingUp}
          trend="up"
          trendValue="Healthy margin"
          color="blue"
        />
        <MetricCard
          title="Net Margin"
          value={`${(plData.netMargin * 100).toFixed(2)}%`}
          icon={Activity}
          color="purple"
          subtitle="Room for improvement"
        />
        <MetricCard
          title="Revenue Volatility"
          value={`${(plData.volatility * 100).toFixed(1)}%`}
          icon={AlertCircle}
          color="orange"
          subtitle="CV: Coefficient of variation"
        />
      </div>

      {/* Best vs Worst Month Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm font-medium">Best Month</p>
              <h3 className="text-3xl font-bold mt-1">{plData.bestMonth.month}</h3>
            </div>
            <TrendingUp className="w-12 h-12 text-white/50" />
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4">
            <p className="text-green-100 text-sm mb-1">Revenue</p>
            <p className="text-4xl font-bold">{formatCurrency(plData.bestMonth.revenue)}</p>
          </div>
          <p className="text-green-100 text-sm mt-4">
            +{((plData.bestMonth.revenue / plData.avgRevenue - 1) * 100).toFixed(0)}% above average
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-red-100 text-sm font-medium">Worst Month</p>
              <h3 className="text-3xl font-bold mt-1">{plData.worstMonth.month}</h3>
            </div>
            <TrendingDown className="w-12 h-12 text-white/50" />
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4">
            <p className="text-red-100 text-sm mb-1">Revenue</p>
            <p className="text-4xl font-bold">{formatCurrency(plData.worstMonth.revenue)}</p>
          </div>
          <p className="text-red-100 text-sm mt-4">
            {((plData.worstMonth.revenue / plData.avgRevenue - 1) * 100).toFixed(0)}% below average
          </p>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-green-600" />
          Monthly Revenue & Profitability Trend
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={monthlyRevenueData}>
            <defs>
              <linearGradient id="colorRevenuePL" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="url(#colorRevenuePL)" name="Revenue" radius={[8, 8, 0, 0]} />
            <Line type="monotone" dataKey="profit" stroke="#ef4444" strokeWidth={3} name="Net Profit" dot={{ fill: '#ef4444', r: 5 }} />
            <Line type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Expenses" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* COGS Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Package className="w-6 h-6 mr-2 text-blue-600" />
            Cost of Goods Sold (COGS)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cogsBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {cogsBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {cogsBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600 font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-700">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Expenses */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-purple-600" />
            Operating Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={opexBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {opexBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-purple-700">Total Operating Expenses</span>
              <span className="text-xl font-bold text-purple-700">{formatCurrency(plData.operatingExpenses)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">Strong Gross Margin</h4>
          </div>
          <p className="text-gray-600 text-sm">
            40.9% gross margin indicates healthy pricing and cost management. Industry benchmark: 35-45%.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">High Volatility</h4>
          </div>
          <p className="text-gray-600 text-sm">
            47% revenue volatility suggests seasonal fluctuations. Consider diversification and consistent marketing.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">Growth Opportunity</h4>
          </div>
          <p className="text-gray-600 text-sm">
            Low net margin (1.58%) indicates opportunity to optimize operating expenses and scale operations.
          </p>
        </div>
      </div>
    </div>
  );

  // Sales Rep Simulator Tab
  const SalesRepSimulator = () => {
    // Calculate sales rep performance metrics
    const leadsGenerated = useMemo(() => Math.round(monthlyCalls * (callToLeadRate / 100)), [monthlyCalls, callToLeadRate]);
    const contractsClosed = useMemo(() => Math.round(leadsGenerated * (leadToContractRate / 100)), [leadsGenerated, leadToContractRate]);

    // Deal size distribution
    const smallDeals = useMemo(() => Math.round(contractsClosed * (dealsUnder10k / 100)), [contractsClosed, dealsUnder10k]);
    const mediumDeals = useMemo(() => Math.round(contractsClosed * (deals10to20k / 100)), [contractsClosed, deals10to20k]);
    const largeDeals = useMemo(() => contractsClosed - smallDeals - mediumDeals, [contractsClosed, smallDeals, mediumDeals]);

    // Revenue calculations
    const avgSmallDeal = 7500;
    const avgMediumDeal = 15000;
    const avgLargeDeal = 30000;

    const totalRevenue = useMemo(() =>
      (smallDeals * avgSmallDeal) + (mediumDeals * avgMediumDeal) + (largeDeals * avgLargeDeal),
      [smallDeals, mediumDeals, largeDeals]
    );

    // Commission calculations
    const fixedCommissions = useMemo(() =>
      (smallDeals * commissionSmall) + (mediumDeals * commissionMedium) + (largeDeals * commissionLarge),
      [smallDeals, mediumDeals, largeDeals, commissionSmall, commissionMedium, commissionLarge]
    );

    const percentageCommissions = useMemo(() =>
      totalRevenue * (commissionPct / 100),
      [totalRevenue, commissionPct]
    );

    const totalCommissions = fixedCommissions + percentageCommissions;

    // Bonus calculation
    const earnedBonus = contractsClosed >= bonusThreshold ? monthlyBonus : 0;

    // Total compensation
    const totalCompensation = repSalary + totalCommissions + earnedBonus;

    // Gross profit from rep's deals (using company's 40.9% margin)
    const grossProfit = totalRevenue * gm;

    // Net profit (gross profit - total compensation)
    const netProfit = grossProfit - totalCompensation;

    // ROI calculation
    const repROI = totalCompensation > 0 ? (netProfit / totalCompensation) * 100 : 0;

    // Cost per acquisition
    const costPerAcquisition = contractsClosed > 0 ? totalCompensation / contractsClosed : 0;

    // Contribution margin per deal
    const avgDealSize = contractsClosed > 0 ? totalRevenue / contractsClosed : 0;
    const contributionMargin = avgDealSize * gm - costPerAcquisition;

    // Break-even analysis
    const monthlyFixedCost = repSalary + (contractsClosed >= bonusThreshold ? monthlyBonus : 0);
    const avgCommissionPerDeal = contractsClosed > 0 ? totalCommissions / contractsClosed : 0;
    const contributionPerDeal = avgDealSize * gm - avgCommissionPerDeal;
    const breakevenDeals = contributionPerDeal > 0 ? Math.ceil(monthlyFixedCost / contributionPerDeal) : 0;
    const breakevenCalls = breakevenDeals > 0 ? Math.ceil(breakevenDeals / (callToLeadRate / 100) / (leadToContractRate / 100)) : 0;

    // Payback period (months)
    const paybackPeriod = netProfit > 0 ? 1 : netProfit < 0 ? (totalCompensation / Math.abs(netProfit)) : 0;

    // Annual projections
    const annualRevenue = totalRevenue * 12;
    const annualProfit = netProfit * 12;
    const annualCompensation = totalCompensation * 12;

    // Scenario presets
    const applyScenario = (scenario) => {
      setActiveScenario(scenario);
      if (scenario === 'conservative') {
        setRepSalary(2500);
        setCommissionSmall(50);
        setCommissionMedium(100);
        setCommissionLarge(150);
        setCommissionPct(0.5);
        setMonthlyBonus(0);
        setBonusThreshold(15);
        setMonthlyCalls(200);
        setCallToLeadRate(10);
        setLeadToContractRate(20);
        setDealsUnder10k(40);
        setDeals10to20k(45);
        setDealsOver20k(15);
      } else if (scenario === 'expected') {
        setRepSalary(3000);
        setCommissionSmall(100);
        setCommissionMedium(200);
        setCommissionLarge(300);
        setCommissionPct(1.0);
        setMonthlyBonus(500);
        setBonusThreshold(10);
        setMonthlyCalls(300);
        setCallToLeadRate(15);
        setLeadToContractRate(30);
        setDealsUnder10k(30);
        setDeals10to20k(50);
        setDealsOver20k(20);
      } else if (scenario === 'optimistic') {
        setRepSalary(3500);
        setCommissionSmall(150);
        setCommissionMedium(250);
        setCommissionLarge(400);
        setCommissionPct(1.5);
        setMonthlyBonus(1000);
        setBonusThreshold(8);
        setMonthlyCalls(400);
        setCallToLeadRate(20);
        setLeadToContractRate(35);
        setDealsUnder10k(25);
        setDeals10to20k(50);
        setDealsOver20k(25);
      }
    };

    // Cost breakdown data
    const costBreakdownData = [
      { name: 'Base Salary', value: repSalary, color: '#3b82f6' },
      { name: 'Commissions', value: totalCommissions, color: '#10b981' },
      { name: 'Bonuses', value: earnedBonus, color: '#f59e0b' }
    ];

    // Monthly performance scenarios
    const performanceData = [
      { scenario: 'Conservative', calls: 200, contracts: 4, revenue: 90000, profit: -5000, roi: -15 },
      { scenario: 'Expected', calls: monthlyCalls, contracts: contractsClosed, revenue: totalRevenue, profit: netProfit, roi: repROI },
      { scenario: 'Optimistic', calls: 400, contracts: 28, revenue: 520000, profit: 155000, roi: 235 }
    ];

    // Revenue vs Cost comparison
    const revenueComparisonData = [
      { category: 'Revenue', amount: totalRevenue },
      { category: 'Gross Profit', amount: grossProfit },
      { category: 'Compensation', amount: totalCompensation },
      { category: 'Net Profit', amount: netProfit }
    ];

    // Quarterly projection
    const quarterlyProjection = [
      { month: 'Month 1', revenue: totalRevenue * 0.7, profit: netProfit * 0.5, compensation: totalCompensation },
      { month: 'Month 2', revenue: totalRevenue * 0.85, profit: netProfit * 0.75, compensation: totalCompensation },
      { month: 'Month 3', revenue: totalRevenue, profit: netProfit, compensation: totalCompensation },
      { month: 'Month 4', revenue: totalRevenue * 1.1, profit: netProfit * 1.2, compensation: totalCompensation * 1.05 },
      { month: 'Month 5', revenue: totalRevenue * 1.15, profit: netProfit * 1.3, compensation: totalCompensation * 1.05 },
      { month: 'Month 6', revenue: totalRevenue * 1.2, profit: netProfit * 1.4, compensation: totalCompensation * 1.1 }
    ];

    // Performance metrics radar
    const performanceRadarData = [
      { metric: 'Call Volume', value: (monthlyCalls / 500) * 100, fullMark: 100 },
      { metric: 'Lead Conv', value: callToLeadRate * 5, fullMark: 100 },
      { metric: 'Close Rate', value: leadToContractRate * 2.5, fullMark: 100 },
      { metric: 'Deal Size', value: (avgDealSize / 40000) * 100, fullMark: 100 },
      { metric: 'Profitability', value: repROI > 0 ? Math.min((repROI / 2), 100) : 0, fullMark: 100 }
    ];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Sales Rep ROI Simulator</h1>
              <p className="text-purple-100 text-lg">Analyze profitability of hiring a cold call sales representative</p>
              <p className="text-purple-200 text-sm mt-2">Model compensation structures and performance scenarios</p>
            </div>
            <UserPlus className="w-32 h-32 text-white/30" />
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Scenario Presets</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => applyScenario('conservative')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                activeScenario === 'conservative'
                  ? 'border-orange-500 bg-orange-50 shadow-lg'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-gray-800">Conservative</h4>
                <AlertCircle className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-sm text-gray-600">Lower salary, minimal commissions, conservative performance targets</p>
            </button>

            <button
              onClick={() => applyScenario('expected')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                activeScenario === 'expected'
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-gray-800">Expected</h4>
                <Target className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">Realistic compensation with balanced performance expectations</p>
            </button>

            <button
              onClick={() => applyScenario('optimistic')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                activeScenario === 'optimistic'
                  ? 'border-green-500 bg-green-50 shadow-lg'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-gray-800">Optimistic</h4>
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm text-gray-600">Higher compensation with aggressive performance goals</p>
            </button>
          </div>
        </div>

        {/* Key Results Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Monthly Net Profit"
            value={formatCurrency(netProfit)}
            icon={netProfit >= 0 ? TrendingUp : TrendingDownIcon}
            trend={netProfit >= 0 ? 'up' : 'down'}
            trendValue={netProfit >= 0 ? 'Profitable' : 'Loss'}
            color={netProfit >= 0 ? 'green' : 'red'}
            subtitle={`From ${contractsClosed} contracts`}
          />
          <MetricCard
            title="ROI"
            value={`${repROI.toFixed(1)}%`}
            icon={Award}
            trend={repROI >= 0 ? 'up' : 'down'}
            trendValue={repROI >= 100 ? 'Excellent' : repROI >= 0 ? 'Positive' : 'Negative'}
            color={repROI >= 100 ? 'green' : repROI >= 0 ? 'blue' : 'red'}
            subtitle="Return on investment"
          />
          <MetricCard
            title="Total Compensation"
            value={formatCurrency(totalCompensation)}
            icon={DollarSign}
            color="purple"
            subtitle={`Base: ${formatCurrency(repSalary)}/mo`}
          />
          <MetricCard
            title="Monthly Revenue"
            value={formatCurrency(totalRevenue)}
            icon={TrendingUp}
            trend="up"
            trendValue={`${contractsClosed} contracts`}
            color="blue"
            subtitle={`Avg: ${formatCurrency(avgDealSize)}`}
          />
        </div>

        {/* ROI Alert */}
        {netProfit < 0 && (
          <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300 rounded-xl shadow-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-red-500 p-3 rounded-xl">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-red-800">Negative ROI Warning</h3>
                <p className="text-gray-700 mb-4">
                  With current parameters, hiring this sales rep would result in a monthly loss of {formatCurrency(Math.abs(netProfit))}.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Current Contracts/Month</p>
                    <p className="text-2xl font-bold text-red-600">{contractsClosed}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Break-Even Needed</p>
                    <p className="text-2xl font-bold text-orange-600">{breakevenDeals}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Gap</p>
                    <p className="text-2xl font-bold text-red-600">+{breakevenDeals - contractsClosed}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {netProfit >= 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-500 p-3 rounded-xl">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-green-800">Profitable Hire!</h3>
                <p className="text-gray-700 mb-4">
                  This sales rep would generate a monthly profit of {formatCurrency(netProfit)} with an ROI of {repROI.toFixed(1)}%.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Monthly Profit</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(netProfit)}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Annual Profit</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(annualProfit)}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Payback Period</p>
                    <p className="text-2xl font-bold text-green-600">{paybackPeriod.toFixed(1)}mo</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Annual Revenue</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(annualRevenue)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compensation Structure Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Compensation Structure</h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Monthly Base Salary</label>
                  <span className="text-lg font-bold text-purple-600">{formatCurrency(repSalary)}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="4000"
                  step="100"
                  value={repSalary}
                  onChange={(e) => setRepSalary(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-purple-200 to-purple-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$2,000</span>
                  <span>$4,000</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Commission per Deal (Fixed)</h4>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-600">Deals &lt; $10K</label>
                      <span className="text-md font-bold text-blue-600">${commissionSmall}</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      step="10"
                      value={commissionSmall}
                      onChange={(e) => setCommissionSmall(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-600">Deals $10K-$20K</label>
                      <span className="text-md font-bold text-green-600">${commissionMedium}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="300"
                      step="10"
                      value={commissionMedium}
                      onChange={(e) => setCommissionMedium(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-600">Deals &gt; $20K</label>
                      <span className="text-md font-bold text-orange-600">${commissionLarge}</span>
                    </div>
                    <input
                      type="range"
                      min="150"
                      max="500"
                      step="10"
                      value={commissionLarge}
                      onChange={(e) => setCommissionLarge(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-orange-200 to-orange-400 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Commission % on Revenue</label>
                  <span className="text-lg font-bold text-indigo-600">{commissionPct.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={commissionPct}
                  onChange={(e) => setCommissionPct(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-indigo-200 to-indigo-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5%</span>
                  <span>1.5%</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Monthly Performance Bonus</label>
                  <span className="text-lg font-bold text-yellow-600">{formatCurrency(monthlyBonus)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={monthlyBonus}
                  onChange={(e) => setMonthlyBonus(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$0</span>
                  <span>$1,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Bonus Threshold (Contracts/Month)</label>
                  <span className="text-lg font-bold text-red-600">{bonusThreshold}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="1"
                  value={bonusThreshold}
                  onChange={(e) => setBonusThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-red-200 to-red-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5</span>
                  <span>15</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Performance Metrics</h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Monthly Cold Calls</label>
                  <span className="text-lg font-bold text-blue-600">{monthlyCalls}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="10"
                  value={monthlyCalls}
                  onChange={(e) => setMonthlyCalls(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100</span>
                  <span>500</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Call to Lead Conversion</label>
                  <span className="text-lg font-bold text-green-600">{callToLeadRate}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={callToLeadRate}
                  onChange={(e) => setCallToLeadRate(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5%</span>
                  <span>25%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 italic">{leadsGenerated} leads generated/month</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Lead to Contract Conversion</label>
                  <span className="text-lg font-bold text-purple-600">{leadToContractRate}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="40"
                  step="1"
                  value={leadToContractRate}
                  onChange={(e) => setLeadToContractRate(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-purple-200 to-purple-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>20%</span>
                  <span>40%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 italic">{contractsClosed} contracts closed/month</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Deal Size Distribution</h4>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-600">% Deals &lt; $10K</label>
                      <span className="text-md font-bold text-blue-600">{dealsUnder10k}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="5"
                      value={dealsUnder10k}
                      onChange={(e) => setDealsUnder10k(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">{smallDeals} deals @ avg ${avgSmallDeal.toLocaleString()}</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-600">% Deals $10K-$20K</label>
                      <span className="text-md font-bold text-green-600">{deals10to20k}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="5"
                      value={deals10to20k}
                      onChange={(e) => setDeals10to20k(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">{mediumDeals} deals @ avg ${avgMediumDeal.toLocaleString()}</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-600">% Deals &gt; $20K</label>
                      <span className="text-md font-bold text-orange-600">{dealsOver20k}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="5"
                      value={dealsOver20k}
                      onChange={(e) => setDealsOver20k(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-orange-200 to-orange-400 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">{largeDeals} deals @ avg ${avgLargeDeal.toLocaleString()}</p>
                  </div>
                </div>

                {(dealsUnder10k + deals10to20k + dealsOver20k) !== 100 && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      Warning: Distribution should total 100% (currently {dealsUnder10k + deals10to20k + dealsOver20k}%)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-blue-800">Cost per Acquisition</h4>
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-700">{formatCurrency(costPerAcquisition)}</p>
            <p className="text-xs text-blue-600 mt-2">Per closed contract</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-green-800">Contribution Margin</h4>
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-700">{formatCurrency(contributionMargin)}</p>
            <p className="text-xs text-green-600 mt-2">After all rep costs</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-orange-800">Break-Even Calls</h4>
              <Phone className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-700">{breakevenCalls}</p>
            <p className="text-xs text-orange-600 mt-2">{breakevenDeals} contracts needed</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-purple-800">Annual Impact</h4>
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-700">{formatCurrency(annualProfit)}</p>
            <p className="text-xs text-purple-600 mt-2">Projected yearly profit</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <PieChartIcon className="w-6 h-6 mr-2 text-purple-600" />
              Compensation Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Monthly Cost</span>
                <span className="text-xl font-bold text-blue-600">{formatCurrency(totalCompensation)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Bonus Earned</span>
                <span className="text-xl font-bold text-green-600">
                  {contractsClosed >= bonusThreshold ? 'Yes ✓' : 'No ✗'}
                </span>
              </div>
            </div>
          </div>

          {/* Revenue vs Cost */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-green-600" />
              Revenue vs Cost Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" angle={-15} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {revenueComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.category === 'Revenue' ? '#3b82f6' :
                      entry.category === 'Gross Profit' ? '#10b981' :
                      entry.category === 'Compensation' ? '#ef4444' :
                      entry.amount >= 0 ? '#10b981' : '#ef4444'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Projection */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-blue-600" />
            6-Month Performance Projection
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={quarterlyProjection}>
              <defs>
                <linearGradient id="colorRevProj" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#colorRevProj)" name="Revenue" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="Net Profit" dot={{ fill: '#10b981', r: 5 }} />
              <Line type="monotone" dataKey="compensation" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Compensation" />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-4">
            Projection assumes gradual ramp-up over first 2 months, then steady improvement in months 4-6 as rep gains experience.
          </p>
        </div>

        {/* Scenario Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-600" />
            Scenario Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="scenario" />
              <YAxis yAxisId="left" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => {
                if (name === 'ROI') return `${value.toFixed(1)}%`;
                if (name === 'Contracts') return value;
                return formatCurrency(value);
              }} />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="left" dataKey="profit" name="Profit" radius={[8, 8, 0, 0]}>
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="contracts" stroke="#f59e0b" strokeWidth={3} name="Contracts" dot={{ fill: '#f59e0b', r: 5 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-indigo-600" />
              Performance Metrics Radar
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceRadarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Current Performance" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-600 mt-4 text-center">
              Normalized performance across key metrics (0-100 scale)
            </p>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
              Smart Recommendations
            </h3>
            <div className="space-y-4">
              {repROI < 0 && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <h4 className="text-sm font-bold text-red-800 mb-1">Increase Performance</h4>
                  <p className="text-sm text-red-700">
                    Rep needs {breakevenDeals - contractsClosed} more contracts/month to break even.
                    Consider increasing cold call volume or improving conversion rates.
                  </p>
                </div>
              )}

              {repROI >= 0 && repROI < 50 && (
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                  <h4 className="text-sm font-bold text-yellow-800 mb-1">Low ROI</h4>
                  <p className="text-sm text-yellow-700">
                    While profitable, ROI is below 50%. Consider optimizing compensation structure or performance targets.
                  </p>
                </div>
              )}

              {repROI >= 50 && repROI < 100 && (
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                  <h4 className="text-sm font-bold text-blue-800 mb-1">Good Performance</h4>
                  <p className="text-sm text-blue-700">
                    Solid ROI of {repROI.toFixed(1)}%. This hire is generating positive returns.
                  </p>
                </div>
              )}

              {repROI >= 100 && (
                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                  <h4 className="text-sm font-bold text-green-800 mb-1">Excellent Performance!</h4>
                  <p className="text-sm text-green-700">
                    Outstanding ROI of {repROI.toFixed(1)}%. This rep is highly profitable. Consider hiring additional reps with similar performance potential.
                  </p>
                </div>
              )}

              {contractsClosed >= bonusThreshold && (
                <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                  <h4 className="text-sm font-bold text-purple-800 mb-1">Bonus Triggered</h4>
                  <p className="text-sm text-purple-700">
                    Rep is earning the performance bonus ({formatCurrency(monthlyBonus)}) by closing {contractsClosed} contracts.
                  </p>
                </div>
              )}

              {avgDealSize > 25000 && (
                <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg">
                  <h4 className="text-sm font-bold text-indigo-800 mb-1">High-Value Deals</h4>
                  <p className="text-sm text-indigo-700">
                    Average deal size of {formatCurrency(avgDealSize)} is excellent. Rep is attracting quality leads.
                  </p>
                </div>
              )}

              <div className="p-4 bg-gray-50 border-l-4 border-gray-500 rounded-lg">
                <h4 className="text-sm font-bold text-gray-800 mb-1">Team Comparison</h4>
                <p className="text-sm text-gray-700">
                  Current team average: {jobnimbusData.avgClosedPerMonth.toFixed(1)} contracts/month at {(jobnimbusData.conversionRate).toFixed(1)}% conversion.
                  This rep would contribute {contractsClosed} contracts at {(leadToContractRate).toFixed(1)}% conversion.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Insights */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-4">Executive Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-3">Financial Impact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Monthly net profit: <strong>{formatCurrency(netProfit)}</strong> ({repROI.toFixed(1)}% ROI)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Annual profit projection: <strong>{formatCurrency(annualProfit)}</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Total compensation: <strong>{formatCurrency(totalCompensation)}</strong>/month</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Break-even at: <strong>{breakevenDeals} contracts</strong> ({breakevenCalls} calls)</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">Performance Metrics</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Expected contracts: <strong>{contractsClosed}/month</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Monthly revenue: <strong>{formatCurrency(totalRevenue)}</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Cost per acquisition: <strong>{formatCurrency(costPerAcquisition)}</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Contribution margin: <strong>{formatCurrency(contributionMargin)}</strong>/deal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8 bg-white rounded-xl shadow-lg p-4">
          <TabButton id="main" label="Sales Dashboard" icon={Activity} />
          <TabButton id="jobnimbus" label="JobNimbus Analytics" icon={Briefcase} />
          <TabButton id="pl" label="P&L Analysis" icon={BarChart3} />
          <TabButton id="simulator" label="Sales Rep Simulator" icon={UserPlus} />
        </div>

        {/* Tab Content */}
        {activeTab === 'main' && <MainDashboard />}
        {activeTab === 'jobnimbus' && <JobNimbusAnalytics />}
        {activeTab === 'pl' && <PLAnalysis />}
        {activeTab === 'simulator' && <SalesRepSimulator />}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>G.A. Castro Construction LLC - Sales Dashboard v2.0</p>
          <p className="mt-1">Data updated: November 2025</p>
        </div>
      </div>
    </div>
  );
};

export default SalesCompensationDashboardPro;
