"use client";

import { signUp } from '@/lib/auth/auth-client';
import { Briefcase, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"
import Link from "next/link";

const PERKS = [
  'Drag-and-drop Kanban pipeline',
  'Salary tracking & comparison',
  'Unlimited job applications',
  'Smart notes & reminders',
  'Free forever — no credit card',
];

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; message?: string }>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6c8f] transition-all bg-[#1e2a38] border border-[#2a3d52] text-[#e8edf2] font-[DM Sans,sans-serif]";

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const result = await signUp.email({
        name,
        email,
        password
      });

      if (result.error) {
        setError({ message: result.error.message ?? "Failed to signup" });
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

    if (!name) {
      errors.name = "Name is required";
    }

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

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  }

  return (
    <div className="min-h-screen flex bg-[#10151c]">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 px-12 py-32 relative overflow-hidden bg-[#1e2a38] border-[#2a3d52]">
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
          <h2 className="text-3xl font-bold text-white mb-4 font-['Space Grotesk', sans-serif ]">
            Start your search<br />the right way.
          </h2>
          <p className="text-[#7a90a4] leading-relaxed mb-8 pe-32">
            Join thousands of professionals who use CareerPath to track, organize, and win their next role.
          </p>
          <div className="flex flex-col gap-3">
            {PERKS.map(perk => (
              <div key={perk} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 text-[#d9a441]" />
                <span className="text-sm text-[#a0b4c8]">{perk}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-[#4a5a6a]">© 2024 CareerPath — Trusted by 10,000+ professionals</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-linear-to-br from-[#4a6c8f] to-[#d9a441]">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-white font-['Space Grotesk', sans-serif]">
              Career<span className="text-[#d9a441]">Path</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 font-['Space Grotesk', sans-serif]">Create your account</h1>
          <p className="text-[#7a90a4] text-sm mb-8">Start tracking your career in minutes</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor='name' className="text-xs text-[#7a90a4] font-medium mb-1.5 block uppercase tracking-wider">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                autoComplete="name"
              />
              {error.name && <p className="text-red-400 text-xs mt-1">{error.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="text-xs text-[#7a90a4] font-medium mb-1.5 block uppercase tracking-wider">Email</label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                autoComplete="email"
              />
              {error.email && <p className="text-red-400 text-xs mt-1">{error.email}</p>}
            </div>
            <div>
              <label className="text-xs text-[#7a90a4] font-medium mb-1.5 block uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  className={inputClass}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5a6a] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error.password && <p className="text-red-400 text-xs mt-1">{error.password}</p>}
            </div>
            <div>
              <label className="text-xs text-[#7a90a4] font-medium mb-1.5 block uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  className={inputClass}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
              {error.confirmPassword && <p className="text-red-400 text-xs mt-1">{error.confirmPassword}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center mt-2 bg-[linear-gradient(135deg,#d9a441,#c8932a)] text-[#10151c]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#10151c]/30 border-t-[#10151c] rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Free Account'}
            </button>
          </form>
          <p className="text-center text-xs text-[#4a5a6a] mt-4">
            By signing up, you agree to our{' '}
            <span className="text-[#4a6c8f] cursor-pointer hover:text-[#7aacce]">Terms</span>
            {' '}and{' '}
            <span className="text-[#4a6c8f] cursor-pointer hover:text-[#7aacce]">Privacy Policy</span>
          </p>

          <p className="text-center text-sm text-[#7a90a4] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:text-white transition-colors text-[#d9a441]">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default SignUp;