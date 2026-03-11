/**
 * Auth Controller - User registration, login, token management
 */

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const emailService = require("../services/emailService");
const { validationResult } = require("express-validator");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "jobpulse_secret_key", {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

// ── POST /api/auth/register ───────────────────────────────────────────────────
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password, alert_categories, alert_states } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      alert_categories: alert_categories || [],
      alert_states: alert_states || [],
      verification_token: verificationToken,
    });

    // Send verification email (non-blocking)
    emailService
      .sendVerificationEmail(user.email, user.name, verificationToken)
      .catch(console.error);

    const token = signToken(user._id);
    res.status(201).json({
      success: true,
      message: "Registration successful! Please verify your email.",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────────
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: "Account deactivated" });
    }

    user.last_login = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/auth/verify/:token ───────────────────────────────────────────────
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verification_token: req.params.token });
    if (!user) return res.status(400).json({ error: "Invalid verification token" });

    user.is_verified = true;
    user.verification_token = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: "Email verified successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: "No user with that email" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.reset_password_token = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.reset_password_expires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    emailService.sendPasswordResetEmail(user.email, user.name, resetToken).catch(console.error);

    res.json({ success: true, message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("saved_jobs", "title organization slug");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
