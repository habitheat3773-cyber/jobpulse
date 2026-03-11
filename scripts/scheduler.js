/**
 * JobPulse India - Automated Job Scheduler
 *
 * Runs the job crawler every 3 hours automatically.
 * Also handles deadline reminders and notification cleanup.
 *
 * Schedule:
 * - Job crawl: Every 3 hours (0 *\/3 * * *)
 * - Deadline alerts: Daily at 8 AM
 * - Cleanup old jobs: Weekly on Sundays at midnight
 */

const cron = require("node-cron");

let crawlerService;
try {
  crawlerService = require("../backend/services/crawlerService");
} catch {
  // Running standalone
  require("dotenv").config({ path: "../backend/.env" });
  const mongoose = require("mongoose");
  mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/jobpulse_india");
  crawlerService = require("../backend/services/crawlerService");
}

// ─── Schedule 1: Job crawl every 3 hours ─────────────────────────────────────
cron.schedule("0 */3 * * *", async () => {
  console.log(`[${new Date().toISOString()}] 🔄 Scheduled crawler starting...`);
  try {
    const result = await crawlerService.runCrawler();
    console.log(`[${new Date().toISOString()}] ✅ Crawl complete:`, result);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Crawl failed:`, err.message);
  }
});

// ─── Schedule 2: Deadline reminders at 8 AM daily ────────────────────────────
cron.schedule("0 8 * * *", async () => {
  console.log(`[${new Date().toISOString()}] 📅 Sending deadline reminders...`);
  try {
    const Job = require("../backend/models/Job");
    const { Notification } = require("../backend/models/Notification");
    const User = require("../backend/models/User");

    // Jobs ending in next 3 days
    const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const urgentJobs = await Job.find({
      is_active: true,
      application_end: { $gte: tomorrow, $lte: threeDaysLater },
    });

    if (urgentJobs.length > 0) {
      const users = await User.find({ is_active: true, email_alerts: true });
      for (const user of users.slice(0, 100)) {
        // Limit to prevent spam
        await Notification.create({
          user: user._id,
          type: "deadline_reminder",
          title: `⚠️ ${urgentJobs.length} job applications closing soon!`,
          message: `Applications for ${urgentJobs
            .slice(0, 3)
            .map((j) => j.title)
            .join(", ")} are closing in the next 3 days.`,
          channel: "email",
        });
      }
    }
  } catch (err) {
    console.error("Deadline reminder error:", err.message);
  }
});

// ─── Schedule 3: Deactivate expired jobs weekly ───────────────────────────────
cron.schedule("0 0 * * 0", async () => {
  console.log(`[${new Date().toISOString()}] 🗑️ Cleaning up expired jobs...`);
  try {
    const Job = require("../backend/models/Job");
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await Job.updateMany(
      { application_end: { $lt: thirtyDaysAgo }, is_active: true },
      { is_active: false }
    );
    console.log(`Deactivated ${result.modifiedCount} expired jobs`);
  } catch (err) {
    console.error("Job cleanup error:", err.message);
  }
});

console.log("⏰ JobPulse India Scheduler active");
console.log("   • Job crawl: every 3 hours");
console.log("   • Deadline alerts: daily at 8 AM");
console.log("   • Expired job cleanup: every Sunday");

module.exports = {}; // Export nothing — just runs schedules
