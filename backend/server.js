const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'PCOS HOMA-IQ Score API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint - API information
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'PCOS HOMA-IQ Score API',
        version: '1.0.0',
        status: 'Running',
        endpoints: {
            health: 'GET /health',
            auth: {
                signup: 'POST /api/auth/signup',
                login: 'POST /api/auth/login',
                logout: 'POST /api/auth/logout',
                verify: 'GET /api/auth/verify'
            },
            data: {
                create: 'POST /api/data',
                list: 'GET /api/data',
                get: 'GET /api/data/:id',
                update: 'PUT /api/data/:id',
                delete: 'DELETE /api/data/:id',
                stats: 'GET /api/data/stats/summary'
            }
        },
        documentation: 'https://github.com/muddusurendranehru/pcos_homaiq_score'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏥  PCOS HOMA-IQ Score API Server                      ║
║                                                           ║
║   📡  Server running on port ${PORT}                        ║
║   🌐  http://localhost:${PORT}                             ║
║   💚  Database: pcos_homaiq_score (Neon PostgreSQL)      ║
║                                                           ║
║   Available endpoints:                                    ║
║   • GET  /health                                         ║
║   • POST /api/auth/signup                                ║
║   • POST /api/auth/login                                 ║
║   • POST /api/auth/logout                                ║
║   • GET  /api/auth/verify                                ║
║   • POST /api/data (protected)                           ║
║   • GET  /api/data (protected)                           ║
║   • GET  /api/data/:id (protected)                       ║
║   • PUT  /api/data/:id (protected)                       ║
║   • DELETE /api/data/:id (protected)                     ║
║   • GET  /api/data/stats/summary (protected)             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;

