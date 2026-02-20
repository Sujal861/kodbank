import express from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// POST /api/transfer — Send money to another user
router.post('/transfer', authMiddleware, async (req, res) => {
    try {
        const { recipient, amount, note } = req.body;
        const transferAmount = Number(amount);

        if (!recipient || !transferAmount) {
            return res.status(400).json({ success: false, message: 'Recipient and amount are required.' });
        }
        if (transferAmount < 1) {
            return res.status(400).json({ success: false, message: 'Minimum transfer amount is ₹1.' });
        }
        if (transferAmount > 1000000) {
            return res.status(400).json({ success: false, message: 'Maximum transfer limit is ₹10,00,000.' });
        }

        // Find sender
        const sender = await User.findOne({ uid: req.user.uid });
        if (!sender) {
            return res.status(404).json({ success: false, message: 'Sender account not found.' });
        }

        // Check balance
        if (sender.balance < transferAmount) {
            return res.status(400).json({ success: false, message: 'Insufficient balance.' });
        }

        // Find receiver by email or username
        const receiver = await User.findOne({
            $or: [
                { email: recipient.toLowerCase() },
                { username: recipient.toLowerCase() },
            ],
        });

        if (!receiver) {
            return res.status(404).json({ success: false, message: 'Recipient not found. Check email or username.' });
        }

        if (receiver.uid === sender.uid) {
            return res.status(400).json({ success: false, message: 'Cannot transfer to yourself.' });
        }

        // Execute transfer
        sender.balance -= transferAmount;
        receiver.balance += transferAmount;

        await sender.save();
        await receiver.save();

        // Create transaction record
        const transaction = await Transaction.create({
            senderUid: sender.uid,
            senderUsername: sender.username,
            receiverUid: receiver.uid,
            receiverUsername: receiver.username,
            amount: transferAmount,
            type: 'transfer',
            note: note || '',
            status: 'completed',
        });

        res.json({
            success: true,
            message: `₹${transferAmount.toLocaleString('en-IN')} sent to ${receiver.username}!`,
            data: {
                transactionId: transaction._id,
                amount: transferAmount,
                receiver: receiver.username,
                newBalance: sender.balance,
            },
        });
    } catch (error) {
        console.error('Transfer error:', error);
        res.status(500).json({ success: false, message: 'Transfer failed. Please try again.' });
    }
});

// GET /api/transactions — Get user's transaction history
router.get('/transactions', authMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const userUid = req.user.uid;

        const transactions = await Transaction.find({
            $or: [{ senderUid: userUid }, { receiverUid: userUid }],
        })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Transaction.countDocuments({
            $or: [{ senderUid: userUid }, { receiverUid: userUid }],
        });

        const formatted = transactions.map((t) => ({
            id: t._id,
            type: t.senderUid === userUid ? 'sent' : 'received',
            amount: t.amount,
            counterparty: t.senderUid === userUid ? t.receiverUsername : t.senderUsername,
            note: t.note,
            status: t.status,
            date: t.createdAt,
        }));

        res.json({
            success: true,
            data: {
                transactions: formatted,
                pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
            },
        });
    } catch (error) {
        console.error('Transaction history error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch transactions.' });
    }
});

// GET /api/profile — Get full user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.user.uid }).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        const txCount = await Transaction.countDocuments({
            $or: [{ senderUid: user.uid }, { receiverUid: user.uid }],
        });
        res.json({
            success: true,
            data: {
                uid: user.uid,
                username: user.username,
                email: user.email,
                phone: user.phone || 'Not set',
                balance: user.balance,
                role: user.role,
                totalTransactions: txCount,
                memberSince: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
    }
});

export default router;
