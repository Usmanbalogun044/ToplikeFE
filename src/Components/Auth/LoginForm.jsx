import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { API_URL } from "../../config";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // If user is not verified, redirect to OTP. 
        // Note: Backend might block login if not verified, or we check user.is_verified
        if (!data.user.email_verified_at) {
             navigate("/verify-otp", { state: { email: formData.email } });
        } else {
             navigate("/dashboard");
        }
      } else {
        setErrors({ form: data.message || "Login failed" });
      }
    } catch (error) {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {errors.form && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl text-center text-sm">
          {errors.form}
        </div>
      )}
      
      <div className="space-y-1">
        <label className="text-xs font-semibold text-purple-200/80 ml-1 uppercase tracking-wider">Email Address</label>
        <div className="relative">
          <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`input-field ${errors.email ? "border-red-500/50" : ""}`}
            autoComplete="email"
          />
        </div>
        {errors.email && <p className="text-red-300 text-xs ml-1">{errors.email}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-purple-200/80 ml-1 uppercase tracking-wider">Password</label>
        <div className="relative">
             <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className={`input-field ${errors.password ? "border-red-500/50" : ""}`}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-fuchsia-300 transition"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </div>
        {errors.password && <p className="text-red-300 text-xs ml-1">{errors.password}</p>}
        <div className="flex justify-end pt-1">
            <a href="#" className="text-xs text-purple-300 hover:text-white transition">Forgot Password?</a>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-brand mt-4"
      >
        {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;
