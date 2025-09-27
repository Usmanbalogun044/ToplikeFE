import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { q: 'Why only one post per week?', a: 'Constraint drives quality. You focus on craft, storytelling & timing instead of spamming.' },
  { q: 'How are winners decided?', a: 'Weighted engagement + anti-cheat heuristics. Authenticity & retention > raw vanity numbers.' },
  { q: 'What stops fake likes?', a: 'We apply pattern detection, velocity checks, and trust scoring. Suspicious spikes get flagged.' },
  { q: 'Can I withdraw instantly?', a: 'Yes. Wallet balance from winnings can be withdrawn subject to minimum threshold compliance.' },
  { q: 'Is this for beginners?', a: 'Absolutely. It accelerates feedback loops and gives a structured progression path.' }
];

const FAQItem = ({ item, open, onToggle }) => (
  <div className="border border-fuchsia-500/15 rounded-xl overflow-hidden bg-gradient-to-br from-[#1d0b32]/85 to-[#2b0f4d]/80 backdrop-blur-xl shadow-lg shadow-black/40">
    <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/60">
      <span className="font-medium text-purple-50 text-sm md:text-base pr-4">{item.q}</span>
      <span className={`w-7 h-7 flex items-center justify-center rounded-full text-white text-xs font-semibold transition-transform duration-300 bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow ${open ? 'rotate-45' : ''}`}>+</span>
    </button>
    <AnimatePresence initial={false}>
      {open && (
        <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.35}} className="px-5 pb-5 pt-0 text-purple-200/80 text-sm leading-relaxed">
          {item.a}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection = () => {
  const [open, setOpen] = useState(null);
  return (
  <section id="faq" className="px-6 py-24 relative">
      <div className="max-w-5xl mx-auto">
  <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6}} className="text-3xl md:text-4xl font-bold text-center mb-5 bg-gradient-to-b from-white to-purple-200/70 bg-clip-text text-transparent">Answers</motion.h2>
  <p className="text-center text-purple-200/80 max-w-xl mx-auto mb-14">Built intentionally. Here’s clarity before you jump in.</p>

        <div className="space-y-4">
          {faqs.map((f,i)=>(
            <FAQItem key={f.q} item={f} open={open===i} onToggle={()=>setOpen(open===i?null:i)} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <a href="#get-started" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-8 py-4 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-shadow">Start Creating<span className="opacity-70">→</span></a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
