/**
 * Navbar - Responsive top navigation
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import {
  HiMenuAlt3, HiX, HiBell, HiSearch, HiUser,
  HiLogout, HiViewGrid, HiBookmark
} from "react-icons/hi";
import { MdWork } from "react-icons/md";

const NAV_LINKS = [
  { label: "Jobs", href: "/jobs" },
  { label: "Categories", href: "/categories" },
  { label: "States", href: "/states" },
  { label: "Results", href: "/results" },
  { label: "Admit Cards", href: "/admit-cards" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <MdWork className="text-white text-lg" />
            </div>
            <div>
              <span className="text-primary-700 font-bold text-lg leading-none block">JobPulse</span>
              <span className="text-accent-500 font-semibold text-xs leading-none">India 🇮🇳</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  router.pathname.startsWith(link.href)
                    ? "text-primary-700 bg-primary-50"
                    : "text-gray-600 hover:text-primary-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            >
              <HiSearch className="text-xl" />
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <Link href="/dashboard/notifications" className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all relative">
                  <HiBell className="text-xl" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pl-3 bg-primary-50 hover:bg-primary-100 rounded-full transition-all"
                  >
                    <span className="text-sm font-medium text-primary-700 hidden sm:block max-w-[100px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <HiViewGrid className="text-gray-400" /> Dashboard
                      </Link>
                      <Link href="/dashboard/saved" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <HiBookmark className="text-gray-400" /> Saved Jobs
                      </Link>
                      <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <HiUser className="text-gray-400" /> Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <HiLogout /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login" className="btn-secondary py-2 px-4 text-sm">Login</Link>
                <Link href="/register" className="btn-primary py-2 px-4 text-sm">Register</Link>
              </div>
            )}

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-primary-600 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <HiX className="text-xl" /> : <HiMenuAlt3 className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Search government jobs... e.g. 'Punjab Police', 'Railway'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field flex-1 text-sm"
              />
              <button type="submit" className="btn-primary py-2 px-4 text-sm">Search</button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="btn-secondary flex-1 text-center text-sm py-2">Login</Link>
              <Link href="/register" className="btn-primary flex-1 text-center text-sm py-2">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
