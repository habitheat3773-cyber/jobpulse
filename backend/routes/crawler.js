const express = require("express");
const router = express.Router();
const { CrawlerLog } = require("../models/Notification");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/logs", protect, adminOnly, async (req, res) => {
  try {
    const logs = await CrawlerLog.find().sort({ started_at: -1 }).limit(50);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/trigger", protect, adminOnly, async (req, res) => {
  try {
    const { runCrawler } = require("../services/crawlerService");
    res.json({ success: true, message: "Crawler triggered. Running in background..." });
    runCrawler().catch(console.error);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
