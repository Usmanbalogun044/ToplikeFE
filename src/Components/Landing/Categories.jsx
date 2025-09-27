import React from 'react';
import { motion } from 'framer-motion';
import { categories } from './landingConfig';
import Tilt from './Tilt';
import { FaPaintBrush, FaVideo, FaCamera, FaMusic, FaTheaterMasks, FaPenFancy, FaGamepad, FaRunning } from 'react-icons/fa';

const iconMap = {
  paint: <FaPaintBrush />,
  video: <FaVideo />,
  camera: <FaCamera />,
  music: <FaMusic />,
  theatre: <FaTheaterMasks />,
  pen: <FaPenFancy />,
  game: <FaGamepad />,
  run: <FaRunning />,
};

const Categories = () => (
  <section id="categories" className="px-6 py-24 relative">
    <div className="max-w-7xl mx-auto">
  <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6}} className="text-center text-3xl md:text-4xl font-bold bg-gradient-to-b from-white to-purple-200/70 bg-clip-text text-transparent mb-4">Built For Multi‑Talented Creators</motion.h2>
  <p className="text-center text-purple-200/80 max-w-2xl mx-auto mb-12">Whether you storyboard, shoot, edit, sing, code gameplays, write, dance or design – there’s a lane for you. One platform. Infinite creative verticals.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {categories.map((c,i)=>(
          <Tilt key={c.label} max={18}>
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true, margin:'-50px'}} transition={{delay:i*0.05}} className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#241042]/80 to-[#31155a]/80 backdrop-blur-xl p-5 shadow-lg shadow-black/40 border border-fuchsia-500/10 hover:border-fuchsia-400/40 hover:shadow-fuchsia-600/30 transition three-d-card">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 text-fuchsia-300 bg-gradient-to-br from-purple-600/30 to-fuchsia-600/20 group-hover:from-fuchsia-500/40 group-hover:to-purple-600/30 text-xl ring-1 ring-white/10">{iconMap[c.icon]}</div>
              <p className="font-medium text-purple-50 text-sm tracking-wide">{c.label}</p>
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)] transition duration-500" />
              <div className="absolute bottom-0 left-0 w-full h-0 group-hover:h-1 bg-gradient-to-r from-fuchsia-500 to-purple-500 transition-all" />
            </motion.div>
          </Tilt>
        ))}
      </div>
    </div>
  </section>
);

export default Categories;
