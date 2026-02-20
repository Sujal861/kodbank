import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
        },
        uid: {
            type: String,
            required: true,
            ref: 'User',
        },
        expiry: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

// Index for cleanup of expired tokens
tokenSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model('Token', tokenSchema);
export default Token;
