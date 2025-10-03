import { useEffect, useRef } from 'react';
import { FiAward, FiArrowRight, FiHeart, FiClock, FiDollarSign } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const statCard = (value, label) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-[11px] uppercase tracking-wide text-purple-200">{label}</p>
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
        const depth = parseFloat(layer.dataset.depth || '0');
        const moveX = -x * depth * 40; // adjust intensity
        const moveY = -y * depth * 40;
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px,0)`;
      });
      // dynamic light
      el.style.setProperty('--mx', x.toString());
      el.style.setProperty('--my', y.toString());
    };
    window.addEventListener('pointermove', handlePointer);
    return () => window.removeEventListener('pointermove', handlePointer);
  }, []);

  return (
    <section id="hero" className="relative pt-32 md:pt-40 overflow-hidden hero-3d">
      {/* Make hero overlays semi-transparent so Three.js canvas beneath is visible */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0214]/70 via-[#16052a]/60 to-[#230c44]/60" />
        <div ref={el=>layersRef.current[0]=el} data-depth="0.15" className="parallax-layer absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-fuchsia-600/25 to-purple-500/10 blur-3xl" />
        <div ref={el=>layersRef.current[1]=el} data-depth="0.3" className="parallax-layer absolute top-1/3 -right-40 w-[640px] h-[640px] rounded-full bg-gradient-to-tr from-purple-400/20 to-transparent blur-2xl" />
        <div ref={el=>layersRef.current[2]=el} data-depth="0.6" className="parallax-layer absolute -bottom-40 -left-20 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-pink-500/25 to-purple-600/0 blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(255,255,255,0.06),transparent_60%),radial-gradient(circle_at_80%_65%,rgba(167,60,255,0.1),transparent_65%)]" />
        <div className="absolute inset-0 pointer-events-none dynamic-light mix-blend-overlay" />
      </div>
      <div ref={sceneRef} className="relative z-10 px-4 pt-2 pb-10 md:px-14 xl:px-24 flex flex-col-reverse md:flex-row items-center gap-12">
        <div
          className="md:w-1/2 animate-fade-slide-left"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm text-purple-200 border border-white/10 mb-5">
            <FiAward className="text-purple-300" />
            <span>Weekly Creative Showcase</span>
          </div>
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-purple-200 to-purple-400">
            Share Your Best. Get Noticed. Earn Real Rewards.
          </h1>
          <p className="mt-6 text-base md:text-lg text-purple-100 leading-relaxed max-w-xl">
            TopLike is the arena for emerging African creators – post <strong>one powerful photo or video each week</strong>, rally authentic likes, climb the chart and unlock cash rewards.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <NavLink
              to="/signup"
              className="group bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition"
            >
              Start Now – ₦500 Entry <FiArrowRight className="group-hover:translate-x-1 transition" />
            </NavLink>
            <button
              onClick={onScrollHow}
              className="px-8 py-4 rounded-full font-semibold border border-purple-400/40 text-purple-200 hover:bg-white/10 transition backdrop-blur-sm"
            >
              How It Works
            </button>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6" aria-label="Platform live stats">
            {statCard(`${stats.creators}+`, 'Creators')}
            {statCard(`${stats.payouts}+`, 'Payouts')}
            {statCard(`${stats.weeklyReach}+`, 'Weekly Reach')}
          </div>
          <div className="mt-8 text-purple-200 text-sm flex flex-col gap-2" aria-live="polite">
            <div className="flex items-center gap-2"><FiClock /> Next cycle ends in {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</div>
            <div className="flex items-center gap-2"><FiDollarSign /> Cash rewards paid to your TopLike wallet.</div>
          </div>
        </div>
        <div
          className="md:w-1/2 relative animate-fade-slide-right"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 backdrop-blur-xl bg-white/5 border border-white/10 h-[380px] md:h-[480px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-fuchsia-500/10 to-transparent mix-blend-overlay" />
            <div className="text-center px-10">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-lg shadow-purple-900/40 mb-8 hero-rotate-slow"
              >
                <FiHeart className="text-white" size={38} />
              </div>
              <h3 className="text-white font-semibold text-2xl mb-4 tracking-tight">One Post. One Shot. Every Week.</h3>
              <p className="text-purple-100 text-sm leading-relaxed max-w-sm mx-auto">Focus on quality over spam. Craft your best submission – photo, video, reel, design or highlight clip – and let the people decide.</p>
            </div>
            <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-gradient-to-tr from-fuchsia-500/30 to-purple-500/0 blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
