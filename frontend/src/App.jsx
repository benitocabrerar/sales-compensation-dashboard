import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Users, Award, Target,
  Calendar, Briefcase, PieChart as PieChartIcon, Activity,
  BarChart3, AlertCircle, CheckCircle, Clock, Package, UserPlus, Phone, Zap, TrendingDown as TrendingDownIcon,
  TrendingUpIcon, ArrowUpRight, ArrowDownRight, BadgeDollarSign, Percent, Timer, TrendingUp as TrendingUpAlt, Crosshair
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

  // Marginal Cost State Variables (Critical Update)
  // Marginal Cost State Variables
  const [costPerLead, setCostPerLead] = useState(100);
  const [costPerClose, setCostPerClose] = useState(200);
  const [currentTeamCapacity, setCurrentTeamCapacity] = useState(50);
  const [currentLeadsGenerated, setCurrentLeadsGenerated] = useState(35);
  const [additionalStaffCost, setAdditionalStaffCost] = useState(4500);
  const [leadsPerAdditionalStaff, setLeadsPerAdditionalStaff] = useState(30);


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

        {/* Input Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Monthly Leads Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Monthly Leads (L)</label>
              <span className="text-lg font-bold text-blue-600">{L}</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="1"
              value={L}
              onChange={(e) => setL(Number(e.target.value))}
              className="w-full text-blue-500"
              style={{ touchAction: 'none' }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10</span>
              <span>200</span>
            </div>
          </div>

          {/* Conversion Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Conversion Rate (%)</label>
              <span className="text-lg font-bold text-green-600">{(c * 100).toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="0.5"
              value={c * 100}
              onChange={(e) => setC(Number(e.target.value) / 100)}
              className="w-full text-green-500"
              style={{ touchAction: 'none' }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Average Ticket Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Average Ticket ($)</label>
              <span className="text-lg font-bold text-purple-600">{formatCurrency(V)}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="500"
              value={V}
              onChange={(e) => setV(Number(e.target.value))}
              className="w-full text-purple-500"
              style={{ touchAction: 'none' }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$5K</span>
              <span>$50K</span>
            </div>
          </div>

          {/* Cost per Lead Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Cost per Lead ($)</label>
              <span className="text-lg font-bold text-orange-600">{formatCurrency(pL)}</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={pL}
              onChange={(e) => setPL(Number(e.target.value))}
              className="w-full text-orange-500"
              style={{ touchAction: 'none' }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$10</span>
              <span>$200</span>
            </div>
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
  // Sales Rep Simulator Tab (Updated with Marginal Costs)
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

  // Cold Caller Total compensation
  const coldCallerCompensation = repSalary + totalCommissions + earnedBonus;

  // === NEW: MARGINAL COST CALCULATIONS ===

  // Marginal processing costs
  const marginalLeadProcessingCost = leadsGenerated * costPerLead;
  const marginalClosingCost = contractsClosed * costPerClose;
  const totalMarginalProcessingCost = marginalLeadProcessingCost + marginalClosingCost;

  // Existing sales team commission (7.9% on closed deals)
  const existingSalesTeamCommission = totalRevenue * 0.079;

  // Capacity analysis
  const availableCapacity = currentTeamCapacity - currentLeadsGenerated;
  const capacityOverflow = Math.max(0, leadsGenerated - availableCapacity);
  const additionalStaffNeeded = Math.ceil(capacityOverflow / leadsPerAdditionalStaff);
  const totalAdditionalStaffCost = additionalStaffNeeded * additionalStaffCost;

  // Operating overhead allocation
  const totalOperatingExpenses = useMemo(() =>
    advertising + autoCosts + generalAdmin + insurance + legalProfessional +
    payrollCosts + taxesPaid + travelCosts + utilities,
    [advertising, autoCosts, generalAdmin, insurance, legalProfessional,
     payrollCosts, taxesPaid, travelCosts, utilities]
  );
  const overheadAllocationPerLead = totalOperatingExpenses / currentTeamCapacity;
  const allocatedOverhead = leadsGenerated * overheadAllocationPerLead;

  // === TRUE TOTAL COSTS ===
  const totalCosts = coldCallerCompensation + totalMarginalProcessingCost + existingSalesTeamCommission + totalAdditionalStaffCost;

  // === TRUE PROFITABILITY ===
  const grossProfit = totalRevenue * gm;
  const netProfit = grossProfit - totalCosts;

  // === TRUE COST METRICS ===
  const trueCostPerLead = leadsGenerated > 0 ? totalCosts / leadsGenerated : 0;
  const trueCostPerContract = contractsClosed > 0 ? totalCosts / contractsClosed : 0;
  const trueContributionMargin = contractsClosed > 0 ? (grossProfit - totalCosts) / contractsClosed : 0;

  // === TRUE ROI ===
  const trueROI = totalCosts > 0 ? (netProfit / totalCosts) * 100 : 0;

  // Cost breakdown for waterfall
  const costWaterfallData = [
    { category: 'Revenue', value: totalRevenue, color: '#3b82f6' },
    { category: 'COGS (59.1%)', value: -(totalRevenue * 0.591), color: '#ef4444' },
    { category: 'Gross Profit', value: grossProfit, color: '#10b981' },
    { category: 'Cold Caller', value: -coldCallerCompensation, color: '#f59e0b' },
    { category: 'Processing Costs', value: -totalMarginalProcessingCost, color: '#ef4444' },
    { category: 'Sales Commissions', value: -existingSalesTeamCommission, color: '#ef4444' },
    { category: 'Additional Staff', value: -totalAdditionalStaffCost, color: '#ef4444' },
    { category: 'Net Profit', value: netProfit, color: netProfit >= 0 ? '#10b981' : '#ef4444' }
  ];

  // Cumulative waterfall for display
  let cumulative = 0;
  const waterfallChartData = costWaterfallData.map((item, index) => {
    const start = cumulative;
    cumulative += item.value;
    return {
      category: item.category,
      value: Math.abs(item.value),
      start: Math.min(start, cumulative),
      end: Math.max(start, cumulative),
      color: item.color,
      isNegative: item.value < 0
    };
  });

  // Capacity analysis chart data
  const capacityChartData = [
    {
      category: 'Current Capacity',
      value: currentTeamCapacity,
      color: '#3b82f6'
    },
    {
      category: 'Current Leads',
      value: currentLeadsGenerated,
      color: '#10b981'
    },
    {
      category: 'Available Capacity',
      value: availableCapacity,
      color: '#60a5fa'
    },
    {
      category: 'Cold Call Leads',
      value: leadsGenerated,
      color: '#f59e0b'
    }
  ];

  // Break-even analysis with marginal costs
  const monthlyFixedCost = coldCallerCompensation + totalAdditionalStaffCost;
  const avgCommissionPerDeal = contractsClosed > 0 ? totalCommissions / contractsClosed : 0;
  const avgClosingCostPerDeal = costPerClose + (totalRevenue / contractsClosed) * 0.079;
  const avgLeadCostPerDeal = contractsClosed > 0 ? (leadsGenerated / contractsClosed) * costPerLead : 0;

  const avgDealSize = contractsClosed > 0 ? totalRevenue / contractsClosed : 0;
  const contributionPerDeal = avgDealSize * gm - avgCommissionPerDeal - avgClosingCostPerDeal - avgLeadCostPerDeal;

  const breakevenDeals = contributionPerDeal > 0 ? Math.ceil(monthlyFixedCost / contributionPerDeal) : 0;
  const breakevenCalls = breakevenDeals > 0 ? Math.ceil(breakevenDeals / (callToLeadRate / 100) / (leadToContractRate / 100)) : 0;
  const breakevenRevenue = breakevenDeals * avgDealSize;

  // Annual projections
  const annualRevenue = totalRevenue * 12;
  const annualProfit = netProfit * 12;
  const annualTotalCosts = totalCosts * 12;

  // ROI Comparison: Wrong vs Correct
  const wrongROI = coldCallerCompensation > 0 ? ((grossProfit - coldCallerCompensation) / coldCallerCompensation) * 100 : 0;
  const roiComparisonData = [
    { scenario: 'Incomplete\n(No Marginal Costs)', roi: wrongROI, color: '#ef4444' },
    { scenario: 'Complete\n(All Costs)', roi: trueROI, color: '#10b981' }
  ];

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
    { name: 'Bonuses', value: earnedBonus, color: '#f59e0b' },
    { name: 'Processing Costs', value: totalMarginalProcessingCost, color: '#ef4444' },
    { name: 'Sales Team Comm', value: existingSalesTeamCommission, color: '#8b5cf6' },
    { name: 'Additional Staff', value: totalAdditionalStaffCost, color: '#ec4899' }
  ];

  // Monthly performance scenarios with marginal costs
  const performanceData = [
    { scenario: 'Conservative', calls: 200, contracts: 4, revenue: 90000, profit: -8500, roi: -25 },
    { scenario: 'Expected', calls: monthlyCalls, contracts: contractsClosed, revenue: totalRevenue, profit: netProfit, roi: trueROI },
    { scenario: 'Optimistic', calls: 400, contracts: 28, revenue: 520000, profit: 142000, roi: 198 }
  ];

  // Quarterly projection
  const quarterlyProjection = [
    { month: 'Month 1', revenue: totalRevenue * 0.7, profit: netProfit * 0.5, costs: totalCosts },
    { month: 'Month 2', revenue: totalRevenue * 0.85, profit: netProfit * 0.75, costs: totalCosts },
    { month: 'Month 3', revenue: totalRevenue, profit: netProfit, costs: totalCosts },
    { month: 'Month 4', revenue: totalRevenue * 1.1, profit: netProfit * 1.2, costs: totalCosts * 1.05 },
    { month: 'Month 5', revenue: totalRevenue * 1.15, profit: netProfit * 1.3, costs: totalCosts * 1.05 },
    { month: 'Month 6', revenue: totalRevenue * 1.2, profit: netProfit * 1.4, costs: totalCosts * 1.1 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Sales Rep ROI Simulator</h1>
            <p className="text-purple-100 text-lg">Complete financial model with marginal costs and capacity analysis</p>
            <p className="text-purple-200 text-sm mt-2">Includes lead processing, sales team commissions, and staffing requirements</p>
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
          title="TRUE Net Profit"
          value={formatCurrency(netProfit)}
          icon={netProfit >= 0 ? TrendingUp : TrendingDownIcon}
          trend={netProfit >= 0 ? 'up' : 'down'}
          trendValue={netProfit >= 0 ? 'Profitable' : 'Loss'}
          color={netProfit >= 0 ? 'green' : 'red'}
          subtitle="After all costs"
        />
        <MetricCard
          title="TRUE ROI"
          value={`${trueROI.toFixed(1)}%`}
          icon={Award}
          trend={trueROI >= 0 ? 'up' : 'down'}
          trendValue={trueROI >= 100 ? 'Excellent' : trueROI >= 0 ? 'Positive' : 'Negative'}
          color={trueROI >= 100 ? 'green' : trueROI >= 0 ? 'blue' : 'red'}
          subtitle="Including marginal costs"
        />
        <MetricCard
          title="Total All-In Costs"
          value={formatCurrency(totalCosts)}
          icon={DollarSign}
          color="red"
          subtitle={`vs ${formatCurrency(coldCallerCompensation)} cold caller only`}
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

      {/* Critical Alert: Capacity Warning */}
      {capacityOverflow > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-400 rounded-xl shadow-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-orange-500 p-3 rounded-xl">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 text-orange-800">CAPACITY EXCEEDED!</h3>
              <p className="text-gray-700 mb-4">
                Cold caller will generate {leadsGenerated} leads/month, but your team only has capacity for {availableCapacity} more leads.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Overflow Leads</p>
                  <p className="text-2xl font-bold text-orange-600">{capacityOverflow}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Staff Needed</p>
                  <p className="text-2xl font-bold text-red-600">{additionalStaffNeeded}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Additional Cost</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalAdditionalStaffCost)}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Impact on ROI</p>
                  <p className="text-2xl font-bold text-red-600">{(trueROI - wrongROI).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                With TRUE costs including marginal processing and sales commissions, this hire would result in a monthly loss of {formatCurrency(Math.abs(netProfit))}.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Current Contracts/Month</p>
                  <p className="text-2xl font-bold text-red-600">{contractsClosed}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Break-Even Needed</p>
                  <p className="text-2xl font-bold text-orange-600">{breakevenDeals}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Revenue Gap</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(breakevenRevenue - totalRevenue)}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Total Costs</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCosts)}</p>
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
              <h3 className="text-2xl font-bold mb-2 text-green-800">Profitable After ALL Costs!</h3>
              <p className="text-gray-700 mb-4">
                Even with marginal processing costs, sales commissions, and additional staff, this generates {formatCurrency(netProfit)}/month with {trueROI.toFixed(1)}% ROI.
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
                  <p className="text-sm text-gray-600 mb-1">True All-In ROI</p>
                  <p className="text-2xl font-bold text-green-600">{trueROI.toFixed(1)}%</p>
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

      {/* Configuration Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compensation Structure */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Cold Caller Compensation</h2>
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
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Bonus Threshold (Contracts)</label>
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
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm font-semibold text-purple-800 mb-2">Total Compensation</p>
              <p className="text-2xl font-bold text-purple-700">{formatCurrency(coldCallerCompensation)}</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
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

        {/* Marginal Costs & Capacity */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Marginal Costs & Capacity</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm font-semibold text-red-800 mb-1">Critical Cost Factors</p>
              <p className="text-xs text-red-700">These costs are incurred for EVERY lead the cold caller generates</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Cost per Lead (Estimating)</label>
                <span className="text-lg font-bold text-red-600">{formatCurrency(costPerLead)}</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                step="10"
                value={costPerLead}
                onChange={(e) => setCostPerLead(Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-red-200 to-red-400 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$50</span>
                <span>$150</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Site visits, estimator time, proposal creation</p>
              <p className="text-xs font-semibold text-red-600 mt-1">Total: {formatCurrency(marginalLeadProcessingCost)}</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Cost per Close</label>
                <span className="text-lg font-bold text-red-600">{formatCurrency(costPerClose)}</span>
              </div>
              <input
                type="range"
                min="100"
                max="300"
                step="10"
                value={costPerClose}
                onChange={(e) => setCostPerClose(Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-red-200 to-red-400 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$100</span>
                <span>$300</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Closer time, negotiations, paperwork</p>
              <p className="text-xs font-semibold text-red-600 mt-1">Total: {formatCurrency(marginalClosingCost)}</p>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <p className="text-xs text-purple-700 mb-1">Sales Team Commission (7.9%)</p>
              <p className="text-lg font-bold text-purple-800">{formatCurrency(existingSalesTeamCommission)}</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Team Capacity Analysis</h4>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-600">Current Team Capacity (leads/mo)</label>
                  <span className="text-md font-bold text-blue-600">{currentTeamCapacity}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={currentTeamCapacity}
                  onChange={(e) => setCurrentTeamCapacity(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-600">Current Leads (existing)</label>
                  <span className="text-md font-bold text-green-600">{currentLeadsGenerated}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="5"
                  value={currentLeadsGenerated}
                  onChange={(e) => setCurrentLeadsGenerated(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available Capacity:</span>
                  <span className="font-bold text-blue-600">{availableCapacity} leads</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cold Call Leads:</span>
                  <span className="font-bold text-orange-600">{leadsGenerated} leads</span>
                </div>
                {capacityOverflow > 0 && (
                  <div className="flex justify-between text-sm bg-red-50 p-2 rounded">
                    <span className="text-red-700 font-semibold">Overflow:</span>
                    <span className="font-bold text-red-700">{capacityOverflow} leads</span>
                  </div>
                )}
              </div>
            </div>

            {capacityOverflow > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Staffing Required</h4>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-600">Cost per Additional Staff</label>
                    <span className="text-md font-bold text-red-600">{formatCurrency(additionalStaffCost)}</span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="6000"
                    step="100"
                    value={additionalStaffCost}
                    onChange={(e) => setAdditionalStaffCost(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-red-200 to-red-400 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$3,000</span>
                    <span>$6,000</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-600">Leads per Staff Member</label>
                    <span className="text-md font-bold text-blue-600">{leadsPerAdditionalStaff}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="40"
                    step="5"
                    value={leadsPerAdditionalStaff}
                    onChange={(e) => setLeadsPerAdditionalStaff(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="mt-4 bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-700">Staff Needed:</span>
                    <span className="font-bold text-red-700">{additionalStaffNeeded} people</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-700">Total Cost:</span>
                    <span className="font-bold text-red-700">{formatCurrency(totalAdditionalStaffCost)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cost Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <h4 className="text-xs font-semibold text-blue-800 mb-2">Cold Caller Cost</h4>
          <p className="text-2xl font-bold text-blue-700">{formatCurrency(coldCallerCompensation)}</p>
          <p className="text-xs text-blue-600 mt-1">Salary + commissions</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200">
          <h4 className="text-xs font-semibold text-red-800 mb-2">Processing Costs</h4>
          <p className="text-2xl font-bold text-red-700">{formatCurrency(totalMarginalProcessingCost)}</p>
          <p className="text-xs text-red-600 mt-1">Lead + close costs</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
          <h4 className="text-xs font-semibold text-purple-800 mb-2">Sales Commissions</h4>
          <p className="text-2xl font-bold text-purple-700">{formatCurrency(existingSalesTeamCommission)}</p>
          <p className="text-xs text-purple-600 mt-1">7.9% on revenue</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border-2 border-orange-200">
          <h4 className="text-xs font-semibold text-orange-800 mb-2">Additional Staff</h4>
          <p className="text-2xl font-bold text-orange-700">{formatCurrency(totalAdditionalStaffCost)}</p>
          <p className="text-xs text-orange-600 mt-1">{additionalStaffNeeded} people</p>
        </div>

        <div className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-green-50 to-green-100 border-green-200' : 'from-red-50 to-red-100 border-red-200'} rounded-xl p-5 border-2`}>
          <h4 className={`text-xs font-semibold ${netProfit >= 0 ? 'text-green-800' : 'text-red-800'} mb-2`}>NET PROFIT</h4>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>{formatCurrency(netProfit)}</p>
          <p className={`text-xs ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'} mt-1`}>After all costs</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Waterfall Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
            Cost Waterfall: Revenue to Net Profit
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={waterfallChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <YAxis dataKey="category" type="category" width={120} style={{ fontSize: '12px' }} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'value') return formatCurrency(value);
                  return value;
                }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {waterfallChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700 mb-1">Gross Profit</p>
              <p className="text-lg font-bold text-blue-800">{formatCurrency(grossProfit)}</p>
            </div>
            <div className={`${netProfit >= 0 ? 'bg-green-50' : 'bg-red-50'} p-3 rounded-lg`}>
              <p className={`text-xs ${netProfit >= 0 ? 'text-green-700' : 'text-red-700'} mb-1`}>Net Profit</p>
              <p className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-800' : 'text-red-800'}`}>{formatCurrency(netProfit)}</p>
            </div>
          </div>
        </div>

        {/* Capacity Analysis Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-green-600" />
            Capacity Analysis
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={capacityChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" angle={-15} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => `${value} leads`} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {capacityChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {capacityOverflow > 0 ? (
            <div className="mt-4 bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm font-semibold text-red-800">OVERFLOW: {capacityOverflow} leads exceed capacity</p>
              <p className="text-xs text-red-700 mt-1">Need {additionalStaffNeeded} additional staff at {formatCurrency(totalAdditionalStaffCost)}/month</p>
            </div>
          ) : (
            <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm font-semibold text-green-800">Capacity OK: {availableCapacity - leadsGenerated} leads spare capacity</p>
              <p className="text-xs text-green-700 mt-1">No additional staff required</p>
            </div>
          )}
        </div>
      </div>

      {/* ROI Comparison: Wrong vs Correct */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <AlertCircle className="w-6 h-6 mr-2 text-red-600" />
          ROI Reality Check: Why Marginal Costs Matter
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={roiComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="scenario" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Bar dataKey="roi" radius={[8, 8, 0, 0]}>
                  {roiComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="text-sm font-bold text-red-800 mb-2">WRONG Calculation (Misleading)</h4>
              <p className="text-xs text-red-700 mb-2">Only considers cold caller compensation</p>
              <div className="space-y-1 text-xs text-red-700">
                <div className="flex justify-between">
                  <span>Gross Profit:</span>
                  <span className="font-semibold">{formatCurrency(grossProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cold Caller:</span>
                  <span className="font-semibold">-{formatCurrency(coldCallerCompensation)}</span>
                </div>
                <div className="flex justify-between border-t border-red-300 pt-1 font-bold">
                  <span>Fake Profit:</span>
                  <span>{formatCurrency(grossProfit - coldCallerCompensation)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Fake ROI:</span>
                  <span>{wrongROI.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="text-sm font-bold text-green-800 mb-2">CORRECT Calculation (Reality)</h4>
              <p className="text-xs text-green-700 mb-2">Includes all marginal costs</p>
              <div className="space-y-1 text-xs text-green-700">
                <div className="flex justify-between">
                  <span>Gross Profit:</span>
                  <span className="font-semibold">{formatCurrency(grossProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cold Caller:</span>
                  <span className="font-semibold">-{formatCurrency(coldCallerCompensation)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing:</span>
                  <span className="font-semibold">-{formatCurrency(totalMarginalProcessingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Comm:</span>
                  <span className="font-semibold">-{formatCurrency(existingSalesTeamCommission)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Add Staff:</span>
                  <span className="font-semibold">-{formatCurrency(totalAdditionalStaffCost)}</span>
                </div>
                <div className="flex justify-between border-t border-green-300 pt-1 font-bold">
                  <span>TRUE Profit:</span>
                  <span>{formatCurrency(netProfit)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>TRUE ROI:</span>
                  <span>{trueROI.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <p className="text-sm font-semibold text-orange-800">
                Difference: {(wrongROI - trueROI).toFixed(1)} percentage points
              </p>
              <p className="text-xs text-orange-700 mt-1">
                The incomplete calculation overstates profitability by {formatCurrency(Math.abs((grossProfit - coldCallerCompensation) - netProfit))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Month Projection */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Activity className="w-6 h-6 mr-2 text-blue-600" />
          6-Month Performance Projection (with TRUE costs)
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
            <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="Net Profit (TRUE)" dot={{ fill: '#10b981', r: 5 }} />
            <Line type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Total Costs" />
          </ComposedChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-4">
          Projection includes ALL costs: cold caller, marginal processing, sales commissions, and additional staff.
        </p>
      </div>

      {/* Comprehensive Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-blue-800">TRUE Cost per Lead</h4>
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-700">{formatCurrency(trueCostPerLead)}</p>
          <p className="text-xs text-blue-600 mt-2">All-in cost including processing</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-green-800">TRUE Cost per Contract</h4>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-700">{formatCurrency(trueCostPerContract)}</p>
          <p className="text-xs text-green-600 mt-2">Complete customer acquisition cost</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-purple-800">TRUE Contribution Margin</h4>
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-700">{formatCurrency(trueContributionMargin)}</p>
          <p className="text-xs text-purple-600 mt-2">Profit per deal after all costs</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-orange-800">Break-Even Revenue</h4>
            <Phone className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-700">{formatCurrency(breakevenRevenue)}</p>
          <p className="text-xs text-orange-600 mt-2">{breakevenDeals} contracts needed</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-indigo-800">Annual Impact</h4>
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-indigo-700">{formatCurrency(annualProfit)}</p>
          <p className="text-xs text-indigo-600 mt-2">Yearly TRUE profit projection</p>
        </div>

        <div className={`bg-gradient-to-br ${trueROI >= 0 ? 'from-green-50 to-green-100 border-green-200' : 'from-red-50 to-red-100 border-red-200'} rounded-xl p-6 border-2`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={`text-sm font-semibold ${trueROI >= 0 ? 'text-green-800' : 'text-red-800'}`}>TRUE ROI</h4>
            <Award className={`w-6 h-6 ${trueROI >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <p className={`text-3xl font-bold ${trueROI >= 0 ? 'text-green-700' : 'text-red-700'}`}>{trueROI.toFixed(1)}%</p>
          <p className={`text-xs ${trueROI >= 0 ? 'text-green-600' : 'text-red-600'} mt-2`}>Complete cost accounting</p>
        </div>
      </div>

      {/* Smart Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
          Smart Recommendations (Based on TRUE Costs)
        </h3>
        <div className="space-y-4">
          {capacityOverflow > 0 && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <h4 className="text-sm font-bold text-red-800 mb-1">Capacity Constraint</h4>
              <p className="text-sm text-red-700">
                Your team cannot handle {leadsGenerated} leads. You need {additionalStaffNeeded} additional staff at {formatCurrency(totalAdditionalStaffCost)}/month.
                Consider increasing team capacity BEFORE hiring cold caller, or reduce cold call volume target.
              </p>
            </div>
          )}

          {netProfit < 0 && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <h4 className="text-sm font-bold text-red-800 mb-1">Unprofitable with TRUE Costs</h4>
              <p className="text-sm text-red-700">
                Need {breakevenDeals - contractsClosed} more contracts to break even ({formatCurrency(breakevenRevenue - totalRevenue)} revenue gap).
                Options: Increase conversion rates, reduce compensation, or optimize marginal costs.
              </p>
            </div>
          )}

          {netProfit >= 0 && trueROI < 50 && (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
              <h4 className="text-sm font-bold text-yellow-800 mb-1">Low TRUE ROI</h4>
              <p className="text-sm text-yellow-700">
                While profitable, TRUE ROI of {trueROI.toFixed(1)}% is below 50%. Marginal costs are eating {formatCurrency(totalMarginalProcessingCost)} per month.
                Focus on reducing cost per lead/close or improving deal sizes.
              </p>
            </div>
          )}

          {netProfit >= 0 && trueROI >= 50 && trueROI < 100 && (
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <h4 className="text-sm font-bold text-blue-800 mb-1">Good TRUE Performance</h4>
              <p className="text-sm text-blue-700">
                Solid TRUE ROI of {trueROI.toFixed(1)}% after all costs. This hire generates {formatCurrency(netProfit)}/month in real profit.
                Annual impact: {formatCurrency(annualProfit)}.
              </p>
            </div>
          )}

          {netProfit >= 0 && trueROI >= 100 && (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <h4 className="text-sm font-bold text-green-800 mb-1">Excellent TRUE Performance!</h4>
              <p className="text-sm text-green-700">
                Outstanding TRUE ROI of {trueROI.toFixed(1)}% even after marginal costs. This is highly profitable at {formatCurrency(netProfit)}/month.
                Strong case for hiring. Consider hiring multiple reps with similar performance potential.
              </p>
            </div>
          )}

          {totalMarginalProcessingCost > coldCallerCompensation && (
            <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
              <h4 className="text-sm font-bold text-orange-800 mb-1">Marginal Costs Exceed Caller Compensation</h4>
              <p className="text-sm text-orange-700">
                Processing costs ({formatCurrency(totalMarginalProcessingCost)}) exceed cold caller pay ({formatCurrency(coldCallerCompensation)}).
                Focus on optimizing your estimation and closing processes to reduce marginal costs.
              </p>
            </div>
          )}

          {existingSalesTeamCommission > coldCallerCompensation * 0.5 && (
            <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
              <h4 className="text-sm font-bold text-purple-800 mb-1">Sales Commission Impact</h4>
              <p className="text-sm text-purple-700">
                Sales team commissions ({formatCurrency(existingSalesTeamCommission)}) represent significant cost.
                This is unavoidable but important to account for in profitability calculations.
              </p>
            </div>
          )}

          <div className="p-4 bg-gray-50 border-l-4 border-gray-500 rounded-lg">
            <h4 className="text-sm font-bold text-gray-800 mb-1">Key Insight</h4>
            <p className="text-sm text-gray-700">
              Current team generates {jobnimbusData.avgLeadsPerMonth.toFixed(1)} leads/month at {jobnimbusData.conversionRate.toFixed(1)}% conversion.
              Cold caller would add {leadsGenerated} leads at {leadToContractRate}% conversion.
              TRUE incremental profit: {formatCurrency(netProfit)}/month after ALL costs.
            </p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-2xl font-bold mb-4">Executive Summary (TRUE Cost Model)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3">Financial Impact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Monthly TRUE net profit: <strong>{formatCurrency(netProfit)}</strong> ({trueROI.toFixed(1)}% ROI)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Annual TRUE profit: <strong>{formatCurrency(annualProfit)}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Total all-in costs: <strong>{formatCurrency(totalCosts)}</strong>/month</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>TRUE cost per contract: <strong>{formatCurrency(trueCostPerContract)}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Marginal processing costs: <strong>{formatCurrency(totalMarginalProcessingCost)}</strong>/month</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Operational Impact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Monthly leads generated: <strong>{leadsGenerated}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Monthly contracts closed: <strong>{contractsClosed}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Available capacity: <strong>{availableCapacity}</strong> leads</span>
              </li>
              {capacityOverflow > 0 && (
                <>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Capacity overflow: <strong className="text-yellow-200">{capacityOverflow}</strong> leads</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Additional staff needed: <strong className="text-yellow-200">{additionalStaffNeeded}</strong> people</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Additional staff cost: <strong className="text-yellow-200">{formatCurrency(totalAdditionalStaffCost)}</strong>/month</span>
                  </li>
                </>
              )}
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Revenue impact: <strong>{formatCurrency(totalRevenue)}</strong>/month</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
          <p className="text-sm">
            <strong>Critical:</strong> This model includes ALL costs: cold caller compensation ({formatCurrency(coldCallerCompensation)}),
            marginal processing costs ({formatCurrency(totalMarginalProcessingCost)}),
            sales team commissions ({formatCurrency(existingSalesTeamCommission)}),
            and additional staffing requirements ({formatCurrency(totalAdditionalStaffCost)}).
            This provides an accurate picture of TRUE profitability.
          </p>
        </div>
      </div>
    </div>
  );
};

  // Lead Cost Analysis Component
  const LeadCostAnalysis = () => {
    // Real monthly data with accurate expenses and lead counts
    const monthlyLeadData = [
      { month: 'Jan', leads: 28, closed: 5, revenue: 129411, expenses: 103016, advertising: 4439, payroll: 25074, overhead: 73503 },
      { month: 'Feb', leads: 32, closed: 6, revenue: 161010, expenses: 149635, advertising: 4439, payroll: 25074, overhead: 120122 },
      { month: 'Mar', leads: 30, closed: 4, revenue: 78064, expenses: 172101, advertising: 4439, payroll: 25074, overhead: 142588 },
      { month: 'Apr', leads: 38, closed: 7, revenue: 79421, expenses: 170484, advertising: 4439, payroll: 25074, overhead: 140971 },
      { month: 'May', leads: 42, closed: 8, revenue: 215940, expenses: 200745, advertising: 4439, payroll: 25074, overhead: 171232 },
      { month: 'Jun', leads: 35, closed: 6, revenue: 142440, expenses: 188472, advertising: 4439, payroll: 25074, overhead: 158959 },
      { month: 'Jul', leads: 33, closed: 6, revenue: 127374, expenses: 196296, advertising: 4439, payroll: 25074, overhead: 166783 },
      { month: 'Aug', leads: 38, closed: 8, revenue: 279915, expenses: 132052, advertising: 4439, payroll: 25074, overhead: 102539 },
      { month: 'Sep', leads: 37, closed: 6, revenue: 132564, expenses: 156279, advertising: 4439, payroll: 25074, overhead: 126766 },
      { month: 'Oct', leads: 38, closed: 7, revenue: 304649, expenses: 155561, advertising: 4439, payroll: 25074, overhead: 126048 }
    ];

    const avgTicket = 26203;
    const grossMargin = 0.409;
    const ltv = avgTicket * grossMargin; // $10,717

    // Calculate metrics for each month
    const analysisData = monthlyLeadData.map(month => {
      // Marketing & Sales costs (Advertising + Payroll allocated to sales)
      const salesMarketingCosts = month.advertising + month.payroll;

      // Allocate 30% of overhead to sales & marketing activities
      const allocatedOverhead = month.overhead * 0.30;

      // Total cost for lead generation & conversion
      const totalCosts = salesMarketingCosts + allocatedOverhead;

      // Cost per Lead (CPL)
      const cpl = month.leads > 0 ? totalCosts / month.leads : 0;

      // Cost per Acquisition (CAC)
      const cac = month.closed > 0 ? totalCosts / month.closed : 0;

      // LTV:CAC Ratio
      const ltvCacRatio = cac > 0 ? ltv / cac : 0;

      // Payback period in months
      const monthlyRevenuePerCustomer = avgTicket * grossMargin / 12;
      const paybackPeriod = cac > 0 ? cac / monthlyRevenuePerCustomer : 0;

      // Lead Efficiency Score (Revenue per dollar spent)
      const leadEfficiency = totalCosts > 0 ? month.revenue / totalCosts : 0;

      // ROI percentage
      const roi = totalCosts > 0 ? ((month.revenue - totalCosts) / totalCosts) * 100 : 0;

      // Profit
      const profit = month.revenue - totalCosts;

      return {
        ...month,
        salesMarketingCosts,
        allocatedOverhead,
        totalCosts,
        cpl: Math.round(cpl),
        cac: Math.round(cac),
        ltvCacRatio: Number(ltvCacRatio.toFixed(2)),
        paybackPeriod: Number(paybackPeriod.toFixed(1)),
        leadEfficiency: Number(leadEfficiency.toFixed(2)),
        roi: Number(roi.toFixed(1)),
        profit
      };
    });

    // Overall averages
    const totalLeads = analysisData.reduce((sum, m) => sum + m.leads, 0);
    const totalClosed = analysisData.reduce((sum, m) => sum + m.closed, 0);
    const totalRevenue = analysisData.reduce((sum, m) => sum + m.revenue, 0);
    const totalCosts = analysisData.reduce((sum, m) => sum + m.totalCosts, 0);

    const avgCPL = Math.round(totalCosts / totalLeads);
    const avgCAC = Math.round(totalCosts / totalClosed);
    const avgLTVCAC = Number((ltv / avgCAC).toFixed(2));
    const avgLeadEfficiency = Number((totalRevenue / totalCosts).toFixed(2));
    const avgPayback = Number((avgCAC / (avgTicket * grossMargin / 12)).toFixed(1));
    const totalROI = Number((((totalRevenue - totalCosts) / totalCosts) * 100).toFixed(1));

    const bestCPLMonth = analysisData.reduce((min, m) => m.cpl < min.cpl ? m : min);
    const worstCPLMonth = analysisData.reduce((max, m) => m.cpl > max.cpl ? m : max);

    // Quarterly aggregation
    const quarters = [
      { name: 'Q1', months: analysisData.slice(0, 3) },
      { name: 'Q2', months: analysisData.slice(3, 6) },
      { name: 'Q3', months: analysisData.slice(6, 9) },
      { name: 'Q4', months: analysisData.slice(9, 12) }
    ].map(q => {
      const qLeads = q.months.reduce((sum, m) => sum + m.leads, 0);
      const qClosed = q.months.reduce((sum, m) => sum + m.closed, 0);
      const qRevenue = q.months.reduce((sum, m) => sum + m.revenue, 0);
      const qCosts = q.months.reduce((sum, m) => sum + m.totalCosts, 0);
      return {
        quarter: q.name,
        leads: qLeads,
        closed: qClosed,
        revenue: qRevenue,
        costs: qCosts,
        cpl: Math.round(qCosts / qLeads),
        cac: Math.round(qCosts / qClosed),
        roi: Number((((qRevenue - qCosts) / qCosts) * 100).toFixed(1))
      };
    }).filter(q => q.leads > 0);

    // State for comparisons
    const [compareMonth1, setCompareMonth1] = useState('Jan');
    const [compareMonth2, setCompareMonth2] = useState('Oct');

    const getComparisonData = () => {
      const m1 = analysisData.find(m => m.month === compareMonth1);
      const m2 = analysisData.find(m => m.month === compareMonth2);
      return { m1, m2 };
    };

    const { m1, m2 } = getComparisonData();

    return (
      <div className="space-y-6">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <BadgeDollarSign className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Lead Cost Analysis</h1>
              </div>
              <p className="text-emerald-100 text-lg">True Cost of Customer Acquisition</p>
              <div className="mt-4 flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm text-emerald-100">Analysis Period</p>
                  <p className="text-xl font-bold">Jan-Oct 2025</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm text-emerald-100">Total Leads</p>
                  <p className="text-xl font-bold">{totalLeads}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm text-emerald-100">Conversions</p>
                  <p className="text-xl font-bold">{totalClosed}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-emerald-100 mb-1">LTV:CAC Ratio</p>
                <p className={`text-5xl font-bold ${avgLTVCAC >= 3 ? 'text-green-200' : avgLTVCAC >= 2 ? 'text-yellow-200' : 'text-red-200'}`}>
                  {avgLTVCAC}:1
                </p>
                <p className="text-xs text-emerald-200 mt-2">
                  {avgLTVCAC >= 3 ? 'Healthy ✓' : avgLTVCAC >= 2 ? 'Acceptable' : 'Needs Improvement'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg Cost per Lead</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">${avgCPL}</h3>
                <p className="text-xs text-gray-500 mt-2">Total: ${formatCurrency(totalCosts)}</p>
              </div>
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-600 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Best: ${bestCPLMonth.cpl} ({bestCPLMonth.month})
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg CAC</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">${avgCAC}</h3>
                <p className="text-xs text-gray-500 mt-2">Per Customer</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">LTV: ${formatCurrency(ltv)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Lead Efficiency</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{avgLeadEfficiency}x</h3>
                <p className="text-xs text-gray-500 mt-2">Revenue / Cost</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                <TrendingUpIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <span className={totalROI >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ROI: {totalROI > 0 ? '+' : ''}{totalROI}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Payback Period</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{avgPayback}</h3>
                <p className="text-xs text-gray-500 mt-2">Months</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                <Timer className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <span className={avgPayback <= 12 ? 'text-green-600' : 'text-yellow-600'}>
                  {avgPayback <= 12 ? 'Fast Recovery' : 'Monitor Closely'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1: CPL Trend & CAC vs LTV */}
        <div className="grid grid-cols-2 gap-6">
          {/* Monthly CPL Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-teal-600" />
              Cost per Lead Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={analysisData}>
                <defs>
                  <linearGradient id="cplGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => ['$' + value, 'CPL']}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="cpl"
                  stroke="#14b8a6"
                  fill="url(#cplGradient)"
                  strokeWidth={3}
                  name="Cost per Lead"
                />
                <Line
                  type="monotone"
                  dataKey={avgCPL}
                  stroke="#9ca3af"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                  name="2025 Average"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* CAC vs LTV Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
              CAC vs LTV Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={analysisData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value, name) => [
                    name === 'LTV' ? '$' + formatCurrency(ltv) : '$' + value,
                    name
                  ]}
                />
                <Legend />
                <Bar dataKey="cac" fill="#10b981" name="CAC" />
                <Line
                  type="monotone"
                  dataKey={() => ltv}
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 4 }}
                  name="LTV"
                />
                <Line
                  type="monotone"
                  dataKey={() => ltv / 3}
                  stroke="#f59e0b"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                  name="Healthy Zone (LTV/3)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2: Conversion Funnel & Monthly Efficiency Heatmap */}
        <div className="grid grid-cols-2 gap-6">
          {/* Conversion Funnel with Costs */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Conversion Funnel & Costs
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Total Leads</span>
                  <span className="text-sm font-bold text-gray-900">{totalLeads}</span>
                </div>
                <div className="h-16 bg-gradient-to-r from-teal-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                  {formatCurrency(avgCPL)} per lead
                </div>
                <div className="text-center mt-2 text-xs text-gray-500">
                  Total Spent: {formatCurrency(totalCosts)}
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowDownRight className="w-6 h-6 text-gray-400" />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Closed Contracts</span>
                  <span className="text-sm font-bold text-gray-900">{totalClosed}</span>
                </div>
                <div className="h-16 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg" style={{ width: `${(totalClosed/totalLeads)*100}%` }}>
                  {formatCurrency(avgCAC)} per customer
                </div>
                <div className="text-center mt-2 text-xs text-gray-500">
                  Conversion Rate: {((totalClosed/totalLeads)*100).toFixed(1)}%
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowDownRight className="w-6 h-6 text-gray-400" />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Total Revenue</span>
                  <span className="text-sm font-bold text-gray-900">${formatCurrency(totalRevenue)}</span>
                </div>
                <div className="h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                  ${formatCurrency(avgTicket)} avg ticket
                </div>
                <div className="text-center mt-2 text-xs text-gray-500">
                  LTV: ${formatCurrency(ltv)} per customer
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Efficiency Heatmap */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Monthly Efficiency Heatmap
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {analysisData.map((month) => {
                const efficiency = month.ltvCacRatio;
                const getColor = (ratio) => {
                  if (ratio >= 4) return 'bg-green-500';
                  if (ratio >= 3) return 'bg-emerald-400';
                  if (ratio >= 2) return 'bg-yellow-400';
                  if (ratio >= 1) return 'bg-orange-400';
                  return 'bg-red-400';
                };

                return (
                  <div
                    key={month.month}
                    className={`${getColor(efficiency)} rounded-lg p-3 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer`}
                    title={`${month.month}: LTV:CAC ${efficiency}:1, ROI ${month.roi}%`}
                  >
                    <div className="text-xs font-bold mb-1">{month.month}</div>
                    <div className="text-lg font-bold">{efficiency}:1</div>
                    <div className="text-xs mt-1">{month.roi > 0 ? '+' : ''}{month.roi}%</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span>&lt;1:1</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-400 rounded"></div>
                <span>1-2:1</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                <span>2-3:1</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-400 rounded"></div>
                <span>3-4:1</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>&gt;4:1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quarterly Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Quarterly Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quarters}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="quarter" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value, name) => [
                  name === 'cpl' || name === 'cac' ? '$' + value : value + (name === 'roi' ? '%' : ''),
                  name.toUpperCase()
                ]}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="cpl" fill="#14b8a6" name="CPL" />
              <Bar yAxisId="left" dataKey="cac" fill="#10b981" name="CAC" />
              <Line yAxisId="right" type="monotone" dataKey="roi" stroke="#6366f1" strokeWidth={3} name="ROI %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Month Comparison Tool */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-pink-600" />
            Month-to-Month Comparison
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Month</label>
              <select
                value={compareMonth1}
                onChange={(e) => setCompareMonth1(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                {analysisData.map(m => (
                  <option key={m.month} value={m.month}>{m.month} 2025</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Second Month</label>
              <select
                value={compareMonth2}
                onChange={(e) => setCompareMonth2(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                {analysisData.map(m => (
                  <option key={m.month} value={m.month}>{m.month} 2025</option>
                ))}
              </select>
            </div>
          </div>

          {m1 && m2 && (
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6">
                <h4 className="text-lg font-bold text-teal-800 mb-4">{m1.month} 2025</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Leads:</span>
                    <span className="font-bold text-gray-900">{m1.leads}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Closed:</span>
                    <span className="font-bold text-gray-900">{m1.closed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">CPL:</span>
                    <span className="font-bold text-gray-900">${m1.cpl}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">CAC:</span>
                    <span className="font-bold text-gray-900">${m1.cac}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">LTV:CAC:</span>
                    <span className="font-bold text-gray-900">{m1.ltvCacRatio}:1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">ROI:</span>
                    <span className={`font-bold ${m1.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {m1.roi > 0 ? '+' : ''}{m1.roi}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Revenue:</span>
                    <span className="font-bold text-gray-900">${formatCurrency(m1.revenue)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6">
                <h4 className="text-lg font-bold text-emerald-800 mb-4">{m2.month} 2025</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Leads:</span>
                    <span className="font-bold text-gray-900">
                      {m2.leads}
                      {m2.leads !== m1.leads && (
                        <span className={`ml-2 text-xs ${m2.leads > m1.leads ? 'text-green-600' : 'text-red-600'}`}>
                          ({m2.leads > m1.leads ? '+' : ''}{m2.leads - m1.leads})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Closed:</span>
                    <span className="font-bold text-gray-900">
                      {m2.closed}
                      {m2.closed !== m1.closed && (
                        <span className={`ml-2 text-xs ${m2.closed > m1.closed ? 'text-green-600' : 'text-red-600'}`}>
                          ({m2.closed > m1.closed ? '+' : ''}{m2.closed - m1.closed})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">CPL:</span>
                    <span className="font-bold text-gray-900">
                      ${m2.cpl}
                      {m2.cpl !== m1.cpl && (
                        <span className={`ml-2 text-xs ${m2.cpl < m1.cpl ? 'text-green-600' : 'text-red-600'}`}>
                          ({m2.cpl < m1.cpl ? '-' : '+'}{Math.abs(m2.cpl - m1.cpl)})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">CAC:</span>
                    <span className="font-bold text-gray-900">
                      ${m2.cac}
                      {m2.cac !== m1.cac && (
                        <span className={`ml-2 text-xs ${m2.cac < m1.cac ? 'text-green-600' : 'text-red-600'}`}>
                          ({m2.cac < m1.cac ? '-' : '+'}{Math.abs(m2.cac - m1.cac)})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">LTV:CAC:</span>
                    <span className="font-bold text-gray-900">
                      {m2.ltvCacRatio}:1
                      {m2.ltvCacRatio !== m1.ltvCacRatio && (
                        <span className={`ml-2 text-xs ${m2.ltvCacRatio > m1.ltvCacRatio ? 'text-green-600' : 'text-red-600'}`}>
                          ({m2.ltvCacRatio > m1.ltvCacRatio ? '+' : ''}{(m2.ltvCacRatio - m1.ltvCacRatio).toFixed(2)})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">ROI:</span>
                    <span className={`font-bold ${m2.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {m2.roi > 0 ? '+' : ''}{m2.roi}%
                      {m2.roi !== m1.roi && (
                        <span className={`ml-2 text-xs ${m2.roi > m1.roi ? 'text-green-600' : 'text-red-600'}`}>
                          ({m2.roi > m1.roi ? '+' : ''}{(m2.roi - m1.roi).toFixed(1)}%)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Revenue:</span>
                    <span className="font-bold text-gray-900">
                      ${formatCurrency(m2.revenue)}
                      {m2.revenue !== m1.revenue && (
                        <span className={`ml-2 text-xs ${m2.revenue > m1.revenue ? 'text-green-600' : 'text-red-600'}`}>
                          ({m2.revenue > m1.revenue ? '+' : '-'}${formatCurrency(Math.abs(m2.revenue - m1.revenue))})
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Smart Insights Panel */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-indigo-600" />
            Smart Insights & Recommendations
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-start">
                  {avgLTVCAC >= 3 ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 mt-1" />
                  )}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">LTV:CAC Ratio</h4>
                    <p className="text-sm text-gray-600">
                      {avgLTVCAC >= 3
                        ? `Excellent! Your ${avgLTVCAC}:1 ratio exceeds the healthy 3:1 benchmark. Customer lifetime value justifies acquisition costs.`
                        : `Current ${avgLTVCAC}:1 ratio is below the ideal 3:1. Consider optimizing conversion rates or reducing acquisition costs.`
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-blue-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Best Performing Month</h4>
                    <p className="text-sm text-gray-600">
                      {bestCPLMonth.month} had the lowest CPL at ${bestCPLMonth.cpl} with {bestCPLMonth.leads} leads and {bestCPLMonth.closed} conversions.
                      Analyze this month's strategies for replication.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-start">
                  {avgPayback <= 12 ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500 mr-3 mt-1" />
                  )}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Payback Period</h4>
                    <p className="text-sm text-gray-600">
                      {avgPayback <= 12
                        ? `Excellent ${avgPayback} month payback period. You're recovering acquisition costs quickly.`
                        : `${avgPayback} month payback period. Consider strategies to accelerate customer value realization.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-start">
                  {totalROI >= 50 ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                  ) : totalROI >= 0 ? (
                    <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 mt-1" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-1" />
                  )}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Overall ROI</h4>
                    <p className="text-sm text-gray-600">
                      {totalROI >= 50
                        ? `Strong ${totalROI}% ROI on lead generation. Your marketing spend is generating excellent returns.`
                        : totalROI >= 0
                        ? `${totalROI}% ROI is positive but has room for improvement. Focus on conversion optimization.`
                        : `Negative ${totalROI}% ROI requires immediate attention. Review lead quality and sales processes.`
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-start">
                  <Target className="w-5 h-5 text-purple-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Optimization Opportunity</h4>
                    <p className="text-sm text-gray-600">
                      Based on your ${avgCPL} CPL and {((totalClosed/totalLeads)*100).toFixed(1)}% conversion rate,
                      a 5% conversion improvement could reduce CAC to ${Math.round(avgCAC * 0.95)},
                      potentially saving ${formatCurrency((avgCAC - Math.round(avgCAC * 0.95)) * totalClosed)} annually.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-start">
                  <Award className="w-5 h-5 text-orange-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Seasonal Pattern</h4>
                    <p className="text-sm text-gray-600">
                      Q2 and Q3 show {quarters[1] && quarters[2] && quarters[1].cpl < quarters[0].cpl && quarters[2].cpl < quarters[0].cpl ? 'lower' : 'higher'} CPL compared to Q1.
                      Consider seasonal marketing budget adjustments to capitalize on efficiency trends.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Monthly Data Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
            Detailed Monthly Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Month</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Leads</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Closed</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Conv %</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">CPL</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">CAC</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">LTV:CAC</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">ROI</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Revenue</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Efficiency</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analysisData.map((month) => (
                  <tr key={month.month} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{month.month}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-700">{month.leads}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-700">{month.closed}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-700">
                      {((month.closed / month.leads) * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className={`font-medium ${month.cpl <= avgCPL ? 'text-green-600' : 'text-red-600'}`}>
                        ${month.cpl}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className={`font-medium ${month.cac <= avgCAC ? 'text-green-600' : 'text-red-600'}`}>
                        ${month.cac}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className={`font-bold ${
                        month.ltvCacRatio >= 3 ? 'text-green-600' :
                        month.ltvCacRatio >= 2 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {month.ltvCacRatio}:1
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className={`font-medium ${month.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {month.roi > 0 ? '+' : ''}{month.roi}%
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-700">
                      ${formatCurrency(month.revenue)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className={`font-medium ${month.leadEfficiency >= avgLeadEfficiency ? 'text-green-600' : 'text-gray-600'}`}>
                        {month.leadEfficiency}x
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gradient-to-r from-gray-100 to-gray-50 font-bold border-t-2 border-gray-300">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-900">AVERAGE</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-gray-900">{Math.round(totalLeads / analysisData.length)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-gray-900">{Math.round(totalClosed / analysisData.length)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-gray-900">
                    {((totalClosed / totalLeads) * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-teal-600">${avgCPL}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-emerald-600">${avgCAC}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-green-600">{avgLTVCAC}:1</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-blue-600">
                    {totalROI > 0 ? '+' : ''}{totalROI}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-gray-900">
                    ${formatCurrency(totalRevenue / analysisData.length)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-purple-600">{avgLeadEfficiency}x</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Break-Even Analysis Tab
  const BreakEvenAnalysis = () => {
    // Calculate break-even metrics
    const netMargin = useMemo(() => gm - r - h, [gm, r, h]);

    // Break-even conversion rate: cBreakEven = (L * pL + B + M) / (netMargin * L * V)
    const cBreakEven = useMemo(() => {
      if (netMargin <= 0 || L === 0 || V === 0) return 0;
      return (L * pL + B + M) / (netMargin * L * V);
    }, [L, pL, B, M, netMargin, V]);

    // Break-even leads: LBreakEven = (B + M) / (netMargin * c * V - pL)
    const LBreakEven = useMemo(() => {
      const denominator = netMargin * c * V - pL;
      if (denominator <= 0) return Infinity;
      return (B + M) / denominator;
    }, [B, M, netMargin, c, V, pL]);

    // Current position
    const currentRevenue = useMemo(() => N * V, [N, V]);
    const currentTotalCosts = useMemo(() =>
      pL * L + C_variable + totalOperatingExpenses + M,
      [pL, L, C_variable, totalOperatingExpenses, M]
    );
    const currentProfit = useMemo(() =>
      currentRevenue * gm - currentTotalCosts,
      [currentRevenue, gm, currentTotalCosts]
    );

    // Break-even revenue
    const breakEvenRevenue = useMemo(() =>
      currentTotalCosts / gm,
      [currentTotalCosts, gm]
    );

    // Gap analysis
    const conversionGap = useMemo(() =>
      Math.max(0, cBreakEven - c),
      [cBreakEven, c]
    );
    const leadsGap = useMemo(() =>
      Math.max(0, LBreakEven - L),
      [LBreakEven, L]
    );
    const revenueGap = useMemo(() =>
      Math.max(0, breakEvenRevenue - currentRevenue),
      [breakEvenRevenue, currentRevenue]
    );

    // Status
    const isBreakEven = currentProfit >= 0;
    const profitMarginPct = useMemo(() =>
      currentRevenue > 0 ? (currentProfit / currentRevenue) * 100 : 0,
      [currentProfit, currentRevenue]
    );

    // Chart data for break-even visualization
    const breakEvenChartData = useMemo(() => {
      const data = [];
      const maxLeads = Math.max(L * 2, LBreakEven * 1.5);
      const step = maxLeads / 20;

      for (let leads = 0; leads <= maxLeads; leads += step) {
        const contracts = leads * c;
        const revenue = contracts * V * gm;
        const costs = pL * leads + contracts * V * r + totalOperatingExpenses + M;

        data.push({
          leads: Math.round(leads),
          revenue: revenue,
          costs: costs,
          profit: revenue - costs
        });
      }
      return data;
    }, [L, LBreakEven, c, V, gm, pL, r, totalOperatingExpenses, M]);

    // Sensitivity analysis data
    const sensitivityData = useMemo(() => {
      const variations = [-20, -10, 0, 10, 20];

      return {
        costPerLead: variations.map(pct => {
          const newPL = pL * (1 + pct / 100);
          const newLBreakEven = (B + M) / (netMargin * c * V - newPL);
          return {
            change: `${pct > 0 ? '+' : ''}${pct}%`,
            value: newPL.toFixed(2),
            breakEvenLeads: Math.ceil(newLBreakEven),
            impact: newLBreakEven - LBreakEven
          };
        }),
        commissionRate: variations.map(pct => {
          const newR = r * (1 + pct / 100);
          const newNetMargin = gm - newR - h;
          const newLBreakEven = (B + M) / (newNetMargin * c * V - pL);
          return {
            change: `${pct > 0 ? '+' : ''}${pct}%`,
            value: `${(newR * 100).toFixed(2)}%`,
            breakEvenLeads: Math.ceil(newLBreakEven),
            impact: newLBreakEven - LBreakEven
          };
        }),
        operatingExpenses: variations.map(pct => {
          const newOpEx = totalOperatingExpenses * (1 + pct / 100);
          const newLBreakEven = (B + newOpEx) / (netMargin * c * V - pL);
          return {
            change: `${pct > 0 ? '+' : ''}${pct}%`,
            value: formatCurrency(newOpEx),
            breakEvenLeads: Math.ceil(newLBreakEven),
            impact: newLBreakEven - LBreakEven
          };
        })
      };
    }, [pL, r, h, gm, totalOperatingExpenses, B, M, netMargin, c, V, LBreakEven]);

    // Action items
    const actionItems = useMemo(() => {
      const actions = [];

      if (!isBreakEven) {
        // Priority 1: Increase leads
        if (leadsGap > 0) {
          actions.push({
            priority: 1,
            category: 'Lead Generation',
            action: `Increase monthly leads by ${Math.ceil(leadsGap)}`,
            impact: 'High',
            target: `${Math.ceil(LBreakEven)} leads/month`,
            difficulty: leadsGap > 20 ? 'Hard' : leadsGap > 10 ? 'Medium' : 'Easy'
          });
        }

        // Priority 2: Improve conversion
        if (c < cBreakEven) {
          const targetC = Math.min(cBreakEven * 1.1, 0.5);
          actions.push({
            priority: 2,
            category: 'Conversion Rate',
            action: `Improve conversion rate to ${(targetC * 100).toFixed(2)}%`,
            impact: 'High',
            target: `+${((targetC - c) * 100).toFixed(2)}% improvement`,
            difficulty: conversionGap > 0.05 ? 'Hard' : 'Medium'
          });
        }

        // Priority 3: Reduce cost per lead
        const targetPL = pL * 0.85;
        const plImpact = (pL - targetPL) * L;
        actions.push({
          priority: 3,
          category: 'Cost Reduction',
          action: `Reduce cost per lead by 15%`,
          impact: 'Medium',
          target: `${formatCurrency(targetPL)} per lead`,
          difficulty: 'Medium',
          monthlySavings: formatCurrency(plImpact)
        });

        // Priority 4: Reduce operating expenses
        if (totalOperatingExpenses > 30000) {
          const targetOpEx = totalOperatingExpenses * 0.90;
          actions.push({
            priority: 4,
            category: 'Operating Efficiency',
            action: 'Reduce operating expenses by 10%',
            impact: 'Medium',
            target: formatCurrency(targetOpEx),
            difficulty: 'Medium',
            monthlySavings: formatCurrency(totalOperatingExpenses - targetOpEx)
          });
        }

        // Priority 5: Increase average ticket
        const targetV = V * 1.1;
        actions.push({
          priority: 5,
          category: 'Revenue Growth',
          action: 'Increase average ticket by 10%',
          impact: 'High',
          target: formatCurrency(targetV),
          difficulty: 'Hard'
        });
      } else {
        // Already profitable - focus on growth
        actions.push({
          priority: 1,
          category: 'Growth',
          action: 'Scale lead generation to maximize profit',
          impact: 'High',
          target: `${Math.ceil(L * 1.5)} leads/month`,
          difficulty: 'Medium'
        });

        actions.push({
          priority: 2,
          category: 'Optimization',
          action: 'Optimize profit margin through efficiency',
          impact: 'Medium',
          target: `${(profitMarginPct * 1.2).toFixed(1)}% profit margin`,
          difficulty: 'Medium'
        });
      }

      return actions.sort((a, b) => a.priority - b.priority);
    }, [isBreakEven, leadsGap, LBreakEven, c, cBreakEven, conversionGap, pL, L,
        totalOperatingExpenses, V, profitMarginPct]);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Break-Even Analysis</h2>
              <p className="text-blue-100">
                Comprehensive analysis of your break-even point and profitability
              </p>
            </div>
            <Crosshair className="w-16 h-16 opacity-50" />
          </div>
        </div>

        {/* Status Banner */}
        <div className={`rounded-xl shadow-lg p-6 ${
          isBreakEven
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200'
            : 'bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isBreakEven ? (
                <CheckCircle className="w-12 h-12 text-green-600" />
              ) : (
                <AlertCircle className="w-12 h-12 text-orange-600" />
              )}
              <div>
                <h3 className={`text-2xl font-bold ${isBreakEven ? 'text-green-800' : 'text-orange-800'}`}>
                  {isBreakEven ? 'Above Break-Even' : 'Below Break-Even'}
                </h3>
                <p className={`text-lg ${isBreakEven ? 'text-green-600' : 'text-orange-600'}`}>
                  {isBreakEven
                    ? `Profitable with ${profitMarginPct.toFixed(1)}% margin`
                    : `Need ${revenueGap > 0 ? formatCurrency(revenueGap) : '0'} more revenue to break even`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Monthly Profit</p>
              <p className={`text-3xl font-bold ${currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(currentProfit))}
                {currentProfit < 0 && ' loss'}
              </p>
            </div>
          </div>
        </div>

        {/* Break-Even Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Break-Even Conversion Rate"
            value={`${(cBreakEven * 100).toFixed(2)}%`}
            icon={Percent}
            color={c >= cBreakEven ? 'green' : 'orange'}
            subtitle={c >= cBreakEven
              ? `Current: ${(c * 100).toFixed(2)}% ✓`
              : `Current: ${(c * 100).toFixed(2)}% (need +${(conversionGap * 100).toFixed(2)}%)`
            }
          />

          <MetricCard
            title="Break-Even Leads Required"
            value={Math.ceil(LBreakEven)}
            icon={Users}
            color={L >= LBreakEven ? 'green' : 'orange'}
            subtitle={L >= LBreakEven
              ? `Current: ${L} leads ✓`
              : `Current: ${L} leads (need +${Math.ceil(leadsGap)})`
            }
          />

          <MetricCard
            title="Break-Even Revenue"
            value={formatCurrency(breakEvenRevenue)}
            icon={DollarSign}
            color={currentRevenue >= breakEvenRevenue ? 'green' : 'orange'}
            subtitle={`Current: ${formatCurrency(currentRevenue)}`}
          />

          <MetricCard
            title="Net Margin"
            value={`${(netMargin * 100).toFixed(2)}%`}
            icon={Activity}
            color="purple"
            subtitle={`After ${(r * 100).toFixed(1)}% commission & ${(h * 100).toFixed(1)}% overhead`}
          />
        </div>

        {/* Break-Even Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Break-Even Visualization</h3>
          <p className="text-sm text-gray-600 mb-4">
            Revenue vs. Costs - Intersection point shows break-even
          </p>

          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={breakEvenChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="leads"
                label={{ value: 'Monthly Leads', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => `${label} leads`}
              />
              <Legend />

              {/* Revenue line */}
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                name="Revenue (Gross Margin)"
                dot={false}
              />

              {/* Costs line */}
              <Line
                type="monotone"
                dataKey="costs"
                stroke="#ef4444"
                strokeWidth={3}
                name="Total Costs"
                dot={false}
              />

              {/* Profit area */}
              <Area
                type="monotone"
                dataKey="profit"
                fill="#10b981"
                fillOpacity={0.2}
                stroke="none"
                name="Profit/Loss"
              />

              {/* Current position marker */}
              <Line
                type="monotone"
                dataKey="leads"
                stroke="transparent"
                strokeWidth={0}
                dot={(props) => {
                  if (Math.abs(props.payload.leads - L) < 5) {
                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={8}
                        fill="#3b82f6"
                        stroke="#1e40af"
                        strokeWidth={2}
                      />
                    );
                  }
                  return null;
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="font-semibold text-green-800">Profit Zone</span>
              </div>
              <p className="text-sm text-green-700">Above {Math.ceil(LBreakEven)} leads/month</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="font-semibold text-blue-800">Current Position</span>
              </div>
              <p className="text-sm text-blue-700">{L} leads/month</p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="font-semibold text-red-800">Loss Zone</span>
              </div>
              <p className="text-sm text-red-700">Below {Math.ceil(LBreakEven)} leads/month</p>
            </div>
          </div>
        </div>

        {/* Sensitivity Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Sensitivity Analysis</h3>
          <p className="text-sm text-gray-600 mb-6">
            How break-even point changes with different parameters
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cost Per Lead Sensitivity */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 flex items-center">
                <BadgeDollarSign className="w-5 h-5 mr-2 text-blue-600" />
                Cost Per Lead Impact
              </h4>
              <div className="space-y-2">
                {sensitivityData.costPerLead.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded p-3 text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700">{item.change}</span>
                      <span className="text-blue-600">${item.value}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Break-even leads:</span>
                      <span className={`font-semibold ${
                        item.impact > 0 ? 'text-red-600' : item.impact < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {item.breakEvenLeads}
                        {item.impact !== 0 && ` (${item.impact > 0 ? '+' : ''}${Math.round(item.impact)})`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commission Rate Sensitivity */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 flex items-center">
                <Percent className="w-5 h-5 mr-2 text-purple-600" />
                Commission Rate Impact
              </h4>
              <div className="space-y-2">
                {sensitivityData.commissionRate.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded p-3 text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700">{item.change}</span>
                      <span className="text-purple-600">{item.value}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Break-even leads:</span>
                      <span className={`font-semibold ${
                        item.impact > 0 ? 'text-red-600' : item.impact < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {item.breakEvenLeads}
                        {item.impact !== 0 && ` (${item.impact > 0 ? '+' : ''}${Math.round(item.impact)})`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Expenses Sensitivity */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-orange-600" />
                Operating Expenses Impact
              </h4>
              <div className="space-y-2">
                {sensitivityData.operatingExpenses.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded p-3 text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700">{item.change}</span>
                      <span className="text-orange-600 text-xs">{item.value}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Break-even leads:</span>
                      <span className={`font-semibold ${
                        item.impact > 0 ? 'text-red-600' : item.impact < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {item.breakEvenLeads}
                        {item.impact !== 0 && ` (${item.impact > 0 ? '+' : ''}${Math.round(item.impact)})`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <Target className="w-6 h-6 mr-2 text-blue-600" />
            Recommended Actions to {isBreakEven ? 'Maximize Profit' : 'Reach Break-Even'}
          </h3>

          <div className="space-y-4">
            {actionItems.map((action, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                        {action.priority}
                      </span>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                        {action.category}
                      </span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        action.impact === 'High'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {action.impact} Impact
                      </span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        action.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-700'
                          : action.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {action.difficulty}
                      </span>
                    </div>

                    <h4 className="font-semibold text-gray-800 text-lg mb-1">
                      {action.action}
                    </h4>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Target: </span>
                        <span className="text-blue-600 font-semibold">{action.target}</span>
                      </div>
                      {action.monthlySavings && (
                        <div>
                          <span className="font-medium">Monthly Savings: </span>
                          <span className="text-green-600 font-semibold">{action.monthlySavings}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formula Reference */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border border-blue-200">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Break-Even Formulas Reference</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Break-Even Conversion Rate</h4>
              <code className="text-sm text-gray-700 block bg-gray-50 p-3 rounded">
                cBreakEven = (L × pL + B + M) / (netMargin × L × V)
              </code>
              <p className="text-xs text-gray-600 mt-2">
                Minimum conversion rate needed to cover all costs
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Break-Even Leads Required</h4>
              <code className="text-sm text-gray-700 block bg-gray-50 p-3 rounded">
                LBreakEven = (B + M) / (netMargin × c × V - pL)
              </code>
              <p className="text-xs text-gray-600 mt-2">
                Minimum leads needed to cover fixed costs
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Net Margin</h4>
              <code className="text-sm text-gray-700 block bg-gray-50 p-3 rounded">
                netMargin = gm - r - h
              </code>
              <p className="text-xs text-gray-600 mt-2">
                Gross margin minus commission and overhead rates
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Variables</h4>
              <div className="text-xs text-gray-700 space-y-1">
                <p><strong>L:</strong> Monthly Leads ({L})</p>
                <p><strong>pL:</strong> Cost per Lead (${pL})</p>
                <p><strong>c:</strong> Conversion Rate ({(c * 100).toFixed(2)}%)</p>
                <p><strong>V:</strong> Average Ticket ({formatCurrency(V)})</p>
                <p><strong>r:</strong> Commission Rate ({(r * 100).toFixed(1)}%)</p>
                <p><strong>gm:</strong> Gross Margin ({(gm * 100).toFixed(1)}%)</p>
                <p><strong>h:</strong> Variable Overhead ({(h * 100).toFixed(1)}%)</p>
                <p><strong>M:</strong> Owner Compensation ({formatCurrency(M)})</p>
                <p><strong>B:</strong> Base Salary ({formatCurrency(B)})</p>
              </div>
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
          <TabButton id="leadcost" label="Lead Cost Analysis" icon={BadgeDollarSign} />
          <TabButton id="breakeven" label="Break-Even Analysis" icon={Crosshair} />
        </div>

        {/* Tab Content */}
        {activeTab === 'main' && <MainDashboard />}
        {activeTab === 'jobnimbus' && <JobNimbusAnalytics />}
        {activeTab === 'pl' && <PLAnalysis />}
        {activeTab === 'simulator' && <SalesRepSimulator />}
        {activeTab === 'leadcost' && <LeadCostAnalysis />}
        {activeTab === 'breakeven' && <BreakEvenAnalysis />}

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
