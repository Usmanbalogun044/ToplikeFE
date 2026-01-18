"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full bg-white flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT – BRANDING (same as landing page) */}
        <div className="flex justify-center md:justify-start">
          <Image
            src="/logos/Frame 1.svg"
            alt="TopLike Logo"
            width={180}
            height={180}
            className="w-auto h-auto"
            priority
          />
        </div>

        {/* RIGHT – FORM AREA */}
        <div className="relative space-y-6 md:border-l border-gray-300 md:pl-12">

          {/* CLOSE (X) */}
          <Link
            href="/"
            aria-label="Go back home"
            className="absolute -top-2 -right-2 text-blue-600 hover:opacity-70 transition"
          >
            <X size={22} strokeWidth={2} />
          </Link>

          {/* FORM SLOT */}
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

      </div>
    </main>
  );
}
