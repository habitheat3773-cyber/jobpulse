/**
 * /login - Login Page
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useAuth } from "../hooks/useAuth";
import { MdWork } from "react-icons/md";
import { HiEye, HiEyeOff } from "react-icons/hi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      router.push(router.query.redirect || "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NextSeo title="Login - JobPulse India" noindex />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow">
                <MdWork className="text-white text-xl" />
              </div>
              <div className="text-left">
                <div className="text-primary-700 font-extrabold text-xl leading-none">JobPulse</div>
                <div className="text-accent-500 font-semibold text-xs">India 🇮🇳</div>
              </div>
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900">Welcome back!</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to access your job alerts</p>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>
                <div className="text-right mt-1">
                  <Link href="/forgot-password" className="text-xs text-primary-600 hover:underline">Forgot password?</Link>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary-600 font-semibold hover:underline">Register free</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
