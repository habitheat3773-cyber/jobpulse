const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const User = require("../models/User");
const { CrawlerLog } = require("../models/Notification");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect, adminOnly);

router.get("/dashboard", async (req, res) => {
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

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ created_at: -1 }).limit(100).select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/jobs/:id/feature", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { is_featured: req.body.featured }, { new: true });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
