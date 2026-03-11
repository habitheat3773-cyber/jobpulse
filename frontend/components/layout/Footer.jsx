import Link from "next/link";
import { MdWork } from "react-icons/md";
import { FaTelegram, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <MdWork className="text-white text-lg" />
            </div>
            <div>
              <span className="text-white font-bold text-lg leading-none block">JobPulse</span>
              <span className="text-accent-400 font-semibold text-xs">India 🇮🇳</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            India's Smart Government Job Alert Platform. Stay updated with the latest sarkari naukri notifications.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://t.me/jobpulseindia" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors"><FaTelegram /></a>
            <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors"><FaTwitter /></a>
            <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors"><FaInstagram /></a>
            <a href="#" className="p-2 bg-gray-800 hover:bg-red-600 rounded-lg transition-colors"><FaYoutube /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {["Latest Jobs", "Central Govt Jobs", "State Govt Jobs", "Railway Jobs", "Banking Jobs", "Police Jobs"].map(l => (
              <li key={l}><Link href="/jobs" className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-semibold mb-4">By Education</h4>
          <ul className="space-y-2 text-sm">
            {["10th Pass Jobs", "12th Pass Jobs", "Graduate Jobs", "Post Graduate", "Diploma Jobs", "Any Qualification"].map(l => (
              <li key={l}><Link href="/categories" className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-semibold mb-4">Get Job Alerts</h4>
          <p className="text-sm text-gray-400 mb-3">Subscribe to receive daily government job notifications.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
            <button className="btn-primary py-2 px-3 text-sm whitespace-nowrap">Subscribe</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Join 50,000+ job seekers</p>
        </div>
      </div>

      <div className="border-t border-gray-800 max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} JobPulse India. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-300">Terms of Use</Link>
          <Link href="/about" className="hover:text-gray-300">About</Link>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
