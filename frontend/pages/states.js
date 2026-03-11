/**
 * /states - Browse jobs by state
 */

import Link from "next/link";
import { NextSeo } from "next-seo";
import Layout from "../components/layout/Layout";

const STATES = [
  { name: "Central Govt", emoji: "🇮🇳", href: "/jobs?gov_type=Central", desc: "Central government departments" },
  { name: "Punjab", emoji: "🌾", href: "/jobs?state=Punjab", desc: "Punjab state government" },
  { name: "Haryana", emoji: "🌻", href: "/jobs?state=Haryana", desc: "Haryana government vacancies" },
  { name: "Delhi", emoji: "🏛️", href: "/jobs?state=Delhi", desc: "Delhi government & MCD" },
  { name: "Uttar Pradesh", emoji: "🕌", href: "/jobs?state=Uttar+Pradesh", desc: "UP Police, UPPSC, etc." },
  { name: "Rajasthan", emoji: "🏰", href: "/jobs?state=Rajasthan", desc: "Rajasthan government jobs" },
  { name: "Maharashtra", emoji: "🏙️", href: "/jobs?state=Maharashtra", desc: "MPSC, Mumbai police, etc." },
  { name: "Gujarat", emoji: "🎪", href: "/jobs?state=Gujarat", desc: "GPSC, Gujarat state jobs" },
  { name: "Karnataka", emoji: "🌴", href: "/jobs?state=Karnataka", desc: "KPSC, Bengaluru jobs" },
  { name: "Tamil Nadu", emoji: "🏛️", href: "/jobs?state=Tamil+Nadu", desc: "TNPSC and state vacancies" },
  { name: "Bihar", emoji: "🌊", href: "/jobs?state=Bihar", desc: "BPSC and Bihar state jobs" },
  { name: "West Bengal", emoji: "🐯", href: "/jobs?state=West+Bengal", desc: "WBPSC and state jobs" },
  { name: "Andhra Pradesh", emoji: "🌾", href: "/jobs?state=Andhra+Pradesh", desc: "APPSC and AP state jobs" },
  { name: "Telangana", emoji: "🌿", href: "/jobs?state=Telangana", desc: "TSPSC and Telangana jobs" },
  { name: "Madhya Pradesh", emoji: "🐆", href: "/jobs?state=Madhya+Pradesh", desc: "MPPSC and MP state jobs" },
  { name: "Kerala", emoji: "🥥", href: "/jobs?state=Kerala", desc: "Kerala PSC and state jobs" },
  { name: "Himachal Pradesh", emoji: "🏔️", href: "/jobs?state=Himachal+Pradesh", desc: "HPPSC and HP jobs" },
  { name: "Uttarakhand", emoji: "⛰️", href: "/jobs?state=Uttarakhand", desc: "UKPSC and state jobs" },
];

export default function StatesPage() {
  return (
    <Layout>
      <NextSeo
        title="State-wise Government Jobs - Punjab, Haryana, Delhi, UP, Rajasthan"
        description="Find state government jobs in India. Browse vacancies by state including Punjab, Haryana, Delhi, UP, Maharashtra, Karnataka and more."
      />

      <div className="bg-gradient-to-r from-green-700 to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-extrabold mb-2">State-wise Government Jobs</h1>
          <p className="text-green-100">Find government vacancies in your state</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {STATES.map((state) => (
            <Link key={state.name} href={state.href}
              className="card p-4 flex flex-col items-center text-center group hover:border-green-200">
              <span className="text-4xl mb-2">{state.emoji}</span>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{state.name}</h3>
              <p className="text-xs text-gray-500 leading-tight">{state.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
