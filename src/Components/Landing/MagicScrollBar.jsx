import React, { useEffect, useState } from 'react';

/* MagicScrollBar: A vertical right-edge reactive bar showing scroll progress + pulsing magical energy nodes.
   - Pure React (no Three.js) for lightweight UI overlay.
   - Syncs with document scroll; nodes light up as thresholds passed.
*/
const checkpoints = [0.05,0.15,0.3,0.45,0.62,0.78,0.92];

const MagicScrollBar = () => {
  const [progress,setProgress] = useState(0);
  useEffect(()=> {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h>0 ? window.scrollY / h : 0;
      setProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return ()=> window.removeEventListener('scroll', onScroll);
  },[]);

  return (
  <div className="pointer-events-none fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-3">
      <div className="relative h-[380px] w-2 rounded-full bg-gradient-to-b from-[#1a062c]/70 via-[#1d0733]/50 to-[#140424]/60 backdrop-blur-md border border-purple-600/30 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_34px_-10px_rgba(150,60,255,0.5)] overflow-hidden">
        <div style={{height: `${progress*100}%`}} className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-fuchsia-400 via-purple-500 to-fuchsia-600 transition-[height] duration-200 rounded-t-full" />
        {checkpoints.map((c,i)=> {
          const active = progress >= c; 
          return (
            <div key={c} style={{top:`${c*100}%`}} className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className={`w-4 h-4 rounded-full ${active?'bg-gradient-to-br from-fuchsia-400 to-purple-500':'bg-purple-800/60'} border border-fuchsia-300/40 shadow-md shadow-fuchsia-500/30 relative`}>
                {active && (
                  <div className="absolute inset-0 rounded-full animate-pingSlow bg-fuchsia-400/50" />
                )}
              </div>
            </div>
          );
        })}
        <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(circle_at_50%_30%,rgba(255,150,255,0.15),transparent_70%)]" />
      </div>
      <style>{`@keyframes pingSlow {0%{transform:scale(1);opacity:.7}70%{opacity:0}100%{transform:scale(2.2);opacity:0}} .animate-pingSlow{animation:pingSlow 2.8s cubic-bezier(.4,0,.2,1) infinite}`}</style>
    </div>
  );
};

export default MagicScrollBar;
