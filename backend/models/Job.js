/**
 * Job Model - Stores all government job notifications
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const slugify = require("slugify");

const ImportantDateSchema = new mongoose.Schema({
  label: { type: String, required: true },    // e.g. "Application Start"
  date: { type: String, required: true },     // e.g. "15 Dec 2024"
});

const JobSchema = new mongoose.Schema(
  {
    // ── Core Info ─────────────────────────────────────────────────────────────
    job_id: { type: String, unique: true, required: true },
    slug: { type: String, unique: true },
    title: { type: String, required: true, index: true },
    seo_title: { type: String },
    organization: { type: String, required: true, index: true },
    description: { type: String },
    short_description: { type: String },

    // ── Vacancy Details ───────────────────────────────────────────────────────
    posts: { type: String },                  // "500 Posts" or numeric
    total_posts: { type: Number },
    qualification: { type: String },
    age_limit: { type: String },
    application_fee: { type: String },
    salary: { type: String },

    // ── Location & Classification ─────────────────────────────────────────────
    location: { type: String },
    state: {
      type: String,
      index: true,
      enum: [
        "Central", "Punjab", "Haryana", "Delhi", "Uttar Pradesh",
        "Madhya Pradesh", "Rajasthan", "Maharashtra", "Gujarat",
        "Karnataka", "Tamil Nadu", "Andhra Pradesh", "Telangana",
        "Bihar", "Jharkhand", "Odisha", "West Bengal", "Assam",
        "Kerala", "Himachal Pradesh", "Uttarakhand", "Chhattisgarh",
        "Goa", "Jammu & Kashmir", "Other",
      ],
    },
    category: {
      type: String,
      index: true,
      enum: [
        "Police", "Railway", "Banking", "Teaching", "Defence",
        "SSC", "UPSC", "Medical", "Engineering", "PSC",
        "Forest", "Agriculture", "IT", "Postal", "Other",
      ],
    },
    education_level: {
      type: String,
      enum: ["10th Pass", "12th Pass", "Graduate", "Post Graduate", "Diploma", "Any"],
    },
    government_type: {
      type: String,
      enum: ["Central", "State"],
      default: "Central",
    },

    // ── Dates ─────────────────────────────────────────────────────────────────
    important_dates: [ImportantDateSchema],
    application_start: { type: Date },
    application_end: { type: Date },
    exam_date: { type: Date },
    result_date: { type: Date },

    // ── Links ─────────────────────────────────────────────────────────────────
    official_notification_link: { type: String },
    apply_link: { type: String },
    official_website: { type: String },

    // ── Meta ──────────────────────────────────────────────────────────────────
    scraped_source: { type: String },
    source_url: { type: String },
    is_active: { type: Boolean, default: true },
    is_featured: { type: Boolean, default: false },
    is_trending: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    tags: [{ type: String }],

    // ── SEO ───────────────────────────────────────────────────────────────────
    meta_title: { type: String },
    meta_description: { type: String },

    // ── AI Processing ─────────────────────────────────────────────────────────
    ai_processed: { type: Boolean, default: false },
    ai_processed_at: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// ── Indexes for fast search ───────────────────────────────────────────────────
JobSchema.index({ title: "text", organization: "text", description: "text", tags: "text" });
JobSchema.index({ state: 1, category: 1, is_active: 1 });
JobSchema.index({ application_end: 1 });
JobSchema.index({ created_at: -1 });
JobSchema.index({ is_featured: 1, is_trending: 1 });

// ── Auto-generate slug before save ───────────────────────────────────────────
JobSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(`${this.title}-${this.organization}`, {
      lower: true,
      strict: true,
    });
  }
  if (!this.meta_title) {
    this.meta_title = `${this.title} - ${this.organization} Recruitment ${new Date().getFullYear()}`;
  }
  if (!this.meta_description && this.short_description) {
    this.meta_description = this.short_description.substring(0, 160);
  }
  next();
});

JobSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Job", JobSchema);
