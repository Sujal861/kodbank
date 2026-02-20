import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import balanceRoutes from './routes/balance.js';
import tokenRoutes from './routes/token.js';
import transferRoutes from './routes/transfer.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Support multiple origins (comma-separated in CLIENT_URL env var)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map(s => s.trim());

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);
            if (allowedOrigins.some(allowed => origin === allowed || origin.endsWith('.vercel.app'))) {
                return callback(null, true);
            }
            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);

// Routes
app.use('/api', authRoutes);
app.use('/api', balanceRoutes);
app.use('/api', tokenRoutes);
app.use('/api', transferRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error.',
    });
});

// Generate a JWT secret if not provided
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
    console.log('⚡ Auto-generated JWT_SECRET for development');
}

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        let mongoUri = process.env.MONGO_URI;

        // If no MongoDB URI is configured, use in-memory MongoDB for development
        if (!mongoUri || mongoUri.includes('<DB_USER>') || mongoUri.includes('<DB_PASSWORD>')) {
            console.log('📦 No MongoDB Atlas URI configured. Starting in-memory MongoDB...');
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            mongoUri = mongod.getUri();
            console.log('✅ In-memory MongoDB started successfully');
            console.log('⚠️  Note: Data will be lost when the server stops.');
            console.log('   To persist data, configure MONGO_URI in .env with your Atlas connection string.\n');
        }

        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`\n🚀 Kodbank server running on http://localhost:${PORT}`);
            console.log('   Ready to accept requests!\n');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();

export default app;
