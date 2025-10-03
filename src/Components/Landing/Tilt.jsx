import { useRef } from 'react';

// Lightweight 3D tilt wrapper (no re-renders on mouse move, uses direct style mutation)
const Tilt = ({ children, className = '', glare = true, max = 14, scale = 1.04 }) => {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    const rotX = (py - 0.5) * max * -1; // invert for natural feel
    const rotY = (px - 0.5) * max;
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
    if (glare) {
      const glareEl = el.querySelector('.tilt-glare');
      if (glareEl) {
        const angle = Math.atan2(py - 0.5, px - 0.5) * 180 / Math.PI + 180;
        const intensity = Math.max(0, 1 - Math.hypot(px - 0.5, py - 0.5) * 1.8);
        glareEl.style.background = `radial-gradient(circle at ${px*100}% ${py*100}%, rgba(255,255,255,${0.35*intensity}) 0%, rgba(255,255,255,0) 65%)`;
        glareEl.style.filter = `blur(${8 - intensity*6}px)`;
        glareEl.style.opacity = 1;
        glareEl.style.transform = `rotate(${angle}deg)`;
      }
    }
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    const glareEl = el.querySelector('.tilt-glare');
    if (glareEl) glareEl.style.opacity = 0;
  };

  return (
    <div
      className={`tilt-wrapper will-change-transform ${className}`}
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onTouchStart={reset}
      onTouchEnd={reset}
      style={{ transition: 'transform 320ms cubic-bezier(.21,1,.32,1)' }}
    >
      {glare && <div className="tilt-glare pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300" />}
      {children}
    </div>
  );
};

export default Tilt;
