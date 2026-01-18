import React from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label: string;
}

export default function InputWithIcon({ icon: Icon, label, ...props }: InputProps) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="input-wrapper">
        <div className="input-icon">
          <Icon className="h-5 w-5" />
        </div>
        {/* We use the clean class here */}
        <input className="input-field" {...props} />
      </div>
    </div>
  );
}