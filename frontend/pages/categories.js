/**
 * /categories - Browse jobs by category
 */

import Link from "next/link";
import { NextSeo } from "next-seo";
import Layout from "../components/layout/Layout";
import { MdTrain, MdAccountBalance, MdSchool, MdSecurity, MdLocalPolice, MdForest } from "react-icons/md";
import { HiBriefcase, HiAcademicCap, HiHeart, HiChip } from "react-icons/hi";

const CATEGORIES = [
  { name: "Police", icon: MdLocalPolice, color: "from-blue-500 to-blue-600", desc: "State and Central police recruitment", jobs: "500+" },
  { name: "Railway", icon: MdTrain, color: "from-green-500 to-green-600", desc: "Indian Railways & Metro jobs", jobs: "1000+" },
  { name: "Banking", icon: MdAccountBalance, color: "from-yellow-500 to-orange-500", desc: "SBI, IBPS, RBI, PSU banks", jobs: "200+" },
  { name: "Teaching", icon: MdSchool, color: "from-purple-500 to-purple-600", desc: "TGT, PGT, College, University", jobs: "400+" },
  { name: "Defence", icon: MdSecurity, color: "from-red-500 to-red-600", desc: "Army, Navy, Air Force, NDA", jobs: "150+" },
  { name: "SSC", icon: HiBriefcase, color: "from-orange-500 to-orange-600", desc: "Staff Selection Commission", jobs: "300+" },
  { name: "UPSC", icon: HiAcademicCap, color: "from-indigo-500 to-indigo-600", desc: "IAS, IPS, IFS Civil Services", jobs: "50+" },
  { name: "Medical", icon: HiHeart, color: "from-teal-500 to-teal-600", desc: "AIIMS, ESIC, Hospital staff", jobs: "200+" },
  { name: "Engineering", icon: HiChip, color: "from-cyan-500 to-cyan-600", desc: "ISRO, DRDO, PSU engineers", jobs: "150+" },
  { name: "Forest", icon: MdForest, color: "from-lime-500 to-green-600", desc: "Forest guards, rangers, officers", jobs: "80+" },
];

const EDUCATION_CATEGORIES = [
  { name: "10th Pass Jobs", href: "/jobs?education=10th+Pass", desc: "Matric/SSC pass vacancies" },
  { name: "12th Pass Jobs", href: "/jobs?education=12th+Pass", desc: "Intermediate/HSC vacancies" },
  { name: "Graduate Jobs", href: "/jobs?education=Graduate", desc: "Any degree holders" },
  { name: "Post Graduate", href: "/jobs?education=Post+Graduate", desc: "Masters & PhD level jobs" },
  { name: "Diploma Jobs", href: "/jobs?education=Diploma", desc: "ITI/Polytechnic diploma" },
];

export default function CategoriesPage() {
  return (
    <Layout>
      <NextSeo
        title="Government Job Categories - Police, Railway, Banking, SSC, UPSC"
        description="Browse government jobs by category. Find Police, Railway, Banking, Teaching, Defence, SSC, UPSC jobs in India."
      />

      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-extrabold mb-2">Browse by Job Category</h1>
          <p className="text-primary-100">Find government jobs matching your skills and interest</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Main categories */}
        <h2 className="section-title mb-1">Job Categories</h2>
        <p className="section-subtitle mb-6">Click any category to see all matching vacancies</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} href={`/jobs?category=${cat.name}`}
              className="card p-5 flex flex-col items-center text-center group">
              <div className={`bg-gradient-to-br ${cat.color} text-white rounded-2xl p-4 mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                <cat.icon className="text-3xl" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{cat.name}</h3>
              <p className="text-xs text-gray-500 mb-2 leading-tight">{cat.desc}</p>
              <span className="badge badge-blue">{cat.jobs} jobs</span>
            </Link>
          ))}
        </div>

        {/* By education */}
        <h2 className="section-title mb-1">Browse by Education</h2>
        <p className="section-subtitle mb-6">Find jobs matching your qualification</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {EDUCATION_CATEGORIES.map((cat) => (
            <Link key={cat.name} href={cat.href}
              className="card p-5 text-center group hover:border-primary-200">
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{cat.name}</h3>
              <p className="text-xs text-gray-500">{cat.desc}</p>
            </Link>
          ))}
        </div>

      </div>
    </Layout>
  );
}
