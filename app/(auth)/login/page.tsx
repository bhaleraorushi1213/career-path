"use client";

import { signIn } from "@/lib/auth/auth-client";
import { Briefcase, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const STATS_DATA = [
  { value: '10k+', label: 'Professionals' },
  { value: '94%', label: 'Interview rate' },
  { value: '3.2x', label: 'Faster search' },
  { value: '$40k', label: 'Avg salary boost' },
]

const inputClass = "w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6c8f] transition-all bg-[#1e2a38] border-[#2a3d52] text-[#e8edf2] font-['DM Sans', sans-serif]";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<{ email?: string; password?: string; message?: string }>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!validate()) return;
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password
      });

      if (result.error) {
        setError({ message: result.error.message ?? "Failed to sign in" });
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError({ message: "An unexpected error occurred: " + err });
    } finally {
      setLoading(false);
    }
  }

  const validate = () => {
    const errors: typeof error = {};

    // validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  }


  return (
    <div className="min-h-screen flex" style={{ background: '#10151c' }}>
      {/* LEFT PANEL — BRANDING */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 px-12 py-32 relative overflow-hidden border-r-[#1e2a38] bg-[#1e2a38]" >
        <div
          className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,#4a6c8f,transparent)]"
        />
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-linear-to-br from-[#4a6c8f] to-[#d9a441]">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white">
            Career<span style={{ color: '#d9a441' }}>Path</span>
          </span>
        </Link>

        <div className="relative">
          <h2 className="text-3xl font-bold text-white mb-4">
            Your pipeline,<br />perfectly organized.
          </h2>
          <p className="text-[#7a90a4] leading-relaxed mb-8">
            Drag, drop, and track every application with executive clarity.
            Never lose track of an opportunity again.
          </p>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4">
            {STATS_DATA.map(stat => (
              <div key={stat.label} className="rounded-xl p-4 bg-[rgba(74,108,143,0.1)] border-[#2a3d52]">
                <p className="text-2xl font-bold text-[#d9a441]">{stat.value}</p>
                <p className="text-xs text-[#7a90a4] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-[#4a5a6a]">© 2024 CareerPath</p>
      </div>

      {/* RIGHT PANEL — FORM */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* MOBILE LOGO */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-linear-to-br from-[#4a6c8f] to-[#d9a441]">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-white font-['Space Grotesk', sans-serif]">
              Career<span className="text-[#d9a441]">Path</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-['Space Grotesk', sans-serif]">Welcome back</h1>
          <p className="text-[#7a90a4] text-sm mb-8">Sign in to your workspace</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="text-xs text-[#7a90a4] font-medium mb-1.5 block uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={inputClass}
              />
              {error?.email && <p className="text-red-400 text-xs mt-1">{error?.email}</p>}
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-xs text-[#7a90a4] font-medium mb-1.5 block uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
                {error.password && <p className="text-red-400 text-xs mt-1">{error.password}</p>}
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button type="button" className="text-xs text-[#4a6c8f] hover:text-[#7aacce] transition-colors">
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center bg-[linear-gradient(135deg,#d9a441,#c8932a)] text-[#10151c]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#10151c]/30 border-t-[#10151c] rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-[#7a90a4] mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold hover:text-white transition-colors text-[#d9a441]">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Login;