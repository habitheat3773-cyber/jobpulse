/**
 * Jobs Controller - Handles all job-related API operations
 */

const Job = require("../models/Job");
const { validationResult } = require("express-validator");

// ── GET /api/jobs - List all jobs with filters & pagination ───────────────────
exports.getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      state,
      education,
      gov_type,
      search,
      sort = "created_at",
      featured,
      trending,
    } = req.query;

    const query = { is_active: true };

    // Apply filters
    if (category) query.category = category;
    if (state) query.state = state;
    if (education) query.education_level = education;
    if (gov_type) query.government_type = gov_type;
    if (featured === "true") query.is_featured = true;
    if (trending === "true") query.is_trending = true;

    // Full-text search
    if (search) {
      query.$text = { $search: search };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sort]: -1 },
      select: "title organization posts qualification location state category education_level application_end is_featured is_trending views slug created_at short_description apply_link",
      lean: true,
    };

    const result = await Job.paginate(query, options);

    res.json({
      success: true,
      jobs: result.docs,
      pagination: {
        total: result.totalDocs,
        pages: result.totalPages,
        current: result.page,
        limit: result.limit,
        hasNext: result.hasNextPage,
        hasPrev: result.hasPrevPage,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/jobs/stats - Dashboard stats ────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [total, central, state, today] = await Promise.all([
      Job.countDocuments({ is_active: true }),
      Job.countDocuments({ is_active: true, government_type: "Central" }),
      Job.countDocuments({ is_active: true, government_type: "State" }),
      Job.countDocuments({
        is_active: true,
        created_at: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
    ]);

    // Category breakdown
    const categoryStats = await Job.aggregate([
      { $match: { is_active: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      stats: {
        total_jobs: total,
        central_govt: central,
        state_govt: state,
        added_today: today,
        categories: categoryStats,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/jobs/latest - Latest 10 jobs ─────────────────────────────────────
exports.getLatestJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ is_active: true })
      .sort({ created_at: -1 })
      .limit(12)
      .select("title organization posts location state category application_end slug created_at short_description")
      .lean();

    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/jobs/trending - Trending jobs by views ──────────────────────────
exports.getTrendingJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ is_active: true })
      .sort({ views: -1, created_at: -1 })
      .limit(8)
      .select("title organization posts location state category slug views")
      .lean();

    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/jobs/:slug - Single job details ─────────────────────────────────
exports.getJobBySlug = async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug, is_active: true }).lean();

    if (!job) return res.status(404).json({ success: false, error: "Job not found" });

    // Increment views
    await Job.findByIdAndUpdate(job._id, { $inc: { views: 1 } });

    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/jobs/search - Search jobs ───────────────────────────────────────
exports.searchJobs = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    if (!q) return res.json({ success: true, jobs: [], pagination: {} });

    const query = {
      is_active: true,
      $text: { $search: q },
    };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { score: { $meta: "textScore" }, created_at: -1 },
      lean: true,
    };

    const result = await Job.paginate(query, options);

    res.json({
      success: true,
      jobs: result.docs,
      query: q,
      pagination: {
        total: result.totalDocs,
        pages: result.totalPages,
        current: result.page,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── POST /api/jobs - Create job (Admin) ───────────────────────────────────────
exports.createJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { v4: uuidv4 } = require("uuid");
    const jobData = { ...req.body, job_id: uuidv4() };
    const job = new Job(jobData);
    await job.save();
    res.status(201).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── PUT /api/jobs/:id - Update job (Admin) ────────────────────────────────────
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, error: "Job not found" });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── DELETE /api/jobs/:id - Delete job (Admin) ─────────────────────────────────
exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndUpdate(req.params.id, { is_active: false });
    res.json({ success: true, message: "Job deactivated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
