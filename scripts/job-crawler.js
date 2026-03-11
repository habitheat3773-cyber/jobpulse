/**
 * JobPulse India - Standalone Job Crawler
 * Run manually: node scripts/job-crawler.js
 */

require("dotenv").config({ path: "./backend/.env" });
const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/jobpulse_india"
    );
    console.log("✅ DB connected");

    const { runCrawler } = require("./backend/services/crawlerService");
    const result = await runCrawler();
    console.log("✅ Done:", result);
    process.exit(0);
  } catch (err) {
    console.error("❌ Crawler error:", err.message);
    process.exit(1);
  }
})();
