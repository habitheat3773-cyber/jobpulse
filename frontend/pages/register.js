/**
 * /register - Registration Page with Alert Preferences
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useAuth } from "../hooks/useAuth";
import { MdWork } from "react-icons/md";
import toast from "react-hot-toast";

const CATEGORIES = ["Police", "Railway", "Banking", "Teaching", "Defence", "SSC", "UPSC", "Medical"];
const STATES = ["Punjab", "Haryana", "Delhi", "Uttar Pradesh", "Rajasthan", "Maharashtra", "Gujarat", "Karnataka", "Central"];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    alert_categories: [], alert_states: [],
  });
  const [loading, setLoading] = useState(false);

  const toggleItem = (key, val) => {
    const arr = form[key];
    setForm({ ...form, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created! Check your email to verify.");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NextSeo title="Register - JobPulse India" noindex />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
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
            <h1 className="text-2xl font-extrabold text-gray-900">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">Get personalized government job alerts</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6 justify-center">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {s}
                </div>
                {s < 2 && <div className={`w-12 h-1 rounded ${step > s ? "bg-primary-600" : "bg-gray-200"}`} />}
              </div>
            ))}
            <span className="text-xs text-gray-500 ml-2">{step === 1 ? "Account Details" : "Job Preferences"}</span>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-8">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field" placeholder="Ravi Kumar" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field" placeholder="ravi@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                    <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="input-field" placeholder="Minimum 6 characters" />
                  </div>
                  <button type="button" onClick={() => setStep(2)} disabled={!form.name || !form.email || form.password.length < 6}
                    className="btn-primary w-full py-3 disabled:opacity-60">
                    Next: Set Preferences →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="mb-5">
                    <h3 className="font-semibold text-gray-900 mb-1">Which job types interest you?</h3>
                    <p className="text-xs text-gray-500 mb-3">We'll send alerts only for selected categories</p>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((c) => (
                        <button key={c} type="button" onClick={() => toggleItem("alert_categories", c)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                            form.alert_categories.includes(c) ? "bg-primary-600 text-white border-primary-600" : "border-gray-200 text-gray-600 hover:border-primary-300"
                          }`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-1">Which states?</h3>
                    <p className="text-xs text-gray-500 mb-3">Leave blank for all-India alerts</p>
                    <div className="flex flex-wrap gap-2">
                      {STATES.map((s) => (
                        <button key={s} type="button" onClick={() => toggleItem("alert_states", s)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                            form.alert_states.includes(s) ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-300"
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 disabled:opacity-60">
                      {loading ? "Creating account..." : "Create Account 🎉"}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-5 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
