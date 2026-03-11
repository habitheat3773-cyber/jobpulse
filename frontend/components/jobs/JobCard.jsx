/**
 * JobCard - Reusable card for displaying job listings
 */

import Link from "next/link";
import { HiLocationMarker, HiCalendar, HiOfficeBuilding, HiUsers, HiAcademicCap } from "react-icons/hi";
import { MdFiberNew } from "react-icons/md";
import { BsBookmarkPlus, BsBookmarkFill } from "react-icons/bs";
import { formatDistanceToNow, isPast, isWithinInterval, addDays } from "date-fns";
import { useAuth } from "../../hooks/useAuth";
import { usersAPI } from "../../lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

const CATEGORY_COLORS = {
  Police: "badge-blue",
  Railway: "badge-green",
  Banking: "badge-orange",
  Teaching: "bg-purple-100 text-purple-700 badge",
  Defence: "bg-red-100 text-red-700 badge",
  SSC: "badge-orange",
  UPSC: "badge-blue",
  Medical: "bg-teal-100 text-teal-700 badge",
  default: "badge-blue",
};

const isNew = (date) => {
  if (!date) return false;
  return isWithinInterval(new Date(date), {
    start: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });
};

const isClosingSoon = (date) => {
  if (!date) return false;
  return isWithinInterval(new Date(date), {
    start: new Date(),
    end: addDays(new Date(), 5),
  });
};

export default function JobCard({ job, savedIds = [], onSaveToggle }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(savedIds.includes(job._id));
  const [saving, setSaving] = useState(false);

  const badgeClass = CATEGORY_COLORS[job.category] || CATEGORY_COLORS.default;
  const deadline = job.application_end ? new Date(job.application_end) : null;
  const expired = deadline && isPast(deadline);
  const closingSoon = deadline && isClosingSoon(deadline) && !expired;
  const justPosted = isNew(job.created_at);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to save jobs");
      return;
    }
    setSaving(true);
    try {
      await usersAPI.saveJob(job._id);
      setSaved(!saved);
      toast.success(saved ? "Removed from saved jobs" : "Job saved!");
      onSaveToggle?.(job._id, !saved);
    } catch {
      toast.error("Could not save job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`card p-5 relative ${expired ? "opacity-70" : ""}`}>
      {/* Top badges row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1.5">
          <span className={badgeClass}>{job.category || "Govt"}</span>
          {job.government_type && (
            <span className="badge bg-gray-100 text-gray-600">{job.government_type}</span>
          )}
          {justPosted && (
            <span className="badge bg-green-100 text-green-700 gap-0.5">
              <MdFiberNew className="text-sm" /> New
            </span>
          )}
          {closingSoon && !expired && (
            <span className="badge bg-red-100 text-red-700 animate-pulse">Closing Soon</span>
          )}
          {expired && <span className="badge bg-gray-200 text-gray-500">Expired</span>}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-shrink-0 p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
          title={saved ? "Remove from saved" : "Save job"}
        >
          {saved ? <BsBookmarkFill className="text-primary-600" /> : <BsBookmarkPlus />}
        </button>
      </div>

      {/* Title & Org */}
      <Link href={`/jobs/${job.slug}`} className="group">
        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-primary-700 transition-colors line-clamp-2 mb-1">
          {job.title}
        </h3>
      </Link>
      <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
        <HiOfficeBuilding className="flex-shrink-0" />
        <span className="truncate">{job.organization}</span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600 mb-4">
        {job.posts && (
          <div className="flex items-center gap-1.5">
            <HiUsers className="text-primary-400 flex-shrink-0" />
            <span className="truncate font-medium">{job.posts} Posts</span>
          </div>
        )}
        {job.location && (
          <div className="flex items-center gap-1.5">
            <HiLocationMarker className="text-primary-400 flex-shrink-0" />
            <span className="truncate">{job.state || job.location}</span>
          </div>
        )}
        {job.education_level && (
          <div className="flex items-center gap-1.5">
            <HiAcademicCap className="text-primary-400 flex-shrink-0" />
            <span className="truncate">{job.education_level}</span>
          </div>
        )}
        {deadline && (
          <div className={`flex items-center gap-1.5 ${closingSoon ? "text-red-600 font-semibold" : ""}`}>
            <HiCalendar className={`flex-shrink-0 ${closingSoon ? "text-red-400" : "text-primary-400"}`} />
            <span className="truncate">
              {expired ? "Expired" : `Last: ${formatDistanceToNow(deadline, { addSuffix: true })}`}
            </span>
          </div>
        )}
      </div>

      {/* Short description */}
      {job.short_description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-4">{job.short_description}</p>
      )}

      {/* CTA */}
      <div className="flex gap-2">
        <Link
          href={`/jobs/${job.slug}`}
          className="flex-1 text-center bg-primary-50 hover:bg-primary-100 text-primary-700 text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          View Details
        </Link>
        {job.apply_link && !expired && (
          <a
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent text-sm py-2 px-4"
          >
            Apply Now →
          </a>
        )}
      </div>
    </div>
  );
}
