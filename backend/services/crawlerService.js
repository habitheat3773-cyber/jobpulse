/**
 * Crawler Service - Automated Government Job Data Collection
 *
 * Sources scraped:
 * - FreeJobAlert (freejobsalert.com)
 * - SarkariResult (sarkariresult.com)
 * - Employment News (employmentnews.gov.in)
 * - NCS National Career Service (ncs.gov.in)
 *
 * NOTE: This scraper uses public HTML parsing. Always check robots.txt
 * of target sites and comply with their terms of service.
 * For production, consider official RSS feeds or government APIs.
 */

const axios = require("axios");
const cheerio = require("cheerio");
const { v4: uuidv4 } = require("uuid");
const Job = require("../models/Job");
const { CrawlerLog } = require("../models/Notification");
const aiService = require("./aiService");
const notificationService = require("./notificationService");

// ─── HTTP client with headers to mimic browser ────────────────────────────────
const http = axios.create({
  timeout: 30000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
    "Cache-Control": "no-cache",
  },
});

// ─── Category detection from title keywords ───────────────────────────────────
const detectCategory = (title, org) => {
  const text = `${title} ${org}`.toLowerCase();
  if (/police|constable|cop|si |sub inspector/.test(text)) return "Police";
  if (/railway|rail|rrb|ntpc/.test(text)) return "Railway";
  if (/bank|sbi|ibps|rbi|nabard/.test(text)) return "Banking";
  if (/teacher|teaching|tgt|pgt|school|education|bed/.test(text)) return "Teaching";
  if (/army|navy|airforce|defence|military|nda|cds/.test(text)) return "Defence";
  if (/ssc|staff selection/.test(text)) return "SSC";
  if (/upsc|ias|ips|civil service/.test(text)) return "UPSC";
  if (/doctor|nurse|medical|health|aiims|hospital/.test(text)) return "Medical";
  if (/engineer|technical|jee|gate/.test(text)) return "Engineering";
  if (/psc|public service commission/.test(text)) return "PSC";
  if (/forest|wildlife/.test(text)) return "Forest";
  if (/agri|farmer|krishi/.test(text)) return "Agriculture";
  if (/postal|post|postman/.test(text)) return "Postal";
  return "Other";
};

// ─── Education level detection ────────────────────────────────────────────────
const detectEducation = (qualification = "") => {
  const q = qualification.toLowerCase();
  if (/post.?graduate|mba|mca|msc|ma |mcom/.test(q)) return "Post Graduate";
  if (/graduate|degree|bsc|bcom|ba |btech|be /.test(q)) return "Graduate";
  if (/diploma/.test(q)) return "Diploma";
  if (/12th|intermediate|hsc|plus two/.test(q)) return "12th Pass";
  if (/10th|matric|ssc|middle/.test(q)) return "10th Pass";
  return "Any";
};

// ─── State detection ──────────────────────────────────────────────────────────
const detectState = (text) => {
  const states = [
    ["punjab", "Punjab"], ["haryana", "Haryana"], ["delhi", "Delhi"],
    ["uttar pradesh|u.p.", "Uttar Pradesh"], ["madhya pradesh|m.p.", "Madhya Pradesh"],
    ["rajasthan", "Rajasthan"], ["maharashtra", "Maharashtra"], ["gujarat", "Gujarat"],
    ["karnataka", "Karnataka"], ["tamil nadu", "Tamil Nadu"],
    ["andhra pradesh", "Andhra Pradesh"], ["telangana", "Telangana"],
    ["bihar", "Bihar"], ["jharkhand", "Jharkhand"], ["odisha", "Odisha"],
    ["west bengal", "West Bengal"], ["assam", "Assam"], ["kerala", "Kerala"],
    ["himachal pradesh", "Himachal Pradesh"], ["uttarakhand", "Uttarakhand"],
    ["chhattisgarh", "Chhattisgarh"], ["jammu|j&k", "Jammu & Kashmir"],
  ];
  const t = text.toLowerCase();
  for (const [pattern, name] of states) {
    if (new RegExp(pattern).test(t)) return name;
  }
  return "Central";
};

