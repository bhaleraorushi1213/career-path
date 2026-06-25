"use client";

import { Bell, ChartBar, Kanban, Shield, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: <Kanban className="w-6 h-6" />,
    title: 'Drag-and-Drop Kanban',
    desc: 'Visualize your entire pipeline in one fluid board. Move applications between stages effortlessly.',
    color: '#4a6c8f',
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: 'Smart Reminders',
    desc: 'Never miss a follow-up. CareerPath keeps your pipeline moving with timely nudges.',
    color: '#d9a441',
  },
  {
    icon: <ChartBar className="w-6 h-6" />,
    title: 'Salary Intelligence',
    desc: 'Track compensation ranges across all roles and sort by salary potential instantly.',
    color: '#3a9668',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Private & Secure',
    desc: 'Your job search is personal. All data stays private — we never sell your information.',
    color: '#7a4a9f',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Lightning Fast',
    desc: 'Built for speed. Add a role in seconds and keep your momentum going.',
    color: '#d9a441',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Notes & Context',
    desc: 'Capture recruiter info, interview prep, and contacts — all in one place per role.',
    color: '#4a6c8f',
  },
];

const FeaturesSection = () => {

  const features = FEATURES.map((f, i: number) => (
    <motion.div
      key={f.title}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      className="rounded-2xl p-6 hover:-translate-y-0.5 transition-transform"
      style={{ background: '#1e2a38', border: '1px solid #2a3d52' }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}22`, color: f.color }}>
        {f.icon}
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
      <p className="text-sm text-[#7a90a4] leading-relaxed">{f.desc}</p>
    </motion.div>
  ))

  return features;
}

export default FeaturesSection;