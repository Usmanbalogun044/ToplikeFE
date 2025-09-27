import React from 'react';

const Footer = () => (
  <footer className="px-6 py-16 bg-[#07010f]/95 text-purple-200/70 text-sm relative backdrop-blur-xl border-t border-fuchsia-500/10">
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(167,60,255,0.18),transparent_60%)] opacity-60" />
    <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-12">
      <div className="md:col-span-2">
        <h3 className="font-semibold text-lg mb-3 bg-gradient-to-r from-white to-purple-200/70 bg-clip-text text-transparent">TopLike</h3>
        <p className="text-purple-200/70 text-xs leading-relaxed max-w-sm">A focused weekly arena for creators to test, learn & earn through authentic audience response.</p>
      </div>
      <div>
        <h4 className="text-purple-100 font-medium text-sm mb-3">Platform</h4>
        <ul className="space-y-2">
          <li><a className="hover:text-white/90 transition-colors" href="#how-it-works">How it works</a></li>
          <li><a className="hover:text-white/90 transition-colors" href="#journey">Journey</a></li>
          <li><a className="hover:text-white/90 transition-colors" href="#faq">FAQ</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-purple-100 font-medium text-sm mb-3">Legal</h4>
        <ul className="space-y-2">
          <li><button className="hover:text-white/90 transition-colors">Terms</button></li>
          <li><button className="hover:text-white/90 transition-colors">Privacy</button></li>
        </ul>
      </div>
      <div>
        <h4 className="text-purple-100 font-medium text-sm mb-3">Connect</h4>
        <ul className="space-y-2">
          <li><button className="hover:text-white/90 transition-colors">Twitter / X</button></li>
          <li><button className="hover:text-white/90 transition-colors">Instagram</button></li>
          <li><button className="hover:text-white/90 transition-colors">Support</button></li>
        </ul>
      </div>
    </div>
    <div className="relative mt-12 pt-8 border-t border-fuchsia-500/10 flex flex-col md:flex-row gap-4 items-center justify-between">
      <p className="text-xs text-purple-300/80">© {new Date().getFullYear()} TopLike. All rights reserved.</p>
      <p className="text-xs text-purple-400/60">Made for disciplined creators.</p>
    </div>
  </footer>
);

export default Footer;
