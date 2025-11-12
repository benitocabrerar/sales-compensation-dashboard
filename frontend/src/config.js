/**
 * Application configuration
 * Handles API endpoints and environment-specific settings
 */

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Remove trailing slash if present
const normalizedApiUrl = API_URL.replace(/\/$/, '');

export const config = {
    // API Base URL
    API_URL: normalizedApiUrl,

    // API Endpoints
    endpoints: {
        health: `${normalizedApiUrl}/api/health`,
        config: `${normalizedApiUrl}/api/config`,
        scenarios: `${normalizedApiUrl}/api/scenarios`,
        calculate: `${normalizedApiUrl}/api/calculate`,
        exportCsv: `${normalizedApiUrl}/api/export/csv`
    },

    // Application settings
    app: {
        name: 'Sales Compensation Dashboard',
        version: '1.0.0',
        environment: import.meta.env.MODE || 'development'
    },

    // Feature flags
    features: {
        enableExport: true,
        enableScenarios: true,
        enableLeadAnalysis: true,
        enableDebugMode: import.meta.env.MODE === 'development'
    },

    // UI Configuration
    ui: {
        theme: 'light',
        animationDuration: 300,
        toastDuration: 3000,
        debounceDelay: 500
    },

    // Data formatting
    formatting: {
        currency: {
            locale: 'en-US',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        },
        percentage: {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        },
        number: {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    },

    // Request configuration
    request: {
        timeout: 30000, // 30 seconds
        retries: 3,
        retryDelay: 1000 // 1 second
    }
};

// Export helper functions
export const formatCurrency = (value) => {
    return new Intl.NumberFormat(
        config.formatting.currency.locale,
        {
            style: 'currency',
            currency: config.formatting.currency.currency,
            minimumFractionDigits: config.formatting.currency.minimumFractionDigits,
            maximumFractionDigits: config.formatting.currency.maximumFractionDigits
        }
    ).format(value);
};

export const formatPercentage = (value) => {
    return `${(value * 100).toFixed(config.formatting.percentage.maximumFractionDigits)}%`;
};

export const formatNumber = (value) => {
    return new Intl.NumberFormat(
        config.formatting.currency.locale,
        {
            minimumFractionDigits: config.formatting.number.minimumFractionDigits,
            maximumFractionDigits: config.formatting.number.maximumFractionDigits
        }
    ).format(value);
};

// Debug logging
export const debugLog = (...args) => {
    if (config.features.enableDebugMode) {
        console.log('[DEBUG]', ...args);
    }
};

// Environment checks
export const isProduction = () => config.app.environment === 'production';
export const isDevelopment = () => config.app.environment === 'development';

export default config;