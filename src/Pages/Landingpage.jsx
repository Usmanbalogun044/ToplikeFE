import React, { useState, useEffect, Suspense } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";

// Modular landing components
import Hero from "../Components/Landing/Hero";
import { statTargets } from "../Components/Landing/landingConfig";
import toplikeLogo from "/Images/toplike.png";
import LazyMount from "../Components/Util/LazyMount";

// Code-split lower priority sections
const ValueGrid = React.lazy(() => import("../Components/Landing/ValueGrid"));
const Categories = React.lazy(() => import("../Components/Landing/Categories"));
const HowItWorks = React.lazy(() => import("../Components/Landing/HowItWorks"));
const JourneyTimeline = React.lazy(() =>
  import("../Components/Landing/JourneyTimeline")
);
const CreatorJourney = React.lazy(() =>
  import("../Components/Landing/CreatorJourney")
);
const Testimonials = React.lazy(() =>
  import("../Components/Landing/Testimonials")
);
const FAQSection = React.lazy(() => import("../Components/Landing/FAQSection"));
const Footer = React.lazy(() => import("../Components/Landing/Footer"));

const Landingpage = () => {
  // Countdown until Sunday 23:59:59 UTC
  const calcTimeLeft = () => {
    const now = new Date();
    const end = new Date();
    end.setUTCDate(end.getUTCDate() + ((7 - end.getUTCDay()) % 7));
    end.setUTCHours(23, 59, 59, 999);
    const diff = end - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft());
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (y / h) * 100 : 0;
      setScrollProgress(pct);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  // Stats animation
  const [stats, setStats] = useState({
    creators: 0,
    payouts: 0,
    weeklyReach: 0,
  });
  useEffect(() => {
    const duration = 1800;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      setStats({
        creators: Math.floor(progress * statTargets.creators),
        payouts: Math.floor(progress * statTargets.payouts),
        weeklyReach: Math.floor(progress * statTargets.weeklyReach),
      });
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  return (
    <>
      <main className="font-sans relative overflow-hidden bg-[#05010a] text-purple-100">
        {/* Premium Background */}
        <div className="premium-bg pointer-events-none" aria-hidden="true" />

        {/* Navigation */}
        <nav
          className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
            scrolled
              ? "glass-nav py-2"
              : "bg-transparent py-4 border-b border-transparent"
          }`}
          role="navigation"
        >
          <div className="relative container mx-auto px-4 lg:px-20 flex items-center justify-between gap-6">
            {/* Logo */}
            <button
              onClick={(e) => handleSmoothScroll(e, "hero")}
              className="group relative flex items-center gap-3 focus:outline-none"
            >
              <div className="relative w-11 h-11 rounded-2xl flex items-center bg-black/30 backdrop-blur-sm border border-white/10 overflow-hidden justify-center">
                <img
                  src={toplikeLogo}
                  alt="TopLike"
                  className="w-7 h-7 object-contain drop-shadow-[0_2px_6px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">TopLike</span>
              <span className="ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-purple-600/30 border border-purple-400/30 text-purple-100 tracking-widest">
                BETA
              </span>
            </button>

            {/* Desktop Links */}
            <ul className="hidden md:flex items-center gap-9 text-sm font-medium">
              {[
                { href: "how-it-works", label: "How It Works" },
                { href: "winners", label: "Past Winners" },
                { href: "faq", label: "FAQ" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={`#${l.href}`}
                    onClick={(e) => handleSmoothScroll(e, l.href)}
                    className="relative text-purple-200/80 hover:text-white transition-colors px-1 py-2 group"
                  >
                    <span>{l.label}</span>
                    <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-fuchsia-400 to-purple-400 rounded-full transition-all duration-400" />
                  </a>
                </li>
              ))}
            </ul>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              <NavLink
                to="/login"
                className="text-purple-200/90 hover:text-white font-semibold text-sm tracking-wide transition"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="btn-brand text-sm px-6 py-2.5 shadow-lg shadow-purple-900/40"
              >
                Create Account
              </NavLink>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              className="md:hidden relative w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white transition active:scale-95"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Mobile Menu Panel */}
            <div
              className={`md:hidden absolute top-full left-0 right-0 origin-top transition-all duration-500 ${
                mobileMenuOpen
                  ? "opacity-100 scale-y-100"
                  : "opacity-0 pointer-events-none scale-y-50"
              }`}
            >
              <div className="mx-4 mt-3 p-5 rounded-2xl glass-panel space-y-4">
                {[
                  { href: "how-it-works", label: "How It Works" },
                  { href: "winners", label: "Past Winners" },
                  { href: "faq", label: "FAQ" },
                ].map((l) => (
                  <button
                    key={l.href}
                    onClick={(e) => handleSmoothScroll(e, l.href)}
                    className="w-full text-left text-sm font-semibold tracking-wide text-purple-100/90 flex items-center justify-between py-2 group hover:text-white"
                  >
                    <span>{l.label}</span>
                    <span className="h-[2px] w-6 bg-purple-500 rounded-full scale-x-0 origin-left transition group-hover:scale-x-100" />
                  </button>
                ))}
                <div className="pt-2 flex flex-col gap-3">
                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center text-sm font-semibold text-white/90 hover:text-white transition py-2"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-brand justify-center py-3"
                  >
                    Create Account
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Scroll Progress Bar */}
            <div className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-white/5 overflow-hidden">
              <div
                style={{ width: `${scrollProgress}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-[width] duration-150"
              />
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <Hero
          stats={{
            creators: stats.creators.toLocaleString(),
            payouts: stats.payouts.toLocaleString(),
            weeklyReach: stats.weeklyReach.toLocaleString(),
          }}
          timeLeft={timeLeft}
          onScrollHow={(e) => {
            if (e?.preventDefault) e.preventDefault();
            const el = document.getElementById("how-it-works");
            if (el)
              window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
          }}
        />

        {/* Lazy-loaded Sections */}
        <Suspense fallback={null}>
          <LazyMount>
            <ValueGrid />
          </LazyMount>
        </Suspense>
        <Suspense fallback={null}>
          <LazyMount>
            <Categories />
          </LazyMount>
        </Suspense>
        <Suspense fallback={null}>
          <LazyMount>
            <HowItWorks />
          </LazyMount>
        </Suspense>
        <Suspense fallback={null}>
          <LazyMount>
            <JourneyTimeline />
          </LazyMount>
        </Suspense>
        <Suspense fallback={null}>
          <LazyMount timeout={400}>
            <CreatorJourney />
          </LazyMount>
        </Suspense>
        <Suspense fallback={null}>
          <LazyMount>
            <Testimonials />
          </LazyMount>
        </Suspense>
        <Suspense fallback={null}>
          <LazyMount>
            <FAQSection />
          </LazyMount>
        </Suspense>
        <Suspense fallback={null}>
          <LazyMount>
            <Footer />
          </LazyMount>
        </Suspense>
      </main>
    </>
  );
};

export default Landingpage;
