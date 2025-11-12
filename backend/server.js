const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_DIR = path.join(__dirname, 'data');
const SCENARIOS_FILE = path.join(DATA_DIR, 'scenarios.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const initDataDir = async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });

        // Initialize scenarios file if it doesn't exist
        try {
            await fs.access(SCENARIOS_FILE);
        } catch {
            await fs.writeFile(SCENARIOS_FILE, JSON.stringify([], null, 2));
        }

        // Initialize config file if it doesn't exist
        try {
            await fs.access(CONFIG_FILE);
        } catch {
            const defaultConfig = {
                salespersonName: '',
                L: 25,
                pL: 80,
                c: 0.15,
                V: 12000,
                r: 0.0075,
                B: 150,
                b: 2000,
                gm: 0.33,
                h: 0.10,
                M: 1000,
                alpha: 0.11,
                growthRate: 0.05,
                discountRate: 0.10,
                years: 3
            };
            await fs.writeFile(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
        }
    } catch (error) {
        console.error('Error initializing data directory:', error);
    }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Sales Compensation API is running', timestamp: new Date().toISOString() });
});

// Get configuration
app.get('/api/config', async (req, res) => {
    try {
        const data = await fs.readFile(CONFIG_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading config:', error);
        res.status(500).json({ error: 'Failed to read configuration' });
    }
});

// Save configuration
app.post('/api/config', async (req, res) => {
    try {
        await fs.writeFile(CONFIG_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true, message: 'Configuration saved successfully' });
    } catch (error) {
        console.error('Error saving config:', error);
        res.status(500).json({ error: 'Failed to save configuration' });
    }
});

// Get all scenarios
app.get('/api/scenarios', async (req, res) => {
    try {
        const data = await fs.readFile(SCENARIOS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading scenarios:', error);
        res.status(500).json({ error: 'Failed to read scenarios' });
    }
});

// Get scenario by ID
app.get('/api/scenarios/:id', async (req, res) => {
    try {
        const data = await fs.readFile(SCENARIOS_FILE, 'utf8');
        const scenarios = JSON.parse(data);
        const scenario = scenarios.find(s => s.id === parseInt(req.params.id));

        if (!scenario) {
            return res.status(404).json({ error: 'Scenario not found' });
        }

        res.json(scenario);
    } catch (error) {
        console.error('Error reading scenario:', error);
        res.status(500).json({ error: 'Failed to read scenario' });
    }
});

// Create new scenario
app.post('/api/scenarios', async (req, res) => {
    try {
        const data = await fs.readFile(SCENARIOS_FILE, 'utf8');
        const scenarios = JSON.parse(data);

        const newScenario = {
            id: Date.now(),
            name: req.body.name,
            timestamp: new Date().toISOString(),
            config: req.body.config,
            results: req.body.results
        };

        scenarios.push(newScenario);
        await fs.writeFile(SCENARIOS_FILE, JSON.stringify(scenarios, null, 2));

        res.status(201).json({ success: true, scenario: newScenario });
    } catch (error) {
        console.error('Error creating scenario:', error);
        res.status(500).json({ error: 'Failed to create scenario' });
    }
});

// Update scenario
app.put('/api/scenarios/:id', async (req, res) => {
    try {
        const data = await fs.readFile(SCENARIOS_FILE, 'utf8');
        const scenarios = JSON.parse(data);
        const index = scenarios.findIndex(s => s.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).json({ error: 'Scenario not found' });
        }

        scenarios[index] = {
            ...scenarios[index],
            ...req.body,
            id: parseInt(req.params.id),
            updatedAt: new Date().toISOString()
        };

        await fs.writeFile(SCENARIOS_FILE, JSON.stringify(scenarios, null, 2));
        res.json({ success: true, scenario: scenarios[index] });
    } catch (error) {
        console.error('Error updating scenario:', error);
        res.status(500).json({ error: 'Failed to update scenario' });
    }
});

// Delete scenario
app.delete('/api/scenarios/:id', async (req, res) => {
    try {
        const data = await fs.readFile(SCENARIOS_FILE, 'utf8');
        let scenarios = JSON.parse(data);

        const filteredScenarios = scenarios.filter(s => s.id !== parseInt(req.params.id));

        if (filteredScenarios.length === scenarios.length) {
            return res.status(404).json({ error: 'Scenario not found' });
        }

        await fs.writeFile(SCENARIOS_FILE, JSON.stringify(filteredScenarios, null, 2));
        res.json({ success: true, message: 'Scenario deleted successfully' });
    } catch (error) {
        console.error('Error deleting scenario:', error);
        res.status(500).json({ error: 'Failed to delete scenario' });
    }
});

