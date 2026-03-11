/**
 * JobPulse India - Homepage
 * Hero + Latest Jobs + Categories + Stats
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import Layout from "../components/layout/Layout";
import JobCard from "../components/jobs/JobCard";
import { JobCardSkeleton } from "../components/ui/Skeleton";
import { jobsAPI } from "../lib/api";
import {
  HiSearch, HiTrendingUp, HiShieldCheck, HiAcademicCap,
  HiBriefcase, HiChevronRight, HiBell
} from "react-icons/hi";
import { MdTrain, MdAccountBalance, MdSchool, MdSecurity, MdLocalPolice } from "react-icons/md";
import { FaTelegram } from "react-icons/fa";

const CATEGORY_CARDS = [
  { label: "Police Jobs", icon: MdLocalPolice, color: "bg-blue-500", href: "/jobs?category=Police", count: "500+" },
  { label: "Railway Jobs", icon: MdTrain, color: "bg-green-500", href: "/jobs?category=Railway", count: "1000+" },
  { label: "Banking Jobs", icon: MdAccountBalance, color: "bg-yellow-500", href: "/jobs?category=Banking", count: "200+" },
  { label: "Teaching Jobs", icon: MdSchool, color: "bg-purple-500", href: "/jobs?category=Teaching", count: "300+" },
  { label: "Defence Jobs", icon: MdSecurity, color: "bg-red-500", href: "/jobs?category=Defence", count: "150+" },
  { label: "SSC / UPSC", icon: HiBriefcase, color: "bg-orange-500", href: "/jobs?category=SSC", count: "400+" },
];

const QUICK_LINKS = [
  { label: "10th Pass Jobs", href: "/jobs?education=10th+Pass" },
  { label: "12th Pass Jobs", href: "/jobs?education=12th+Pass" },
  { label: "Graduate Jobs", href: "/jobs?education=Graduate" },
  { label: "Punjab Govt Jobs", href: "/jobs?state=Punjab" },
  { label: "Haryana Jobs", href: "/jobs?state=Haryana" },
  { label: "Delhi Govt Jobs", href: "/jobs?state=Delhi" },
  { label: "UP Govt Jobs", href: "/jobs?state=Uttar+Pradesh" },
  { label: "Central Govt", href: "/jobs?gov_type=Central" },
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [latestJobs, setLatestJobs] = useState([]);
  const [trendingJobs, setTrendingJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestRes, trendingRes, statsRes] = await Promise.all([
          jobsAPI.getLatest(),
          jobsAPI.getTrending(),
          jobsAPI.getStats(),
        ]);
        setLatestJobs(latestRes.data.jobs || []);
        setTrendingJobs(trendingRes.data.jobs || []);
        setStats(statsRes.data.stats);
      } catch (err) {
        console.error("Homepage data fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <Layout>
      <NextSeo
        title="Latest Government Jobs 2024 - Sarkari Naukri Alert"
        description="Find latest central and state government jobs in India. Get instant alerts for Railway, Police, Banking, Teaching, SSC, UPSC vacancies."
      />

      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-blue-700 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-accent-400 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Updated every 3 hours · {stats?.added_today || 0} jobs added today</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">
              India's #1 Government<br />
              <span className="text-accent-300">Job Alert Platform</span>
            </h1>
            <p className="text-primary-100 text-lg mb-8">
              Search {stats?.total_jobs?.toLocaleString() || "10,000+"}+ government jobs across all states. 
              Get instant email alerts for your preferred jobs.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
              <div className="flex-1 flex items-center bg-white rounded-xl shadow-lg overflow-hidden">
                <HiSearch className="text-gray-400 text-xl ml-4 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search jobs... e.g. 'Punjab Police', 'Railway 10th pass'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-3.5 text-gray-800 text-sm focus:outline-none bg-transparent"
                />
              </div>
              <button type="submit" className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-accent-500/40 flex-shrink-0">
                Search
              </button>
            </form>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {QUICK_LINKS.slice(0, 6).map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition-all"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: "Total Jobs", value: stats?.total_jobs?.toLocaleString() || "—", color: "text-primary-600" },
              { label: "Central Govt", value: stats?.central_govt?.toLocaleString() || "—", color: "text-blue-600" },
              { label: "State Govt", value: stats?.state_govt?.toLocaleString() || "—", color: "text-green-600" },
              { label: "Added Today", value: stats?.added_today?.toLocaleString() || "—", color: "text-accent-500" },
            ].map((s) => (
              <div key={s.label} className="py-2">
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Job Categories ───────────────────────────────────────────────── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Browse by Category</h2>
              <p className="section-subtitle">Find jobs matching your career interest</p>
            </div>
            <Link href="/categories" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              All Categories <HiChevronRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORY_CARDS.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="card p-4 flex flex-col items-center text-center group cursor-pointer"
              >
                <div className={`${cat.color} text-white rounded-xl p-3 mb-3 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="text-2xl" />
                </div>
                <span className="text-xs font-semibold text-gray-800 leading-tight">{cat.label}</span>
                <span className="text-xs text-gray-400 mt-0.5">{cat.count} jobs</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Latest Jobs ──────────────────────────────────────────────────── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Latest Government Jobs</h2>
              <p className="section-subtitle">Most recently added vacancies</p>
            </div>
            <Link href="/jobs" className="btn-secondary py-2 px-4 text-sm flex items-center gap-1">
              View All <HiChevronRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
              : latestJobs.slice(0, 6).map((job) => <JobCard key={job._id} job={job} />)
            }
          </div>

          {!loading && latestJobs.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <HiBriefcase className="text-5xl mx-auto mb-3" />
              <p>No jobs found. The crawler will populate jobs shortly.</p>
            </div>
          )}
        </div>

        {/* ── Trending Jobs ────────────────────────────────────────────────── */}
        {trendingJobs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="section-title flex items-center gap-2">
                  <HiTrendingUp className="text-accent-500" /> Trending Jobs
                </h2>
                <p className="section-subtitle">Most viewed government vacancies right now</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingJobs.map((job, i) => (
                <Link key={job._id} href={`/jobs/${job.slug}`} className="card p-4 flex items-start gap-3 group">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    i === 0 ? "bg-yellow-100 text-yellow-700" :
                    i === 1 ? "bg-gray-100 text-gray-600" :
                    i === 2 ? "bg-orange-100 text-orange-600" : "bg-primary-50 text-primary-600"
                  }`}>
                    #{i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2">{job.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{job.organization}</p>
                    <p className="text-xs text-gray-400 mt-1">{job.views?.toLocaleString()} views</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Telegram Banner ──────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#229ED9] to-[#1a7db5] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-white text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
              <FaTelegram className="text-2xl" />
              <h3 className="text-xl font-bold">Join Our Telegram Channel</h3>
            </div>
            <p className="text-blue-100 text-sm">Get instant government job alerts on Telegram. 50,000+ members already joined!</p>
          </div>
          <a
            href="https://t.me/jobpulseindia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-white text-[#229ED9] font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
          >
            <FaTelegram /> Join Now Free
          </a>
        </div>

        {/* ── Email Alert CTA ──────────────────────────────────────────────── */}
        <div className="mt-8 bg-gradient-to-r from-primary-700 to-primary-600 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-white text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
              <HiBell className="text-2xl" />
              <h3 className="text-xl font-bold">Never Miss a Job Alert</h3>
            </div>
            <p className="text-primary-100 text-sm">Register free and get personalized government job notifications by email.</p>
          </div>
          <Link href="/register" className="flex-shrink-0 bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all">
            Register Free →
          </Link>
        </div>

      </div>
    </Layout>
  );
}
