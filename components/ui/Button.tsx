import React, { FC } from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
}

const Button: FC<ButtonProps> = ({ children, onClick, type = "button", variant = "primary" }) => {
  const baseClass = "rounded-lg px-6 py-3 font-bold text-white";
  const variantClass = variant === "primary" ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-300 hover:bg-gray-400";

  return (
    <button type={type} onClick={onClick} className={`${baseClass} ${variantClass}`}>
      {children}
    </button>
  );
};

export default Button;
