"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CTASection = () => {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="rounded-3xl p-12"
        style={{ background: 'linear-gradient(135deg, #1e2a38, #2a3d52)', border: '1px solid #4a6c8f' }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Ready to take control of your search?
        </h2>
        <p className="text-[#7a90a4] mb-8">Free forever. No credit card required.</p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:opacity-90 hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #d9a441, #c8932a)', color: '#10151c' }}
        >
          Get Started Now
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  )
}

export default CTASection