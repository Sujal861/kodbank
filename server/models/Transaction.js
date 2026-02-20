import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        senderUid: { type: String, required: true, index: true },
        senderUsername: { type: String, required: true },
        receiverUid: { type: String, required: true, index: true },
        receiverUsername: { type: String, required: true },
        amount: { type: Number, required: true, min: [1, 'Minimum transfer is ₹1'] },
        type: { type: String, enum: ['transfer', 'credit', 'debit'], default: 'transfer' },
        note: { type: String, maxlength: 200, default: '' },
        status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
    },
    { timestamps: true }
);

transactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
