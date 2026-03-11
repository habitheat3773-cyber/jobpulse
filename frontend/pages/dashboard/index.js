/**
 * /dashboard - User Dashboard
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { NextSeo } from "next-seo";
import Layout from "../components/layout/Layout";
import JobCard from "../components/jobs/JobCard";
import { useAuth } from "../hooks/useAuth";
import { usersAPI, notificationsAPI } from "../lib/api";
import {
  HiBookmark, HiBell, HiUser, HiCog, HiChevronRight,
  HiBriefcase, HiLogout
} from "react-icons/hi";
import { MdVerified } from "react-icons/md";
import toast from "react-hot-toast";

const SIDEBAR_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: HiUser },
  { label: "Saved Jobs", href: "/dashboard/saved", icon: HiBookmark },
  { label: "Notifications", href: "/dashboard/notifications", icon: HiBell },
  { label: "Settings", href: "/dashboard/settings", icon: HiCog },
];

export default function Dashboard() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login?redirect=/dashboard");
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    Promise.all([usersAPI.getSavedJobs(), notificationsAPI.getAll()])
      .then(([savedRes, notifRes]) => {
        setSavedJobs(savedRes.data.saved_jobs || []);
        setNotifications(notifRes.data.notifications || []);
      })
      .catch(console.error)
      .finally(() => setLoadingData(false));
  }, [user]);

  if (authLoading || !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Layout>
      <NextSeo title="Dashboard - JobPulse India" noindex />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">

          {/* Sidebar */}
          <div className="hidden md:block w-56 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-card border border-gray-100 p-4 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm leading-snug">{user.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    {user.is_verified ? <><MdVerified className="text-primary-500" /> Verified</> : "Unverified"}
                  </div>
                </div>
              </div>
              {SIDEBAR_LINKS.map((link) => (
                <Link key={link.href} href={link.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all ${
                    router.pathname === link.href
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <span className="flex items-center gap-2">
                    <link.icon className="text-base" /> {link.label}
                  </span>
                  {link.label === "Notifications" && unreadCount > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">{unreadCount}</span>
                  )}
                </Link>
              ))}
              <hr className="my-2" />
              <button onClick={() => { logout(); router.push("/"); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-all">
                <HiLogout /> Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome, {user.name.split(" ")[0]}! 👋</h1>
            <p className="text-gray-500 text-sm mb-6">Here's your personalized job dashboard.</p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Saved Jobs", value: savedJobs.length, icon: HiBookmark, color: "text-primary-600 bg-primary-50" },
                { label: "Unread Alerts", value: unreadCount, icon: HiBell, color: "text-orange-600 bg-orange-50" },
                { label: "Alert Categories", value: user.alert_categories?.length || 0, icon: HiBriefcase, color: "text-green-600 bg-green-50" },
              ].map((stat) => (
                <div key={stat.label} className="card p-5 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="text-2xl" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Alert Preferences Summary */}
            <div className="card p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-900">Your Alert Preferences</h2>
                <Link href="/dashboard/settings" className="text-xs text-primary-600 hover:underline flex items-center gap-0.5">
                  Edit <HiChevronRight />
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.alert_categories?.length > 0 ? (
                  user.alert_categories.map((c) => (
                    <span key={c} className="badge badge-blue">{c}</span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">All categories (no filter set)</span>
                )}
              </div>
              {user.alert_states?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.alert_states.map((s) => (
                    <span key={s} className="badge badge-green">{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Jobs Preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Saved Jobs ({savedJobs.length})</h2>
                <Link href="/dashboard/saved" className="text-xs text-primary-600 hover:underline flex items-center gap-0.5">
                  View all <HiChevronRight />
                </Link>
              </div>
              {savedJobs.length === 0 ? (
                <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                  <HiBookmark className="text-4xl mx-auto mb-2" />
                  <p className="text-sm">No saved jobs yet. Browse jobs and save ones that interest you.</p>
                  <Link href="/jobs" className="btn-primary mt-3 text-sm py-2 px-5">Browse Jobs</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedJobs.slice(0, 4).map((job) => (
                    <JobCard key={job._id} job={job} savedIds={savedJobs.map((j) => j._id)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
