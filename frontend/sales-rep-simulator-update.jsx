// NEW STATE VARIABLES TO ADD AFTER LINE 86 (after setActiveScenario)

// Marginal Cost State Variables
const [costPerLead, setCostPerLead] = useState(100);
const [costPerClose, setCostPerClose] = useState(200);
const [currentTeamCapacity, setCurrentTeamCapacity] = useState(50);
const [currentLeadsGenerated, setCurrentLeadsGenerated] = useState(35);
const [additionalStaffCost, setAdditionalStaffCost] = useState(4500);
const [leadsPerAdditionalStaff, setLeadsPerAdditionalStaff] = useState(30);

// =======================
// COMPLETE REPLACEMENT FOR SalesRepSimulator COMPONENT
// REPLACE FROM LINE 972 TO LINE 1897
// =======================

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
