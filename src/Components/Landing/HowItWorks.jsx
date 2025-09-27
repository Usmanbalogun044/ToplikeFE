import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { title: 'Submit Once', desc: 'Pay ₦500, upload your strongest content of the week – no spam, just impact.', color: 'from-purple-500 to-fuchsia-500' },
  { title: 'Earn Organic Likes', desc: 'Share your post. Friends & community engage. Authentic reach drives ranking.', color: 'from-fuchsia-500 to-rose-500' },
  { title: 'Get Rewarded', desc: 'Top entries unlock weekly cash payouts you can withdraw or reinvest.', color: 'from-violet-500 to-purple-600' },
];

const HowItWorks = () => (
  <section id="how-it-works" className="px-6 py-24 relative">
    <div className="max-w-7xl mx-auto">
  <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6}} className="text-3xl md:text-4xl font-bold text-center mb-5 bg-gradient-to-b from-white to-purple-200/70 bg-clip-text text-transparent">How It Works</motion.h2>
  <p className="text-center text-purple-200/80 max-w-xl mx-auto mb-14">Three clean steps. One weekly shot. Keep leveling up.</p>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((card,i)=>(
          <motion.div key={card.title} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6, delay:i*0.1}} className="relative rounded-2xl p-[2px] bg-gradient-to-br from-fuchsia-500/40 via-purple-600/30 to-violet-600/30 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
            <div className="rounded-2xl h-full p-8 flex flex-col bg-gradient-to-br from-[#1d0b32]/90 to-[#2b0f4d]/80 backdrop-blur-xl border border-fuchsia-500/10">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white font-semibold mb-6 shadow-lg shadow-fuchsia-800/40 ring-1 ring-white/10`}>{i+1}</div>
              <h3 className="font-semibold text-lg mb-3 text-purple-50">{card.title}</h3>
              <p className="text-sm text-purple-200/80 leading-relaxed flex-1">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
