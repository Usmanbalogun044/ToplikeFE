"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Trophy, Medal, Wallet, LogOut } from "lucide-react";
import Logo from "@/components/branding/Logo";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Challenges", href: "/challenge", icon: Trophy },
  { name: "Leaderboard", href: "/leaderboard", icon: Medal },
  { name: "Wallet", href: "/features/wallet", icon: Wallet }, // Placeholder for future feature
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* 1. Logo Section */}
      <div className="sidebar-header">
        <Logo variant="blue" size="md" />
      </div>

      {/* 2. Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "active" : "inactive"}`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 3. Footer / Logout */}
      <div className="p-4 border-t border-gray-100">
        <Link href="/auth/login" className="nav-item inactive text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut size={20} />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}