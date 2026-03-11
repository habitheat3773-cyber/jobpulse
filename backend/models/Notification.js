/**
 * Notification Model
 */
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    type: {
      type: String,
      enum: ["new_job", "deadline_reminder", "admit_card", "result", "exam_date"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },
    channel: { type: String, enum: ["email", "push", "telegram"], default: "email" },
    sent_at: { type: Date },
    is_sent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, is_read: 1 });
NotificationSchema.index({ is_sent: 1, sent_at: 1 });

const Notification = mongoose.model("Notification", NotificationSchema);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Category Model
 */
const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    icon: { type: String },             // emoji or icon name
    description: { type: String },
    color: { type: String },            // hex color for UI
    job_count: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
    sort_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crawler Log Model - Tracks automation runs
 */
const CrawlerLogSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    started_at: { type: Date, required: true },
    completed_at: { type: Date },
    status: { type: String, enum: ["running", "completed", "failed"], default: "running" },
    jobs_found: { type: Number, default: 0 },
    jobs_new: { type: Number, default: 0 },
    jobs_updated: { type: Number, default: 0 },
    error_message: { type: String },
    duration_ms: { type: Number },
  },
  { timestamps: true }
);

const CrawlerLog = mongoose.model("CrawlerLog", CrawlerLogSchema);

module.exports = { Notification, Category, CrawlerLog };
