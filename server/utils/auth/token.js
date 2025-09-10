import jwt from "jsonwebtoken";

// Generate JWT access token
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "myStrongSecret123!@#",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } // short expiry for security
  );
};

// Generate JWT refresh token
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // longer expiry for remember-me
  );
};
