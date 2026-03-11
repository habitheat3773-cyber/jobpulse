/**
 * Job Routes
 */
const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", jobController.getJobs);
router.get("/stats", jobController.getStats);
router.get("/latest", jobController.getLatestJobs);
router.get("/trending", jobController.getTrendingJobs);
router.get("/search", jobController.searchJobs);
router.get("/:slug", jobController.getJobBySlug);
router.post("/", protect, adminOnly, jobController.createJob);
router.put("/:id", protect, adminOnly, jobController.updateJob);
router.delete("/:id", protect, adminOnly, jobController.deleteJob);

module.exports = router;
