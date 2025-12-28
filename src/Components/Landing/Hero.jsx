import { useEffect, useRef } from "react";
import {
  FiAward,
  FiArrowRight,
  FiHeart,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const statCard = (value, label) => (
  <div className="glass-panel rounded-xl p-4 text-center transform hover:scale-105 transition duration-300">
    <p className="text-2xl font-bold text-white mb-1">{value}</p>
    <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-medium">
      {label}
    </p>
  </div>
);

const Hero = ({ stats, timeLeft, onScrollHow }) => {
  const sceneRef = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    const handlePointer = (e) => {
      const el = sceneRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      layersRef.current.forEach((layer) => {
        if (!layer) return;
        const depth = parseFloat(layer.dataset.depth || "0");
        const moveX = -x * depth * 30;
        const moveY = -y * depth * 30;
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px,0)`;
      });
    };
    window.addEventListener("pointermove", handlePointer);
    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  return (
    <section
      id="hero"
      className="relative pt-32 md:pt-40 pb-20 overflow-hidden"
    >
      {/* 3D Parallax Background Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={(el) => (layersRef.current[0] = el)}
          data-depth="0.1"
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px]"
        />
        <div
          ref={(el) => (layersRef.current[1] = el)}
          data-depth="0.2"
          className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-fuchsia-600/15 blur-[100px]"
        />
        <div
          ref={(el) => (layersRef.current[2] = el)}
          data-depth="0.15"
          className="absolute -bottom-20 left-10 w-[400px] h-[400px] rounded-full bg-purple-800/20 blur-[80px]"
        />
      </div>

      <div
        ref={sceneRef}
        className="relative z-10 container mx-auto px-4 md:px-14 xl:px-20 flex flex-col md:flex-row items-center gap-12 lg:gap-20"
      >
        {/* Left Content */}
        <div className="md:w-1/2 animate-slide-up">
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 mb-6">
            <FiAward className="text-fuchsia-400" />
            <span className="text-sm font-medium text-purple-100">Weekly Creative Showcase</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
            Share Your Best. <br/>
            <span className="text-brand">Get Noticed.</span> <br/>
            Earn Real Rewards.
          </h1>
          
          <p className="text-lg text-purple-200/80 leading-relaxed max-w-lg mb-8">
            TopLike is the arena for creators. Post <strong>one powerful entry each week</strong>, compete for authentic likes, and win cash prizes paid directly to your wallet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <NavLink to="/signup" className="btn-brand text-lg px-8 py-4 shadow-xl shadow-purple-900/40">
              Start Now - ₦500 Entry <FiArrowRight className="ml-2" />
            </NavLink>
            <button
              onClick={onScrollHow}
              className="px-8 py-4 rounded-2xl font-semibold border border-white/10 text-white hover:bg-white/5 transition flex items-center justify-center"
            >
              How It Works
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4" aria-label="Platform stats">
            {statCard(`${stats.creators}+`, "Creators")}
            {statCard(`${stats.payouts}+`, "Payouts")}
            {statCard(`${stats.weeklyReach}+`, "Reach")}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-6 text-sm text-purple-300/60 font-medium">
             <div className="flex items-center gap-2">
                <FiClock className="text-purple-400"/> Ends in: <span className="text-white">{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</span>
             </div>
             <div className="flex items-center gap-2">
                <FiDollarSign className="text-purple-400"/> Guaranteed Weekly Payouts
             </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="md:w-1/2 relative animate-float">
          <div className="relative z-10 glass-panel rounded-3xl p-1 md:p-2 rotate-1 hover:rotate-0 transition duration-500">
             <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/40 to-black h-[400px] md:h-[500px] flex items-center justify-center border border-white/5">
                <div className="absolute inset-0 bg-[url('/Images/noise.png')] opacity-20 mix-blend-overlay"></div>
                
                <div className="text-center px-8 relative z-10">
                   <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-fuchsia-600 to-purple-700 shadow-2xl shadow-fuchsia-900/50 mb-8 transform rotate-3">
                      <FiHeart className="text-white fill-white/20" size={42} />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-3">One Post. One Chance.</h3>
                   <p className="text-purple-200/70 text-sm leading-relaxed">
                      "Unlike other platforms where spam wins, TopLike rewards <span className="text-white font-semibold">quality engagement</span>. May the best content win."
                   </p>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-3 h-3 rounded-full bg-fuchsia-400 animate-pulse delay-75"></div>
             </div>
          </div>
          
          {/* Back Glow */}
          <div className="absolute top-10 left-10 right-10 bottom-0 bg-fuchsia-600/20 blur-[80px] -z-10 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
