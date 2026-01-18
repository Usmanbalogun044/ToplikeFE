"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // SPLASH SCREEN
  if (showSplash) {
    return (
      <div className="h-screen w-full bg-hero-gradient flex items-center justify-center animate-in fade-out duration-700">
        <div className="animate-pulse">
          <Image
            src="/logos/Variant2.svg"
            alt="TopLike Logo"
            width={150}
            height={150}
            priority
          />
        </div>
      </div>
    );
  }

  // LANDING PAGE
  return (
    <main className="min-h-screen w-full bg-white flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left: Branding */}
        <div className="flex justify-center md:justify-start">
          <Image
            src="/logos/Frame 1.svg"
            alt="TopLike Logo"
            width={180}
            height={180}
            className="w-auto h-auto"
          />
        </div>

        {/* Right: Content */}
        <div className="space-y-6 text-center md:text-left md:border-l border-gray-300 md:pl-12">
          <h3 className="text-4xl font-brand text-blue-600 leading-tight">
            Where Quality Thinking Wins
          </h3>

          <p className="text-gray-500 text-lg max-w-md mx-auto md:mx-0">
            TopLike is a weekly challenge platform for Builders, Thinkers, and Creators.
          </p>

          <p className="text-gray-500 text-lg max-w-md mx-auto md:mx-0">
            You post once.
            <br />
            People respond.
          </p>

          <p className="text-sm font-medium text-gray-400">
            The best ideas rise, not the loudest ones.
          </p>

          {/* CTA SECTION */}
          <div className="pt-10 flex w-full flex-col gap-10 md:flex-row md:justify-between md:items-center">

            {/* Left CTA */}
            <Link href="/about" className="group flex flex-col items-start gap-1">
              <span className="text-gray-400 font-medium text-lg">
                Learn More
              </span>
              <div className="flex items-center text-gray-300 transition-all duration-300 group-hover:text-gray-500 group-hover:-translate-x-2">
                <ArrowLeft size={20} className="-mr-1" />
                <div className="h-[1.5px] w-12 bg-current" />
              </div>
            </Link>

            {/* Right CTA */}
            <Link href="/auth/signup" className="group flex flex-col items-end gap-1">
              <span className="text-blue-600 font-bold text-lg">
                Get Started
              </span>
              <div className="flex items-center text-blue-600 transition-all duration-300 group-hover:translate-x-2">
                <div className="h-[1.5px] w-12 bg-current" />
                <ArrowRight size={20} className="-ml-1" />
              </div>
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
}
