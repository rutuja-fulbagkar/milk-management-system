import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    // Basic details
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: (val) => /^\d{10}$/.test(val),
        message: "Phone number must be 10 digits",
      },
    },

    // Local authentication
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    // Social login providers
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },

    // OTP authentication
    otp: String,
    otpType: { type: String, enum: ["email", "phone"], default: null },
    otpExpires: Date,
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },

    // Email/Phone verification tokens
    emailVerificationToken: String,
    emailVerificationTokenExpiry: Date,
    phoneVerificationToken: String,
    phoneVerificationTokenExpiry: Date,

    // Password reset token
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Roles & profile logic
    role: {
      type: String,
      enum: [
        "admin",
        "farmer",
        "customer",
        "delivery",
        "supplier",
        "distributor",
        "retailer",
        "wholesaler",
        "agent",
        "partner",
      ],
      default: "customer",
    },
    profile: { type: mongoose.Schema.Types.Mixed }, // Role-specific extra fields

    // Account management
    address: { type: String, trim: true },
    isActive: { type: Boolean, default: true },

    // Login/session tracking
    lastLogin: { type: Date },
    loginHistory: [
      {
        ip: String,
        device: String,
        loggedInAt: { type: Date, default: Date.now },
      },
    ],

    // Token management
    refreshTokens: [
      {
        token: String,
        createdAt: { type: Date, default: Date.now },
        expiresAt: Date, // optional expiry
      },
    ],

    // 2FA (future-ready)
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
  },
  { timestamps: true }
);

 
const User = mongoose.model("User", userSchema);
export default User;

// // This schema is designed to support different
// covering local login, social login, OTP, verification, 2FA, roles, account status, tokens, and session tracking.
// “When user logs in, and when he visits after some time, he must be remembered.”

// store refresh tokens & login history so that you can:
// Keep users logged in (“Remember Me”)
// Track last login + multiple devices
// Revoke sessions if needed (logout from all devices)