// ─── Source 1: FreeJobAlert ───────────────────────────────────────────────────
const scrapeFreeJobAlert = async () => {
  const jobs = [];
  try {
    const { data } = await http.get("https://www.freejobsalert.com/");
    const $ = cheerio.load(data);

    $(".postbox, .post-item, article").each((i, el) => {
      const title = $(el).find("h2 a, h3 a, .post-title a").first().text().trim();
      const link = $(el).find("h2 a, h3 a, .post-title a").first().attr("href");
      const excerpt = $(el).find(".post-excerpt, .entry-summary, p").first().text().trim();
      const dateText = $(el).find(".post-date, time, .date").first().text().trim();

      if (title && title.length > 10) {
        jobs.push({
          title,
          source_url: link,
          description: excerpt,
          date_text: dateText,
          source: "freejobsalert",
        });
      }
    });
  } catch (err) {
    console.error("FreeJobAlert scrape error:", err.message);
  }
  return jobs;
};

// ─── Source 2: SarkariResult ──────────────────────────────────────────────────
const scrapeSarkariResult = async () => {
  const jobs = [];
  try {
    const { data } = await http.get("https://www.sarkariresult.com/");
    const $ = cheerio.load(data);

    // SarkariResult uses table-based layout
    $("table tr, .notification-list li, .new-jobs a").each((i, el) => {
      const text = $(el).text().trim();
      const link = $(el).find("a").attr("href") || $(el).attr("href");

      if (text && text.length > 15 && link) {
        // Parse job info from text
        const titleMatch = text.match(/^(.{10,100}?)(?:\s+\d{1,5}\s*(?:post|vacancy|vacancies))?/i);
        if (titleMatch) {
          jobs.push({
            title: titleMatch[1].trim(),
            source_url: link?.startsWith("http") ? link : `https://www.sarkariresult.com${link}`,
            description: text,
            source: "sarkariresult",
          });
        }
      }
    });
  } catch (err) {
    console.error("SarkariResult scrape error:", err.message);
  }
  return jobs.slice(0, 30); // Limit to 30 per run
};

// ─── Source 3: Employment News (Government RSS) ───────────────────────────────
const scrapeEmploymentNews = async () => {
  const jobs = [];
  try {
    // Employment News has a public listing
    const { data } = await http.get("https://www.employmentnews.gov.in/webui/JobList.aspx");
    const $ = cheerio.load(data);

    $("table tr").each((i, el) => {
      if (i === 0) return; // Skip header
      const cols = $(el).find("td");
      if (cols.length >= 3) {
        const title = $(cols[0]).text().trim();
        const org = $(cols[1]).text().trim();
        const deadline = $(cols[2]).text().trim();
        const link = $(cols[0]).find("a").attr("href");

        if (title && title.length > 5) {
          jobs.push({
            title,
            organization: org,
            date_text: deadline,
            source_url: link ? `https://www.employmentnews.gov.in${link}` : null,
            source: "employmentnews.gov.in",
          });
        }
      }
    });
  } catch (err) {
    console.error("Employment News scrape error:", err.message);
  }
  return jobs;
};

// ─── Source 4: NCS Portal (Government API) ───────────────────────────────────
const scrapeNCSPortal = async () => {
  const jobs = [];
  try {
    // NCS has a public job search endpoint
    const { data } = await http.get(
      "https://www.ncs.gov.in/jobseeker/FindJob?pageNumber=1&pageSize=20&sector=Government"
    );
    const $ = cheerio.load(data);

    $(".job-card, .job-listing, .job-item").each((i, el) => {
      const title = $(el).find(".job-title, h3, h4").text().trim();
      const org = $(el).find(".company-name, .org-name").text().trim();
      const location = $(el).find(".location, .job-location").text().trim();
      const link = $(el).find("a").attr("href");

      if (title) {
        jobs.push({
          title,
          organization: org,
          location,
          source_url: link,
          source: "ncs.gov.in",
        });
      }
    });
  } catch (err) {
    console.error("NCS Portal scrape error:", err.message);
  }
  return jobs;
};

