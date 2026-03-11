/**
 * /jobs/[slug] - Job Details Page
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { NextSeo, JobPostingJsonLd } from "next-seo";
import Layout from "../../components/layout/Layout";
import { jobsAPI, usersAPI } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import {
  HiLocationMarker, HiCalendar, HiOfficeBuilding, HiUsers,
  HiAcademicCap, HiArrowLeft, HiDocumentText, HiCurrencyRupee,
  HiExternalLink, HiBookmark, HiShare
} from "react-icons/hi";
import { MdVerified } from "react-icons/md";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function JobDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!slug) return;
    jobsAPI
      .getBySlug(slug)
      .then((res) => {
        setJob(res.data.job);
        setSaved(user?.saved_jobs?.includes(res.data.job._id));
      })
      .catch(() => router.push("/404"))
      .finally(() => setLoading(false));
  }, [slug, user]);

  const handleSave = async () => {
    if (!user) { toast.error("Please login to save jobs"); return; }
    await usersAPI.saveJob(job._id);
    setSaved(!saved);
    toast.success(saved ? "Removed from saved" : "Job saved!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: job.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="skeleton h-8 w-32 rounded mb-6" />
          <div className="card p-8">
            <div className="skeleton h-7 w-3/4 rounded mb-3" />
            <div className="skeleton h-5 w-1/2 rounded mb-6" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!job) return null;

  const infoItems = [
    { icon: HiOfficeBuilding, label: "Organization", value: job.organization },
    { icon: HiUsers, label: "Total Posts", value: job.posts || "Not Specified" },
    { icon: HiAcademicCap, label: "Qualification", value: job.qualification || job.education_level || "Not Specified" },
    { icon: HiLocationMarker, label: "Location", value: job.state || job.location || "India" },
    { icon: HiCurrencyRupee, label: "Application Fee", value: job.application_fee || "Check Notification" },
    { icon: HiCalendar, label: "Age Limit", value: job.age_limit || "As per rules" },
  ];

  return (
    <Layout>
      <NextSeo
        title={job.meta_title || `${job.title} - ${job.organization}`}
        description={job.meta_description || job.short_description}
      />
      {job.application_end && (
        <JobPostingJsonLd
          datePosted={job.created_at}
          description={job.description || job.short_description || ""}
          hiringOrganization={{ name: job.organization, sameAs: job.official_website || "" }}
          jobLocation={{ addressCountry: "IN", addressRegion: job.state || "India" }}
          title={job.title}
          validThrough={job.application_end}
          employmentType="FULL_TIME"
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-primary-600">Jobs</Link>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-xs">{job.title}</span>
        </div>

        {/* Main Card */}
        <div className="card p-6 sm:p-8 mb-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge badge-blue">{job.category}</span>
                <span className="badge bg-gray-100 text-gray-600">{job.government_type} Govt</span>
                {job.education_level && (
                  <span className="badge badge-green">{job.education_level}</span>
                )}
                {job.is_trending && (
                  <span className="badge bg-orange-100 text-orange-700">🔥 Trending</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MdVerified className="text-primary-500 flex-shrink-0" />
                <span className="font-semibold">{job.organization}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleSave}
                className={`p-2.5 rounded-lg border transition-all ${saved ? "bg-primary-50 border-primary-200 text-primary-600" : "border-gray-200 text-gray-500 hover:border-primary-300"}`}
                title="Save job"
              >
                <HiBookmark />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-lg border border-gray-200 text-gray-500 hover:border-primary-300 transition-all"
                title="Share"
              >
                <HiShare />
              </button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {infoItems.map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 bg-primary-100 rounded-lg flex-shrink-0">
                  <item.icon className="text-primary-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-0.5">{item.label}</div>
                  <div className="text-sm font-semibold text-gray-800">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Important Dates */}
          {job.important_dates?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HiCalendar className="text-primary-500" /> Important Dates
              </h2>
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <tbody>
                    {job.important_dates.map((d, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 font-medium text-gray-700 w-1/2">{d.label}</td>
                        <td className="px-4 py-3 text-primary-700 font-semibold">{d.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Description */}
          {job.description && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            {job.apply_link && (
              <a
                href={job.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent flex items-center justify-center gap-2 flex-1 text-center py-3"
              >
                Apply Now <HiExternalLink />
              </a>
            )}
            {job.official_notification_link && (
              <a
                href={job.official_notification_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center justify-center gap-2 flex-1 text-center py-3"
              >
                <HiDocumentText /> Download Notification
              </a>
            )}
          </div>
        </div>

        {/* Back */}
        <Link href="/jobs" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors">
          <HiArrowLeft /> Back to all jobs
        </Link>
      </div>
    </Layout>
  );
}
