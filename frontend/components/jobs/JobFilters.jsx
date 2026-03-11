/**
 * JobFilters - Sidebar filters for jobs listing
 */

const CATEGORIES = [
  "Police", "Railway", "Banking", "Teaching", "Defence",
  "SSC", "UPSC", "Medical", "Engineering", "PSC", "Postal", "Forest", "Other"
];

const STATES = [
  "Central", "Punjab", "Haryana", "Delhi", "Uttar Pradesh", "Rajasthan",
  "Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Bihar", "West Bengal", "Andhra Pradesh"
];

const EDUCATION = ["10th Pass", "12th Pass", "Graduate", "Post Graduate", "Diploma"];

export default function JobFilters({ filters, onChange, onClear }) {
  const update = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-100 p-5 sticky top-20">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900">Filters</h3>
        <button onClick={onClear} className="text-xs text-primary-600 hover:underline">
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</h4>
        <select
          value={filters.category || ""}
          onChange={(e) => update("category", e.target.value)}
          className="input-field text-sm"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* State */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">State</h4>
        <select
          value={filters.state || ""}
          onChange={(e) => update("state", e.target.value)}
          className="input-field text-sm"
        >
          <option value="">All States</option>
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Education */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Education</h4>
        <div className="space-y-2">
          {EDUCATION.map((edu) => (
            <label key={edu} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="education"
                value={edu}
                checked={filters.education === edu}
                onChange={(e) => update("education", e.target.value)}
                className="accent-primary-600"
              />
              <span className="text-sm text-gray-700">{edu}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Govt Type */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Government Type</h4>
        <div className="flex gap-2">
          {["Central", "State"].map((t) => (
            <button
              key={t}
              onClick={() => update("gov_type", filters.gov_type === t ? "" : t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filters.gov_type === t
                  ? "bg-primary-600 text-white border-primary-600"
                  : "border-gray-200 text-gray-600 hover:border-primary-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
