const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

/**
 * Database migration script
 * Migrates data from JSON files to PostgreSQL database
 */

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
});

async function createTables() {
    console.log('📊 Creating database tables...');

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
        console.log('✅ Config table created');

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
        console.log('✅ Scenarios table created');

        // Create audit log table for tracking changes
        await pool.query(`
            CREATE TABLE IF NOT EXISTS audit_log (
                id SERIAL PRIMARY KEY,
                table_name VARCHAR(50) NOT NULL,
                operation VARCHAR(10) NOT NULL,
                user_id VARCHAR(255),
                data JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Audit log table created');

        // Create update trigger function
        await pool.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        // Apply triggers
        const tables = ['config', 'scenarios'];
        for (const table of tables) {
            await pool.query(`
                DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
                CREATE TRIGGER update_${table}_updated_at
                BEFORE UPDATE ON ${table}
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
            `);
        }
        console.log('✅ Database triggers created');

    } catch (error) {
        console.error('❌ Error creating tables:', error);
        throw error;
    }
}

async function migrateConfig() {
    console.log('\n📁 Migrating configuration...');

    const configPath = path.join(__dirname, 'data', 'config.json');

    try {
        // Check if config file exists
        await fs.access(configPath);
        const configData = await fs.readFile(configPath, 'utf8');
        const config = JSON.parse(configData);

        // Check if config already exists in database
        const existingConfig = await pool.query(
            'SELECT * FROM config WHERE key = $1',
            ['default']
        );

        if (existingConfig.rows.length > 0) {
            // Update existing config
            await pool.query(
                'UPDATE config SET value = $1 WHERE key = $2',
                [JSON.stringify(config), 'default']
            );
            console.log('✅ Configuration updated in database');
        } else {
            // Insert new config
            await pool.query(
                'INSERT INTO config (key, value) VALUES ($1, $2)',
                ['default', JSON.stringify(config)]
            );
            console.log('✅ Configuration migrated to database');
        }

        // Log the migration
        await pool.query(
            'INSERT INTO audit_log (table_name, operation, data) VALUES ($1, $2, $3)',
            ['config', 'MIGRATE', JSON.stringify({ source: 'config.json' })]
        );

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('⚠️  No config.json file found, using default configuration');

            // Create default config
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

            const existingConfig = await pool.query(
                'SELECT * FROM config WHERE key = $1',
                ['default']
            );

            if (existingConfig.rows.length === 0) {
                await pool.query(
                    'INSERT INTO config (key, value) VALUES ($1, $2)',
                    ['default', JSON.stringify(defaultConfig)]
                );
                console.log('✅ Default configuration created');
            }
        } else {
            console.error('❌ Error migrating config:', error);
            throw error;
        }
    }
}

async function migrateScenarios() {
    console.log('\n📁 Migrating scenarios...');

    const scenariosPath = path.join(__dirname, 'data', 'scenarios.json');

    try {
        // Check if scenarios file exists
        await fs.access(scenariosPath);
        const scenariosData = await fs.readFile(scenariosPath, 'utf8');
        const scenarios = JSON.parse(scenariosData);

        if (!Array.isArray(scenarios)) {
            console.log('⚠️  Invalid scenarios format, skipping migration');
            return;
        }

        console.log(`📊 Found ${scenarios.length} scenarios to migrate`);

        // Migrate each scenario
        let migrated = 0;
        for (const scenario of scenarios) {
            try {
                const { name, id, ...data } = scenario;
                const scenarioName = name || `Scenario ${migrated + 1}`;

                // Check if scenario with same name exists
                const existing = await pool.query(
                    'SELECT id FROM scenarios WHERE name = $1',
                    [scenarioName]
                );

                if (existing.rows.length === 0) {
                    await pool.query(
                        'INSERT INTO scenarios (name, data) VALUES ($1, $2)',
                        [scenarioName, JSON.stringify(data)]
                    );
                    migrated++;
                } else {
                    console.log(`⚠️  Scenario "${scenarioName}" already exists, skipping`);
                }
            } catch (error) {
                console.error(`❌ Error migrating scenario:`, error);
            }
        }

        console.log(`✅ ${migrated} scenarios migrated successfully`);

        // Log the migration
        await pool.query(
            'INSERT INTO audit_log (table_name, operation, data) VALUES ($1, $2, $3)',
            ['scenarios', 'MIGRATE', JSON.stringify({ count: migrated, source: 'scenarios.json' })]
        );

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('⚠️  No scenarios.json file found, starting with empty scenarios');
        } else {
            console.error('❌ Error migrating scenarios:', error);
            throw error;
        }
    }
}

async function createBackup() {
    console.log('\n💾 Creating backup of JSON files...');

    const backupDir = path.join(__dirname, 'data', 'backup');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    try {
        // Create backup directory
        await fs.mkdir(backupDir, { recursive: true });

        // Backup config.json if exists
        try {
            const configPath = path.join(__dirname, 'data', 'config.json');
            await fs.access(configPath);
            const configBackupPath = path.join(backupDir, `config-${timestamp}.json`);
            await fs.copyFile(configPath, configBackupPath);
            console.log(`✅ Config backed up to ${configBackupPath}`);
        } catch (error) {
            // File doesn't exist, skip
        }

        // Backup scenarios.json if exists
        try {
            const scenariosPath = path.join(__dirname, 'data', 'scenarios.json');
            await fs.access(scenariosPath);
            const scenariosBackupPath = path.join(backupDir, `scenarios-${timestamp}.json`);
            await fs.copyFile(scenariosPath, scenariosBackupPath);
            console.log(`✅ Scenarios backed up to ${scenariosBackupPath}`);
        } catch (error) {
            // File doesn't exist, skip
        }

    } catch (error) {
        console.error('❌ Error creating backup:', error);
        // Don't throw, backup is not critical
    }
}

async function verifyMigration() {
    console.log('\n🔍 Verifying migration...');

    try {
        // Check config
        const configResult = await pool.query('SELECT COUNT(*) FROM config');
        console.log(`✅ Config entries: ${configResult.rows[0].count}`);

        // Check scenarios
        const scenariosResult = await pool.query('SELECT COUNT(*) FROM scenarios');
        console.log(`✅ Scenario entries: ${scenariosResult.rows[0].count}`);

        // Check audit log
        const auditResult = await pool.query('SELECT COUNT(*) FROM audit_log');
        console.log(`✅ Audit log entries: ${auditResult.rows[0].count}`);

        // Test a query
        const testQuery = await pool.query('SELECT value FROM config WHERE key = $1', ['default']);
        if (testQuery.rows.length > 0) {
            console.log('✅ Database queries working correctly');
        }

        return true;
    } catch (error) {
        console.error('❌ Verification failed:', error);
        return false;
    }
}

async function runMigration() {
    console.log('🚀 Starting database migration...');
    console.log(`📍 Database: ${process.env.DATABASE_URL ? 'Production' : 'Local'}`);
    console.log('================================\n');

    try {
        // Test database connection
        await pool.query('SELECT NOW()');
        console.log('✅ Database connection successful\n');

        // Create backup
        await createBackup();

        // Create tables
        await createTables();

        // Migrate data
        await migrateConfig();
        await migrateScenarios();

        // Verify migration
        const success = await verifyMigration();

        if (success) {
            console.log('\n================================');
            console.log('🎉 Migration completed successfully!');
            console.log('================================\n');
        } else {
            console.log('\n⚠️  Migration completed with warnings');
        }

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
        console.log('\n👋 Database connection closed');
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    // Check for required environment variable
    if (!process.env.DATABASE_URL) {
        console.log('⚠️  DATABASE_URL not set, using local development database');
        console.log('   For production, set: DATABASE_URL=postgresql://...\n');
    }

    runMigration();
}

module.exports = { runMigration, createTables, migrateConfig, migrateScenarios };