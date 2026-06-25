"use client"

import { motion } from "framer-motion";

const STEPS = [
  { step: '01', title: 'Add a Role', desc: 'Drop any job into your Wishlist in seconds. Include salary, tags, and notes.' },
  { step: '02', title: 'Track Progress', desc: 'Drag cards across columns as you advance — from Applied to Offer in one fluid board.' },
  { step: '03', title: 'Land the Job', desc: 'Use notes and reminders to stay sharp in every interview and negotiate confidently.' },
]

const HowItWorksSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {STEPS.map((item, i: number) => (
        <motion.div
          key={item.step}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12 }}
          className="text-center"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl font-bold"
            style={{ background: 'rgba(217,164,65,0.12)', color: '#d9a441', border: '1px solid rgba(217,164,65,0.3)'}}
          >
            {item.step}
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
          <p className="text-sm text-[#7a90a4] leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default HowItWorksSection