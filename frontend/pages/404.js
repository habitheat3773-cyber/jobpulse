// 404.js
import Link from "next/link";
import Layout from "../components/layout/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-6">😕</div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">404 - Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/jobs" className="btn-secondary">Browse Jobs</Link>
        </div>
      </div>
    </Layout>
  );
}
