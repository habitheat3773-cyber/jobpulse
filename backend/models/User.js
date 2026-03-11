/**
 * User Model - Platform users with alert preferences
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String },
    telegram_chat_id: { type: String },

    // ── Alert Preferences ─────────────────────────────────────────────────────
    alert_categories: [{ type: String }],       // ["Police", "Railway"]
    alert_states: [{ type: String }],            // ["Punjab", "Central"]
    alert_education: [{ type: String }],         // ["Graduate", "12th Pass"]

    // ── Notification Channels ─────────────────────────────────────────────────
    email_alerts: { type: Boolean, default: true },
    push_alerts: { type: Boolean, default: false },
    telegram_alerts: { type: Boolean, default: false },

    // ── Saved Jobs ────────────────────────────────────────────────────────────
    saved_jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

    // ── Account Status ────────────────────────────────────────────────────────
    is_verified: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    verification_token: { type: String },
    reset_password_token: { type: String },
    reset_password_expires: { type: Date },
    last_login: { type: Date },
    profile_photo: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

// Omit password from JSON output
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verification_token;
  delete obj.reset_password_token;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);
