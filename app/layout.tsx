import type { Metadata } from "next";
import { Inter, Lobster } from "next/font/google";
import "./globals.css";

// Your style imports
import "@/styles/tokens.css";
import "@/styles/auth.css";
import "@/styles/dashboard.css";
import "@/styles/utilities.css";

// 1. Configure Inter (Main Font)
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

// 2. Configure Lobster (Brand Font)
const lobster = Lobster({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lobster", 
});

export const metadata: Metadata = {
  title: "TopLike",
  description: "Where Quality Thinking Wins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // This is the REQUIRED html tag the error is asking for
    <html lang="en">
      <body 
        className={`${inter.className} ${lobster.variable}`} 
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}