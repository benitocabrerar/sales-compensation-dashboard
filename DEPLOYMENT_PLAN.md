# Sales Compensation Dashboard - Render.com Deployment Plan

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Backend      │────▶│   PostgreSQL    │
│  Static Site    │     │  Web Service    │     │    Database     │
│  (React/Vite)   │     │ (Node/Express)  │     │  (Render DB)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
   render.com            render.com              render.com
   Free Tier             Free Tier               Free Tier
```

## Cost Estimate (Monthly)

- **Frontend Static Site**: $0 (Free tier)
- **Backend Web Service**: $0 (Free tier - 750 hours/month)
- **PostgreSQL Database**: $0 (Free tier - 1GB storage, 97% uptime)
- **Total Monthly Cost**: $0

Note: Free tier limitations:
- Web Services spin down after 15 min of inactivity
- Database has 90-day expiration (needs manual renewal)
- Limited to 100GB bandwidth/month

---

## Phase 1: Pre-Deployment Preparation

### 1.1 Initialize Git Repository

```bash
# Initialize git in project root
cd C:\Users\benito\poweria\ventas
git init

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
dist/
build/

# Environment files
.env
.env.local
.env.production
.env.development

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Python cache (for analysis scripts)
__pycache__/
*.py[cod]
*$py.class

# Temporary files
*.tmp
*.temp
.cache/

