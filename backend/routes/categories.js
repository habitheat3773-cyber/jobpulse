// ── categories.js ─────────────────────────────────────────────────────────────
const express = require("express");
const categoryRouter = express.Router();
const Job = require("../models/Job");
const { Category } = require("../models/Notification");

categoryRouter.get("/", async (req, res) => {
  try {
    const categories = await Job.aggregate([
      { $match: { is_active: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── states.js ─────────────────────────────────────────────────────────────────
const stateRouter = express.Router();
stateRouter.get("/", async (req, res) => {
  try {
    const states = await Job.aggregate([
      { $match: { is_active: true } },
      { $group: { _id: "$state", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, states });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── notifications.js ──────────────────────────────────────────────────────────
const notifRouter = express.Router();
const { Notification } = require("../models/Notification");
const { protect } = require("../middleware/auth");

notifRouter.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("job", "title slug");
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

notifRouter.put("/:id/read", protect, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { is_read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── admin.js ──────────────────────────────────────────────────────────────────
const adminRouter = express.Router();
const User = require("../models/User");
const { CrawlerLog } = require("../models/Notification");
const { protect: protectAdmin, adminOnly } = require("../middleware/auth");

adminRouter.use(protectAdmin, adminOnly);

adminRouter.get("/dashboard", async (req, res) => {
  try {
    const [totalJobs, totalUsers, recentLogs, topJobs] = await Promise.all([
      Job.countDocuments({ is_active: true }),
      User.countDocuments({ is_active: true }),
      CrawlerLog.find().sort({ started_at: -1 }).limit(10),
      Job.find({ is_active: true }).sort({ views: -1 }).limit(10).select("title views organization"),
    ]);
    res.json({ success: true, data: { totalJobs, totalUsers, recentLogs, topJobs } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ created_at: -1 }).limit(100).select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.put("/jobs/:id/feature", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { is_featured: req.body.featured },
      { new: true }
    );
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── crawler.js ────────────────────────────────────────────────────────────────
const crawlerRouter = express.Router();
const { CrawlerLog: CLog } = require("../models/Notification");
const { protect: prot, adminOnly: ao } = require("../middleware/auth");

crawlerRouter.get("/logs", prot, ao, async (req, res) => {
  try {
    const logs = await CLog.find().sort({ started_at: -1 }).limit(50);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

crawlerRouter.post("/trigger", prot, ao, async (req, res) => {
  try {
    const { runCrawler } = require("../services/crawlerService");
    res.json({ success: true, message: "Crawler triggered. Running in background..." });
    runCrawler().catch(console.error); // Fire and forget
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = {
  categoryRoutes: categoryRouter,
  stateRoutes: stateRouter,
  notificationRoutes: notifRouter,
  adminRoutes: adminRouter,
  crawlerRoutes: crawlerRouter,
};
