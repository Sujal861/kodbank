import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Token from '../models/Token.js';

const router = express.Router();

// GET /api/token - Get user's JWT token info (protected)
router.get('/token', authMiddleware, async (req, res) => {
    try {
        const token = req.cookies?.token;

        const dbToken = await Token.findOne({ uid: req.user.uid });

        if (!dbToken) {
            return res.status(404).json({
                success: false,
                message: 'No active token found.',
            });
        }

        // Mask the token for security (show first 20 and last 10 chars)
        const maskedToken =
            dbToken.token.substring(0, 20) +
            '...' +
            dbToken.token.substring(dbToken.token.length - 10);

        return res.status(200).json({
            success: true,
            data: {
                token: dbToken.token,
                maskedToken,
                uid: dbToken.uid,
                expiry: dbToken.expiry,
                createdAt: dbToken.createdAt,
            },
        });
    } catch (error) {
        console.error('Token fetch error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching token.',
        });
    }
});

export default router;
