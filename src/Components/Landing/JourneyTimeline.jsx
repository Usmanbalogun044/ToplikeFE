import React from 'react';
import { motion } from 'framer-motion';

const phases = [
  { q: 'Week Entry', a: 'Upload one post that represents your best work this cycle. Quality > volume.' },
  { q: 'Engagement Window', a: 'Promote ethically. Real people. Real reactions. Fake engagement disqualifies.' },
  { q: 'Ranking & Review', a: 'Leaderboard updates dynamically. Anti-cheat systems flag anomalies.' },
  { q: 'Weekly Payouts', a: 'Winners get instant wallet credit. Withdraw or recycle into new entries.' },
  { q: 'Progression', a: 'Build a portfolio, unlock trust tiers & future brand collabs.' }
];

const JourneyTimeline = () => (
  <section className="px-6 py-24 relative" id="journey">
    <div className="max-w-6xl mx-auto">
  <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6}} className="text-3xl md:text-4xl font-bold text-center mb-5 bg-gradient-to-b from-white to-purple-200/70 bg-clip-text text-transparent">The Weekly Creator Journey</motion.h2>
  <p className="text-center text-purple-200/80 max-w-2xl mx-auto mb-16">Every cycle is a fresh arena. Sharpen execution, gather proof, scale influence responsibly.</p>

  <div className="relative border-l border-fuchsia-500/20 ml-2 md:ml-8">
        {phases.map((step, i) => (
          <motion.div
            key={step.q}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            className="pl-8 md:pl-10 pb-12 last:pb-0 relative"
          >
            <div className="absolute -left-[11px] top-2 w-5 h-5 bg-gradient-to-br from-fuchsia-500 to-purple-600 border border-white/10 rounded-full shadow ring-2 ring-fuchsia-400/30"></div>
            <h3 className="font-semibold text-purple-50 mb-2 text-lg">{step.q}</h3>
            <p className="text-purple-200/80 text-sm leading-relaxed max-w-xl">{step.a}</p>
          </motion.div>
        ))}

  <div className="absolute inset-y-0 -left-px w-px bg-gradient-to-b from-fuchsia-500/60 via-purple-500/50 to-violet-500/40" />
      </div>
    </div>
  </section>
);

export default JourneyTimeline;
