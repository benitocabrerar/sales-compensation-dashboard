const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection configuration
const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false
      }
    : {
        // Local development fallback
        host: 'localhost',
        port: 5432,
        database: 'salescompensation',
        user: 'postgres',
        password: 'postgres'
      };

const pool = new Pool(poolConfig);

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:5173',
            'http://localhost:3000'
        ].filter(Boolean);

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize database tables
async function initDatabase() {
    try {
        // Create config table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS config (
                id SERIAL PRIMARY KEY,
                key VARCHAR(255) UNIQUE NOT NULL,
                value JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create scenarios table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS scenarios (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                data JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create update trigger for updated_at
        await pool.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        // Apply trigger to config table
        await pool.query(`
            DROP TRIGGER IF EXISTS update_config_updated_at ON config;
            CREATE TRIGGER update_config_updated_at
            BEFORE UPDATE ON config
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        `);

        // Apply trigger to scenarios table
        await pool.query(`
            DROP TRIGGER IF EXISTS update_scenarios_updated_at ON scenarios;
            CREATE TRIGGER update_scenarios_updated_at
            BEFORE UPDATE ON scenarios
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        `);

        // Initialize default config if not exists
        const configCheck = await pool.query('SELECT * FROM config WHERE key = $1', ['default']);
        if (configCheck.rows.length === 0) {
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
            await pool.query(
                'INSERT INTO config (key, value) VALUES ($1, $2)',
                ['default', JSON.stringify(defaultConfig)]
            );
            console.log('Default configuration initialized');
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
        // Don't exit the process, let the health check report the issue
    }
}

// Health check endpoint (IMPORTANT for Render)
app.get('/api/health', async (req, res) => {
    try {
        // Test database connection
        const result = await pool.query('SELECT NOW() as time, version() as version');
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            database: {
                connected: true,
                time: result.rows[0].time,
                version: result.rows[0].version
            }
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            error: 'Database connection failed',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// API Routes

// Get configuration
app.get('/api/config', async (req, res) => {
    try {
        const result = await pool.query('SELECT value FROM config WHERE key = $1', ['default']);
        if (result.rows.length > 0) {
            res.json(result.rows[0].value);
        } else {
            res.status(404).json({ error: 'Configuration not found' });
        }
    } catch (error) {
        console.error('Error fetching config:', error);
        res.status(500).json({ error: 'Failed to fetch configuration' });
    }
});

// Update configuration
app.put('/api/config', async (req, res) => {
    try {
        const result = await pool.query(
            `INSERT INTO config (key, value) VALUES ($1, $2)
             ON CONFLICT (key)
             DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP
             RETURNING value`,
            ['default', JSON.stringify(req.body)]
        );
        res.json(result.rows[0].value);
    } catch (error) {
        console.error('Error updating config:', error);
        res.status(500).json({ error: 'Failed to update configuration' });
    }
});

// Get all scenarios
app.get('/api/scenarios', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, data, created_at FROM scenarios ORDER BY created_at DESC'
        );

        // Transform the data to match the expected format
        const scenarios = result.rows.map(row => ({
            id: row.id,
            name: row.name,
            createdAt: row.created_at,
            ...row.data
        }));

        res.json(scenarios);
    } catch (error) {
        console.error('Error fetching scenarios:', error);
        res.status(500).json({ error: 'Failed to fetch scenarios' });
    }
});

// Create a new scenario
app.post('/api/scenarios', async (req, res) => {
    try {
        const { name, ...data } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Scenario name is required' });
        }

        const result = await pool.query(
            'INSERT INTO scenarios (name, data) VALUES ($1, $2) RETURNING *',
            [name, JSON.stringify(data)]
        );

        const scenario = {
            id: result.rows[0].id,
            name: result.rows[0].name,
            createdAt: result.rows[0].created_at,
            ...result.rows[0].data
        };

        res.status(201).json(scenario);
    } catch (error) {
        console.error('Error creating scenario:', error);
        res.status(500).json({ error: 'Failed to create scenario' });
    }
});

// Update a scenario
app.put('/api/scenarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, ...data } = req.body;

        const result = await pool.query(
            `UPDATE scenarios
             SET name = $1, data = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING *`,
            [name, JSON.stringify(data), id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Scenario not found' });
        }

        const scenario = {
            id: result.rows[0].id,
            name: result.rows[0].name,
            createdAt: result.rows[0].created_at,
            updatedAt: result.rows[0].updated_at,
            ...result.rows[0].data
        };

        res.json(scenario);
    } catch (error) {
        console.error('Error updating scenario:', error);
        res.status(500).json({ error: 'Failed to update scenario' });
    }
});

