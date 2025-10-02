import React, { useState, useEffect, Suspense } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

// Modular landing components
import Hero from "../Components/Landing/Hero"; // keep hero eager for LCP
import { statTargets } from "../Components/Landing/landingConfig";
import toplikeLogo from "../assets/toplike.png";
import LazyMount from "../Components/Util/LazyMount";

// Code-split lower priority sections
const ValueGrid = React.lazy(() => import("../Components/Landing/ValueGrid"));
const Categories = React.lazy(() => import("../Components/Landing/Categories"));
const HowItWorks = React.lazy(() => import("../Components/Landing/HowItWorks"));
const JourneyTimeline = React.lazy(() => import("../Components/Landing/JourneyTimeline"));
const CreatorJourney = React.lazy(() => import("../Components/Landing/CreatorJourney"));
const Testimonials = React.lazy(() => import("../Components/Landing/Testimonials"));
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
  const [stats, setStats] = useState({ creators: 0, payouts: 0, weeklyReach: 0 });
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
      <main className="font-sans relative overflow-hidden bg-transparent text-purple-100">
        {/* Gradient Background */}
        <div
          className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_30%_20%,#2a0b4d_0%,#090114_55%,#05010c_85%)]"
          aria-hidden="true"
        />

        {/* Navigation */}
        <nav
          className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
            scrolled
              ? "backdrop-blur-xl bg-[#0f031fcc]/85 py-2 shadow-[0_4px_28px_-6px_rgba(132,45,255,0.45)] border-b border-purple-600/30"
              : "backdrop-blur-md bg-[#14062699] py-4 border-b border-transparent"
          }`}
          aria-label="Primary"
          role="navigation"
        >
          <div className="relative container mx-auto px-4 lg:px-20 flex items-center justify-between gap-6">
            {/* Logo */}
            <button
              onClick={(e) => handleSmoothScroll(e, "hero")}
              className="group relative flex items-center gap-3 focus:outline-none"
            >
              <div className="relative w-11 h-11 rounded-2xl bg-[#140626]/70 backdrop-blur-sm border border-purple-500/30 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_6px_18px_-6px_rgba(150,60,255,0.55)] overflow-hidden flex items-center justify-center">
                <img
                  src={toplikeLogo}
                  alt="TopLike"
                  className="w-9 h-9 object-contain drop-shadow-[0_2px_6px_rgba(255,120,255,0.45)] group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-60 transition bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.5),transparent_65%)]" />
              </div>
              <span className="sr-only">TopLike Home</span>
              <span className="ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-fuchsia-600/30 border border-fuchsia-400/30 text-fuchsia-100 tracking-widest">
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
                    className="relative text-purple-200/80 hover:text-fuchsia-200 transition-colors px-1 py-2 group"
                  >
                    <span>{l.label}</span>
                    <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-fuchsia-400 via-purple-400 to-fuchsia-300 rounded-full transition-all duration-400" />
                  </a>
                </li>
              ))}
            </ul>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              <NavLink
                to="/login"
                className="text-purple-200/70 hover:text-fuchsia-200 font-semibold text-sm tracking-wide transition"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide text-white bg-gradient-to-br from-fuchsia-600 via-purple-600 to-fuchsia-500 shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_10px_30px_-10px_rgba(155,65,255,0.7)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_6px_18px_-6px_rgba(160,70,255,0.9)] transition group overflow-hidden"
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
                <span>Create Account</span>
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-300 animate-pulse" />
              </NavLink>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              className="md:hidden relative w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600/30 to-purple-700/30 border border-purple-500/30 text-fuchsia-200 shadow-inner shadow-fuchsia-500/20 backdrop-blur-sm active:scale-95 transition"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Mobile Menu Panel */}
            <div
              className={`md:hidden absolute top-full left-0 right-0 origin-top transition-all duration-500 ${
                mobileMenuOpen
                  ? "opacity-100 scale-y-100"
                  : "opacity-0 pointer-events-none scale-y-50"
              } `}
            >
              <div className="mx-4 mt-3 p-5 rounded-2xl backdrop-blur-xl bg-[#1a062c]/85 border border-purple-600/30 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_14px_40px_-10px_rgba(140,55,255,0.55)] space-y-4">
                {[
                  { href: "how-it-works", label: "How It Works" },
                  { href: "winners", label: "Past Winners" },
                  { href: "faq", label: "FAQ" },
                ].map((l) => (
                  <button
                    key={l.href}
                    onClick={(e) => handleSmoothScroll(e, l.href)}
                    className="w-full text-left text-sm font-semibold tracking-wide text-purple-100/85 hover:text-fuchsia-200 flex items-center justify-between py-2 group"
                  >
                    <span>{l.label}</span>
                    <span className="h-[2px] w-6 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition" />
                  </button>
                ))}
                <div className="pt-2 flex flex-col gap-3">
                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center text-sm font-semibold text-purple-100/80 hover:text-fuchsia-200 transition"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center text-sm font-semibold px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-fuchsia-500 text-white shadow-[0_6px_22px_-8px_rgba(158,65,255,0.7)] hover:shadow-[0_4px_16px_-6px_rgba(165,70,255,0.85)] active:scale-[0.97] transition"
                  >
                    Create Account
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Scroll Progress Bar */}
            <div className="absolute left-0 bottom-0 h-[2px] w-full bg-purple-900/40 overflow-hidden rounded-full">
              <div
                style={{ width: `${scrollProgress}%` }}
                className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-fuchsia-300 transition-[width] duration-150"
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 px-6 py-10 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <h2 className="text-3xl font-bold text-purple-700 mb-4">TopLike</h2>
            <p className="text-sm text-gray-400">
              Bringing top-tier experiences to your fingertips.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-purple-300 transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-300 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-300 transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 text-xl">
              <a href="#" className="hover:text-purple-300 transition">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-purple-300 transition">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-purple-300 transition">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-purple-300 transition">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col space-y-4 justify-between text-sm text-gray-500 md:flex-row md:space-y-0">
          <p className="text-center">
            © {new Date().getFullYear()} TopLike. All rights reserved.
          </p>
          <div className="flex items-center justify-between space-x-5">
            <a
              className="text-gray-500 hover:text-purple-300"
              href="coming-soon"
            >
              Terms of Service
            </a>
            <a
              className="text-gray-500 hover:text-purple-300"
              href="coming-soon"
            >
              Cookies
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Landingpage;
