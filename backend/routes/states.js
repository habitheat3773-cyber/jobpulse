// states.js
const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

router.get("/", async (req, res) => {
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

module.exports = router;
