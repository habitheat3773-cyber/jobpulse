/**
 * AI Service - Processes raw job data using Claude API
 * - Cleans and rewrites job descriptions
 * - Generates SEO titles and meta descriptions
 * - Auto-categorizes jobs
 * - Generates search tags
 */

const axios = require("axios");
const Job = require("../models/Job");

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// ─── Process a job with Claude API ───────────────────────────────────────────
const processJobWithAI = async (job) => {
  if (!ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not set — skipping AI processing");
    return null;
  }

  const prompt = `You are a government job portal content writer for India. 
  
Given this raw government job data, please provide:
1. A clean, readable job description (2-3 paragraphs)
2. An SEO-optimized title (max 70 chars)
3. A meta description (max 160 chars)  
4. 5-8 relevant tags (comma separated)

Raw data:
Title: ${job.title}
Organization: ${job.organization}
Description: ${job.description || "Not available"}
Posts: ${job.posts || "Not specified"}
Qualification: ${job.qualification || "Not specified"}
State: ${job.state}
Category: ${job.category}

Respond in this EXACT JSON format only, no other text:
{
  "description": "...",
  "seo_title": "...",
  "meta_description": "...",
  "tags": ["tag1", "tag2", "..."]
}`;

  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const text = response.data.content[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error(`AI processing error for job ${job._id}:`, err.message);
    return null;
  }
};

// ─── Batch process multiple jobs ─────────────────────────────────────────────
exports.processJobs = async (jobs) => {
  console.log(`🧠 AI processing ${jobs.length} new jobs...`);

  // Process max 10 at a time to avoid rate limits, with delay
  const batchSize = 5;
  for (let i = 0; i < Math.min(jobs.length, 20); i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (job) => {
        const result = await processJobWithAI(job);
        if (result) {
          await Job.findByIdAndUpdate(job._id, {
            description: result.description || job.description,
            seo_title: result.seo_title,
            meta_description: result.meta_description,
            tags: result.tags || job.tags,
            ai_processed: true,
            ai_processed_at: new Date(),
          });
        }
      })
    );

    // Rate limit delay between batches
    if (i + batchSize < jobs.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log(`✅ AI processing complete for ${Math.min(jobs.length, 20)} jobs`);
};