// Delete a scenario
app.delete('/api/scenarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM scenarios WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Scenario not found' });
        }

        res.json({ success: true, message: 'Scenario deleted successfully' });
    } catch (error) {
        console.error('Error deleting scenario:', error);
        res.status(500).json({ error: 'Failed to delete scenario' });
    }
});

// Calculation endpoint
app.post('/api/calculate', (req, res) => {
    try {
        const params = req.body;

        // Validate required parameters
        const requiredParams = ['V', 'gm', 'b', 'c', 'L', 'pL', 'r', 'B'];
        const missingParams = requiredParams.filter(param => params[param] === undefined);

        if (missingParams.length > 0) {
            return res.status(400).json({
                error: 'Missing required parameters',
                missing: missingParams
            });
        }

        // Core calculations
        const monthlyRevenue = params.V / 12;
        const monthlyProfit = monthlyRevenue * params.gm;
        const baseSalary = params.b;
        const commission = monthlyRevenue * params.c;
        const totalMonthlyComp = baseSalary + commission;
        const yearlyCompensation = totalMonthlyComp * 12;
        const takeHomeRate = monthlyRevenue > 0 ? totalMonthlyComp / monthlyRevenue : 0;
        const profitAfterSales = monthlyProfit - totalMonthlyComp;

        // Lead generation calculations
        const leadCost = params.pL;
        const conversionRate = params.r;
        const leadBudget = params.B * params.L;
        const closedLeads = params.L * conversionRate;
        const costPerAcquisition = closedLeads > 0 ? leadBudget / closedLeads : 0;

        // Additional metrics
        const revenuePerLead = closedLeads > 0 ? params.V / closedLeads : 0;
        const roi = leadBudget > 0 ? ((params.V - leadBudget) / leadBudget) * 100 : 0;
        const breakEvenLeads = monthlyRevenue > 0 ? leadBudget / (monthlyRevenue / params.L) : 0;

        res.json({
            // Revenue metrics
            monthlyRevenue,
            monthlyProfit,
            yearlyRevenue: params.V,

            // Compensation metrics
            baseSalary,
            commission,
            totalMonthlyComp,
            yearlyCompensation,
            takeHomeRate,
            profitAfterSales,

            // Lead metrics
            totalLeads: params.L,
            leadCost,
            leadBudget,
            closedLeads,
            costPerAcquisition,
            conversionRate,

            // Additional metrics
            revenuePerLead,
            roi,
            breakEvenLeads,

            // Efficiency metrics
            profitMargin: params.gm,
            compensationRatio: monthlyRevenue > 0 ? totalMonthlyComp / monthlyRevenue : 0,
            netProfitMargin: monthlyRevenue > 0 ? profitAfterSales / monthlyRevenue : 0
        });
    } catch (error) {
        console.error('Calculation error:', error);
        res.status(500).json({ error: 'Calculation failed', details: error.message });
    }
});

// CSV Export endpoint
app.post('/api/export/csv', (req, res) => {
    try {
        const { data, filename = 'sales_compensation_export.csv' } = req.body;

        if (!data || !Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: 'Invalid or empty data for export' });
        }

        // Get all unique headers from all objects
        const headers = [...new Set(data.flatMap(row => Object.keys(row)))];

        // Generate CSV content
        const csvRows = [];

        // Add headers
        csvRows.push(headers.map(header => `"${header}"`).join(','));

        // Add data rows
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                if (value === null || value === undefined) return '';
                if (typeof value === 'number') return value;
                // Escape quotes and wrap in quotes
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        });

        const csvContent = csvRows.join('\n');

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csvContent);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Export failed', details: error.message });
    }
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await pool.end();
    process.exit(0);
});

// Start server
const server = app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);

    // Initialize database
    await initDatabase();
});

module.exports = { app, pool };