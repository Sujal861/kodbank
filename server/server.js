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

// Generate a JWT secret if not provided
if (!process.env.JWT_SECRET) {
    if (process.env.VERCEL) {
        console.error("Vercel error: JWT_SECRET is missing in environment variables.");
    } else {
        process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
        console.log('⚡ Auto-generated JWT_SECRET for development');
    }
}

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

// Connect to MongoDB
let isConnected = false;
const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        isConnected = true;
        return;
    }
    try {
        let mongoUri = process.env.MONGO_URI;

        // If no MongoDB URI is configured, use in-memory MongoDB for development
        if (!mongoUri || mongoUri.includes('<DB_USER>') || mongoUri.includes('<DB_PASSWORD>')) {
            if (process.env.VERCEL) {
                console.error("Vercel error: MONGO_URI is missing or invalid in environment variables.");
                throw new Error("MONGO_URI not configured");
            }
            console.log('📦 No MongoDB Atlas URI configured. Starting in-memory MongoDB...');
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            mongoUri = mongod.getUri();
            console.log('✅ In-memory MongoDB started successfully');
            console.log('⚠️  Note: Data will be lost when the server stops.');
            console.log('   To persist data, configure MONGO_URI in .env with your Atlas connection string.\n');
        }

        await mongoose.connect(mongoUri);
        isConnected = true;
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ Failed to connect to DB:', error.message);
        throw error;
    }
};

// Database connection middleware for Serverless
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Database connection failed. Did you configure MONGO_URI?' });
    }
});

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

if (!process.env.VERCEL) {
    app.listen(PORT, async () => {
        await connectDB();
        console.log(`\n🚀 Kodbank server running on http://localhost:${PORT}`);
        console.log('   Ready to accept requests!\n');
    });
}

export default app;
