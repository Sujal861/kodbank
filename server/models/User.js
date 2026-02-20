import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    balance: {
      type: Number,
      default: 100000,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: 'Customer',
      enum: ['Customer'],
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
