import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import Token from '../models/Token.js';

const router = express.Router();

// POST /api/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email, and password are required.',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters.',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    existingUser.email === email
                        ? 'Email already registered.'
                        : 'Username already taken.',
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with unique uid
        const uid = uuidv4();
        const newUser = new User({
            uid,
            username,
            email,
            password: hashedPassword,
            phone: phone || '',
            role: 'Customer',
            balance: 100000,
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'Registration successful! Please login.',
            user: {
                uid: newUser.uid,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'User already exists.',
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Server error during registration.',
        });
    }
});

// POST /api/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.',
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        // Generate JWT token (expires in 24h)
        const tokenPayload = {
            uid: user.uid,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        const jwtToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        // Calculate expiry date
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Remove any existing tokens for this user
        await Token.deleteMany({ uid: user.uid });

        // Save token to database
        const tokenDoc = new Token({
            token: jwtToken,
            uid: user.uid,
            expiry,
        });
        await tokenDoc.save();

        // Set httpOnly cookie
        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/',
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            user: {
                uid: user.uid,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during login.',
        });
    }
});

// POST /api/logout
router.post('/logout', async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (token) {
            await Token.deleteOne({ token });
        }

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully.',
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during logout.',
        });
    }
});

export default router;