// ─── Transform raw scraped data into Job schema ───────────────────────────────
const transformToJob = (raw) => {
  const title = raw.title || "Government Job";
  const org = raw.organization || "Government of India";
  const text = `${title} ${org} ${raw.description || ""}`;

  return {
    job_id: uuidv4(),
    title: title.substring(0, 200),
    organization: org.substring(0, 200),
    description: raw.description || "",
    short_description: (raw.description || "").substring(0, 300),
    location: raw.location || "India",
    state: detectState(text),
    category: detectCategory(title, org),
    education_level: detectEducation(raw.qualification || raw.description || ""),
    government_type: detectState(text) === "Central" ? "Central" : "State",
    important_dates: raw.date_text
      ? [{ label: "Last Date", date: raw.date_text }]
      : [],
    apply_link: raw.source_url,
    official_notification_link: raw.source_url,
    source_url: raw.source_url,
    scraped_source: raw.source,
    is_active: true,
    tags: detectCategory(title, org) !== "Other" ? [detectCategory(title, org)] : [],
  };
};

// ─── Deduplicate and upsert jobs ─────────────────────────────────────────────
const upsertJob = async (jobData) => {
  try {
    // Check for duplicate by title + organization similarity
    const existing = await Job.findOne({
      title: { $regex: new RegExp(jobData.title.substring(0, 30), "i") },
      organization: { $regex: new RegExp(jobData.organization.substring(0, 20), "i") },
    });

    if (existing) {
      // Update link if changed
      await Job.findByIdAndUpdate(existing._id, {
        apply_link: jobData.apply_link || existing.apply_link,
        updated_at: new Date(),
      });
      return { status: "updated", id: existing._id };
    }

    const job = new Job(jobData);
    await job.save();
    return { status: "new", id: job._id, job };
  } catch (err) {
    // Ignore duplicate key errors
    if (err.code === 11000) return { status: "duplicate" };
    throw err;
  }
};

// ─── Main Crawler Function ────────────────────────────────────────────────────
exports.runCrawler = async () => {
  const log = await CrawlerLog.create({
    source: "all",
    started_at: new Date(),
    status: "running",
  });

  let totalNew = 0;
  let totalUpdated = 0;

  try {
    console.log("🤖 JobPulse Crawler starting...");

    // Run all scrapers in parallel
    const [fja, sr, en, ncs] = await Promise.allSettled([
      scrapeFreeJobAlert(),
      scrapeSarkariResult(),
      scrapeEmploymentNews(),
      scrapeNCSPortal(),
    ]);

    const allRaw = [
      ...(fja.value || []),
      ...(sr.value || []),
      ...(en.value || []),
      ...(ncs.value || []),
    ].filter((j) => j.title && j.title.length > 5);

    console.log(`📦 Found ${allRaw.length} raw job entries`);

    const newJobs = [];

    // Process and upsert each job
    for (const raw of allRaw) {
      try {
        const jobData = transformToJob(raw);
        const result = await upsertJob(jobData);

        if (result.status === "new") {
          totalNew++;
          if (result.job) newJobs.push(result.job);
        } else if (result.status === "updated") {
          totalUpdated++;
        }
      } catch (err) {
        console.error("Job processing error:", err.message);
      }
    }

    // AI process new jobs in background
    if (newJobs.length > 0) {
      aiService.processJobs(newJobs).catch(console.error);
    }

    // Send notifications for new jobs
    if (newJobs.length > 0) {
      notificationService.notifyUsers(newJobs).catch(console.error);
    }

    // Update log
    const duration = Date.now() - log.started_at.getTime();
    await CrawlerLog.findByIdAndUpdate(log._id, {
      status: "completed",
      completed_at: new Date(),
      jobs_found: allRaw.length,
      jobs_new: totalNew,
      jobs_updated: totalUpdated,
      duration_ms: duration,
    });

    console.log(`✅ Crawler complete: ${totalNew} new, ${totalUpdated} updated in ${duration}ms`);
    return { totalNew, totalUpdated };
  } catch (err) {
    await CrawlerLog.findByIdAndUpdate(log._id, {
      status: "failed",
      completed_at: new Date(),
      error_message: err.message,
    });
    console.error("❌ Crawler failed:", err.message);
    throw err;
  }
};
