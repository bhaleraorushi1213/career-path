"use client";

import {motion} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <>
      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase"
            style={{ background: 'rgba(217,164,65,0.12)', color: '#d9a441', border: '1px solid rgba(217,164,65,0.3)' }}
          >
            ✦ Your Job Search, Elevated
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Navigate your career{' '}
            <span style={{ color: '#d9a441' }}>with precision.</span>
          </h1>
          <p className="text-lg text-[#7a90a4] max-w-2xl mx-auto mb-10 leading-relaxed">
            CareerPath is the executive-grade job tracker that replaces scattered spreadsheets
            with a visual Kanban workflow — built for ambitious professionals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:opacity-90 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #d9a441, #c8932a)', color: '#10151c', boxShadow: '0 8px 32px rgba(217,164,65,0.3)' }}
            >
              Start Tracking Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl text-base font-semibold text-[#7a90a4] hover:text-white transition-colors"
              style={{ border: '1px solid #2a3d52' }}
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>

      {/* HERO BOARD VIEW */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative max-w-5xl mx-auto mt-20"
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid #2a3d52', background: '#1e2a38', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}
        >
          {/* MOCK BROWSER VIEW UI */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2a3d52]" style={{ background: '#10151c' }}>
            <div className="w-3 h-3 rounded-full bg-[#8f4a4a]" />
            <div className="w-3 h-3 rounded-full bg-[#d9a441]/60" />
            <div className="w-3 h-3 rounded-full bg-[#3a9668]/60" />
            <div className="flex-1 mx-4 h-6 rounded-lg flex items-center px-3" style={{ background: '#2a3d52' }}>
              <span className="text-xs text-[#4a5a6a]">app.careerpath.io/dashboard</span>
            </div>
          </div>
          {/* MOCK BOARD UI */}
          <div className="p-4 overflow-x-auto">
            <div className="flex gap-3 min-w-max">
              {['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'].map((col, i) => {
                const colors = ['#4a6c8f', '#5a7fa0', '#d9a441', '#3a9668', '#8f4a4a'];
                return (
                  <div key={col} className="w-44 rounded-xl overflow-hidden" style={{ border: '1px solid #2a3d52', background: '#10151c' }}>
                    <div className="px-3 py-2 border-b border-[#2a3d52] flex items-center justify-between" style={{ background: '#1e2a38' }}>
                      <span className="text-xs font-semibold text-white">{col}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${colors[i]}22`, color: colors[i] }}>
                        {i === 2 ? 1 : i === 3 ? 1 : i === 0 ? 1 : i === 4 ? 1 : 1}
                      </span>
                    </div>
                    <div className="p-2 flex flex-col gap-2">
                      {i < 5 && (
                        <div className="rounded-lg p-2.5" style={{ background: '#1e2a38', border: '1px solid #2a3d52' }}>
                          <div className="h-2 rounded bg-[#2a3d52] w-3/4 mb-1.5" />
                          <div className="h-1.5 rounded bg-[#2a3d52] w-1/2 mb-2" />
                          <div className="flex gap-1">
                            <div className="h-4 w-10 rounded-full" style={{ background: `${colors[i]}22` }} />
                            <div className="h-4 w-8 rounded-full" style={{ background: `${colors[i]}22` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* GLOW EFFECT */}
        <div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #4a6c8f, transparent)', filter: 'blur(20px)' }}
        />
      </motion.div>
    </>
  )
}

export default HeroSection