# Data files (will be in database)
backend/data/*.json
!backend/data/.gitkeep

# Analysis outputs
*.csv
*.pdf
*.png
*.jpg
EOF

# Keep data directory structure
mkdir -p backend/data
touch backend/data/.gitkeep

# First commit
git add .
git commit -m "Initial commit: Sales Compensation Dashboard"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create repository: `sales-compensation-dashboard`
3. Make it private or public as needed
4. Don't initialize with README (we already have files)

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/sales-compensation-dashboard.git
git branch -M main
git push -u origin main
```

### 1.3 Backend Code Modifications

#### Update `backend/server.js` for Render:

```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Test database connection
        const result = await pool.query('SELECT NOW()');
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'connected',
            dbTime: result.rows[0].now
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            error: 'Database connection failed'
        });
    }
});

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
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

// API Routes
app.get('/api/config', async (req, res) => {
    try {
        const result = await pool.query('SELECT value FROM config WHERE key = $1', ['default']);
        if (result.rows.length > 0) {
            res.json(result.rows[0].value);
        } else {
            res.status(404).json({ error: 'Config not found' });
        }
    } catch (error) {
        console.error('Error fetching config:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/config', async (req, res) => {
    try {
        await pool.query(
            'UPDATE config SET value = $1, updated_at = CURRENT_TIMESTAMP WHERE key = $2',
            [JSON.stringify(req.body), 'default']
        );
        res.json({ success: true, config: req.body });
    } catch (error) {
        console.error('Error updating config:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/scenarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, data FROM scenarios ORDER BY created_at DESC');
        res.json(result.rows.map(row => ({
            id: row.id,
            name: row.name,
            ...row.data
        })));
    } catch (error) {
        console.error('Error fetching scenarios:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/scenarios', async (req, res) => {
    try {
        const { name, ...data } = req.body;
        const result = await pool.query(
            'INSERT INTO scenarios (name, data) VALUES ($1, $2) RETURNING *',
            [name, JSON.stringify(data)]
        );
        res.json({
            id: result.rows[0].id,
            name: result.rows[0].name,
            ...result.rows[0].data
        });
    } catch (error) {
        console.error('Error creating scenario:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/scenarios/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM scenarios WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting scenario:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Calculation endpoint
app.post('/api/calculate', (req, res) => {
    try {
        const params = req.body;

        // Core calculations (your existing logic)
        const monthlyRevenue = params.V / 12;
        const monthlyProfit = monthlyRevenue * params.gm;
        const baseSalary = params.b;
        const commission = monthlyRevenue * params.c;
        const totalMonthlyComp = baseSalary + commission;
        const yearlyCompensation = totalMonthlyComp * 12;
        const takeHomeRate = totalMonthlyComp / monthlyRevenue;
        const profitAfterSales = monthlyProfit - totalMonthlyComp;

        const leadCost = params.pL;
        const conversionRate = params.r;
        const leadBudget = params.B * params.L;
        const closedLeads = params.L * conversionRate;
        const costPerAcquisition = closedLeads > 0 ? leadBudget / closedLeads : 0;

        res.json({
            monthlyRevenue,
            monthlyProfit,
            baseSalary,
            commission,
            totalMonthlyComp,
            yearlyCompensation,
            takeHomeRate,
            profitAfterSales,
            leadBudget,
            closedLeads,
            costPerAcquisition
        });
    } catch (error) {
        console.error('Calculation error:', error);
        res.status(500).json({ error: 'Calculation failed' });
    }
});

// CSV Export endpoint
app.post('/api/export/csv', (req, res) => {
    try {
        const { data, filename = 'export.csv' } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        // Generate CSV
        const headers = Object.keys(data[0] || {});
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => row[header] || '').join(','))
        ].join('\\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csvContent);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Export failed' });
    }
});

// Start server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await initDatabase();
});
```

#### Update `backend/package.json`:

```json
{
  "name": "sales-compensation-backend",
  "version": "1.0.0",
  "description": "Backend API server for Sales Compensation Dashboard",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build step required'"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": ["sales", "compensation", "api", "dashboard"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### 1.4 Frontend Code Modifications

#### Create `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:3001
```

#### Update `frontend/src/config.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const config = {
    API_URL,
    endpoints: {
        health: `${API_URL}/api/health`,
        config: `${API_URL}/api/config`,
        scenarios: `${API_URL}/api/scenarios`,
        calculate: `${API_URL}/api/calculate`,
        exportCsv: `${API_URL}/api/export/csv`
    }
};
```

#### Update API calls in components to use config:

```javascript
// Example in a component
import { config } from './config';
import axios from 'axios';

// Use config.endpoints for all API calls
const fetchConfig = async () => {
    const response = await axios.get(config.endpoints.config);
    return response.data;
};
```

#### Create `frontend/public/_redirects` for SPA routing:

```
/*    /index.html   200
```

---

## Phase 2: Database Setup

### 2.1 Create Render PostgreSQL Database

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `sales-dashboard-db`
   - **Database**: Leave default
   - **User**: Leave default
   - **Region**: Oregon (US West) or closest to you
   - **PostgreSQL Version**: 15
   - **Plan**: Free ($0/month)
4. Click "Create Database"
5. Wait for provisioning (2-3 minutes)
6. Copy the "Internal Database URL" for backend use

### 2.2 Database Migration Script

Create `backend/migrate.js`:

```javascript
const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

// For local migration from JSON files
async function migrateData() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        // Create tables
        console.log('Creating tables...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS config (
                id SERIAL PRIMARY KEY,
                key VARCHAR(255) UNIQUE NOT NULL,
                value JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS scenarios (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                data JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Migrate existing config if exists
        const configPath = path.join(__dirname, 'data', 'config.json');
        try {
            const configData = await fs.readFile(configPath, 'utf8');
            const config = JSON.parse(configData);
            await pool.query(
                'INSERT INTO config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
                ['default', JSON.stringify(config)]
            );
            console.log('Config migrated successfully');
        } catch (error) {
            console.log('No existing config to migrate');
        }

        // Migrate existing scenarios if exists
        const scenariosPath = path.join(__dirname, 'data', 'scenarios.json');
        try {
            const scenariosData = await fs.readFile(scenariosPath, 'utf8');
            const scenarios = JSON.parse(scenariosData);
            for (const scenario of scenarios) {
                const { name, ...data } = scenario;
                await pool.query(
                    'INSERT INTO scenarios (name, data) VALUES ($1, $2)',
                    [name || 'Imported Scenario', JSON.stringify(data)]
                );
            }
            console.log(`${scenarios.length} scenarios migrated successfully`);
        } catch (error) {
            console.log('No existing scenarios to migrate');
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

// Run migration
if (require.main === module) {
    migrateData();
}

module.exports = { migrateData };
```

---

## Phase 3: Backend Deployment

### 3.1 Deploy Backend Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `sales-dashboard-api`
   - **Environment**: Node
   - **Region**: Same as database (Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free ($0/month)

### 3.2 Configure Environment Variables

In the Render backend service settings, add:

```
NODE_ENV=production
DATABASE_URL=<Internal Database URL from PostgreSQL>
FRONTEND_URL=https://sales-dashboard.onrender.com
```

### 3.3 Add Health Check

In Render backend service settings:
- **Health Check Path**: `/api/health`
- **Port**: Leave empty (uses PORT env var)

---

## Phase 4: Frontend Deployment

### 4.1 Deploy Frontend Static Site

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `sales-dashboard`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free ($0/month)

### 4.2 Configure Environment Variables

In the Render frontend static site settings, add:

```
VITE_API_URL=https://sales-dashboard-api.onrender.com
```

### 4.3 Configure Routing

The `_redirects` file we created earlier will handle SPA routing automatically.

---

## Phase 5: Deployment Scripts & Configuration

### 5.1 Create `render.yaml` (Infrastructure as Code)

```yaml
databases:
  - name: sales-dashboard-db
    plan: free
    databaseName: salesdashboard
    user: salesdashboard

services:
  - type: web
    name: sales-dashboard-api
    runtime: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    rootDir: backend
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: sales-dashboard-db
          property: connectionString
      - key: FRONTEND_URL
        value: https://sales-dashboard.onrender.com
    healthCheckPath: /api/health

  - type: web
    name: sales-dashboard
    runtime: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    envVars:
      - key: VITE_API_URL
        value: https://sales-dashboard-api.onrender.com
```

### 5.2 Create Deployment Scripts

#### `scripts/deploy.sh`:

```bash
#!/bin/bash

echo "Deploying Sales Compensation Dashboard to Render..."

# Check for required environment variables
if [ -z "$RENDER_API_KEY" ]; then
    echo "Error: RENDER_API_KEY not set"
    exit 1
fi

# Push to GitHub
echo "Pushing latest changes to GitHub..."
git add .
git commit -m "Deploy: $(date +'%Y-%m-%d %H:%M:%S')"
git push origin main

# Trigger Render deployments
echo "Triggering Render deployments..."

# You can use Render CLI or API here
# render up

echo "Deployment initiated. Check Render dashboard for status."
```

#### `scripts/rollback.sh`:

```bash
#!/bin/bash

echo "Rolling back to previous deployment..."

# Get previous commit
PREV_COMMIT=$(git rev-parse HEAD~1)

# Revert to previous commit
git revert HEAD --no-edit
git push origin main

echo "Rollback initiated. Render will auto-deploy previous version."
```

---

## Phase 6: Post-Deployment Configuration

### 6.1 Custom Domain Setup (Optional)

1. In Render dashboard, go to your frontend service
2. Settings → Custom Domains
3. Add your domain (e.g., `sales.yourdomain.com`)
4. Configure DNS:
   - Add CNAME record pointing to `sales-dashboard.onrender.com`
   - Or use Render's provided A records

### 6.2 SSL Certificates

- Render provides free SSL certificates automatically
- Custom domains get Let's Encrypt certificates
- No configuration needed

### 6.3 Monitoring Setup

1. **Render Native Monitoring**:
   - Metrics available in dashboard
   - Log streaming in service logs
   - Email alerts for service failures

2. **External Monitoring** (Optional):
   - Set up UptimeRobot for uptime monitoring
   - Configure Datadog or New Relic for APM

### 6.4 Backup Strategy

Create `scripts/backup.sh`:

```bash
#!/bin/bash

# Backup database
echo "Backing up database..."
pg_dump $DATABASE_URL > backups/db-$(date +'%Y%m%d-%H%M%S').sql

# Upload to S3 or another backup location
# aws s3 cp backups/latest.sql s3://your-backup-bucket/
```

---

## Phase 7: Testing Checklist

### 7.1 Pre-Deployment Tests

- [ ] Frontend builds successfully locally
- [ ] Backend starts without errors
- [ ] All API endpoints respond correctly
- [ ] Database connection works
- [ ] Environment variables are set correctly

### 7.2 Post-Deployment Tests

- [ ] Health check endpoint responds (https://sales-dashboard-api.onrender.com/api/health)
- [ ] Frontend loads (https://sales-dashboard.onrender.com)
- [ ] API calls from frontend work
- [ ] Data persists in database
- [ ] Scenarios can be created/deleted
- [ ] Configuration saves correctly
- [ ] CSV export works
- [ ] All calculations are accurate

### 7.3 Performance Tests

- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Database queries < 100ms
- [ ] No memory leaks after extended use

---

## Troubleshooting Guide

### Common Issues and Solutions

1. **Backend won't start**
   - Check logs: `render logs sales-dashboard-api`
   - Verify DATABASE_URL is set
   - Check Node version compatibility

2. **Frontend can't reach backend**
   - Verify VITE_API_URL is correct
   - Check CORS configuration
   - Ensure backend is running

3. **Database connection fails**
   - Verify DATABASE_URL format
   - Check SSL settings
   - Ensure database is not suspended

4. **Slow cold starts**
   - Normal for free tier (services sleep after 15 min)
   - Consider upgrading to paid tier for always-on

5. **Build failures**
   - Check build logs in Render dashboard
   - Verify all dependencies are in package.json
   - Check Node version in engines field

---

## Maintenance Plan

### Daily
- Monitor service health via dashboard
- Check for any alert emails

### Weekly
- Review logs for errors
- Check database size (1GB limit on free tier)
- Monitor bandwidth usage (100GB limit)

### Monthly
- Update dependencies
- Review and optimize database queries
- Backup database
- Review costs and usage

### Every 90 Days
- Renew free database (required on free tier)
- Security updates
- Performance review

---

## Migration Commands Summary

```bash
# Initial setup
cd C:\Users\benito\poweria\ventas
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main

# Install new dependencies
cd backend
npm install pg

# Test locally with PostgreSQL
export DATABASE_URL="postgresql://user:pass@localhost:5432/salesdb"
npm run dev

# Deploy to Render
git push origin main
# Render auto-deploys on push

# Run migration (after database is created)
cd backend
node migrate.js

# Monitor deployment
render logs sales-dashboard-api --tail
```

---

## Security Considerations

1. **Environment Variables**: Never commit .env files
2. **Database**: Use connection pooling, SSL in production
3. **CORS**: Restrict to specific frontend domain
4. **API Rate Limiting**: Consider adding rate limiting
5. **Input Validation**: Validate all user inputs
6. **SQL Injection**: Use parameterized queries (already implemented)
7. **HTTPS**: Always use HTTPS in production (Render provides)

---

## Cost Optimization Tips

1. **Stay on Free Tier**:
   - Single web service (backend)
   - Single static site (frontend)
   - Single PostgreSQL database
   - Monitor 100GB bandwidth limit

2. **If Scaling Needed**:
   - Backend: $7/month for Starter (no sleep)
   - Database: $7/month for Starter (better performance)
   - Total: $14/month for production-ready setup

3. **Alternatives for Growth**:
   - Use Redis for caching (Render Redis free tier)
   - CDN for static assets (Cloudflare free)
   - Image optimization (Cloudinary free tier)

---

## Next Steps After Deployment

1. Set up error tracking (Sentry free tier)
2. Add user authentication if needed
3. Implement data export to Google Sheets
4. Add email notifications for scenarios
5. Create mobile-responsive improvements
6. Add data visualization exports
7. Implement user roles and permissions
8. Add API documentation (Swagger)

---

## Contact for Issues

- Render Support: https://render.com/support
- Status Page: https://status.render.com
- Documentation: https://render.com/docs
- Community: https://community.render.com