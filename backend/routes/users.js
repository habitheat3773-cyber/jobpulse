// ── users.js ──────────────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Job = require("../models/Job");
const { protect } = require("../middleware/auth");

// Save/unsave a job
router.post("/save-job/:jobId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const jobId = req.params.jobId;
    const idx = user.saved_jobs.indexOf(jobId);
    if (idx > -1) {
      user.saved_jobs.splice(idx, 1);
    } else {
      user.saved_jobs.push(jobId);
    }
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, saved: idx === -1, saved_jobs: user.saved_jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update alert preferences
router.put("/preferences", protect, async (req, res) => {
  try {
    const { alert_categories, alert_states, alert_education, email_alerts } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { alert_categories, alert_states, alert_education, email_alerts },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get saved jobs
router.get("/saved-jobs", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "saved_jobs",
      select: "title organization posts state category application_end slug",
    });
    res.json({ success: true, saved_jobs: user.saved_jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
