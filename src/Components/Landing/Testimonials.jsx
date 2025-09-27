import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  { name: 'Ada · Fashion', quote: 'One entry. 6 days later I had verifiable traction + cash reward. It forces craft.', avatar: 'A' },
  { name: 'Tunde · Comedy', quote: 'No follower flex culture here. Just authentic reactions. I improved faster.', avatar: 'T' },
  { name: 'Mina · Tech', quote: 'This replaced random posting for me. Structured, measurable, addictive in a good way.', avatar: 'M' }
];

const Testimonials = () => (
  <section id="testimonials" className="px-6 py-24 relative">
    <div className="max-w-6xl mx-auto">
  <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6}} className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-b from-white to-purple-200/70 bg-clip-text text-transparent">Creator Signals</motion.h2>
  <p className="text-center text-purple-200/80 max-w-xl mx-auto mb-14">Early users explain how one-post-per-week discipline reshaped output.</p>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t,i)=>(
          <motion.div key={t.name} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.55, delay:i*0.1}} className="relative rounded-2xl p-8 flex flex-col bg-gradient-to-br from-[#1d0b32]/85 to-[#2b0f4d]/80 backdrop-blur-xl border border-fuchsia-500/10 shadow-lg shadow-black/40 hover:shadow-fuchsia-600/30 transition">
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white flex items-center justify-center font-semibold text-lg ring-1 ring-white/20">{t.avatar}</div>
              <div>
                <p className="font-semibold text-purple-50 text-sm">{t.name}</p>
              </div>
            </div>
            <p className="text-purple-200/80 text-sm leading-relaxed flex-1 relative z-10">“{t.quote}”</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