// Calculate metrics endpoint
app.post('/api/calculate', (req, res) => {
    try {
        const { L, pL, c, V, r, B, b, gm, h, M, alpha } = req.body;

        const R = L * c * V;
        const G = gm * R;
        const leadPayment = L * pL;
        const commission = r * R;
        const totalEarned = leadPayment + commission + B;
        const cashPayment = Math.max(b, totalEarned);
        const recoverableBase = totalEarned < b ? b - totalEarned : 0;
        const variableOverhead = h * R;
        const netProfit = G - totalEarned - variableOverhead - M;

        const cMinBase = (b - (L * pL + B)) / (r * L * V);
        const LMinBase = (b - B) / (pL + r * c * V);
        const meetsBase = c >= cMinBase && L >= LMinBase;
        const cMinCap = (L * pL + B) / ((alpha * gm - r) * L * V);
        const meetsCap = totalEarned <= alpha * G;

        const netMargin = gm - r - h;
        const cBreakEven = (L * pL + B + M) / (netMargin * L * V);
        const LBreakEven = (B + M) / (netMargin * c * V - pL);

        const salespersonAnnual = totalEarned * 12;
        const companyAnnual = netProfit * 12;
        const annualSales = R * 12;
        const annualMargin = G * 12;

        const salespersonPctMargin = (totalEarned / G) * 100;
        const profitPctMargin = (netProfit / G) * 100;
        const salespersonPctSales = (totalEarned / R) * 100;
        const monthlyROI = (netProfit / totalEarned) * 100;

        res.json({
            R, G, leadPayment, commission, totalEarned, cashPayment, recoverableBase,
            variableOverhead, netProfit, cMinBase, LMinBase, meetsBase, cMinCap,
            meetsCap, netMargin, cBreakEven, LBreakEven, salespersonAnnual, companyAnnual,
            annualSales, annualMargin, salespersonPctMargin, profitPctMargin, salespersonPctSales,
            monthlyROI
        });
    } catch (error) {
        console.error('Error calculating metrics:', error);
        res.status(400).json({ error: 'Invalid calculation parameters' });
    }
});

// Export data to CSV
app.post('/api/export/csv', (req, res) => {
    try {
        const { salespersonName, calculations } = req.body;

        const csvData = `Metric,Value
Salesperson Name,${salespersonName || 'Not Set'}
Monthly Sales,${calculations.R.toFixed(0)}
Gross Margin,${calculations.G.toFixed(0)}
Salesperson Total,${calculations.totalEarned.toFixed(0)}
Company Net Profit,${calculations.netProfit.toFixed(0)}
Monthly ROI,${calculations.monthlyROI.toFixed(2)}%
Annual Sales,${calculations.annualSales.toFixed(0)}
Annual Salesperson Comp,${calculations.salespersonAnnual.toFixed(0)}
Annual Company Profit,${calculations.companyAnnual.toFixed(0)}`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="sales-analysis-${salespersonName || 'export'}-${new Date().toISOString().split('T')[0]}.csv"`);
        res.send(csvData);
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ error: 'Failed to export CSV' });
    }
});

// Start server
initDataDir().then(() => {
    app.listen(PORT, () => {
        console.log('');
        console.log('╔══════════════════════════════════════════════════════════╗');
        console.log('║                                                          ║');
        console.log('║   🚀 SALES COMPENSATION API SERVER                      ║');
        console.log('║                                                          ║');
        console.log('╟──────────────────────────────────────────────────────────╢');
        console.log(`║   📡 Server running on: http://localhost:${PORT}          ║`);
        console.log('║   📊 API Documentation: /api/health                     ║');
        console.log('║   💾 Data stored in: ./backend/data/                    ║');
        console.log('║                                                          ║');
        console.log('╟──────────────────────────────────────────────────────────╢');
        console.log('║   Available Endpoints:                                   ║');
        console.log('║   GET    /api/health                                     ║');
        console.log('║   GET    /api/config                                     ║');
        console.log('║   POST   /api/config                                     ║');
        console.log('║   GET    /api/scenarios                                  ║');
        console.log('║   POST   /api/scenarios                                  ║');
        console.log('║   GET    /api/scenarios/:id                              ║');
        console.log('║   PUT    /api/scenarios/:id                              ║');
        console.log('║   DELETE /api/scenarios/:id                              ║');
        console.log('║   POST   /api/calculate                                  ║');
        console.log('║   POST   /api/export/csv                                 ║');
        console.log('║                                                          ║');
        console.log('╚══════════════════════════════════════════════════════════╝');
        console.log('');
        console.log('Press Ctrl+C to stop the server');
        console.log('');
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down server gracefully...');
    process.exit(0);
});
