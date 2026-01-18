import React from "react";
import { Sparkles } from "lucide-react"; // Matches the star/sparkle in your design

interface LogoProps {
  variant?: "blue" | "white"; // 'blue' for white backgrounds, 'white' for blue backgrounds
  size?: "sm" | "md" | "lg";
}

export default function Logo({ variant = "blue", size = "md" }: LogoProps) {
  // Logic: Switch colors based on the 'variant' prop
  const textColor = variant === "blue" ? "text-blue-700" : "text-white";
  const circleBg = variant === "blue" ? "bg-blue-700" : "bg-white";
  const iconColor = variant === "blue" ? "text-white" : "text-blue-700";

  // Logic: Switch sizes
  const circleSize = size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const iconSize = size === "lg" ? 24 : 20;
  const fontSize = size === "lg" ? "text-3xl" : "text-2xl";

  return (
    <div className="flex items-center gap-3 font-bold select-none">
      {/* The Icon Circle */}
      <div className={`${circleBg} ${iconColor} ${circleSize} rounded-full flex items-center justify-center shadow-sm`}>
        <Sparkles size={iconSize} strokeWidth={2.5} />
      </div>
      
      {/* The Text */}
      <span className={`${textColor} ${fontSize} tracking-tight`}>
        TopLike
      </span>
    </div>
  );
}