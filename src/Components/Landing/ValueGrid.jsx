import React from 'react';
import { motion } from 'framer-motion';
import { valueProps } from './landingConfig';
import Tilt from './Tilt';

const ValueGrid = () => (
  <section className="relative px-6 py-24 overflow-hidden">
    <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.25),transparent_60%)]" />
    <div className="max-w-7xl mx-auto">
  <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6}} className="text-center text-3xl md:text-4xl font-bold bg-gradient-to-b from-white to-purple-200/70 bg-clip-text text-transparent mb-6">Why Creators Choose TopLike</motion.h2>
  <p className="text-center text-purple-200/80 max-w-2xl mx-auto mb-14">We strip out noise & vanity – elevating signal, skill & steady improvement. Designed for the creator craving measurable weekly momentum.</p>
      <div className="grid gap-6 md:grid-cols-3">
        {valueProps.map((f,i)=>(
          <Tilt key={f.title}>
            <motion.div initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}} className="group relative p-6 rounded-2xl bg-gradient-to-br from-[#1d0b32]/80 to-[#2b0f4d]/80 backdrop-blur-xl border border-fuchsia-500/10 hover:border-fuchsia-400/40 shadow-lg shadow-black/40 hover:shadow-fuchsia-600/30 transition overflow-hidden three-d-card">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)] transition duration-500" />
              <div className="absolute -inset-px rounded-2xl pointer-events-none border border-white/5 group-hover:border-white/20" />
              <h3 className="font-semibold text-purple-50 mb-2 text-sm tracking-wide relative z-10">{f.title}</h3>
              <p className="text-[13px] text-purple-200/80 leading-relaxed relative z-10">{f.desc}</p>
            </motion.div>
          </Tilt>
        ))}
      </div>
    </div>
  </section>
);

export default ValueGrid;
