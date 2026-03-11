/**
 * /jobs - All Jobs Listing Page
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import Layout from "../components/layout/Layout";
import JobCard from "../components/jobs/JobCard";
import JobFilters from "../components/jobs/JobFilters";
import { JobCardSkeleton } from "../components/ui/Skeleton";
import { jobsAPI } from "../lib/api";
import { HiSearch, HiAdjustments, HiX } from "react-icons/hi";

const SORT_OPTIONS = [
  { value: "created_at", label: "Latest First" },
  { value: "views", label: "Most Viewed" },
  { value: "application_end", label: "Closing Soon" },
];

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("created_at");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sync filters with URL query params
  useEffect(() => {
    const { search, category, state, education, gov_type, page } = router.query;
    const newFilters = {};
    if (category) newFilters.category = category;
    if (state) newFilters.state = state;
    if (education) newFilters.education = education;
    if (gov_type) newFilters.gov_type = gov_type;
    if (search) setSearchQuery(search);
    setFilters(newFilters);
  }, [router.query]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: router.query.page || 1,
        limit: 20,
        sort,
        ...(searchQuery ? { search: searchQuery } : {}),
      };
      const res = await jobsAPI.getAll(params);
      setJobs(res.data.jobs || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error("Jobs fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, searchQuery, router.query.page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push({ pathname: "/jobs", query: { ...filters, search: searchQuery, page: 1 } });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    router.push({ pathname: "/jobs", query: { ...newFilters, page: 1 } });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    router.push("/jobs");
  };

  const changePage = (p) => {
    router.push({ pathname: "/jobs", query: { ...filters, page: p } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <Layout>
      <NextSeo
        title="Latest Government Jobs 2024 - Search All Sarkari Naukri"
        description="Search all latest government jobs in India. Filter by state, category, education and more. Central and state government vacancies updated daily."
      />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Government Jobs</h1>
          <p className="text-gray-500 text-sm mb-4">
            {pagination.total ? `${pagination.total.toLocaleString()} jobs found` : "Loading..."} 
            {searchQuery && ` for "${searchQuery}"`}
          </p>

          {/* Search + Controls */}
          <div className="flex gap-3 flex-wrap">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[240px]">
              <div className="flex flex-1 items-center border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary-300">
                <HiSearch className="text-gray-400 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search jobs, organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-2 py-2.5 text-sm focus:outline-none"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="p-2 text-gray-400 hover:text-gray-600">
                    <HiX />
                  </button>
                )}
              </div>
              <button type="submit" className="btn-primary py-2.5 px-4 text-sm">Search</button>
            </form>

            <div className="flex gap-2">
              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field text-sm py-2.5 w-40"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`lg:hidden flex items-center gap-1.5 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                  activeFilterCount > 0 ? "bg-primary-600 text-white border-primary-600" : "border-gray-200 text-gray-600"
                }`}
              >
                <HiAdjustments />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {Object.entries(filters).filter(([, v]) => v).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                  {v}
                  <button onClick={() => handleFilterChange({ ...filters, [k]: "" })}>
                    <HiX className="ml-0.5" />
                  </button>
                </span>
              ))}
              <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">Clear all</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">

          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <JobFilters filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
          </div>

          {/* Mobile Filters */}
          {filtersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setFiltersOpen(false)}>
              <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">Filters</h3>
                  <button onClick={() => setFiltersOpen(false)}><HiX className="text-xl" /></button>
                </div>
                <JobFilters filters={filters} onChange={(f) => { handleFilterChange(f); setFiltersOpen(false); }} onClear={clearFilters} />
              </div>
            </div>
          )}

          {/* Jobs Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => <JobCardSkeleton key={i} />)}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <HiSearch className="text-5xl mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-600 mb-1">No jobs found</h3>
                <p className="text-sm">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="btn-primary mt-4 text-sm py-2 px-5">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {jobs.map((job) => <JobCard key={job._id} job={job} />)}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      disabled={!pagination.hasPrev}
                      onClick={() => changePage(pagination.current - 1)}
                      className="btn-secondary py-2 px-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                        const p = i + 1;
                        return (
                          <button
                            key={p}
                            onClick={() => changePage(p)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                              p === pagination.current
                                ? "bg-primary-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      disabled={!pagination.hasNext}
                      onClick={() => changePage(pagination.current + 1)}
                      className="btn-secondary py-2 px-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
