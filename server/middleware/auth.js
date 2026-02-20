import jwt from 'jsonwebtoken';
import Token from '../models/Token.js';

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from httpOnly cookie
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
            });
        }

        // Verify JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                // Clean up expired token from DB
                await Token.deleteOne({ token });
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired. Please login again.',
                });
            }
            return res.status(401).json({
                success: false,
                message: 'Invalid token.',
            });
        }

        // Check token exists in database and hasn't expired
        const dbToken = await Token.findOne({ token, uid: decoded.uid });

        if (!dbToken) {
            return res.status(401).json({
                success: false,
                message: 'Token not found. Please login again.',
            });
        }

        // Check DB-level expiry
        if (new Date() > new Date(dbToken.expiry)) {
            await Token.deleteOne({ _id: dbToken._id });
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please login again.',
            });
        }

        // Attach user info to request
        req.user = {
            uid: decoded.uid,
            username: decoded.username,
            email: decoded.email,
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication.',
        });
    }
};

export default authMiddleware;
