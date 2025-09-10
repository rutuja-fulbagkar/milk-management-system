import User from "../../models/authModels/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  sendOTP,
  sendVerificationEmail,
  sendForgotPassEmail
} from "../../services/emailService.js"; // Custom service
import {generateRefreshToken,generateAccessToken} from '../../utils/auth/token.js'

// Register API
export const register = async (req, res) => {
  const { name, email, password, phone, role,address } = req.body;
  try {
    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          type: "validationError"
        },
        message: "Name, email,phone and password are required."
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 409,
          type: "conflictError",
          resolutions:"Try using a different email or phone address.",
        },
        message: "User with this email or phone already exists"
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
   // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    console.log("otp", otp);
    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "customer",
      address: address,
       otp,
      otpExpires,
      otpType: "email",
    });

     // 5. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 6. Save refresh token in DB (for remember-me functionality)
    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Save the user to the database
    await user.save();

    // Send verification email and/or OTP
    if (email) await sendVerificationEmail(user.email, otp);
    if (phone) await sendOTP(phone, otp);
    
    // Return success response
    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your account.",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      },
       tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// -----------------------
// OTP Verification
// -----------------------
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const user = await User.findOne({ email, otp });
    if (!user || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP." });
    }

    user.isEmailVerified = true;
    user.isPhoneVerified = true; // optional
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// -----------------------
// Resend OTP
// -----------------------
export const resendOTP = async (req, res) => {
  const { email, phone } = req.body;
  try {
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Provide either email or phone.",
      });
    }

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if ((email && user.isEmailVerified) || (phone && user.isPhoneVerified)) {
      return res.status(400).json({
        success: false,
        message: "Already verified.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    if (email) await sendVerificationEmail(email, otp);
    if (phone) await sendOTP(phone, otp);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully.",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// -----------------------
// Login
// -----------------------
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required." });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });

    if (!user.isEmailVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Email not verified." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Track login
    user.lastLogin = new Date();
    user.loginHistory.push({
      ip: req.ip,
      device: req.headers["user-agent"],
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          phone: user.phone,
          address: user.address,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      tokens: { accessToken, refreshToken },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// -----------------------
// Forgot Password
// -----------------------
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const content = `Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a>`;

    await sendForgotPassEmail(email, "Password Reset Request", content);

    res.status(200)
      .json({ success: true, message: "Password reset email sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// -----------------------
// Reset Password
// -----------------------
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password too short." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
