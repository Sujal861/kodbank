import express from 'express';
import authMiddleware from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/balance - Get user balance (protected)
router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.user.uid }).select(
            'uid username email balance role'
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                uid: user.uid,
                username: user.username,
                email: user.email,
                balance: user.balance,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Balance fetch error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching balance.',
        });
    }
});

export default router;
