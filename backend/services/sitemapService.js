/**
 * Sitemap Service - Auto-generates XML sitemap for SEO
 */

const Job = require("../models/Job");

exports.generateSitemap = async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || "https://jobpulseindia.com";
    const jobs = await Job.find({ is_active: true }).select("slug updated_at").lean();

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/jobs", priority: "0.9", changefreq: "hourly" },
      { url: "/categories", priority: "0.8", changefreq: "weekly" },
      { url: "/states", priority: "0.8", changefreq: "weekly" },
      { url: "/about", priority: "0.5", changefreq: "monthly" },
    ];

    const jobUrls = jobs
      .map(
        (job) => `
    <url>
      <loc>${baseUrl}/jobs/${job.slug}</loc>
      <lastmod>${new Date(job.updated_at || Date.now()).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`
      )
      .join("");

    const staticUrls = staticPages
      .map(
        (p) => `
    <url>
      <loc>${baseUrl}${p.url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${p.changefreq}</changefreq>
      <priority>${p.priority}</priority>
    </url>`
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${jobUrls}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Sitemap generation failed");
  }
};
