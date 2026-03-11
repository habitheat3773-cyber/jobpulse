/**
 * Notification Service - Match new jobs with user preferences and send alerts
 */

const User = require("../models/User");
const { Notification } = require("../models/Notification");
const emailService = require("./emailService");

exports.notifyUsers = async (newJobs) => {
  try {
    // Get all users with active email alerts
    const users = await User.find({
      is_active: true,
      email_alerts: true,
      $or: [
        { alert_categories: { $exists: true, $not: { $size: 0 } } },
        { alert_states: { $exists: true, $not: { $size: 0 } } },
      ],
    });

    console.log(`📧 Checking ${users.length} users for job matches...`);

    for (const user of users) {
      // Find matching jobs for this user
      const matchedJobs = newJobs.filter((job) => {
        const catMatch =
          user.alert_categories.length === 0 ||
          user.alert_categories.includes(job.category);
        const stateMatch =
          user.alert_states.length === 0 ||
          user.alert_states.includes(job.state) ||
          job.state === "Central";
        const eduMatch =
          !user.alert_education || user.alert_education.length === 0 ||
          user.alert_education.includes(job.education_level) ||
          job.education_level === "Any";
        return catMatch && stateMatch && eduMatch;
      });

      if (matchedJobs.length === 0) continue;

      // Create in-app notifications
      const notifs = matchedJobs.map((job) => ({
        user: user._id,
        job: job._id,
        type: "new_job",
        title: `New ${job.category} Job: ${job.title}`,
        message: `${job.organization} has posted a new vacancy. ${job.posts || ""} posts available.`,
        channel: "email",
      }));

      await Notification.insertMany(notifs, { ordered: false }).catch(() => {});

      // Send email alert (batch all matched jobs in one email)
      if (user.email_alerts) {
        await emailService
          .sendJobAlertEmail(user.email, user.name, matchedJobs.slice(0, 5))
          .catch((e) => console.error(`Email failed for ${user.email}:`, e.message));
      }
    }

    console.log(`✅ Notifications sent for ${newJobs.length} new jobs`);
  } catch (err) {
    console.error("Notification error:", err.message);
  }
};
