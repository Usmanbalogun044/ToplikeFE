import { Bell } from "lucide-react";

export default function Header({ title }: { title: string }) {
  return (
    <header className="top-header">
      {/* Page Title */}
      <h1 className="header-title">{title}</h1>

      {/* Right Actions: Notification & Profile */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-brand-primary transition-colors relative">
          <Bell size={20} />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        {/* User Avatar Placeholder */}
        <div className="h-10 w-10 bg-hero-gradient rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white cursor-pointer">
          JD
        </div>
      </div>
    </header>
  );
}