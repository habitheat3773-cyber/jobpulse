/**
 * Email Service - Send alerts and notifications via Nodemailer
 */

const nodemailer = require("nodemailer");

const createTransporter = () =>
  nodemailer.createTransporter({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

exports.sendVerificationEmail = async (email, name, token) => {
  const transporter = createTransporter();
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"JobPulse India" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your JobPulse India account",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#2563eb;padding:20px;text-align:center;">
          <h1 style="color:white;margin:0;">JobPulse India</h1>
        </div>
        <div style="padding:30px;background:#f9fafb;">
          <h2>Hello ${name}!</h2>
          <p>Thanks for joining JobPulse India — India's Smart Government Job Alert Platform.</p>
          <p>Please verify your email to start receiving job alerts:</p>
          <a href="${url}" style="background:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;margin:15px 0;">Verify Email</a>
          <p style="color:#6b7280;font-size:14px;">Link expires in 24 hours.</p>
        </div>
      </div>
    `,
  });
};

exports.sendPasswordResetEmail = async (email, name, token) => {
  const transporter = createTransporter();
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"JobPulse India" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your JobPulse India password",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h2>Hello ${name},</h2>
        <p>You requested a password reset for your JobPulse India account.</p>
        <a href="${url}" style="background:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Reset Password</a>
        <p style="color:#6b7280;font-size:14px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
};

exports.sendJobAlertEmail = async (email, name, jobs) => {
  const transporter = createTransporter();
  const jobListHtml = jobs
    .map(
      (j) => `
    <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px;background:white;">
      <h3 style="margin:0 0 8px;color:#1e40af;">${j.title}</h3>
      <p style="margin:4px 0;color:#4b5563;"><strong>Organization:</strong> ${j.organization}</p>
      <p style="margin:4px 0;color:#4b5563;"><strong>Posts:</strong> ${j.posts || "N/A"} | <strong>State:</strong> ${j.state}</p>
      <a href="${process.env.FRONTEND_URL}/jobs/${j.slug}" style="background:#f97316;color:white;padding:8px 16px;text-decoration:none;border-radius:4px;display:inline-block;margin-top:8px;font-size:14px;">View Details →</a>
    </div>
  `
    )
    .join("");

  await transporter.sendMail({
    from: `"JobPulse India" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `🔔 ${jobs.length} New Government Jobs Alert - JobPulse India`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#2563eb;padding:20px;text-align:center;">
          <h1 style="color:white;margin:0;">JobPulse India</h1>
          <p style="color:#bfdbfe;margin:4px 0;">India's Smart Government Job Alert Platform</p>
        </div>
        <div style="padding:24px;background:#f9fafb;">
          <h2 style="color:#1f2937;">Hello ${name}, new jobs are waiting!</h2>
          <p style="color:#4b5563;">${jobs.length} new government job${jobs.length > 1 ? "s" : ""} match your preferences:</p>
          ${jobListHtml}
          <div style="text-align:center;margin-top:24px;">
            <a href="${process.env.FRONTEND_URL}/jobs" style="background:#2563eb;color:white;padding:12px 32px;text-decoration:none;border-radius:6px;display:inline-block;">View All Jobs</a>
          </div>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px;text-align:center;">
            <a href="${process.env.FRONTEND_URL}/dashboard/settings" style="color:#6b7280;">Manage alert preferences</a> | 
            <a href="${process.env.FRONTEND_URL}/unsubscribe" style="color:#6b7280;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
  });
};

module.exports = exports;
